import { inflateRawSync } from 'node:zlib';

const MAX_DOC_BYTES = 8 * 1024 * 1024;
const MAX_OUTPUT_CHARS = 120_000;
const MAX_ZIP_ENTRIES = 2_000;
const MAX_ENTRY_BYTES = 16 * 1024 * 1024;
const MAX_TOTAL_INFLATE = 64 * 1024 * 1024;

const TEXT_EXTENSIONS = new Set(('txt md markdown mdx rst adoc org csv tsv yaml yml toml json jsonc jsonl xml js jsx mjs cjs ts tsx mts cts ' +
  'css scss sass less html htm svg vue svelte astro py pyi rb php go rs c h cc cpp cxx hh hpp hxx cs java kt kts scala swift m mm ' +
  'sh bash zsh fish ps1 psm1 bat cmd sql graphql gql proto lua r dart ex exs erl hrl clj cljs edn hs lhs ml mli fs fsx vb zig asm s sol ' +
  'tf hcl ini cfg conf cmake gradle properties resx tex bib diff patch').split(' '));
const IMAGE_TYPES = new Map([
  ['png', 'image/png'], ['jpg', 'image/jpeg'], ['jpeg', 'image/jpeg'], ['gif', 'image/gif'], ['webp', 'image/webp'],
]);

function slice(buffer, start, end) {
  return buffer.subarray(start, Math.min(end, buffer.length));
}

function decodeUtf8(bytes) {
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return undefined;
  }
}

function extensionOf(name) {
  const match = /\.([A-Za-z0-9]{1,12})$/u.exec(name ?? '');
  return match ? match[1].toLowerCase() : '';
}

// ---------------------------------------------------------------- ZIP / OOXML

function zipEntries(bytes) {
  let eocd = -1;
  for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 66_000); i -= 1) {
    if (bytes[i] === 0x50 && bytes[i + 1] === 0x4b && bytes[i + 2] === 0x05 && bytes[i + 3] === 0x06) { eocd = i; break; }
  }
  if (eocd < 0) throw Object.assign(new Error('not a zip archive'), { code: 'corrupt' });
  const count = bytes.readUInt16LE(eocd + 10);
  let offset = bytes.readUInt32LE(eocd + 16);
  if (count > MAX_ZIP_ENTRIES) throw Object.assign(new Error('too many archive entries'), { code: 'tooLarge' });
  const entries = new Map();
  let inflated = 0;
  for (let i = 0; i < count && offset + 46 <= bytes.length; i += 1) {
    if (bytes.readUInt32LE(offset) !== 0x02014b50) break;
    const method = bytes.readUInt16LE(offset + 10);
    const compressedSize = bytes.readUInt32LE(offset + 20);
    const uncompressedSize = bytes.readUInt32LE(offset + 24);
    const nameLength = bytes.readUInt16LE(offset + 28);
    const extraLength = bytes.readUInt16LE(offset + 30);
    const commentLength = bytes.readUInt16LE(offset + 32);
    const localOffset = bytes.readUInt32LE(offset + 42);
    const name = bytes.subarray(offset + 46, offset + 46 + nameLength).toString('utf8');
    offset += 46 + nameLength + extraLength + commentLength;
    if (entries.has(name) || uncompressedSize > MAX_ENTRY_BYTES) continue;
    if (localOffset + 30 > bytes.length || bytes.readUInt32LE(localOffset) !== 0x04034b50) continue;
    const localName = bytes.readUInt16LE(localOffset + 26);
    const localExtra = bytes.readUInt16LE(localOffset + 28);
    const start = localOffset + 30 + localName + localExtra;
    const data = slice(bytes, start, start + compressedSize);
    entries.set(name, { method, data, compressedSize, uncompressedSize });
    inflated += data.length;
    if (inflated > MAX_TOTAL_INFLATE) throw Object.assign(new Error('archive is too large'), { code: 'tooLarge' });
  }
  return entries;
}

