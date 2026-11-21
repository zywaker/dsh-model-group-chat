import { constants } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { TextDecoder } from "node:util";

export const MAX_FILE_CHARS = 4000; // UTF-16 code units; never split a surrogate pair.
export const MAX_FILE_READ_BYTES = 3 * MAX_FILE_CHARS + 4096;

const MAX_PATH_CHARS = 1024;
const MAX_PATH_SEGMENTS = 32;
const MAX_ATTEMPTS = 3;
const TEXT_EXTENSIONS = new Set((
  "txt md markdown mdx rst adoc org csv tsv yaml yml toml json jsonc jsonl xml " +
  "js jsx mjs cjs ts tsx mts cts css scss sass less html htm svg vue svelte astro " +
  "py pyi rb php go rs c h cc cpp cxx hh hpp hxx cs java kt kts scala swift m mm " +
  "sh bash zsh fish ps1 psm1 bat cmd sql graphql gql proto lua r dart ex exs erl hrl " +
  "clj cljs edn hs lhs ml mli fs fsx vb zig asm s sol tf hcl ini cfg conf cmake gradle " +
  "properties resx tex bib diff patch"
).split(" "));
const TEXT_NAMES = new Set([
  "readme", "license", "licence", "copying", "notice", "authors", "changelog",
  "changes", "contributing", "makefile", "dockerfile", "containerfile", "gemfile",
  "rakefile", "procfile", ".gitignore", ".gitattributes", ".editorconfig", ".dockerignore",
]);
const DOT_DIRECTORIES = new Set([".github", ".gitlab"]);
const NON_TEXT_SUFFIXES = /\.(?:key|pem|ppk|p12|pfx|pkcs12|jks|keystore|kdbx|p8)(?:\.|$)/iu;
const SECRET_NAMES = /(?:^|[_. -])(?:secrets?|credentials?|creds|passwords?|passwd|shadow|tokens?|api[-_ ]?keys?|private[-_ ]?keys?|client[-_ ]?secrets?|service[-_ ]?accounts?|keyrings?|env|dotenv|htpasswd|netrc|npmrc|pypirc|dockercfg|awscredentials)(?=$|[_. -])/iu;
const SSH_KEY_NAMES = /^(?:id_(?:rsa|dsa|ecdsa|ed25519|xmss)(?:[_. -]|$)|authorized_keys(?:[_. -]|$)|known_hosts(?:[_. -]|$))/iu;
const SECRET_CONFIG_NAMES = /^(?:auth(?:entication)?|kubeconfig|application_default_credentials|local\.settings|secrets?\.auto\.tfvars|clientsecret|serviceaccount(?:key)?|apikeys?|privatekeys?|accesstoken|refreshtoken)(?:[_. -]|$)/iu;
const DEVICE_NAMES = /^(?:con|prn|aux|nul|clock\$|conin\$|conout\$|(?:com|lpt)[0-9¹²³])$/iu;
const INVALID_SEGMENT_CHARS = /[\u0000-\u001f\u007f-\u009f<>:"|?*~\u202a-\u202e\u2066-\u2069\ud800-\udfff]/u;
const NON_TEXT_CHARS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f]/u;

const MESSAGES = {
  "invalid-path": "Select a valid relative project file path.",
  "blocked-file": "This project file is not eligible for preview.",
  "file-not-found": "The project file was not found.",
  "file-unavailable": "The project file could not be safely opened or verified.",
  "non-text-file": "The project file does not appear to be UTF-8 text.",
  "secret-content": "The project preview resembles a credential and was blocked.",
};
class ProjectFileError extends Error {
  constructor(code) {
    super(MESSAGES[code]);
    this.code = code;
  }
}
class DirectoryChangedError extends ProjectFileError {
  constructor() { super("file-unavailable"); }
}

export function normalizeProjectPath(value) {
  if (typeof value !== "string" || value.length === 0 || value.length > MAX_PATH_CHARS ||
      path.posix.isAbsolute(value) || path.win32.isAbsolute(value)) {
    throw new ProjectFileError("invalid-path");
  }
  const segments = value.split(/[/\\]/u);
  if (segments.length > MAX_PATH_SEGMENTS || segments.some(segment =>
    !segment || segment === "." || segment === ".." || segment.length > 255 ||
    INVALID_SEGMENT_CHARS.test(segment) || /[. ]$/u.test(segment) ||
    DEVICE_NAMES.test(segment.split(".", 1)[0].trimEnd())
  )) {
    throw new ProjectFileError("invalid-path");
  }
  for (const [i, segment] of segments.entries()) {
    const name = segment.toLowerCase();
    const leaf = i === segments.length - 1;
    if (SECRET_NAMES.test(name) || SSH_KEY_NAMES.test(name) || SECRET_CONFIG_NAMES.test(name) ||
        NON_TEXT_SUFFIXES.test(name) ||
        (name.startsWith(".") && !(leaf ? TEXT_NAMES : DOT_DIRECTORIES).has(name))) {
      throw new ProjectFileError("blocked-file");
    }
    if (leaf && !TEXT_NAMES.has(name) && !TEXT_EXTENSIONS.has(path.posix.extname(name).slice(1))) {
      throw new ProjectFileError("blocked-file");
    }
  }
  return segments.join("/");
}

