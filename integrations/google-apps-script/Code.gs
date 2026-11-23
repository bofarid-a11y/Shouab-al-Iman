// CUR001: run as the owner in a deployed Apps Script web app.
// This endpoint is public and write-only; anyone who knows its URL can submit.
// Do not make the spreadsheet public. Keep the URL out of unrelated places.
const SPREADSHEET_ID = '10PLAYtBPJfiPVJEFlyFD-potLh_bk3PZx0YLCEOnJFM';
// Route by the language of the lesson being evaluated, not the page language.
const SHEET_IDS = { NL: 1950680904, AR: 1532437282 };
// Values are shared across both interface languages so the overview is comparable.
const ROLES = ['Ouder / verzorger', 'Leerling', 'Leerkracht / docent', 'Imam', 'Opvoeder / pedagogisch medewerker', 'Onderwijsdeskundige', 'Anders'];
const PROFESSIONS = ['Student', 'Leerkracht / docent', 'Schoolleider / onderwijsmanagement', 'Onderwijsdeskundige / onderwijsadviseur', 'Pedagoog / pedagogisch medewerker', 'Imam / islamitisch docent', 'Onderzoeker / wetenschapper', 'Vertaler / taalkundige', 'Anders'];
const WEBSITE = 'https://bofarid-a11y.github.io/Shouab-al-Iman/';
// Prepared migration: I–K must first be verified empty and given these headers.
const REGISTER_HEADERS = ['Referentie', 'Lescode', 'Lesversie'];

function doPost(e) {
  const params = (e && e.parameter) || {};
  const isArabic = params.uiLang === 'AR';
  const output = (ok) => {
    const title = isArabic ? (ok ? 'شكرًا لتقييمك' : 'تعذر إرسال التقييم') : (ok ? 'Bedankt voor je beoordeling' : 'Versturen is niet gelukt');
    const message = isArabic ? (ok ? 'تم حفظ تقييمك.' : 'لم يتم التأكد من حفظ التقييم. عُد وحاول مرة أخرى.') : (ok ? 'Je beoordeling is opgeslagen.' : 'Opslaan kon niet worden bevestigd. Ga terug en probeer het opnieuw.');
    const link = isArabic ? 'العودة إلى الموقع' : 'Terug naar de website';
    return HtmlService.createHtmlOutput('<!doctype html><html lang="' + (isArabic ? 'ar' : 'nl') + '" dir="' + (isArabic ? 'rtl' : 'ltr') + '"><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + title + '</title><style>body{font:18px/1.6 system-ui,sans-serif;max-width:40rem;margin:3rem auto;padding:1rem;color:#18392e}a{display:inline-block;padding:12px;background:#135342;color:white;border-radius:8px}</style></head><body><h1>' + title + '</h1><p>' + message + '</p><a href="' + WEBSITE + (isArabic ? 'ar.html' : '') + '">' + link + '</a></body></html>');
  };
  // Reject repeated values and malformed fields; do not log or echo feedback.
  const keys = ['grade', 'lang', 'clarity', 'suitability', 'suggestion', 'uiLang', 'reviewerRole', 'profession'];
  if (e && e.parameters && keys.some(k => e.parameters[k] && e.parameters[k].length !== 1)) return output(false);
  const { grade, lang, clarity, suitability } = params;
  const suggestion = typeof params.suggestion === 'string' ? params.suggestion : '';
  if (!/^[3-8]$/.test(grade || '') || !/^(NL|AR)$/.test(lang || '') ||
      !/^[1-5]$/.test(clarity || '') || !/^[1-5]$/.test(suitability || '') ||
      !/^(NL|AR)$/.test(params.uiLang || '') || suggestion.length > 3000) return output(false);
  // Missing new fields remain valid for older open forms and deployments.
  const reviewerRole = params.reviewerRole || '';
  const profession = params.profession || '';
  if ((reviewerRole && !ROLES.includes(reviewerRole)) ||
      (profession && !PROFESSIONS.includes(profession))) return output(false);
  // Google Sheets interprets strings beginning with '=' as formulas. Prefix all
  // potentially formula-like comments, including leading whitespace, as text.
  const safeSuggestion = /^[\s]*[=+\-@]/.test(suggestion) ? "'" + suggestion : suggestion;
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return output(false);
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets().find(s => s.getSheetId() === SHEET_IDS[lang]);
    if (!sheet) throw new Error('Sheet not found');
    // Fail closed if the owner has not prepared the expected columns. Never
    // silently append into an unknown spreadsheet layout. Existing A–H remain.
    const headers = sheet.getRange(1, 9, 1, 3).getValues()[0];
    if (!REGISTER_HEADERS.every((header, i) => headers[i] === header)) throw new Error('Register columns not prepared');
    const reference = 'EV-' + Utilities.getUuid().toUpperCase();
    const lessonCode = 'CUR001-K01-L01-G' + grade + '-' + lang;
    // The public form also accepts direct visits and paper evaluations. Do not
    // invent a version when the exact material assessed cannot be established.
    sheet.appendRow([new Date(), grade, lang, clarity, suitability, safeSuggestion, reviewerRole, profession, reference, lessonCode, 'Niet vastgesteld']);
    SpreadsheetApp.flush();
    return output(true);
  } catch (err) {
    return output(false);
  } finally {
    lock.releaseLock();
  }
}
