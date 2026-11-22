'use strict';
const languageDialog=document.getElementById('language-dialog'),languageTrigger=document.getElementById('language-picker-trigger'),languageSearch=document.getElementById('language-search');
const languageChoices=Array.from(document.querySelectorAll('[data-language-code]'));
const foldLanguage=s=>String(s).normalize('NFD').replace(/\p{M}/gu,'').toLowerCase();
function filterLanguages(){const text=foldLanguage(languageSearch.value);let found=0;for(const link of languageChoices){const visible=foldLanguage(link.dataset.languageSearch).includes(text);link.hidden=!visible;if(visible)found++;}document.getElementById('language-no-results').hidden=found>0;}
languageTrigger.addEventListener('click',()=>{languageSearch.value='';filterLanguages();languageDialog.showModal();languageTrigger.setAttribute('aria-expanded','true');languageSearch.focus();});
document.getElementById('language-picker-close').addEventListener('click',()=>languageDialog.close());
languageDialog.addEventListener('close',()=>{languageTrigger.setAttribute('aria-expanded','false');languageTrigger.focus({preventScroll:true});});
languageDialog.addEventListener('click',event=>{if(event.target!==languageDialog)return;const rect=languageDialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)languageDialog.close();});
languageSearch.addEventListener('input',filterLanguages);
i18n.attribute(languageSearch,'placeholder','Search languages');
