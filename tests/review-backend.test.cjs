const vm = require('node:vm');
const fs = require('node:fs');
const assert = require('node:assert/strict');
let saved = [], locked = false, throws = false, prepared = true, sequence = 0;
const context = vm.createContext({
  HtmlService: {createHtmlOutput: html => html},
  LockService: {getScriptLock: () => ({tryLock: () => true, releaseLock: () => { locked = false; }})},
  SpreadsheetApp: {openById: () => ({getSheets: () => [1950680904,1532437282].map(id => ({getSheetId: () => id, getRange: (row, col, rows, cols) => {assert.deepEqual([row,col,rows,cols],[1,9,1,3]); return {getValues: () => [prepared ? ['Referentie','Lescode','Lesversie'] : ['Andere kolom','','']]};}, appendRow: row => {if (throws) throw Error('unavailable'); saved.push({id,row});}}))}), flush() {}},
  Utilities: {getUuid: () => `00000000-0000-4000-8000-${String(++sequence).padStart(12, '0')}`},
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
assert.match(post({...valid, reviewerRole:'Imam', profession:'Imam / islamitisch docent'}), /Je beoordeling is opgeslagen/);
assert.equal(saved[3].row[6], 'Imam'); assert.equal(saved[3].row[7], 'Imam / islamitisch docent');
assert.match(post({...valid, lang:'AR', uiLang:'AR', reviewerRole:'Leerling', profession:'Student'}), /تم حفظ تقييمك/);
assert.equal(saved[4].id,1532437282); assert.equal(saved[4].row[7], 'Student');
assert.equal(saved[4].row[9], 'CUR001-K01-L01-G3-AR'); assert.equal(saved[4].row[10], 'Niet vastgesteld');
assert.equal(new Set(saved.map(x => x.row[8])).size, saved.length);
prepared = false; assert.match(post(valid), /niet gelukt/); assert.equal(saved.length, 5); prepared = true;
assert.match(post({...valid, reviewerRole:'=HYPERLINK(1)'}), /niet gelukt/);
assert.match(post({...valid, profession:'onbekend'}), /niet gelukt/);
assert.match(context.doPost({parameter:valid,parameters:{reviewerRole:['Imam','Leerling']}}), /niet gelukt/);
assert.equal(saved.length, 5);
throws = true; assert.match(post(valid), /niet gelukt/); assert.equal(saved.length,5);
console.log('OK: geldige en ongeldige inzendingen, beide talen, formule-injectie en opslagfout (met mocks).');