function workspaceRoot(workspacePath) {
  if (typeof workspacePath !== "string" || workspacePath.includes("\0") || !path.isAbsolute(workspacePath) ||
      (process.platform === "win32" && !/^[A-Za-z]:[/\\]/u.test(workspacePath))) {
    throw new ProjectFileError("invalid-path");
  }
  return path.resolve(workspacePath);
}

function assertRegular(stat, leaf) {
  if (stat.isSymbolicLink() || (leaf ? !stat.isFile() || stat.nlink !== 1n : !stat.isDirectory())) {
    throw new ProjectFileError("blocked-file");
  }
  // A provider without a usable file identity cannot substantiate this preview.
  if (stat.ino === 0n) throw new ProjectFileError("file-unavailable");
}

function sameIdentity(before, after) {
  return before.dev === after.dev && before.ino === after.ino && before.birthtimeNs === after.birthtimeNs;
}

function sameFileSnapshot(before, after) {
  // Reading changes atime, which is deliberately not compared.
  return sameIdentity(before, after) && before.mode === after.mode && before.nlink === after.nlink &&
    before.size === after.size && before.mtimeNs === after.mtimeNs && before.ctimeNs === after.ctimeNs;
}

function pathsFromRoot(absolutePath) {
  const { root } = path.parse(absolutePath);
  const paths = [root];
  for (const component of absolutePath.slice(root.length).split(path.sep).filter(Boolean)) {
    paths.push(path.join(paths.at(-1), component));
  }
  return paths;
}

function samePath(a, b) {
  return path.relative(a, b) === "";
}

async function captureChain(root, candidate) {
  const chain = [];
  let workspaceDevice;
  for (const name of pathsFromRoot(candidate)) {
    const stat = await fs.lstat(name, { bigint: true });
    assertRegular(stat, name === candidate);
    if (name === root) workspaceDevice = stat.dev;
    if (workspaceDevice !== undefined && stat.dev !== workspaceDevice) {
      throw new ProjectFileError("blocked-file");
    }
    chain.push({ name, stat });
  }
  return chain;
}

async function verifyRealPaths(root, candidate) {
  const canonicalRoot = await fs.realpath(root);
  const canonicalFile = await fs.realpath(candidate);
  const relative = path.relative(canonicalRoot, canonicalFile);
  if (!samePath(root, canonicalRoot) || !samePath(candidate, canonicalFile) || !relative ||
      relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new ProjectFileError("blocked-file");
  }
  // Apply the name restrictions to the filesystem's spelling as well as the request.
  normalizeProjectPath(relative);
}

async function verifyChain(chain, file) {
  const opened = await file.stat({ bigint: true });
  const expected = chain.at(-1).stat;
  assertRegular(opened, true);
  // Match the opened inode even if a substituted path has already been restored.
  if (!sameFileSnapshot(expected, opened)) throw new ProjectFileError("file-unavailable");
  // Check ancestor mutation times as well as identity: even a restored rename
  // can leave evidence in the parent. Unrelated changes may cause a fresh attempt.
  let directoryChanged = false;
  for (let i = chain.length - 1; i >= 0; i--) {
    const { name, stat } = chain[i];
    const current = await fs.lstat(name, { bigint: true });
    const leaf = i === chain.length - 1;
    assertRegular(current, leaf);
    if (!(leaf ? sameFileSnapshot(stat, current) : sameIdentity(stat, current))) {
      throw new ProjectFileError("file-unavailable");
    }
    if (!leaf && (stat.ctimeNs !== current.ctimeNs || stat.mtimeNs !== current.mtimeNs)) {
      directoryChanged = true;
    }
  }
  if (directoryChanged) throw new DirectoryChangedError();
}

