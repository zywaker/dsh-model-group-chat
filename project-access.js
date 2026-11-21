import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { lstat, opendir } from 'node:fs/promises';
import path from 'node:path';
import { TextDecoder } from 'node:util';
import { normalizeProjectPath } from './project-files.js';

const MODES = new Set(['read-only', 'workspace-write', 'danger-full-access']);
const MAX_FILE_BYTES = 16 * 1024;
const MAX_SCREEN_BYTES = 1024 * 1024;
// Leave room under the Host's 20,000-character serialized result limit for
// the path, cursor and other metadata (including a fully escaped path).
const MAX_PAGE_JSON_CHARS = 17_000;
const MAX_CHANGE_BYTES = 4 * 1024;
const MAX_CREATE_BYTES = 8 * 1024;
const MAX_PATH = 1024;
const MAX_ENTRIES = 60;
const MAX_DIRECTORY_SIZE = 512;
const MAX_CURSOR_CHARS = 2048;
const EXTRA_TEXT_NAMES = /^(?:go\.(?:mod|sum|work|work\.sum)|cargo\.lock|poetry\.lock|uv\.lock|yarn\.lock|bun\.lock|flake\.lock|gemfile\.lock|composer\.lock|deno\.lock|pipfile(?:\.lock)?|justfile|vagrantfile|brewfile|jenkinsfile|build(?:\.bazel)?|workspace(?:\.bazel)?|module\.bazel|gradlew|cmakelists\.txt)$/iu;
const EXTRA_TEXT_EXTENSIONS = /\.(?:lock|bzl|nix|rego|cuh?|f(?:90|95|03|08)?|for|jl|nim|rkt|lisp|el|scm|sbt|groovy|ipynb|webmanifest|map|http|log)$/iu;
const MAX_WIRE_CHARS = 64 * 1024;
const KNOWN_SECRET = /-----BEGIN (?:[A-Z0-9]+ ){0,4}(?:PRIVATE KEY|OPENSSH PRIVATE KEY)-----|\b(?:gh[pousr]_[A-Za-z0-9]{32,}|github_pat_[A-Za-z0-9_]{50,}|xox[baprs]-[A-Za-z0-9-]{12,}|(?:AKIA|ASIA)[A-Z0-9]{16}|AIza[A-Za-z0-9_-]{35}|(?:sk|rk)_(?:live|test)_[A-Za-z0-9]{16,}|sk-(?:(?:proj|svcacct|ant-api03)-)?[A-Za-z0-9_-]{24,}|npm_[A-Za-z0-9]{36}|eyJ[A-Za-z0-9_-]{8,}\.eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{12,})\b/u;
const SECRET_VALUE = /(?:^|[,\s{])(?:(?:export|const|let|var)[^\S\r\n]+)?["']?(?:[A-Za-z][A-Za-z0-9_-]*[_-])?(?:api[-_]?key|access[-_]?token|refresh[-_]?token|auth[-_]?token|bearer[-_]?token|secret[-_]?key|client[-_]?secret|private[-_]?key|secret[-_]?access[-_]?key|password|passwd|credentials?|secrets?|tokens?)["']?[^\S\r\n]*[:=][^\S\r\n]*(?:"([^"\r\n]{4,})"|'([^'\r\n]{4,})'|([A-Za-z0-9!$%&*+./:@^_=-]{4,})(?=[^\S\r\n]*(?:$|[#;},])))/gimu;
const HEADER_VALUE = /\bauthorization["']?\s*:\s*["']?(?:bearer|basic)\s+([A-Za-z0-9._~+/-]{8,}={0,2})/giu;
const URI_VALUE = /\b(?:https?|postgres(?:ql)?|mysql|mariadb|mongodb(?:\+srv)?|redis|amqps?):\/\/[^/:@\s]+:([^/@\s]+)@/giu;
const PLACEHOLDER = /^(?:example(?:[-_ ]?(?:key|token|password|secret|value))?|(?:your|test|dummy|sample|fake|placeholder|replace[-_ ]?with)[-_ ]*(?:api[-_ ]?)?(?:key|token|password|secret|credential|value)?|changeme|change[-_ ]?me|redacted|none|null|undefined|password|secret|\*+|x{3,}|\$\{[^}]+\}|\{\{[^}]+\}\}|<[^>]+>|(?:process\.env|import\.meta\.env)\.[\w.]+)$/iu;
const NON_TEXT = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069\ud800-\udfff]/u;
const BLOCKED_DIRECTORY = /^(?:node_modules|appdata|keychains?|proc|sys|dev|devices|system volume information|\$recycle\.bin|system32|configstore)$/iu;
const BLOCKED_NAME = /^(?:cookies|login[ _-]?data|key[ _-]?data|web[ _-]?data|local[ _-]?state|credentials?|shadow|sam|ntuser|security|sso|secrets?)(?:[. _-]|$)/iu;
const ERRORS = Object.freeze({
  unavailable: 'Project filesystem access is unavailable.',
  route: 'Unknown or unavailable project operation.',
  args: 'Invalid project operation arguments.',
  path: 'That path is invalid or outside the allowed project scope.',
  blocked: 'That project path is not eligible for access.',
  missing: 'The project path or its parent does not exist.',
  nontext: 'The selected file or change is not supported UTF-8 text.',
  tooLarge: 'The file, listing, or proposed change exceeds the project tool limit.',
  credential: 'Credential-like material was blocked.',
  stale: 'The project path changed; restart the listing or read before continuing.',
  cursor: 'Invalid continuation cursor for this project operation.',
  ambiguous: 'This text window could not be safely screened for credentials.',
  conflict: 'The destination already exists; create will not overwrite it.',
  literal: 'The old text must occur exactly once and the edit must change it.',
  approval: 'The exact proposed change was not approved.',
  cancelled: 'The project operation was cancelled.',
  failure: 'The project operation could not be completed safely.',
});
class ProjectAccessError extends Error {
  constructor(kind) { super(ERRORS[kind]); }
}
function reject(kind) { throw new ProjectAccessError(kind); }

export function supportsProjectAccess(fs) {
  try {
    // sandboxMode is the documented capability fact; the bare local provider returns undefined.
    return MODES.has(fs?.sandboxMode) && [
      'resolve', 'processPath', 'processPathFromHostPath', 'contains', 'stat', 'lstat',
      'listDir', 'readBytes', 'editText', 'writeText',
    ].every(name => typeof fs[name] === 'function');
  } catch { return false; }
}

const str = (description, maxLength = MAX_PATH) => ({ type: 'string', description, maxLength });
const pathArg = str('Project-relative path. Only full-access mode accepts an explicit absolute outside path.');
const definitions = [
  ['project_list', 'List one page of eligible direct children without reading files. Call again with the same path and nextCursor for more, or list a returned directory to descend.', {
    path: pathArg, cursor: str('Opaque nextCursor from the previous listing of this same directory.', MAX_CURSOR_CHARS),
  }, []],
  ['project_read', 'Read one UTF-8 text window. To continue, pass nextCursor with the same path. Only small files return an edit version.', {
    path: pathArg, cursor: str('Opaque nextCursor from the previous read of this same file.', MAX_CURSOR_CHARS),
  }, ['path']],
  ['project_edit', 'Replace one exact literal occurrence in a version-guarded text file after user approval.', {
    path: pathArg, expectedVersion: str('Version returned by project_read.', 64),
    oldText: str('Exact, nonempty text that occurs once.', MAX_CHANGE_BYTES),
    newText: str('Replacement text; pass the empty string to remove the selected text.', MAX_CHANGE_BYTES),
  }, ['path', 'expectedVersion', 'oldText', 'newText']],
  ['project_create', 'Create a new small text file in an existing directory after user approval. Never overwrites.', {
    path: pathArg, content: str('Complete contents of the new file.', MAX_CREATE_BYTES),
  }, ['path', 'content']],
];

const samePath = (a, b) => typeof a === 'string' && typeof b === 'string' && path.relative(a, b) === '';
function contained(dir, candidate) {
  const rel = path.relative(dir, candidate);
  return rel !== '..' && !rel.startsWith(`..${path.sep}`) && !path.isAbsolute(rel);
}
function fullNativePath(value) {
  return typeof value === 'string' && path.isAbsolute(value) &&
    (process.platform !== 'win32' || /^[A-Za-z]:[/\\]/u.test(value));
}
function validateSpelling(value, directory) {
  const volume = path.parse(value).root;
  if (volume && !fullNativePath(value)) reject('path');
  const segments = value.slice(volume.length).split(/[/\\]/u);
  if (segments.length === 1 && segments[0] === '' && volume && directory) return [];
  if (segments.length > 32 || segments.some(part => BLOCKED_NAME.test(part) || KNOWN_SECRET.test(part))) reject('blocked');
  if (segments.some((part, i) => (directory || i < segments.length - 1) && BLOCKED_DIRECTORY.test(part))) reject('blocked');
  const specimen = `${segments.join('/')}${directory ? '/DSH-check.txt' : ''}`;
  try { normalizeProjectPath(specimen); } catch (error) {
    const name = segments.at(-1);
    if (directory || error?.code !== 'blocked-file' ||
        !(EXTRA_TEXT_NAMES.test(name) || EXTRA_TEXT_EXTENSIONS.test(name))) {
      reject(error?.code === 'invalid-path' ? 'path' : 'blocked');
    }
    // Reuse all original name/ancestor checks; appending a permitted extension
    // changes only the file-type allowlist decision, not the secret-name policy.
    try { normalizeProjectPath(`${specimen}.txt`); } catch { reject('blocked'); }
  }
  return segments;
}
function checkText(text, cap) {
  if (typeof text !== 'string') reject('args');
  if (text.length > cap || Buffer.byteLength(text, 'utf8') > cap) reject('tooLarge');
  if (NON_TEXT.test(text) || text.startsWith('%PDF-')) reject('nontext');
  if (KNOWN_SECRET.test(text) || [SECRET_VALUE, HEADER_VALUE, URI_VALUE].some(pattern =>
    Array.from(text.matchAll(pattern)).some(match => {
      const value = (match[1] ?? match[2] ?? match[3]).trim();
      return value && !PLACEHOLDER.test(value);
    }))) reject('credential');
}
function stamp(stat) {
  return [stat.dev, stat.ino, stat.birthtimeNs, stat.mode, stat.nlink, stat.size, stat.mtimeNs, stat.ctimeNs].join(':');
}
function identity(stat) {
  return [stat.dev, stat.ino, stat.birthtimeNs, stat.mode].join(':');
}
function publicVersion(target, version, content) {
  return createHash('sha256').update(JSON.stringify([target.targetKey, version, content])).digest('hex');
}
// Match the provider: normalize CRLF only; a lone CR remains literal.
const lf = text => text.replaceAll('\r\n', '\n');
function editedStorageText(original, edited) {
  const sample = original.slice(0, 4096);
  const crlfCount = sample.split('\r\n').length - 1;
  const lfCount = sample.split('\n').length - 1 - crlfCount;
  return crlfCount > lfCount ? lf(edited).replaceAll('\n', '\r\n') : edited;
}
// A window may end inside a multi-byte character; drop that partial tail so the
// next page (which starts at the returned offset) always begins on a boundary.
function trimIncompleteUtf8(bytes) {
  let index = bytes.byteLength - 1;
  let continuation = 0;
  while (index >= 0 && (bytes[index] & 0xc0) === 0x80) { continuation += 1; index -= 1; }
  if (index < 0) return bytes;
  const lead = bytes[index];
  let width;
  if ((lead & 0x80) === 0x00) width = 1;
  else if ((lead & 0xe0) === 0xc0) width = 2;
  else if ((lead & 0xf0) === 0xe0) width = 3;
  else if ((lead & 0xf8) === 0xf0) width = 4;
  else return bytes.subarray(0, index);
  return continuation + 1 < width ? bytes.subarray(0, index) : bytes;
}

export function createProjectAccess({ fs, root, mode, allowWrites, approve, signal } = {}) {
  let available = supportsProjectAccess(fs) && MODES.has(mode) && fullNativePath(root) && root.length <= MAX_PATH;
  if (available) {
    try { validateSpelling(root, true); } catch { available = false; }
  }
  const writes = available && mode !== 'read-only' && allowWrites === true && typeof approve === 'function';
  const schemas = available ? definitions.slice(0, writes ? 4 : 2).map(([name, description, properties, required]) => ({
    name, description, parameters: { type: 'object', properties, required, additionalProperties: false },
  })) : [];
  const active = new Set(schemas.map(schema => schema.name));
  const rootPath = available ? path.resolve(root) : '';
  const checkSignal = () => { if (signal?.aborted) reject('cancelled'); };

  async function probePath(absolute, directory, permitAbsent = false) {
    const volume = path.parse(absolute).root;
    const components = validateSpelling(absolute, directory);
    let current = volume;
    let leaf, parent, projectDevice;
    const chain = [];
    for (let i = 0; i <= components.length; i++) {
      if (i) current = path.join(current, components[i - 1]);
      const final = i === components.length;
      checkSignal();
      try { leaf = await lstat(current, { bigint: true }); } catch (error) {
        if (error?.code === 'ENOENT' && final && permitAbsent) return { leaf: undefined, parent, chain };
        if (error?.code === 'ENOENT' || error?.code === 'ENOTDIR') reject('missing');
        throw error;
      }
      if (leaf.ino === 0n || leaf.isSymbolicLink() ||
          (!final || directory ? !leaf.isDirectory() : !leaf.isFile() || leaf.nlink !== 1n)) reject('blocked');
      if (samePath(current, rootPath)) projectDevice = leaf.dev;
      if (projectDevice !== undefined && leaf.dev !== projectDevice) reject('blocked');
      chain.push(identity(leaf));
      if (!final) parent = leaf;
    }
    return { leaf, parent, chain };
  }
  async function getTarget(value, { directory = false, permitAbsent = false } = {}) {
    const listingRoot = directory && (value === undefined || value === '.');
    if (!listingRoot && (typeof value !== 'string' || !value || value.length > MAX_PATH || value.includes('\0'))) reject('path');
    const absoluteInput = !listingRoot && (path.posix.isAbsolute(value) || path.win32.isAbsolute(value));
    if (absoluteInput && (mode !== 'danger-full-access' || !fullNativePath(value))) reject('path');
    if (!listingRoot) validateSpelling(value, directory);
    const absolute = listingRoot ? rootPath : path.resolve(rootPath, ...(
      absoluteInput ? [value] : value.split(/[/\\]/u)
    ));
    const inside = contained(rootPath, absolute);
    if (!inside && (!absoluteInput || mode !== 'danger-full-access')) reject('path');
    if (absolute.length > MAX_PATH) reject('path');
    // The selected project itself must be a stable physical directory, even for full-mode outside operations.
    const rootProbe = await probePath(rootPath, true);
    const rootTarget = await fs.resolve(rootPath, { signal });
    ensureSameWorld(rootTarget, rootPath);
    const metadata = samePath(absolute, rootPath) && directory ? rootProbe : await probePath(absolute, directory, permitAbsent);
    const noFollow = await fs.lstat(absolute, {}, signal);
    if (metadata.leaf ? noFollow?.type !== (directory ? 'directory' : 'file') : noFollow !== undefined) reject('failure');
    const target = await fs.resolve(absolute, { cwd: rootPath, signal });
    const canonical = ensureSameWorld(target, absolute);
    if (inside && fs.contains(rootTarget, target) !== true) reject('path');
    const info = await fs.stat(target, signal);
    if (metadata.leaf ? (!info || info.type !== noFollow.type || typeof info.version !== 'string' || info.version !== noFollow.version ||
        (!directory && (info.size !== Number(metadata.leaf.size) || !Number.isSafeInteger(info.size)))) : info !== undefined) reject('failure');
    const display = inside ? path.relative(rootPath, canonical).split(path.sep).join('/') || '.' : canonical;
    return { target, canonical, inside, display, info, ...metadata };
  }
  function ensureSameWorld(target, lexical) {
    const canonical = fs.processPath(target);
    const mapped = fs.processPathFromHostPath(lexical);
    if (!fullNativePath(canonical) || !fullNativePath(mapped) || !samePath(canonical, lexical) ||
        !samePath(mapped, canonical) || typeof target?.targetKey !== 'string' || target.targetKey.length > MAX_PATH * 2) reject('blocked');
    return canonical;
  }
  function matchTarget(before, after, directory = false) {
    const norm = directory ? identity : stamp;
    return before.target.targetKey === after.target.targetKey && before.info?.version === after.info?.version &&
      before.chain.join('|') === after.chain.join('|') &&
      (before.leaf ? after.leaf && norm(before.leaf) === norm(after.leaf) : !after.leaf);
  }
  const cursorKey = randomBytes(32);
  function scope(kind, selected) {
    return createHash('sha256').update(JSON.stringify([
      kind, selected.target.targetKey, selected.info.version, selected.chain, stamp(selected.leaf),
    ])).digest('hex');
  }
  function makeCursor(snapshot, position) {
    const payload = Buffer.from(JSON.stringify([snapshot, position])).toString('base64url');
    return `${payload}.${createHmac('sha256', cursorKey).update(payload).digest('base64url')}`;
  }
  function cursorPosition(cursor, snapshot) {
    const parts = cursor.match(/^([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]{43})$/u);
    if (!parts) reject('cursor');
    const expected = createHmac('sha256', cursorKey).update(parts[1]).digest();
    const tag = Buffer.from(parts[2], 'base64url');
    if (!timingSafeEqual(expected, tag) || tag.toString('base64url') !== parts[2]) reject('cursor');
    const [bound, position] = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    if (bound !== snapshot) reject('stale');
    return position;
  }
  async function readEditable(value, selected) {
    selected ??= await getTarget(value);
    if (selected.info.size > MAX_FILE_BYTES) reject('tooLarge');
    checkSignal();
    const bytes = await fs.readBytes(selected.target, signal, MAX_FILE_BYTES);
    const fresh = await getTarget(value);
    if (!matchTarget(selected, fresh) || !(bytes instanceof Uint8Array) || bytes.byteLength !== fresh.info.size) reject('stale');
    let content;
    try { content = new TextDecoder('utf-8', { fatal: true }).decode(bytes); } catch { reject('nontext'); }
    checkText(content, MAX_FILE_BYTES);
    checkSignal();
    return { selected: fresh, content, version: publicVersion(fresh.target, fresh.info.version, content) };
  }
  // Screen the bounded file locally before returning any page. Screening each
  // visible window alone could miss a credential split across page boundaries.
  async function read(value, cursor) {
    const selected = await getTarget(value);
    const size = selected.info.size;
    if (size > MAX_SCREEN_BYTES) reject('tooLarge');
    checkSignal();
    const bytes = await fs.readBytes(selected.target, signal, size <= MAX_FILE_BYTES ? MAX_FILE_BYTES : MAX_SCREEN_BYTES);
    const fresh = await getTarget(value);
    if (!matchTarget(selected, fresh) || !(bytes instanceof Uint8Array) || bytes.byteLength !== size) reject('stale');
    const snapshot = scope(`read:${createHash('sha256').update(bytes).digest('hex')}`, fresh);
    const position = cursor === undefined ? 0 : cursorPosition(cursor, snapshot);
    if (!Number.isSafeInteger(position) || position < 0 || position > size) reject('cursor');
    let screened;
    try { screened = new TextDecoder('utf-8', { fatal: true }).decode(bytes); } catch { reject('nontext'); }
    checkText(screened, MAX_SCREEN_BYTES);
    checkSignal();
    const decode = new TextDecoder('utf-8', { fatal: true, ignoreBOM: position !== 0 });
    let body = bytes.subarray(position, position + MAX_FILE_BYTES);
    let content;
    for (;;) {
      if (position + body.byteLength < size) body = trimIncompleteUtf8(body);
      content = decode.decode(body);
      if (JSON.stringify(content).length <= MAX_PAGE_JSON_CHARS) break;
      body = body.subarray(0, Math.floor(body.byteLength / 2));
    }
    const end = position + body.byteLength;
    const eof = end >= size;
    const page = { path: fresh.display, content, offset: position, length: body.byteLength, eof };
    if (size <= MAX_FILE_BYTES && eof) {
      // Version is for the whole screened file, even if JSON escaping needed a second page.
      page.version = publicVersion(fresh.target, fresh.info.version, screened);
    }
    if (!eof) page.nextCursor = makeCursor(snapshot, end);
    return page;
  }
  async function list(value, cursor) {
    const selected = await getTarget(value, { directory: true });
    // Native listDir has no producer cap. Preflight directory size incrementally,
    // then reject an inconsistent snapshot instead of returning unverified names.
    const names = new Map();
    for await (const entry of await opendir(selected.canonical, { bufferSize: 16 })) {
      checkSignal();
      if (names.size >= MAX_DIRECTORY_SIZE) reject('tooLarge');
      names.set(entry.name, entry.isDirectory() ? 'directory' : entry.isFile() ? 'file' : 'other');
    }
    const entries = await fs.listDir(selected.target, signal);
    const fresh = await getTarget(value, { directory: true });
    if (!matchTarget(selected, fresh, true) || entries.length !== names.size || entries.length > MAX_DIRECTORY_SIZE) reject('failure');
    const visible = [];
    for (const entry of entries) {
      checkSignal();
      if (!['file', 'directory'].includes(entry?.type) || names.get(entry.name) !== entry.type || /[/\\]/u.test(entry.name)) continue;
      try {
        validateSpelling(entry.name, entry.type === 'directory');
        const childPath = path.join(fresh.canonical, entry.name);
        if (childPath.length > MAX_PATH || fs.contains(fresh.target, entry.target) !== true) continue;
        ensureSameWorld(entry.target, childPath);
        const child = await lstat(childPath, { bigint: true });
        if (child.ino === 0n || child.dev !== fresh.leaf.dev || child.isSymbolicLink() ||
            (entry.type === 'file' ? !child.isFile() || child.nlink !== 1n : !child.isDirectory())) continue;
      } catch { continue; }
      visible.push({ name: entry.name, type: entry.type });
      if (visible.length >= MAX_DIRECTORY_SIZE) break;
    }
    checkSignal();
    visible.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
    const latest = await getTarget(value, { directory: true });
    if (!matchTarget(fresh, latest, true) || stamp(fresh.leaf) !== stamp(latest.leaf)) reject('stale');
    const snapshot = scope(`list:${createHash('sha256').update(JSON.stringify(visible)).digest('hex')}`, latest);
    const position = cursor === undefined ? 0 : cursorPosition(cursor, snapshot);
    if (!Number.isSafeInteger(position) || position < 0 || position > visible.length) reject('cursor');
    const page = [];
    let wireChars = 0;
    for (const entry of visible.slice(position, position + MAX_ENTRIES)) {
      wireChars += JSON.stringify(entry).length + 1;
      if (wireChars > MAX_PAGE_JSON_CHARS) break;
      page.push(entry);
    }
    checkSignal();
    const end = position + page.length;
    const result = { path: fresh.display, entries: page, offset: position, total: visible.length, truncated: end < visible.length };
    if (end < visible.length) result.nextCursor = makeCursor(snapshot, end);
    return result;
  }
  async function confirm(change) {
    checkSignal();
    let accepted = false;
    try { accepted = (await approve(Object.freeze(change))) === true; } catch { /* fail closed */ }
    checkSignal();
    if (!accepted) reject('approval');
  }
  async function edit(args) {
    if (!/^[a-f0-9]{64}$/u.test(args.expectedVersion)) reject('args');
    checkText(args.oldText, MAX_CHANGE_BYTES);
    checkText(args.newText, MAX_CHANGE_BYTES);
    const original = await readEditable(args.path);
    if (original.version !== args.expectedVersion) reject('stale');
    const before = lf(original.content), oldText = lf(args.oldText), newText = lf(args.newText);
    const first = before.indexOf(oldText);
    if (!oldText || oldText === newText || first < 0 || before.indexOf(oldText, first + 1) >= 0) reject('literal');
    const edited = before.slice(0, first) + newText + before.slice(first + oldText.length);
    checkText(editedStorageText(original.content, edited), MAX_FILE_BYTES);
    await confirm({ operation: 'edit', path: original.selected.display, canonicalPath: original.selected.canonical,
      expectedVersion: original.version, oldText, newText });
    const fresh = await getTarget(args.path);
    if (!matchTarget(original.selected, fresh)) reject('stale');
    checkSignal();
    await fs.editText(fresh.target, { oldString: oldText, newString: newText, replaceAll: false },
      { version: fresh.info.version }, signal, { mode, workspaceRoot: rootPath });
    return { operation: 'edit', path: fresh.display };
  }
  async function create(args) {
    checkText(args.content, MAX_CREATE_BYTES);
    const selected = await getTarget(args.path, { permitAbsent: true });
    if (selected.info) reject('conflict');
    await confirm({ operation: 'create', path: selected.display, canonicalPath: selected.canonical,
      expectedVersion: null, oldText: '', newText: args.content, content: args.content });
    const fresh = await getTarget(args.path, { permitAbsent: true });
    if (fresh.info) reject('conflict');
    if (!matchTarget(selected, fresh)) reject('failure');
    checkSignal();
    await fs.writeText(fresh.target, args.content, { kind: 'createIfAbsent' }, signal, { mode, workspaceRoot: rootPath });
    return { operation: 'create', path: fresh.display };
  }
  async function execute(call) {
    try {
      if (!available) reject('unavailable');
      checkSignal();
      const operation = call?.function ?? call;
      const name = operation?.name;
      if (!active.has(name)) reject('route');
      let args = operation.arguments;
      if (typeof args === 'string') {
        if (args.length > MAX_WIRE_CHARS) reject('tooLarge');
        try { args = JSON.parse(args); } catch { reject('args'); }
      }
      if (args === undefined && name === 'project_list') args = {};
      const [, , properties, required] = definitions.find(entry => entry[0] === name);
      if (!args || typeof args !== 'object' || Array.isArray(args) ||
          Object.keys(args).some(key => !Object.hasOwn(properties, key) || typeof args[key] !== 'string' || args[key].length > properties[key].maxLength) ||
          required.some(key => !Object.hasOwn(args, key) || typeof args[key] !== 'string')) reject('args');
      const clean = Object.fromEntries(Object.keys(properties).filter(key => Object.hasOwn(args, key)).map(key => [key, args[key]]));
      if (name === 'project_list') return { ok: true, ...(await list(clean.path, clean.cursor)) };
      if (name === 'project_read') return { ok: true, ...(await read(clean.path, clean.cursor)) };
      return { ok: true, ...(await (name === 'project_edit' ? edit(clean) : create(clean))) };
    } catch (error) {
      const mapped = {
        FS_STALE_VERSION: ERRORS.stale, FS_NOT_OBSERVED: ERRORS.conflict, FS_ALREADY_EXISTS: ERRORS.conflict,
        FS_AMBIGUOUS_EDIT: ERRORS.literal, FS_EDIT_NOT_FOUND: ERRORS.literal, FS_NOT_FOUND: ERRORS.missing,
        FS_TOO_LARGE: ERRORS.tooLarge, FS_NOT_TEXT: ERRORS.nontext, FS_ABORTED: ERRORS.cancelled,
      };
      return { ok: false, error: error instanceof ProjectAccessError ? error.message :
        (Object.hasOwn(mapped, error?.code) ? mapped[error.code] : ERRORS.failure) };
    }
  }
  return { schemas, execute };
}

// The shipping local backend revalidates its workspace-write fence, not a kernel
// sandbox. Pre/post metadata checks reject normal link substitution; a separate
// process capable of racing native filesystem syscalls is outside that guarantee.
// Full access changes path scope only: no shell, command, execution, or delete API.
