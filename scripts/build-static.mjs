import { cp, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');

const dirs = [
  'assets',
  'contact',
  'downloads',
  'en',
  'material',
  'products',
  'projects',
  'resources',
  'solutions',
];

const rootFiles = [
  'llms.txt',
  'robots.txt',
  'sitemap.xml',
];

const excludedHtml = new Set([
  'app-shell.html',
  'dev.html',
  'eyeshot-share-poster.html',
]);

for (const dir of dirs) {
  await cp(path.join(root, dir), path.join(dist, dir), { recursive: true, force: true });
}

const entries = await readdir(root, { withFileTypes: true });
for (const entry of entries) {
  if (entry.isFile() && entry.name.endsWith('.html') && !excludedHtml.has(entry.name)) {
    await cp(path.join(root, entry.name), path.join(dist, entry.name));
  }
}

for (const file of rootFiles) {
  await cp(path.join(root, file), path.join(dist, file));
}

console.log('Static site copied to dist');
