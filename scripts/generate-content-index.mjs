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
generateFolderIndex('public/keebs');
