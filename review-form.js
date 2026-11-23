(() => {
  const form = document.querySelector('#feedbackForm form');
  const fields = form.querySelector('fieldset');
  const notice = document.getElementById('reviewNotice');
  const legend = fields.querySelector('legend');
  const ar = document.documentElement.lang === 'ar';
  const endpoint = window.CUR001_REVIEW_ENDPOINT;
  // Only an actual Apps Script deployment endpoint is permitted, never an
  // arbitrary host or a placeholder. Without JavaScript fields remain disabled.
  if (typeof endpoint !== 'string' || !/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(endpoint)) return;
  form.method = 'POST';
  form.action = endpoint;
  notice.textContent = ar ? 'التقييم منفصل عن المشاركة في التجربة. لا تُدخل أسماء أو بيانات اتصال أو معلومات شخصية أخرى.' : 'De beoordeling staat los van deelname aan een pilot. Vul geen namen, contactgegevens of andere persoonsgegevens in.';
  legend.textContent = ar ? 'التقييم' : 'Beoordeling';
  fields.disabled = false;
  // Avoid accidental repeated submissions; returning from the response page or
  // restoring the page from browser history makes the button usable again.
  const submit = form.querySelector('button');
  const label = submit.textContent;
  const resetSubmit = () => { submit.disabled = false; submit.textContent = label; };
  window.addEventListener('pageshow', resetSubmit);
  form.addEventListener('submit', (event) => {
    if (submit.disabled) { event.preventDefault(); return; }
    submit.disabled = true;
    submit.textContent = ar ? 'جارٍ الإرسال…' : 'Bezig met versturen…';
  });
})();
