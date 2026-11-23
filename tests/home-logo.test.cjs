const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const root = path.join(__dirname, '..');
for (const page of ['index.html', 'ar.html']) {
  const html = fs.readFileSync(path.join(root, page), 'utf8');
  const doc = new JSDOM(html).window.document;
  const logo = doc.querySelector('.hero img.hero-logo');
  assert(logo, `${page} mist het logo`);
  assert(logo.getAttribute('alt').trim(), `${page} mist alternatieve tekst`);
  assert(fs.statSync(path.join(root, logo.getAttribute('src'))).size > 0);
  assert(doc.querySelector('#lessonPicker') && doc.querySelector('#feedbackForm'));
}
console.log('OK: homepage-logo op beide talen; leskiezer en beoordeling behouden.');
