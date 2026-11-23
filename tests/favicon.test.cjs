const assert = require('assert');
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const pages = fs.readdirSync(root).filter(name => name.endsWith('.html'));
assert(pages.length > 0);
for (const page of pages) {
  const html = fs.readFileSync(path.join(root, page), 'utf8');
  for (const asset of ['assets/ihsan-favicon.ico', 'assets/ihsan-favicon.png']) {
    assert(html.includes(`href="${asset}"`), `${page} mist ${asset}`);
    assert(fs.statSync(path.join(root, asset)).size > 0);
  }
}
console.log(`OK: logo beschikbaar op ${pages.length} HTML-pagina's.`);
