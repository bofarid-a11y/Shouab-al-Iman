const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { JSDOM } = require('jsdom');
const root = path.join(__dirname, '..');
const pages = fs.readdirSync(root).filter(name => name.endsWith('.html'));
for (const page of pages) {
  const doc = new JSDOM(fs.readFileSync(path.join(root, page), 'utf8')).window.document;
  const img = doc.querySelector('img.corner-logo');
  assert(img, `${page} mist logo`);
  assert.equal(img.getAttribute('alt'), '', `${page}: decoratief logo moet leeg alt hebben`);
  assert(fs.existsSync(path.join(root, img.getAttribute('src'))));
  assert(doc.querySelector('link[href^="brand-logo.css"]'));
}
console.log(`OK: hoeklogo op ${pages.length} HTML-pagina's.`);
