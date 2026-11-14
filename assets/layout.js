'use strict';

// Focusing a sticky question heading does not scroll the pattern into view.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
function scrollToQuestion() { window.scrollTo({ top: 0, behavior: 'instant' }); }
for (const id of ['question-number', 'answer-review-title']) {
  new MutationObserver(scrollToQuestion).observe(document.getElementById(id), { childList: true });
}
if (!document.getElementById('test').hidden) scrollToQuestion();

// The scoring module supplies plain text; present longer methodology in short paragraphs.
const resultContext = document.getElementById('result-context');
function formatResultContext() {
  if (!resultContext.textContent.trim() || resultContext.children.length) return;
  const sentences = resultContext.textContent.trim().split(/(?<=\.)\s+/);
  const paragraphs = [];
  for (let i = 0; i < sentences.length; i += 2) {
    const paragraph = document.createElement('p');
    paragraph.textContent = sentences.slice(i, i + 2).join(' ');
    paragraphs.push(paragraph);
  }
  resultContext.replaceChildren(...paragraphs);
}
new MutationObserver(formatResultContext).observe(resultContext, { childList: true });
formatResultContext();

// Let completed attempts return to the introduction without deleting saved results.
document.getElementById('about-test-link').addEventListener('click', () => {
  const result = document.getElementById('result');
  if (result.hidden) return;
  result.hidden = true;
  const front = document.getElementById('front');
  front.hidden = false;
  front.querySelector('h1').focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'instant' });
});
