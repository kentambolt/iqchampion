'use strict';
// Updates wait for existing tabs to close, so an active test keeps its assets.
if ('serviceWorker' in navigator && window.isSecureContext) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js', {scope:'/',updateViaCache:'none'})
      .catch(() => { /* The online test remains fully usable. */ });
  });
}
