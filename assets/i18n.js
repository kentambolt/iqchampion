'use strict';

// Product-owned copy only. No user data is sent to a translation service.
const i18n = (() => {
  const da = {
    "Estimated median range": "Estimeret medianinterval",
    "Public comparisons include all contributors using this puzzle version. Optional age group and country are only used in private aggregate statistics.": "Offentlige sammenligninger omfatter alle bidrag på denne opgaveversion. Frivillig aldersgruppe og land bruges kun i privat, samlet statistik.",
    "I agree to contribute my anonymous question results, active times and any optional age group or country to aggregate statistics.": "Jeg accepterer, at mine anonyme opgaveresultater, aktive tider og eventuelt valgt aldersgruppe eller land indgår i samlet statistik.",
    "Median ranges are estimated from time histograms. The displayed interval shows the timing resolution; no exact median or speed percentile is claimed.": "Medianintervaller estimeres fra tidshistogrammer. Det viste interval angiver tidsopløsningen. Der angives ikke en eksakt median eller hastighedspercentil.",
    "Share the challenge": "Del udfordringen",
    "Question time": "Opgavetid",
    "Your browser privacy preferences keep these statistics on your device.": "Din browsers privatlivsvalg holder disse statistikker på din enhed.",
    "All voluntary attempts": "Alle frivillige forsøg",
    "Thank you. Your anonymous contribution was saved.": "Tak. Dit anonyme bidrag er gemt.",
    "There are not enough comparable attempts in this group yet. Your own statistics are always available.": "Der er endnu ikke nok sammenlignelige forsøg i denne gruppe. Din egen statistik er altid tilgængelig.",
    "Comparisons are temporarily unavailable. Your own statistics and sharing still work.": "Sammenligninger er midlertidigt utilgængelige. Din egen statistik og deling fungerer stadig.",
    "This older attempt has no complete timing record. You can still explore and share your result.": "Dette ældre forsøg har ikke en fuldstændig tidsmåling. Du kan stadig gennemgå og dele dit resultat.",
    "Choose whether to contribute before sending any data.": "Vælg, om du vil bidrage, før der sendes data.",
    "This attempt has no complete timing record. Your personal results are unchanged.": "Dette forsøg har ikke en fuldstændig tidsmåling. Dine egne resultater er uændrede.",
    "Your contribution could not be saved in this browser. Nothing was sent.": "Dit bidrag kunne ikke gemmes i denne browser. Der blev ikke sendt noget.",
    "This contribution needs review and was not counted again.": "Dette bidrag kræver gennemgang og er ikke talt med igen.",
    "Your contribution has not been confirmed. Try again with the same saved contribution.": "Dit bidrag er ikke bekræftet. Prøv igen med det samme gemte bidrag.",
    "IQCHAMPION": "IQCHAMPION",
    "No account needed": "Ingen konto nødvendig",
    "The test starts when you are ready": "Testen starter, når du er klar",
    "Test": "test",
    "Answered questions": "Besvarede opgaver",
    "Something to share": "Noget at dele",
    "Your strongest moment": "Dit stærkeste øjeblik",
    "Your estimated IQ": "Din estimerede IQ",
    "A tricky puzzle, solved quickly": "En svær opgave, løst hurtigt",
    "Quicker than the typical correct answer": "Hurtigere end det typiske korrekte svar",
    "Your quickest correct answer": "Dit hurtigste korrekte svar",
    "Patterns you solved": "Mønstre, du løste",
    "A challenge worth sharing": "En udfordring at dele",
    "36 puzzles. One challenge.": "36 opgaver. Én udfordring.",
    "Share a challenge with someone you know.": "Del udfordringen med en, du kender.",
    "Your own active time. There is not enough comparison data to rank its speed.": "Din egen aktive tid. Der er endnu ikke nok sammenligningsdata til at vurdere hastigheden.",
    "Choose what to share": "Vælg, hvad du vil dele",
    "Best moment": "Bedste øjeblik",
    "IQ estimate": "IQ-estimat",
    "Correct patterns": "Rigtige mønstre",
    "Share on Facebook": "Del på Facebook",
    "Copy a personal caption": "Kopiér en personlig tekst",
    "Your share text": "Din delingstekst",
    "Copy text": "Kopiér tekst",
    "Facebook lets you write your own caption. We never post automatically.": "På Facebook kan du skrive din egen tekst. Vi slår aldrig noget op automatisk.",
    "Copied. Paste it into your post.": "Kopieret. Indsæt teksten i dit opslag.",
    "Select and copy the text below.": "Markér og kopiér teksten herunder.",
    "Your question statistics": "Din opgavestatistik",
    "Question comparisons are not available yet. Your personal statistics are shown below.": "Opgavesammenligninger er endnu ikke tilgængelige. Du kan se din egen statistik herunder.",
    "Times count visible, focused question time up to your last answer. For unanswered questions, time spent is shown. Hidden tabs and closed pages do not count. Earlier attempts may have no timings.": "Tiderne måler aktiv tid i en synlig opgave med fokus frem til dit sidste svar. Ved ubesvarede opgaver vises den brugte tid. Skjulte faner og lukkede sider tæller ikke med. Ældre forsøg kan mangle tider.",
    "All 36 questions, including skipped questions": "Alle 36 opgaver, også dem du sprang over",
    "Question": "Opgave",
    "Your time": "Din tid",
    "Correct-answer median": "Median for korrekte svar",
    "Others correct": "Andre med korrekt svar",
    "Compare with voluntary attempts using the same puzzle version. At least 30 answered questions are needed for a correct rate, and 30 timed correct answers for a median. These are participants, not a representative population.": "Sammenlign med frivillige forsøg på samme opgaveversion. En korrektandel kræver mindst 30 besvarelser, og en median kræver 30 korrekte svar med tidsmåling. Deltagerne er ikke et repræsentativt udsnit af befolkningen.",
    "Compare and contribute": "Sammenlign og bidrag",
    "Help future participants compare their results. You can share anonymous test statistics after finishing, even if you skipped questions.": "Hjælp fremtidige deltagere med at sammenligne deres resultater. Du kan dele anonym teststatistik efter afslutning, også hvis du sprang opgaver over.",
    "Anonymous comparisons are being prepared. Your personal statistics and sharing work without contributing.": "Anonyme sammenligninger er på vej. Din egen statistik og deling fungerer uden et bidrag.",
    "Age group (optional)": "Aldersgruppe (valgfrit)",
    "Country (optional)": "Land (valgfrit)",
    "Prefer not to say": "Ønsker ikke at oplyse",
    "Under 18": "Under 18",
    "I agree to contribute my anonymous question results and active times, together with any age group and country I choose, to comparison statistics.": "Jeg accepterer, at mine anonyme opgaveresultater og aktive tider samt eventuelt valgt aldersgruppe og land indgår i sammenligningsstatistik.",
    "No name, email or exact age. Sharing your statistics is optional and does not affect your result. Small comparison groups are hidden.": "Intet navn, e-mail eller præcis alder. Det er frivilligt at dele statistik og ændrer ikke dit resultat. Små sammenligningsgrupper skjules.",
    "Contribute anonymously": "Bidrag anonymt",
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
    'A challenge in visual reasoning': 'En udfordring i visuel ræsonnering.',
    'Spot the pattern.': 'Spot mønstret.', 'Find the missing piece.': 'Find den manglende brik.',
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
    'Start 40-minute test': 'Start 40-minutters test',
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
  Object.assign(da,{"Choose language":"Vælg sprog","Search languages":"Søg efter sprog","Close language selector":"Luk sprogvælgeren","No languages found":"Ingen sprog fundet","Free IQ test for fun | IQ Champion":"Gratis IQ-test for sjov | IQ Champion","A free IQ-style test for fun: 36 visual puzzles, 40 minutes, saved progress and an estimated IQ result. No account needed.":"En gratis IQ-lignende test for sjov: 36 figuropgaver, 40 minutter, gemte svar og et estimeret IQ-resultat. Ingen konto nødvendig.","Choose your preferred language. Your answers and original deadline stay saved.":"Vælg dit sprog. Dine svar og oprindelige tidsfrist bevares.","Loading language…":"Indlæser sprog…","The language could not be loaded. Your test and answers are unchanged.":"Sproget kunne ikke indlæses. Din test og dine svar er uændrede.","Feedback is available in Danish and English.":"Feedback er tilgængelig på dansk og engelsk.","Shared achievement":"Delt præstation","Shared result":"Delt resultat","Shared results are self-reported.":"Delte resultater er selvrapporterede.","Shared achievements are self-reported. No age, country, answers or personal profiles are shared.":"Delte præstationer er selvrapporterede. Alder, land, svar og personlige profiler deles ikke.","Try the 36 puzzles yourself":"Prøv selv de 36 opgaver","Try the test yourself":"Prøv selv testen","A visual challenge in IQ Champion. Can you spot the pattern too?":"En visuel udfordring i IQ Champion. Kan du også finde mønstret?","A free visual puzzle test, just for fun. Not a professionally validated IQ measurement.":"En gratis test med figuropgaver, kun for sjov. Ikke en fagligt valideret IQ-måling.","Page not found":"Siden findes ikke","You can continue in another language.":"Du kan fortsætte på et andet sprog."});
  const danishTemplates={"Estimated median range: {0} ({1} timed correct answers).":"Estimeret medianinterval: {0} ({1} korrekte svar med tidsmåling).","Question {0} · {1}":"Opgave {0} · {1}","{0} correct patterns":"{0} rigtige mønstre","Active time: {0}":"Aktiv tid: {0}","Comparison: {0} voluntary attempts over {1} days.":"Sammenligning: {0} frivillige forsøg over {1} dage.","Question {0} / {1}":"Opgave {0} / {1}","Review question {0} / {1}":"Gennemgå opgave {0} / {1}","Row {0}, icon {1}":"Række {0}, figur {1}","Answer {0}":"Svar {0}","Question {0}, {1}":"Opgave {0}, {1}","Review question {0}, {1}":"Gennemgå opgave {0}, {1}","{0} correct; {1} incorrect; {2} unanswered.":"{0} rigtige; {1} forkerte; {2} ubesvarede.","{0} answered; {1} unanswered.":"{0} besvarede; {1} ubesvarede.","{0} answered; {1} unanswered. Unanswered questions count as incorrect. Once finished, you cannot change answers.":"{0} besvarede; {1} ubesvarede. Ubesvarede opgaver tæller som forkerte. Når du har afsluttet, kan du ikke rette dine svar.","{0} / {1} correct":"{0} / {1} rigtige","Percentile among historical participants: {0}":"Percentil blandt historiske deltagere: {0}","Participants scoring lower: {0}%. Participants with the same score: {1}%.":"Deltagere med lavere resultat: {0} %. Deltagere med samme resultat: {1} %.","Reference group: {0} historical attempts. Attempts with recorded durations over one minute and up to 40 minutes are included. Tied scores share the midpoint of their percentile group. Estimates are rounded to whole numbers and displayed only within 55–145, with a limit indicator outside that range. This is a scale conversion, not an independently validated population IQ measurement. Practice and repeated attempts can affect your result. Some example images have been corrected since the historical attempts were collected, which limits comparability.":"Sammenligningsgruppe: {0} historiske forsøg. Forsøg med registreret varighed på over ét minut og op til 40 minutter indgår. Ved samme antal rigtige bruges midten af gruppens percentilinterval. Estimater afrundes til hele tal og vises kun inden for 55–145 med en grænsemarkering uden for intervallet. Dette er en omregning af skalaen, ikke en uafhængigt valideret IQ-måling i befolkningen. Øvelse og gentagne forsøg kan påvirke dit resultat. Nogle eksempelbilleder er rettet, siden de historiske forsøg blev indsamlet, hvilket begrænser sammenligneligheden.","My estimated IQ in IQ Champion: {0}. Just for fun. Try it: {1}":"Min estimerede IQ i IQ Champion: {0}. Kun for sjov. Prøv selv: {1}","I solved question {0} correctly in {1}. Can you do it too? {2}":"Jeg løste opgave {0} korrekt på {1}. Kan du også? {2}","I solved question {0} correctly in {1} (estimated median among correct answers: {2}). Can you do it too? {3}":"Jeg løste opgave {0} korrekt på {1} (estimeret median blandt korrekte svar: {2}). Kan du også? {3}","I found {0} correct patterns in IQ Champion. Try it: {1}":"Jeg fandt {0} rigtige mønstre i IQ Champion. Prøv selv: {1}","Can you find the missing patterns in IQ Champion? {0}":"Kan du finde de manglende mønstre i IQ Champion? {0}","Question {0} solved":"Opgave {0} løst","{0} patterns solved":"{0} mønstre løst","{0} / 36 correct. {1}":"{0} / 36 rigtige. {1}","Estimated IQ {0} | IQ Champion":"Estimeret IQ {0} | IQ Champion"};
  const status = {correct:'rigtigt', incorrect:'forkert', unanswered:'ubesvaret', answered:'besvaret'};
  const count = (n, singular, plural) => `${n} ${Number(n) === 1 ? singular : plural}`;
  const number = value => String(value).replace('.', ',');
  const patterns = [
    [/^Estimated median range: (.+) \((\d+) timed correct answers\)\.$/, (_,range,n) => 'Estimeret medianinterval: '+range+' ('+n+' korrekte svar med tidsmåling).'],
    [/^Question (\d+) · (.+)$/, (_,q,time) => 'Opgave '+q+' · '+time],
    [/^(\d+) correct patterns$/, (_,n) => n+' rigtige mønstre'],
    [/^Correct-answer median: (.+) \((\d+) timed correct answers\)\.$/, (_,time,n) => 'Median for korrekte svar: '+time+' ('+n+' korrekte svar med tidsmåling).'],
    [/^Active time: (.+)$/, (_,time) => 'Aktiv tid: '+time],
    [/^Comparison: (\d+) voluntary attempts over (\d+) days\.$/, (_,n,days) => 'Sammenligning: '+n+' frivillige forsøg over '+days+' dage.'],
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
  const catalog = typeof IQLanguages!=='undefined'?IQLanguages:[{code:'da',nativeName:'Dansk',flag:'dk',dir:'ltr'},{code:'en',nativeName:'English',flag:'gb',dir:'ltr'}];
  const supported = code=>catalog.some(l=>l.code===code);
  const packs=globalThis.IQLocalePacks||(globalThis.IQLocalePacks={});
  packs.da={code:'da',messages:da,templates:danishTemplates};packs.en??={code:'en',messages:{},templates:{}};
  const routeCode=typeof location!=='undefined'?location.pathname.match(/^\/([^/]+)(?:\/|\/index\.html)?$/)?.[1]:null;
  const route=supported(routeCode)?routeCode:null;
  function preferred(code){const base=String(code||'').toLowerCase().split('-')[0];return supported(base)?base:base==='no'?'nb':null;}
  let language=route||'en';
  if(!route){let saved;try{saved=localStorage.getItem('iqchampion.language');}catch{}language=preferred(saved)||Array.from(navigator.languages||[navigator.language]).map(preferred).find(Boolean)||'en';}
  if(language!=='en'&&language!=='da'&&!packs[language])language='en';
  const englishSources=new Map();
  for(const p of Object.values(packs))for(const [english,target] of Object.entries(p.messages||{}))englishSources.set(target,english);
  const englishSource=value=>englishSources.get(value)||value;
  const bindings = new Map();
  const missing = new Set();
  function format(template,...values){const translated=language==='en'?template:packs[language]?.templates?.[template];if(!translated){missing.add(template);return typeof IQLocaleTemplates!=='undefined'?IQLocaleTemplates.format(template,values):template;}return IQLocaleTemplates.format(translated,values);}
  function translate(value) {
    const source=String(value);
    if(language==='en')return source;
    const dictionary=language==='da'?da:packs[language]?.messages||{};
    if(Object.hasOwn(dictionary,source))return dictionary[source];
    if(language==='da')for(const [pattern,render] of patterns){const match=source.match(pattern);if(match)return render(...match);}
    if(typeof IQLocaleTemplates!=='undefined'){const dynamic=IQLocaleTemplates.match(source);if(dynamic){const translated=packs[language]?.templates?.[dynamic.source];if(translated)return IQLocaleTemplates.format(translated,dynamic.values.map(v=>dictionary[v]||v));}}
    if(/^\d{1,3}(,\d{3})+$/.test(source))return new Intl.NumberFormat(language).format(Number(source.replace(/,/g,'')));
    if(/[A-Za-z]/.test(source)&&!['IQ Champion','IQCHAMPION','Dansk','English'].includes(source))missing.add(source);
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
  function applyLanguage(next, persist = true) {
    if (!supported(next)) return false;
    language = next;
    document.documentElement?.setAttribute('lang', language);
    document.documentElement?.setAttribute('dir', catalog.find(l=>l.code===language)?.dir||'ltr');
    missing.clear();
    for (const [element, entries] of bindings) {
      if (element.isConnected === false) { bindings.delete(element); continue; }
      for (const [property, source] of entries) apply(element, property, source);
    }
    for (const {code} of catalog) document.getElementById('language-'+code)?.setAttribute('aria-current', language === code ? 'page' : 'false');
    const link = document.getElementById('feedback-link');
    if (link) link.setAttribute('href', 'https://munthesystems.dk/systems/feedback/iqchampion?lang='+(language==='da'?'da':'en'));
    const locale=catalog.find(l=>l.code===language);
    const label=document.getElementById('language-current-name');if(label)label.textContent=locale.nativeName;
    document.getElementById('language-current-flag')?.setAttribute('src','images/flags/'+locale.flag+'.svg');
    const note=document.getElementById('feedback-language-note');if(note)note.hidden=['da','en'].includes(language);
    if (typeof update_share_links === 'function') update_share_links();
    if (typeof render_result_statistics === 'function') render_result_statistics();
    const canonical = 'https://iqchampion.com/'+language+'/';
    document.title = translate('Free IQ test for fun | IQ Champion');
    document.querySelector?.('link[rel="canonical"]')?.setAttribute('href',canonical);
    document.querySelector?.('meta[property="og:url"]')?.setAttribute('content',canonical);
    document.querySelector?.('meta[property="og:title"]')?.setAttribute('content',document.title);
    document.querySelector?.('meta[property="og:locale"]')?.setAttribute('content',(language==='fil'?'tl':language)+'_'+locale.flag.toUpperCase());
    const description=translate('A free IQ-style test for fun: 36 visual puzzles, 40 minutes, saved progress and an estimated IQ result. No account needed.');
    document.querySelector?.('meta[property="og:description"]')?.setAttribute('content',description);
    document.querySelector?.('meta[property="og:image"]')?.setAttribute('content','https://iqchampion.com/images/'+(['da','en'].includes(language)?'share-'+language:'share-universal')+'.png');
    const schema=document.getElementById('site-schema');
    if(schema) schema.textContent=JSON.stringify({'@context':'https://schema.org','@type':'WebPage',name:document.title,description,url:canonical,inLanguage:language,isAccessibleForFree:true,isPartOf:{'@type':'WebSite',name:'IQ Champion',url:'https://iqchampion.com/'},primaryImageOfPage:{'@type':'ImageObject',url:'https://iqchampion.com/images/'+(['da','en'].includes(language)?'share-'+language:'share-universal')+'.png',width:1200,height:630}});
    if (persist) {
      try { localStorage.setItem('iqchampion.language', language); } catch { /* The current page still switches. */ }
      if (typeof history!=='undefined'&&typeof location!=='undefined') try { history.replaceState(null,'','/'+language+'/'+location.search+location.hash); } catch { /* Keep the language usable in restricted previews. */ }
    }
  }
  let languageRequest=0;const loading=new Map();
  function load(code){if(packs[code])return Promise.resolve();if(loading.has(code))return loading.get(code);const promise=new Promise((resolve,reject)=>{if(!document.createElement||!document.head?.append){reject(Error('Language unavailable'));return;}const script=document.createElement('script');script.src='assets/locales/'+code+'.js?v=20261122-l10n1';script.async=true;const timeout=setTimeout(()=>reject(Error('Language timeout')),15000);script.onload=()=>{clearTimeout(timeout);packs[code]?.code===code&&typeof packs[code].messages?.['Free IQ test for fun | IQ Champion']==='string'&&Object.keys(packs.en.messages).every(key=>typeof packs[code].messages[key]==='string'&&packs[code].messages[key].trim())&&IQLocaleTemplates.sources.every(source=>IQLocaleTemplates.valid(source,packs[code].templates?.[source]))?resolve():(delete packs[code],reject(Error('Language unavailable')));};script.onerror=()=>{clearTimeout(timeout);reject(Error('Language unavailable'));};document.head.append(script);}).finally(()=>loading.delete(code));loading.set(code,promise);return promise;}
  function setLanguage(next,persist=true){if(!supported(next))return false;const request=++languageRequest;if(packs[next]){applyLanguage(next,persist);return true;}const status=document.getElementById('language-load-status');if(status)status.textContent=translate('Loading language…');return load(next).then(()=>{if(request!==languageRequest)return false;applyLanguage(next,persist);if(status)status.textContent='';return true;}).catch(()=>{if(request===languageRequest&&status)status.textContent=translate('The language could not be loaded. Your test and answers are unchanged.');return false;});}
  // Capture only the initial product-owned HTML. Dynamic content uses the same bindings below.
  if (document.createTreeWalker) {
    const walker = document.createTreeWalker(document.body, 4);
    let node;
    while ((node = walker.nextNode())) {
      if (['SCRIPT','STYLE','NOSCRIPT'].includes(node.parentElement?.tagName) || node.parentElement?.closest?.('[data-i18n-skip]') || !node.nodeValue.trim()) continue;
      const original=node.nodeValue;
      bind(node,'node',original.match(/^\s*/)[0]+englishSource(original.trim())+original.match(/\s*$/)[0]);
    }
    for (const el of document.querySelectorAll('[aria-label], [alt], meta[name="description"]')) {
      for (const attr of ['aria-label','alt','content']) if (el.hasAttribute(attr)) bind(el,attr,englishSource(el.getAttribute(attr)));
    }
  }
  for (const {code} of catalog) document.getElementById('language-'+code)?.addEventListener('click', event => {
    if (event && (event.button>0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)) return;
    event?.preventDefault();
    Promise.resolve(setLanguage(code)).then(ok=>{const dialog=document.getElementById('language-dialog');if(ok&&dialog?.open)dialog.close();});
  });
  setLanguage(language, false);
  return { clear:el=>bindings.delete(el), text:(el,value)=>bind(el,'text',value), html:(el,value)=>bind(el,'html',value), attribute:(el,name,value)=>bind(el,name,value), setLanguage, translate, format, catalog, get language(){return language;}, missing };
})();
