const fs=require('fs'); const assert=require('assert/strict'); const {JSDOM,VirtualConsole}=require('jsdom');
const setup=fs.readFileSync('review-form.js','utf8');
for (const [file,language] of [['index.html','NL'],['ar.html','AR']]) {
 const doc=fs.readFileSync(file,'utf8');
 for (const valid of [false,true]) {
  const vc=new VirtualConsole(), errors=[];vc.on('jsdomError',e=>errors.push(e.message));
  const dom=new JSDOM(doc,{url:'https://example.test/Shouab-al-Iman/'+file,runScripts:'dangerously',virtualConsole:vc});
  dom.window.CUR001_REVIEW_ENDPOINT=valid?'https://script.google.com/macros/s/Test_123/exec':'https://evil.example/exec';
  dom.window.eval(setup);
  const form=dom.window.document.querySelector('#feedbackForm form');
  assert.equal(form.querySelector('fieldset').disabled,!valid);
  assert.equal(form.elements.uiLang.value,language);
  assert.equal(form.elements.grade.value, '');
  assert.equal(form.elements.lang.value, '');
  if(valid){assert.equal(form.method,'post');assert.equal(form.action,dom.window.CUR001_REVIEW_ENDPOINT);}
  assert.deepEqual(errors,[]);dom.window.close();
 }
}
console.log('OK: beide formulieren blijven veilig uit zonder endpoint en configureren alleen een geldig Apps Script-adres.');
// Exercise the actual configured page scripts and form data without making a network request.
const config = fs.readFileSync('review-config.js', 'utf8');
for (const [file, uiLang, lessonLang] of [['index.html', 'NL', 'AR'], ['ar.html', 'AR', 'NL']]) {
  const dom = new JSDOM(fs.readFileSync(file, 'utf8'), {
    url: `https://example.test/${file}?reviewGrade=7&reviewLang=${lessonLang}#feedbackForm`,
    runScripts: 'dangerously'
  });
  dom.window.eval(config);
  dom.window.eval(setup);
  const form = dom.window.document.querySelector('#feedbackForm form');
  assert.equal(form.elements.grade.value, '7');
  assert.equal(form.elements.lang.value, lessonLang);
  assert.equal(form.action, dom.window.CUR001_REVIEW_ENDPOINT);
  assert.equal(form.checkValidity(), false);
  form.elements.clarity.value = '4';
  form.elements.suitability.value = '5';
  form.elements.suggestion.value = 'TEST';
  assert.deepEqual([...form.querySelectorAll('input[name=reviewerRole]')].map(input => input.value), ['Leerling', 'Ouder / verzorger', 'Anders']);
  form.querySelector('input[name=reviewerRole][value=Leerling]').checked = true;
  form.elements.profession.value = 'Imam / islamitisch docent';
  assert.equal(form.checkValidity(), true);
  assert.deepEqual(Object.fromEntries(new dom.window.FormData(form)), {
    uiLang, reviewerRole: 'Leerling', profession: 'Imam / islamitisch docent', grade: '7', lang: lessonLang, clarity: '4', suitability: '5', suggestion: 'TEST'
  });
  const button = form.querySelector('button');
  form.dispatchEvent(new dom.window.Event('submit', {bubbles:true, cancelable:true}));
  assert.equal(button.disabled, true);
  const secondSubmit = new dom.window.Event('submit', {bubbles:true, cancelable:true});
  form.dispatchEvent(secondSubmit);
  assert.equal(secondSubmit.defaultPrevented, true);
  dom.window.dispatchEvent(new dom.window.Event('pageshow'));
  assert.equal(button.disabled, false);
  dom.window.close();
}
console.log('OK: echte configuratie en formuliervelden voor beide interfaces gesimuleerd, inclusief verschillende lestaal.');
