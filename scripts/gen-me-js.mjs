// Генерит public/me.js из public/me.json.
// me.json — канонический файл, его и правим. me.js нужен только потому, что
// Timeweb отдаёт сайт без CORS-заголовков: тег <script> ограничения обходит,
// а fetch с других поддоменов — нет.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'public/me.json');
const target = path.join(root, 'public/me.js');

const me = JSON.parse(await readFile(source, 'utf8'));

await writeFile(target, `window.__ME__ = ${JSON.stringify(me)};
window.dispatchEvent(new CustomEvent('me:ready'));
`);

console.log(`Generated ${path.relative(root, target)} from ${path.relative(root, source)}`);
