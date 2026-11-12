import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

function generateFolderIndex(relFolder) {
  const dirPath = path.join(rootDir, relFolder);
  if (!fs.existsSync(dirPath)) return;

  const files = fs
    .readdirSync(dirPath)
    .filter((f) => /\.(md|markdown|txt)$/i.test(f) && f.toLowerCase() !== 'readme.md')
    .sort((a, b) => b.localeCompare(a));

  const indexPath = path.join(dirPath, 'index.json');
  fs.writeFileSync(indexPath, JSON.stringify(files, null, 2) + '\n', 'utf-8');
  console.log(`[content-index] Wrote ${files.length} entry(s) to ${relFolder}/index.json`);
}

generateFolderIndex('public/logs');

if (process.argv.includes('--bundle-dist')) {
  const distDir = path.join(rootDir, 'dist');
  const publicDir = path.join(rootDir, 'public');
  const indexHtml = path.join(rootDir, 'index.html');

  fs.rmSync(distDir, { recursive: true, force: true });
  fs.mkdirSync(distDir, { recursive: true });

  if (fs.existsSync(publicDir)) {
    fs.cpSync(publicDir, distDir, { recursive: true });
  }
  const rootSidebarPic = path.join(rootDir, 'sidebar_picture.png');
  if (fs.existsSync(rootSidebarPic)) {
    fs.copyFileSync(rootSidebarPic, path.join(distDir, 'sidebar_picture.png'));
  }
  if (fs.existsSync(indexHtml)) {
    fs.copyFileSync(indexHtml, path.join(distDir, 'index.html'));
  }
  console.log('[content-index] Assembled static dist/ directory for GitHub Pages deployment.');
}