function readZipFile(entries, name) {
  const entry = entries.get(name);
  if (!entry) return undefined;
  if (entry.method === 0) return entry.data;
  if (entry.method !== 8) return undefined;
  try {
    return inflateRawSync(entry.data, { maxOutputLength: Math.min(MAX_ENTRY_BYTES, Math.max(entry.uncompressedSize, 1024)) });
  } catch {
    return undefined;
  }
}

function xmlText(xml) {
  return xml
    .replace(/<w:tab\/>/gu, '\t')
    .replace(/<w:br\s*\/>/gu, '\n')
    .replace(/<\/w:p>/gu, '\n')
    .replace(/<\/a:p>/gu, '\n')
    .replace(/<[^>]+>/gu, '')
    .replace(/&lt;/gu, '<').replace(/&gt;/gu, '>').replace(/&quot;/gu, '"').replace(/&apos;/gu, "'").replace(/&amp;/gu, '&')
    .replace(/[ \t]+\n/gu, '\n')
    .replace(/\n{3,}/gu, '\n\n')
    .trim();
}

function sharedStrings(entries) {
  const xml = readZipFile(entries, 'xl/sharedStrings.xml');
  if (!xml) return [];
  return [...xml.toString('utf8').matchAll(/<si>([\s\S]*?)<\/si>/gu)].map(match =>
    [...match[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/gu)].map(part => part[1]).join('')
      .replace(/&lt;/gu, '<').replace(/&gt;/gu, '>').replace(/&quot;/gu, '"').replace(/&apos;/gu, "'").replace(/&amp;/gu, '&'));
}

function columnIndex(reference) {
  const letters = /^([A-Z]+)/u.exec(reference ?? '')?.[1] ?? '';
  let index = 0;
  for (const letter of letters) index = index * 26 + (letter.charCodeAt(0) - 64);
  return Math.max(0, index - 1);
}

function xlsxText(entries) {
  const strings = sharedStrings(entries);
  const sheets = [...entries.keys()].filter(name => /^xl\/worksheets\/sheet\d+\.xml$/u.test(name)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  const blocks = [];
  for (const sheet of sheets.slice(0, 8)) {
    const xml = readZipFile(entries, sheet);
    if (!xml) continue;
    const rows = [];
    for (const rowMatch of xml.toString('utf8').matchAll(/<row[^>]*>([\s\S]*?)<\/row>/gu)) {
      const cells = [];
      for (const cellMatch of rowMatch[1].matchAll(/<c([^>]*)>([\s\S]*?)<\/c>/gu)) {
        const attributes = cellMatch[1];
        const body = cellMatch[2];
        const reference = /r="([A-Z]+\d+)"/u.exec(attributes)?.[1];
        const type = /t="([^"]+)"/u.exec(attributes)?.[1];
        let value = '';
        if (type === 's') value = strings[Number(/<v>([\s\S]*?)<\/v>/u.exec(body)?.[1] ?? -1)] ?? '';
        else if (type === 'inlineStr') value = xmlText((/<is>([\s\S]*?)<\/is>/u.exec(body)?.[1] ?? ''));
        else value = (/<v>([\s\S]*?)<\/v>/u.exec(body)?.[1] ?? '').replace(/&amp;/gu, '&');
        const index = reference ? columnIndex(reference) : cells.length;
        cells[index] = value.replace(/\s+/gu, ' ').trim();
        if (cells.length > 40) break;
      }
      rows.push(cells.map(cell => cell ?? '').join('\t'));
      if (rows.length >= 400) break;
    }
    const text = rows.join('\n').trim();
    if (text) blocks.push(`[${sheet.replace(/^xl\/worksheets\//u, '').replace(/\.xml$/u, '')}]\n${text}`);
    if (blocks.join('\n\n').length > MAX_OUTPUT_CHARS) break;
  }
  return { format: 'xlsx', text: blocks.join('\n\n') };
}

