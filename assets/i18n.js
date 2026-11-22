'use strict';

// Product-owned copy only. No user data is sent to a translation service.
const i18n = (() => {
  const da = {
    'Why this answer?': 'Hvorfor dette svar?',
    'Explanation': 'Forklaring',
    'The rule': 'Reglen',
    'Applying the rule': 'Sådan får du svaret',
    'You are reviewing an older puzzle version. Its examples contain the previously identified ambiguity; your saved answer and score are unchanged.': 'Du gennemgår en tidligere opgaveversion. Eksemplerne har den tidligere påviste tvetydighed; dit gemte svar og resultat er uændret.',
    'You are reviewing the original version, which contained incorrect example markers. Your saved answer and score are unchanged. New attempts use the corrected version.': 'Du gennemgår den oprindelige version, som havde fejl i eksemplernes prikker. Dit gemte svar og resultat er uændret. Nye forsøg bruger den rettede version.',
    'In this original version, the displayed middle picture expands to green at the top right and row 2, column 3; red at row 2, column 1; and brown at row 2, column 2, row 3, column 3 and row 4, column 3.': 'I denne oprindelige version giver det viste midterbillede grønt øverst til højre og i række 2, kolonne 3; rødt i række 2, kolonne 1; og brunt i række 2, kolonne 2, række 3, kolonne 3 og række 4, kolonne 3.',
    "Share result on Facebook": "Del resultat på Facebook",
    "Share test on Facebook": "Del testen på Facebook",
    "Estimated IQ": "Estimeret IQ",
    "Just for fun. An approximate score, not a professionally validated IQ measurement.": "Kun for sjov. Et omtrentligt tal, ikke en fagligt valideret måling af IQ.",
    "Your test is incomplete. Your correct answers are shown, but an IQ estimate needs all 36 answers.": "Din test er ufuldstændig. Du kan se dine rigtige svar, men et IQ-estimat kræver svar på alle 36 opgaver.",
    "Unavailable": "Ikke tilgængelig",
    'Free visual reasoning test | IQ Champion': 'Gratis logiktest med figurer | IQ Champion',
    '36 visual reasoning puzzles. Take a free 40-minute challenge and explore your results.': '36 visuelle logikopgaver. Prøv en gratis test på 40 minutter, og se dit resultat.',
    'Answered':'Besvaret', 'Unanswered':'Ubesvaret', 'Correct':'Rigtigt', 'Incorrect':'Forkert', 'Close': 'Luk', 'Help': 'Hjælp', '40 min': '40 min', 'Language': 'Sprog', 'About the test': 'Om testen',
    'A challenge in visual reasoning': 'En udfordring i visuel logik',
    'Spot the pattern.': 'Find mønstret.', 'Find the missing piece.': 'Find den manglende brik.',
    "36 visual puzzles and an estimated IQ score. Just for fun.": "36 visuelle opgaver og en estimeret IQ-score. Kun for sjov.",
    'Puzzles': 'Opgaver', 'Time limit': 'Tidsgrænse', 'Cost': 'Pris', 'Free': 'Gratis',
    'No account needed. The timer starts when you begin.': 'Ingen konto nødvendig. Tiden starter, når du begynder.',
    'How the test works': 'Sådan fungerer testen',
    'Choose the icon that completes each pattern.': 'Vælg den figur, der fuldender hvert mønster.',
    'Skip tricky questions and return using the overview.': 'Spring svære opgaver over, og vend tilbage via overblikket.',
    'Review or change your answers before you finish.': 'Gennemgå eller ret dine svar, før du afslutter.',
    'Your answers and start time are saved in this browser. Reloading keeps your original deadline.': 'Dine svar og din starttid gemmes i denne browser. Genindlæsning bevarer den oprindelige tidsfrist.',
    'The 40-minute timer continues while the page is closed. Unanswered questions count as incorrect.': 'De 40 minutter løber videre, mens siden er lukket. Ubesvarede opgaver tæller som forkerte.',
    'About your result': 'Om dit resultat',
    "Your estimated IQ is based on your position among": "Din estimerede IQ bygger på din placering blandt",
    "historical attempts.": "historiske forsøg.",
    "The comparison uses attempts lasting over one minute and up to 40 minutes. It has not been validated against an official IQ test or a representative population sample.": "Sammenligningen bruger forsøg på over ét minut og op til 40 minutter. Den er ikke valideret mod en officiel IQ-test eller et repræsentativt udsnit af befolkningen.",
    "A test for fun. Your estimated IQ is an approximation, not a professionally validated IQ score.": "En test for sjov. Din estimerede IQ er en tilnærmelse, ikke en fagligt valideret IQ-score.",
    'Start 40-minute test': 'Start testen på 40 minutter',
    'Reasoning test': 'Logiktest', 'Your challenge': 'Din udfordring', 'Time remaining': 'Tid tilbage', 'remaining': 'tilbage',
    'Question pattern': 'Opgavens mønster', 'Find the pattern': 'Find mønstret',
    'Four rows of visual patterns; complete the last row': 'Fire rækker med visuelle mønstre; fuldend den sidste række',
    'Choose your answer': 'Vælg dit svar', 'Question navigation': 'Navigation mellem opgaver',
    'Previous question': 'Forrige opgave', 'Skip for now': 'Spring over', 'Next question': 'Næste opgave',
    'Question overview': 'Opgaveoverblik', '✓ Answered': '✓ Besvaret', '○ Unanswered': '○ Ubesvaret', 'Outline = current': 'Ramme = aktuel',
    'Jump to a question': 'Gå til en opgave', 'Review and finish': 'Gennemgå og afslut',
    'Instructions & saved progress': 'Vejledning og gemte svar',
    'Pick an answer to move to the next unanswered question. You can skip, return and change answers before finishing.': 'Vælg et svar for at gå til næste ubesvarede opgave. Du kan springe over, vende tilbage og rette dine svar, før du afslutter.',
    'Answers save automatically in this browser. Reloading resumes the same question; your timer keeps running.': 'Svar gemmes automatisk i denne browser. Efter genindlæsning fortsætter du på samme opgave; tiden løber videre.',
    'Ready when you are': 'Når du er klar', 'Finish this test?': 'Vil du afslutte testen?', 'Keep working': 'Fortsæt testen', 'Finish and see result': 'Afslut og se resultat',
    'Challenge complete': 'Testen er afsluttet', 'Your result': 'Dit resultat',
    'Review answers': 'Gennemgå svar', 'Try again': 'Prøv igen', 'About this test': 'Om denne test',
    'How to read this result': 'Sådan læser du resultatet',
    "Your percentile among historical attempts is converted to the familiar IQ scale: midpoint 100 and standard deviation 15. This assumes the comparison group reflects the population, which has not been established.": "Din percentil blandt historiske forsøg omregnes til den velkendte IQ-skala med midtpunkt 100 og standardafvigelse 15. Det forudsætter, at sammenligningsgruppen afspejler befolkningen, hvilket ikke er dokumenteret.",
    'Your answers, explained': 'Overblik over dine svar', 'Review your answers': 'Gennemgå dine svar', 'Back to result': 'Tilbage til resultat',
    'The pattern': 'Mønstret', 'Compare the answers': 'Sammenlign svarene', 'Your answer': 'Dit svar', 'Correct answer': 'Rigtigt svar',
    'Previous review question': 'Forrige opgave i gennemgangen', 'Next review question': 'Næste opgave i gennemgangen',
    'Results by question': 'Resultat pr. opgave', 'Explore all 36 puzzles': 'Se alle 36 opgaver',
    '✓ Correct': '✓ Rigtigt', '× Incorrect': '× Forkert', 'Review a question': 'Gennemgå en opgave',
    'Your submitted answers and final score stay unchanged.': 'Dine indsendte svar og dit endelige resultat ændres ikke.',
    'Contact': 'Kontakt', 'Feedback & contact': 'Feedback og kontakt', 'Send feedback or contact us': 'Send feedback eller kontakt os',
    'Correct. Your answer matches the correct answer.': 'Rigtigt. Dit svar stemmer med facit.',
    'Incorrect. Your answer differs from the correct answer.': 'Forkert. Dit svar er forskelligt fra facit.',
    'Unanswered. No answer was submitted for this question.': 'Ubesvaret. Du har ikke svaret på denne opgave.',
    'No answer submitted': 'Intet svar afgivet', 'Your submitted answer': 'Dit indsendte svar', 'Missing icon': 'Manglende figur',
    'All questions are answered. You can still review and change answers, then finish the test.': 'Alle opgaver er besvaret. Du kan stadig gennemgå og rette dine svar, før du afslutter testen.',
    'Five minutes or less remaining.': 'Der er højst fem minutter tilbage.',
    'Time is up. Your answers have been scored.': 'Tiden er gået. Dit resultat er beregnet.', 'Test completed.': 'Testen er afsluttet.',
    'Comparison unavailable.': 'Sammenligningen er ikke tilgængelig.',
    'This browser could not save your attempt. Keep this page open: reloading may lose progress or restore older answers.': 'Browseren kunne ikke gemme dit forsøg. Hold siden åben: genindlæsning kan miste nye svar eller gendanne ældre svar.',
    'Local saving is unavailable in this browser. Keep this page open to avoid losing your attempt.': 'Lokal lagring er ikke tilgængelig i denne browser. Hold siden åben, så du ikke mister dit forsøg.',
    'The saved attempt could not be restored. Start a new test when you are ready.': 'Det gemte forsøg kunne ikke gendannes. Start en ny test, når du er klar.'
  };
  if (typeof question_explanations !== 'undefined') for (const entry of Object.values(question_explanations)) for (const key of ['title','rule','application']) da[entry[key]] = entry.da[key];
  const status = {correct:'rigtigt', incorrect:'forkert', unanswered:'ubesvaret', answered:'besvaret'};
  const count = (n, singular, plural) => `${n} ${Number(n) === 1 ? singular : plural}`;
  const number = value => String(value).replace('.', ',');
  const patterns = [
    [/^Question (\d+) \/ (\d+)$/, (_,a,b) => `Opgave ${a} / ${b}`],
    [/^Review question (\d+) \/ (\d+)$/, (_,a,b) => `Gennemgå opgave ${a} / ${b}`],
    [/^Row (\d+), icon (\d+)$/, (_,a,b) => `Række ${a}, figur ${b}`],
    [/^Answer (\d+)$/, (_,a) => `Svar ${a}`],
    [/^Question (\d+), (answered|unanswered)$/, (_,a,s) => `Opgave ${a}, ${status[s]}`],
    [/^Review question (\d+), (correct|incorrect|unanswered)$/, (_,a,s) => `Gennemgå opgave ${a}, ${status[s]}`],
    [/^(\d+) correct; (\d+) incorrect; (\d+) unanswered\.$/, (_,a,b,c) => `${count(a,'rigtig','rigtige')}; ${count(b,'forkert','forkerte')}; ${count(c,'ubesvaret','ubesvarede')}.`],
    [/^(\d+) answered; (\d+) unanswered\.(.*)$/, (_,a,b,rest) => `${count(a,'besvaret','besvarede')}; ${count(b,'ubesvaret','ubesvarede')}.${rest ? ' Ubesvarede opgaver tæller som forkerte. Når du har afsluttet, kan du ikke rette dine svar.' : ''}`],
    [/^(\d+) \/ (\d+) correct$/, (_,a,b) => `${a} / ${b} rigtige`],
    [/^Percentile among historical participants: (.+)$/, (_,a) => `Percentil blandt historiske deltagere: ${number(a)}`],
    [/^Participants scoring lower: (.+)%\. Participants with the same score: (.+)%\.$/, (_,a,b) => `Deltagere med lavere resultat: ${number(a)} %. Deltagere med samme resultat: ${number(b)} %.`],
    [/^Reference group: ([\d,]+) historical attempts\..*$/, (_,count) => `Sammenligningsgruppe: ${count.replace(/,/g,'.')} historiske forsøg. Forsøg med registreret varighed på over ét minut og op til 40 minutter indgår. Ved samme antal rigtige bruges midten af gruppens percentilinterval. Estimater afrundes til hele tal og vises kun inden for 55–145 med en grænsemarkering uden for intervallet. Dette er en omregning af skalaen, ikke en uafhængigt valideret IQ-måling i befolkningen. Øvelse og gentagne forsøg kan påvirke dit resultat. Nogle eksempelbilleder er rettet, siden de historiske forsøg blev indsamlet, hvilket begrænser sammenligneligheden.`],
    [/^\d{1,3}(,\d{3})+$/, text => text.replace(/,/g,'.')]
  ];
  const route = typeof location !== 'undefined' ? location.pathname.match(/^\/(da|en)(?:\/|\/index\.html)?$/)?.[1] : null;
  let language = route || 'en';
  if (!route) try { const saved=localStorage.getItem('iqchampion.language'); if (saved==='da'||saved==='en') language=saved; else if (navigator.language?.toLowerCase().startsWith('da')) language='da'; } catch { if (typeof navigator!=='undefined'&&navigator.language?.toLowerCase().startsWith('da')) language='da'; }
  const englishByDanish = new Map(Object.entries(da).map(([english,danish])=>[danish,english]));
  const englishSource = value => englishByDanish.get(value) || value;
  const bindings = new Map();
  const missing = new Set();
  function translate(value) {
    const source = String(value);
    if (language === 'en') return source;
    if (Object.hasOwn(da, source)) return da[source];
    for (const [pattern, render] of patterns) { const match = source.match(pattern); if (match) return render(...match); }
    if (/[A-Za-z]/.test(source) && !['IQ Champion','Dansk','English'].includes(source)) missing.add(source);
    return source;
  }
  function bind(element, property, source) {
    if (!bindings.has(element)) bindings.set(element, new Map());
    bindings.get(element).set(property, String(source));
    apply(element, property, String(source));
  }
  function apply(element, property, source) {
    let value = property === 'html' ? source : translate(property === 'node' ? source.trim() : source);
    if (property === 'html') {
      value = source.replace(/alt="([^"]*)"/g, (_,alt) => `alt="${translate(alt)}"`);
      if (element.innerHTML !== value) element.innerHTML = value;
    } else if (property === 'text') { if (element.textContent !== value) element.textContent = value; }
    else if (property === 'node') { const rendered = source.match(/^\s*/)[0] + translate(source.trim()) + source.match(/\s*$/)[0]; if (element.nodeValue !== rendered) element.nodeValue = rendered; }
    else if (property === 'alt') element.alt = value;
    else element.setAttribute(property, value);
  }
  function setLanguage(next, persist = true) {
    if (!['da','en'].includes(next)) return;
    language = next;
    document.documentElement?.setAttribute('lang', language);
    missing.clear();
    for (const [element, entries] of bindings) {
      if (element.isConnected === false) { bindings.delete(element); continue; }
      for (const [property, source] of entries) apply(element, property, source);
    }
    for (const code of ['da','en']) document.getElementById('language-'+code)?.setAttribute('aria-current', language === code ? 'page' : 'false');
    const link = document.getElementById('feedback-link');
    if (link) link.setAttribute('href', 'https://munthesystems.dk/systems/feedback/iqchampion?lang='+language);
    if (typeof update_share_links === 'function') update_share_links();
    const canonical = 'https://iqchampion.com/'+language+'/';
    document.title = translate('Free visual reasoning test | IQ Champion');
    document.querySelector?.('link[rel="canonical"]')?.setAttribute('href',canonical);
    document.querySelector?.('meta[property="og:url"]')?.setAttribute('content',canonical);
    document.querySelector?.('meta[property="og:title"]')?.setAttribute('content',document.title);
    document.querySelector?.('meta[property="og:locale"]')?.setAttribute('content',language==='da'?'da_DK':'en_GB');
    const description=translate('36 visual reasoning puzzles. Take a free 40-minute challenge and explore your results.');
    document.querySelector?.('meta[property="og:description"]')?.setAttribute('content',description);
    const schema=document.getElementById('site-schema');
    if(schema) schema.textContent=JSON.stringify({'@context':'https://schema.org','@type':'WebPage',name:document.title,description,url:canonical,inLanguage:language,isAccessibleForFree:true,isPartOf:{'@type':'WebSite',name:'IQ Champion',url:'https://iqchampion.com/'}});
    if (persist) {
      try { localStorage.setItem('iqchampion.language', language); } catch { /* The current page still switches. */ }
      if (typeof history!=='undefined'&&typeof location!=='undefined') try { history.replaceState(null,'','/'+language+'/'+location.search+location.hash); } catch { /* Keep the language usable in restricted previews. */ }
    }
  }
  // Capture only the initial product-owned HTML. Dynamic content uses the same bindings below.
  if (document.createTreeWalker) {
    const walker = document.createTreeWalker(document.body, 4);
    let node;
    while ((node = walker.nextNode())) {
      if (['SCRIPT','STYLE','NOSCRIPT'].includes(node.parentElement?.tagName) || !node.nodeValue.trim()) continue;
      const original=node.nodeValue;
      bind(node,'node',original.match(/^\s*/)[0]+englishSource(original.trim())+original.match(/\s*$/)[0]);
    }
    for (const el of document.querySelectorAll('[aria-label], [alt], meta[name="description"]')) {
      for (const attr of ['aria-label','alt','content']) if (el.hasAttribute(attr)) bind(el,attr,englishSource(el.getAttribute(attr)));
    }
  }
  for (const code of ['da','en']) document.getElementById('language-'+code)?.addEventListener('click', event => {
    if (event && (event.button>0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)) return;
    event?.preventDefault();
    setLanguage(code);
  });
  setLanguage(language, false);
  return { clear:el=>bindings.delete(el), text:(el,value)=>bind(el,'text',value), html:(el,value)=>bind(el,'html',value), attribute:(el,name,value)=>bind(el,name,value), setLanguage, translate, get language(){return language;}, missing };
})();
