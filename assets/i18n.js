'use strict';

// Product-owned copy only. No user data is sent to a translation service.
const i18n = (() => {
  const da = {
    '36 visual reasoning puzzles. Take a free 40-minute challenge and explore your results.': '36 visuelle logikopgaver. Prøv en gratis test på 40 minutter, og se dit resultat.',
    '40 min': '40 min', 'Language': 'Sprog', 'About the test': 'Om testen',
    'A challenge in visual reasoning': 'En udfordring i visuel logik',
    'Spot the pattern.': 'Find mønstret.', 'Find the missing piece.': 'Find den manglende brik.',
    '36 visual puzzles, one question at a time.': '36 visuelle opgaver, ét spørgsmål ad gangen.',
    'Puzzles': 'Opgaver', 'Time limit': 'Tidsgrænse', 'Cost': 'Pris', 'Free': 'Gratis',
    'Try the practice puzzle': 'Prøv øveopgaven',
    'No account needed. Practice before the timer starts.': 'Ingen konto nødvendig. Øv dig, før tiden starter.',
    'How the test works': 'Sådan fungerer testen',
    'Choose the icon that completes each pattern.': 'Vælg den figur, der fuldender hvert mønster.',
    'Skip tricky questions and return using the overview.': 'Spring svære opgaver over, og vend tilbage via overblikket.',
    'Review or change your answers before you finish.': 'Gennemgå eller ret dine svar, før du afslutter.',
    'Your answers and start time are saved in this browser. Reloading keeps your original deadline.': 'Dine svar og din starttid gemmes i denne browser. Genindlæsning bevarer den oprindelige tidsfrist.',
    'The 40-minute timer continues while the page is closed. Unanswered questions count as incorrect.': 'De 40 minutter løber videre, mens siden er lukket. Ubesvarede opgaver tæller som forkerte.',
    'About your result': 'Om dit resultat',
    'Your score is compared with': 'Dit resultat sammenlignes med',
    'historical attempts lasting over one minute and up to 40 minutes.': 'historiske forsøg med en varighed på over ét minut og op til 40 minutter.',
    'Participants were recruited through paid Facebook ads and chose to take the test. This self-selected sample is not established as representative of the population.': 'Deltagerne kom via betalte Facebook-annoncer og valgte selv at tage testen. Det er ikke dokumenteret, at denne gruppe er repræsentativ for befolkningen.',
    'This is a reasoning challenge, not a validated measurement of IQ.': 'Dette er en logiktest, ikke en valideret måling af IQ.',
    'Before you begin': 'Før du begynder', 'A quick warm-up': 'En kort opvarmning', 'Which shape comes next?': 'Hvilken figur kommer bagefter?',
    'Circle, square, circle, square, circle, missing shape': 'Cirkel, firkant, cirkel, firkant, cirkel, manglende figur',
    'Practice answers': 'Svar på øveopgaven', 'Circle': 'Cirkel', 'Square': 'Firkant', 'Triangle': 'Trekant',
    'This puzzle is unscored. You can try as many times as you like.': 'Øveopgaven tæller ikke med. Du kan prøve så mange gange, du vil.',
    'Correct! Circle and square alternate, so the missing shape is a square. In the test, answers are saved immediately. You can skip questions, return and change answers before finishing.': 'Rigtigt! Cirkel og firkant skifter, så den manglende figur er en firkant. I testen gemmes svar med det samme. Du kan springe opgaver over, vende tilbage og rette dine svar, før du afslutter.',
    'Try again. The shapes alternate between circle and square. What comes after a circle?': 'Prøv igen. Figurerne skifter mellem cirkel og firkant. Hvad kommer efter en cirkel?',
    'Start 40-minute test': 'Start testen på 40 minutter',
    'Untimed practice. Your score starts with the real test.': 'Øvelse uden tidsgrænse. Kun den rigtige test tæller med i dit resultat.',
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
    'This result describes your performance on these visual reasoning puzzles. It is not a validated IQ score or a comparison with the general population.': 'Resultatet beskriver, hvordan du klarede disse visuelle logikopgaver. Det er ikke et valideret IQ-tal eller en sammenligning med befolkningen som helhed.',
    'Your answers, explained': 'Overblik over dine svar', 'Review your answers': 'Gennemgå dine svar', 'Back to result': 'Tilbage til resultat',
    'The pattern': 'Mønstret', 'Compare the answers': 'Sammenlign svarene', 'Your answer': 'Dit svar', 'Correct answer': 'Rigtigt svar',
    'Previous review question': 'Forrige opgave i gennemgangen', 'Next review question': 'Næste opgave i gennemgangen',
    'Results by question': 'Resultat pr. opgave', 'Explore all 36 puzzles': 'Se alle 36 opgaver',
    '✓ Correct': '✓ Rigtigt', '× Incorrect': '× Forkert', 'Review a question': 'Gennemgå en opgave',
    'Your submitted answers and final score stay unchanged.': 'Dine indsendte svar og dit endelige resultat ændres ikke.',
    'Contact': 'Kontakt', 'Feedback & contact': 'Feedback og kontakt', 'Send feedback or contact us': 'Send feedback eller kontakt os',
    'Correct — your answer matches the correct answer.': 'Rigtigt — dit svar stemmer med facit.',
    'Incorrect — your answer differs from the correct answer.': 'Forkert — dit svar er forskelligt fra facit.',
    'Unanswered — no answer was submitted for this question.': 'Ubesvaret — du har ikke svaret på denne opgave.',
    'No answer submitted': 'Intet svar afgivet', 'Your submitted answer': 'Dit indsendte svar', 'Missing icon': 'Manglende figur',
    'All questions are answered. You can still review and change answers, then finish the test.': 'Alle opgaver er besvaret. Du kan stadig gennemgå og rette dine svar, før du afslutter testen.',
    'Five minutes or less remaining.': 'Der er højst fem minutter tilbage.',
    'Time is up. Your answers have been scored.': 'Tiden er gået. Dit resultat er beregnet.', 'Test completed.': 'Testen er afsluttet.',
    'Comparison unavailable.': 'Sammenligningen er ikke tilgængelig.',
    'This browser could not save your attempt. Keep this page open: reloading may lose progress or restore older answers.': 'Browseren kunne ikke gemme dit forsøg. Hold siden åben: genindlæsning kan miste nye svar eller gendanne ældre svar.',
    'Local saving is unavailable in this browser. Keep this page open to avoid losing your attempt.': 'Lokal lagring er ikke tilgængelig i denne browser. Hold siden åben, så du ikke mister dit forsøg.',
    'The saved attempt could not be restored. Start a new test when you are ready.': 'Det gemte forsøg kunne ikke gendannes. Start en ny test, når du er klar.'
  };
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
    [/^Reference group: ([\d,]+) historical attempts with recorded durations over one minute and up to 40 minutes\..*$/, (_,count) => `Sammenligningsgruppe: ${count.replace(/,/g,'.')} historiske forsøg med registreret varighed på over ét minut og op til 40 minutter. Deltagerne kom via betalte Facebook-annoncer og valgte selv at tage testen. Denne selvvalgte gruppe kan afvige fra befolkningen som helhed; retningen og størrelsen på forskellen er ukendt. Der er ikke korrigeret til befolkningsniveau. Ved samme antal rigtige bruges midten af gruppens percentilinterval. Historiske tidsmålinger og udeladelser i data er ikke uafhængigt verificeret. Øvelse, muligheden for at vende tilbage til opgaver, visning af facit og gentagne forsøg kan påvirke sammenligneligheden med historiske resultater.`],
    [/^\d{1,3}(,\d{3})+$/, text => text.replace(/,/g,'.')]
  ];
  let language = 'en';
  try { const saved = localStorage.getItem('iqchampion.language'); if (saved === 'da' || saved === 'en') language = saved; else if (navigator.language?.toLowerCase().startsWith('da')) language = 'da'; } catch { if (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('da')) language = 'da'; }
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
    for (const code of ['da','en']) document.getElementById('language-'+code)?.setAttribute('aria-pressed', String(language === code));
    const link = document.getElementById('feedback-link');
    if (link) link.setAttribute('href', 'https://munthesystems.dk/systems/feedback/iqchampion?lang='+language);
    if (persist) try { localStorage.setItem('iqchampion.language', language); } catch { /* Language still works for this page. */ }
  }
  // Capture only the initial product-owned HTML. Dynamic content uses the same bindings below.
  if (document.createTreeWalker) {
    const walker = document.createTreeWalker(document.body, 4);
    let node;
    while ((node = walker.nextNode())) {
      if (['SCRIPT','STYLE','NOSCRIPT'].includes(node.parentElement?.tagName) || !node.nodeValue.trim()) continue;
      bind(node,'node',node.nodeValue);
    }
    for (const el of document.querySelectorAll('[aria-label], [alt], meta[name="description"]')) {
      for (const attr of ['aria-label','alt','content']) if (el.hasAttribute(attr)) bind(el,attr,el.getAttribute(attr));
    }
  }
  for (const code of ['da','en']) document.getElementById('language-'+code)?.addEventListener('click', () => setLanguage(code));
  setLanguage(language, false);
  return { clear:el=>bindings.delete(el), text:(el,value)=>bind(el,'text',value), html:(el,value)=>bind(el,'html',value), attribute:(el,name,value)=>bind(el,name,value), setLanguage, translate, get language(){return language;}, missing };
})();
