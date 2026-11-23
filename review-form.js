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
  notice.textContent = ar ? 'يرجى عدم إدخال أسماء أو معلومات شخصية في التقييم.' : 'Vul geen namen of andere persoonsgegevens in bij de beoordeling.';
  legend.textContent = ar ? 'التقييم' : 'Beoordeling';
  fields.disabled = false;
})();
