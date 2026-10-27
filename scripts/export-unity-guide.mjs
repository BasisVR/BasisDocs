// Copies the creator guide pages into the Basis Unity project so the Creator Guide window can show them offline.
// Usage: node scripts/export-unity-guide.mjs <path to the Basis repo>
import fs from 'node:fs';
import path from 'node:path';

const docsRoot = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..', 'content', 'docs');
const basisRoot = process.argv[2];
if (!basisRoot) {
  console.error('usage: node scripts/export-unity-guide.mjs <path to the Basis repo>');
  process.exit(1);
}
const outDir = path.join(basisRoot, 'Basis', 'Packages', 'com.basis.shim', 'Shims', 'Editor', 'CreatorGuide');

const sections = [
  { title: 'Scripting', pages: ['scripting/native-and-cilbox', 'scripting/common-usages', 'scripting/sandbox-rules', 'scripting/allowed-components', 'scripting/avatar-scripting'] },
  { folder: 'scripting/networking' },
  { folder: 'scripting/examples' },
  { title: 'World', pages: ['world/components', 'world/layers'] },
];

function readMeta(folder) {
  return JSON.parse(fs.readFileSync(path.join(docsRoot, folder, 'meta.json'), 'utf8'));
}

function pagePath(id) {
  const direct = path.join(docsRoot, id + '.mdx');
  return fs.existsSync(direct) ? direct : path.join(docsRoot, id, 'index.mdx');
}

function convert(source) {
  const text = source.replace(/\r\n/g, '\n');
  const front = /^---\n([\s\S]*?)\n---\n/.exec(text);
  const fields = {};
  if (front) {
    for (const line of front[1].split('\n')) {
      const m = /^(\w+):\s*(.*)$/.exec(line);
      if (m) fields[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
    }
  }
  const out = [];
  let callout = null;
  for (const line of (front ? text.slice(front[0].length) : text).split('\n')) {
    if (/^import\s.+from\s.+;?$/.test(line)) continue;
    const open = /^<Callout(?:\s+type="(\w+)")?\s*>$/.exec(line.trim());
    if (open) { callout = open[1] || 'info'; out.push(`> [!${callout}]`); continue; }
    if (line.trim() === '</Callout>') { callout = null; continue; }
    out.push(callout ? (line.trim() ? `> ${line}` : '>') : line);
  }
  return { title: fields.title || '', description: fields.description || '', body: out.join('\n').replace(/^\n+/, '').replace(/\n{3,}/g, '\n\n') };
}

fs.mkdirSync(outDir, { recursive: true });
const index = { baseUrl: 'https://docs.basisvr.org/en/docs/', sections: [] };
const written = new Set();
for (const section of sections) {
  const ids = section.folder ? readMeta(section.folder).pages.map(p => p === 'index' ? section.folder : `${section.folder}/${p}`) : section.pages;
  const entry = { title: section.title || readMeta(section.folder).title, pages: [] };
  for (const id of ids) {
    const page = convert(fs.readFileSync(pagePath(id), 'utf8'));
    const file = id.replace(/\//g, '.') + '.md';
    fs.writeFileSync(path.join(outDir, file), page.body.replace(/\n/g, '\r\n'));
    written.add(file);
    entry.pages.push({ id, title: page.title, description: page.description, file });
  }
  index.sections.push(entry);
}
fs.writeFileSync(path.join(outDir, 'index.json'), JSON.stringify(index, null, 2).replace(/\n/g, '\r\n') + '\r\n');
written.add('index.json');
for (const name of fs.readdirSync(outDir)) {
  const base = name.endsWith('.meta') ? name.slice(0, -5) : name;
  if (!written.has(base)) fs.rmSync(path.join(outDir, name));
}
console.log(`wrote ${written.size} files to ${outDir}`);
