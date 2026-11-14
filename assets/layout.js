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

// Keep expanded instructions/overviews and finish confirmation off the page canvas.
const infoSheet = document.getElementById('info-sheet');
const sheetContent = document.getElementById('sheet-content');
let sheetOrigin = null;
let sheetNodes = [];
let sheetTrigger = null;
function openSheet(origin, nodes, title, trigger) {
  if (infoSheet.open) infoSheet.close();
  sheetOrigin = origin; sheetNodes = nodes; sheetTrigger = trigger;
  i18n.text(document.getElementById('sheet-title'), title);
  sheetContent.replaceChildren(...nodes);
  infoSheet.showModal();
}
for (const details of document.querySelectorAll('details.disclosure')) {
  const summary = details.querySelector('summary');
  summary.addEventListener('click', event => {
    event.preventDefault();
    const nodes = Array.from(details.childNodes).filter(node => node !== summary);
    openSheet(details, nodes, details.dataset.sheetTitle, summary);
  });
}
document.getElementById('sheet-close').addEventListener('click', () => infoSheet.close());
infoSheet.addEventListener('click', event => { if (event.target === infoSheet) {
  const box = infoSheet.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) infoSheet.close();
} });
infoSheet.addEventListener('close', () => {
  if (sheetOrigin) sheetOrigin.append(...sheetNodes);
  if (sheetOrigin === document.getElementById('test')) document.getElementById('finish-review').hidden = true;
  sheetOrigin = null; sheetNodes = [];
  if (sheetTrigger?.isConnected && sheetTrigger.closest('.screen')?.hidden !== true) sheetTrigger.focus({preventScroll:true});
  else if (!document.getElementById('result').hidden) document.getElementById('result-title').focus({preventScroll:true});
  sheetTrigger = null;
});
const finishReview = document.getElementById('finish-review');
new MutationObserver(() => {
  if (!finishReview.hidden && !document.getElementById('test').hidden && !infoSheet.open) {
    openSheet(document.getElementById('test'), [finishReview], 'Finish this test?', document.getElementById('finish-link'));
  } else if (infoSheet.open && sheetNodes.includes(finishReview) && (finishReview.hidden || document.getElementById('test').hidden)) infoSheet.close();
}).observe(finishReview, {attributes:true, attributeFilter:['hidden']});
new MutationObserver(() => { if (document.getElementById('test').hidden && infoSheet.open && sheetNodes.includes(finishReview)) infoSheet.close(); }).observe(document.getElementById('test'), {attributes:true,attributeFilter:['hidden']});

sheetContent.addEventListener('click', event => { if (event.target.closest('.question-link')) infoSheet.close(); });

// Only the public introduction is indexable. Test state/results stay browser-local.
function updateIndexingState() {
  document.querySelector('meta[name="robots"]')?.setAttribute('content',document.getElementById('front').hidden?'noindex,follow':'index,follow');
}
new MutationObserver(updateIndexingState).observe(document.getElementById('front'),{attributes:true,attributeFilter:['hidden']});
updateIndexingState();
