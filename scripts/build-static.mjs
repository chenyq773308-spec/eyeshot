import { cp, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

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
  'index.html',
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

const vite = await createServer({
  appType: 'custom',
  server: { middlewareMode: true },
});

try {
  const { default: App } = await vite.ssrLoadModule('/src/App.jsx');
  const appHtml = renderToStaticMarkup(React.createElement(App));
  const shell = await readFile(path.join(root, 'app-shell.html'), 'utf8');

  if (!shell.includes('<!-- APP_HTML -->')) {
    throw new Error('app-shell.html is missing the APP_HTML marker');
  }

  await writeFile(
    path.join(dist, 'index.html'),
    shell.replace('<!-- APP_HTML -->', appHtml),
    'utf8',
  );
} finally {
  await vite.close();
}

console.log('Static site copied to dist');
