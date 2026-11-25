'use strict';
// Native test browsers are real browsers, so webdriver alone is insufficient.
// Keep synthetic QA entirely outside the public analytics pipeline.
(() => {
  const source=document.currentScript;
  if(location.origin!=='https://iqchampion.com'||/[?&](qa|preview|test)=1(?:&|$)/.test(location.search)
    ||navigator.webdriver||navigator.globalPrivacyControl===true||navigator.doNotTrack==='1'
    ||source?.dataset.analytics==='false')return;
  const script=document.createElement('script');
  script.src='https://munthesystems.dk/systems/tracker.894a456da1305558.js';
  script.integrity='sha384-oGiw7CoaEVI+Ck8QDz70VAKJIosxw7zK9HTPC2p1LL6VwZ0wXtDArQS3qZxiHey8';
  script.crossOrigin='anonymous';script.async=true;
  script.dataset.project='iqchampion';script.dataset.page='test';script.dataset.feedback='false';
  document.head.append(script);
})();