function docxText(entries) {
  const xml = readZipFile(entries, 'word/document.xml');
  if (!xml) throw Object.assign(new Error('missing document.xml'), { code: 'corrupt' });
  const source = xml.toString('utf8')
    .replace(/<w:tab\/>/gu, '\t')
    .replace(/<\/w:tc>/gu, '\t')
    .replace(/<\/w:tr>/gu, '\n');
  const paragraphs = [...source.matchAll(/<w:p[ >][\s\S]*?<\/w:p>/gu)]
    .map(match => [...match[0].matchAll(/<w:t[^>]*>([\s\S]*?)<\/w:t>/gu)].map(part => part[1]).join(''))
    .map(text => text.replace(/&lt;/gu, '<').replace(/&gt;/gu, '>').replace(/&quot;/gu, '"').replace(/&apos;/gu, "'").replace(/&amp;/gu, '&'))
    .filter(text => text.trim());
  const body = paragraphs.length ? paragraphs.join('\n') : xmlText(source);
  return { format: 'docx', text: body };
}

function pptxText(entries) {
  const slides = [...entries.keys()].filter(name => /^ppt\/slides\/slide\d+\.xml$/u.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  const blocks = [];
  for (const slide of slides.slice(0, 60)) {
    const xml = readZipFile(entries, slide);
    if (!xml) continue;
    const text = [...xml.toString('utf8').matchAll(/<a:t>([\s\S]*?)<\/a:t>/gu)].map(match => match[1]).join('\n').trim();
    if (text) blocks.push(`[${slide.replace(/^ppt\/slides\//u, '').replace(/\.xml$/u, '')}]\n${text}`);
  }
  return { format: 'pptx', text: blocks.join('\n\n') };
}

// ----------------------------------------------------------------------- PDF

function pdfText(bytes) {
  const source = bytes.toString('latin1');
  const chunks = [];
  let inflatedBytes = 0;
  for (const match of source.matchAll(/stream\r?\n([\s\S]*?)\r?\nendstream/gu)) {
    const raw = Buffer.from(match[1], 'latin1');
    let data = raw;
    try {
      data = inflateRawSync(raw, { maxOutputLength: 8 * 1024 * 1024 });
      inflatedBytes += data.length;
      if (inflatedBytes > 32 * 1024 * 1024) break;
    } catch { /* page content may be stored uncompressed */ }
    const text = data.toString('latin1');
    for (const piece of text.matchAll(/\((?:\\.|[^\\()])*\)/gu)) {
      const decoded = piece[0].slice(1, -1)
        .replace(/\\([nrtbf()\\])/gu, (_, code) => ({ n: '\n', r: '\r', t: '\t', b: '\b', f: '\f', '(': '(', ')': ')', '\\': '\\' })[code])
        .replace(/\\([0-7]{1,3})/gu, (_, octal) => String.fromCharCode(parseInt(octal, 8)));
      if (decoded.trim()) chunks.push(decoded);
    }
    if (chunks.join(' ').length > MAX_OUTPUT_CHARS) break;
  }
  const text = chunks.join(' ')
    .replace(/\s+/gu, ' ')
    .trim();
  return { format: 'pdf', text };
}

// -------------------------------------------------------------------- images

function imageInfo(bytes, extension) {
  if (bytes.length > 24 && bytes.readUInt32BE(0) === 0x89504e47) {
    return { format: 'png', mimeType: 'image/png', width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  }
  if (bytes.length > 10 && bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {
    return { format: 'gif', mimeType: 'image/gif', width: bytes.readUInt16LE(6), height: bytes.readUInt16LE(8) };
  }
  if (bytes.length > 4 && bytes[0] === 0xff && bytes[1] === 0xd8) {
    for (let i = 2; i + 9 < bytes.length;) {
      if (bytes[i] !== 0xff) { i += 1; continue; }
      const marker = bytes[i + 1];
      const length = bytes.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { format: 'jpeg', mimeType: 'image/jpeg', width: bytes.readUInt16BE(i + 7), height: bytes.readUInt16BE(i + 5) };
      }
      i += 2 + length;
    }
    return { format: 'jpeg', mimeType: 'image/jpeg', width: 0, height: 0 };
  }
  if (bytes.length > 30 && bytes.toString('latin1', 0, 4) === 'RIFF' && bytes.toString('latin1', 8, 12) === 'WEBP') {
    return { format: 'webp', mimeType: 'image/webp', width: 0, height: 0 };
  }
  return IMAGE_TYPES.has(extension) ? { format: extension, mimeType: IMAGE_TYPES.get(extension), width: 0, height: 0 } : undefined;
}

// --------------------------------------------------------------------- entry

/**
 * Convert an uploaded or project file into bounded plain text plus metadata.
 * Never executes the file and never returns more than MAX_OUTPUT_CHARS.
 */
export function extractDocument(input, name = 'file') {
  const bytes = input instanceof Uint8Array ? Buffer.from(input.buffer, input.byteOffset, input.byteLength) : Buffer.from(input);
  if (bytes.length > MAX_DOC_BYTES) return { ok: false, code: 'tooLarge', format: extensionOf(name) };
  const extension = extensionOf(name);
  const image = imageInfo(bytes, extension);
  if (image) {
    return { ok: true, format: image.format, mimeType: image.mimeType,
      text: `[image ${image.format}${image.width ? ` ${image.width}x${image.height}` : ''}, ${bytes.length} bytes]`, image: true, meta: image };
  }
  let result;
  try {
    if (bytes.length > 4 && bytes[0] === 0x50 && bytes[1] === 0x4b) {
      const entries = zipEntries(bytes);
      if (entries.has('xl/workbook.xml')) result = xlsxText(entries);
      else if (entries.has('word/document.xml')) result = docxText(entries);
      else if ([...entries.keys()].some(key => key.startsWith('ppt/slides/'))) result = pptxText(entries);
      else result = { format: 'zip', text: '' };
    } else if (bytes.subarray(0, 5).toString('latin1') === '%PDF-') {
      result = pdfText(bytes);
    } else {
      const text = decodeUtf8(bytes);
      if (text === undefined) return { ok: false, code: 'nontext', format: extension };
      result = { format: lookupFormat(extension), text };
    }
  } catch (error) {
    return { ok: false, code: error?.code === 'tooLarge' ? 'tooLarge' : 'corrupt', format: extension };
  }
  let text = result.text ?? '';
  if (/^html?$/u.test(result.format) || extension === 'html' || extension === 'htm') text = text.replace(/<script[\s\S]*?<\/script>/giu, ' ').replace(/<style[\s\S]*?<\/style>/giu, ' ').replace(/<[^>]+>/gu, ' ');
  text = text.replace(/\u0000/gu, '').replace(/[ \t]+\n/gu, '\n').replace(/\n{4,}/gu, '\n\n\n').trim();
  const truncated = text.length > MAX_OUTPUT_CHARS;
  return { ok: true, format: result.format, mimeType: 'text/plain', text: truncated ? `${text.slice(0, MAX_OUTPUT_CHARS)}\n[Content truncated]` : text,
    truncated, empty: text.length === 0 };
}

function lookupFormat(extension) {
  if (['html', 'htm'].includes(extension)) return 'html';
  if (extension === 'json' || extension === 'jsonc') return 'json';
  if (['csv', 'tsv'].includes(extension)) return extension;
  if (['md', 'markdown'].includes(extension)) return 'markdown';
  if (['xml', 'svg'].includes(extension)) return 'xml';
  return TEXT_EXTENSIONS.has(extension) ? extension : 'text';
}

export { MAX_DOC_BYTES };
