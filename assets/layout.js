'use strict';

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
