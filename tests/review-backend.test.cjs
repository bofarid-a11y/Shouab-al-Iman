const vm = require('node:vm');
const fs = require('node:fs');
const assert = require('node:assert/strict');
let saved = [], locked = false, throws = false;
const context = vm.createContext({
  HtmlService: {createHtmlOutput: html => html},
  LockService: {getScriptLock: () => ({tryLock: () => true, releaseLock: () => { locked = false; }})},
  SpreadsheetApp: {openById: () => ({getSheets: () => [1950680904,1532437282].map(id => ({getSheetId: () => id, appendRow: row => {if (throws) throw Error('unavailable'); saved.push({id,row});}}))}), flush() {}},
  Date,
});
vm.runInContext(fs.readFileSync('integrations/google-apps-script/Code.gs','utf8'), context);
const valid = {grade:'3',lang:'NL',clarity:'4',suitability:'5',suggestion:'Helder',uiLang:'NL'};
const post = p => context.doPost({parameter:p});
assert.match(post(valid), /Je beoordeling is opgeslagen/); assert.equal(saved.length, 1); assert.equal(saved[0].id, 1950680904); assert.equal(saved[0].row[5], 'Helder');
assert.match(post({...valid,grade:'9'}), /niet gelukt/); assert.equal(saved.length, 1);
assert.match(post({...valid,uiLang:'AR',suggestion:'=IMPORTXML("bad")'}), /تم حفظ تقييمك/); assert.equal(saved[1].id, 1950680904); assert.equal(saved[1].row[5], "'=IMPORTXML(\"bad\")");
assert.match(post({...valid,lang:'AR',uiLang:'NL',suggestion:'تعليق'}), /Je beoordeling is opgeslagen/); assert.equal(saved[2].id,1532437282); assert.equal(saved[2].row[5],'تعليق');
assert.match(post({...valid,suggestion:'x'.repeat(3001)}), /niet gelukt/); assert.equal(saved.length, 3);
assert.match(context.doPost({parameter:valid,parameters:{grade:['3','4']}}), /niet gelukt/); assert.equal(saved.length, 3);
throws = true; assert.match(post(valid), /niet gelukt/); assert.equal(saved.length,3);
console.log('OK: geldige en ongeldige inzendingen, beide talen, formule-injectie en opslagfout (met mocks).');