const KNOWN_CREDENTIALS = /-----BEGIN (?:[A-Z0-9]+ ){0,4}PRIVATE KEY-----|\b(?:gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{50,}|xox[baprs]-[A-Za-z0-9-]{12,}|(?:AKIA|ASIA)[A-Z0-9]{16}|AIza[A-Za-z0-9_-]{35}|(?:sk|rk)_(?:live|test)_[A-Za-z0-9]{16,}|sk-(?:(?:proj|svcacct|ant-api03)-)?[A-Za-z0-9_-]{24,}|npm_[A-Za-z0-9]{36}|eyJ[A-Za-z0-9_-]{8,}\.eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{12,})\b/gu;
const ASSIGNMENTS = /(?:^|[,{])[^\S\r\n]*(?:(?:export|const|let|var)[^\S\r\n]+)?["']?(?:[A-Za-z][A-Za-z0-9_-]*[_-])?(?:api[-_]?key|access[-_]?token|refresh[-_]?token|auth[-_]?token|bearer[-_]?token|secret[-_]?key|client[-_]?secret|private[-_]?key|secret[-_]?access[-_]?key|password|passwd|credentials?|secrets?|tokens?)["']?[^\S\r\n]*[:=][^\S\r\n]*(?:"([^"\r\n]{6,})"|'([^'\r\n]{6,})'|([A-Za-z0-9!$%&*+./:@^_=-]{6,})(?=[^\S\r\n]*(?:$|[#;},])))/gimu;
const AUTH_HEADERS = /\bauthorization["']?\s*:\s*["']?(?:bearer|basic)\s+([A-Za-z0-9._~+/-]{12,}={0,2})/giu;
const URI_CREDENTIALS = /\b(?:https?|postgres(?:ql)?|mysql|mariadb|mongodb(?:\+srv)?|redis|amqps?):\/\/[^/:@\s]+:([^/@\s]+)@/giu;
const PLACEHOLDER = /^(?:example(?:[-_ ]?(?:key|token|password|secret|value))?|(?:your|test|dummy|sample|fake|placeholder|replace[-_ ]?with)[-_ ]*(?:api[-_ ]?)?(?:key|token|password|secret|credential|value)?|changeme|change[-_ ]?me|redacted|none|null|undefined|password|secret|\*+|x{3,}|\$\{[^}]+\}|\{\{[^}]+\}\}|<[^>]+>|(?:process\.env|import\.meta\.env)\.[\w.]+)$/iu;

function resemblesSecret(text, visibleChars) {
  if ([...text.matchAll(KNOWN_CREDENTIALS)].some(match => match.index < visibleChars)) return true;
  for (const pattern of [ASSIGNMENTS, AUTH_HEADERS, URI_CREDENTIALS]) {
    for (const match of text.matchAll(pattern)) {
      if (match.index >= visibleChars) break;
      const value = (match[1] ?? match[2] ?? match[3]).trim();
      if (value && !PLACEHOLDER.test(value)) return true;
    }
  }
  return false;
}

async function readVerifiedFile(root, candidate, projectPath) {
  let file;
  let phase = "locate";
  try {
    const chain = await captureChain(root, candidate);
    await verifyRealPaths(root, candidate);
    const flags = constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0) | (constants.O_NONBLOCK ?? 0);
    file = await fs.open(candidate, flags);
    phase = "verify";
    await verifyRealPaths(root, candidate);
    await verifyChain(chain, file);

    const { size } = chain.at(-1).stat;
    const readLength = Number(size > BigInt(MAX_FILE_READ_BYTES) ? BigInt(MAX_FILE_READ_BYTES) : size);
    const bytes = Buffer.alloc(readLength);
    for (let offset = 0; offset < readLength;) {
      const { bytesRead } = await file.read(bytes, offset, readLength - offset, offset);
      if (bytesRead === 0) throw new ProjectFileError("file-unavailable");
      offset += bytesRead;
    }
    await verifyRealPaths(root, candidate);
    await verifyChain(chain, file);

    const byteTruncated = BigInt(readLength) < size;
    let decoded;
    try {
      // Ignore only an incomplete final sequence at our byte boundary. Malformed
      // sequences inside the prefix, or at the true end of the file, still fail.
      decoded = new TextDecoder("utf-8", { fatal: true }).decode(bytes, { stream: byteTruncated });
    } catch {
      throw new ProjectFileError("non-text-file");
    }
    if (!decoded || NON_TEXT_CHARS.test(decoded) || decoded.startsWith("%PDF-")) {
      throw new ProjectFileError("non-text-file");
    }
    let text = decoded.slice(0, MAX_FILE_CHARS);
    if (/[\ud800-\udbff]$/u.test(text)) text = text.slice(0, -1);
    if (resemblesSecret(decoded, text.length)) throw new ProjectFileError("secret-content");
    return { path: projectPath, text, truncated: byteTruncated || text.length < decoded.length };
  } catch (error) {
    if (error instanceof ProjectFileError) throw error;
    if (error?.code === "ELOOP" || error?.code === "EMLINK") throw new ProjectFileError("blocked-file");
    if (phase === "locate" && (error?.code === "ENOENT" || error?.code === "ENOTDIR")) {
      throw new ProjectFileError("file-not-found");
    }
    throw new ProjectFileError("file-unavailable");
  } finally {
    if (file) {
      try { await file.close(); } catch { throw new ProjectFileError("file-unavailable"); }
    }
  }
}

export async function previewProjectFile(options) {
  if (!options || typeof options !== "object") throw new ProjectFileError("invalid-path");
  const { workspacePath, relativePath } = options;
  const projectPath = normalizeProjectPath(relativePath);
  const root = workspaceRoot(workspacePath);
  const candidate = path.join(root, ...projectPath.split("/"));
  for (let attempt = 1; ; attempt++) {
    try {
      return await readVerifiedFile(root, candidate, projectPath);
    } catch (error) {
      if (!(error instanceof DirectoryChangedError) || attempt >= MAX_ATTEMPTS) throw error;
    }
  }
}
