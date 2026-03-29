const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE_DIR = path.join(ROOT, '_site');
const PARTIAL = path.join(ROOT, '_partials', 'gtag.html');

const snippet = fs.readFileSync(PARTIAL, 'utf8').trim();

function walkHtml(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkHtml(full));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

const files = walkHtml(SITE_DIR);
let count = 0;

for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  if (html.includes('googletagmanager.com')) continue;

  const indented = snippet.replace(/\n/g, '\n    ');
  const injected = html.replace('<head>', `<head>\n    ${indented}`);

  if (injected === html) {
    console.warn(`  [warn] no <head> tag in ${path.relative(SITE_DIR, file)}`);
    continue;
  }

  fs.writeFileSync(file, injected);
  count++;
}

console.log(`inject-gtag: injected into ${count} file(s)`);
