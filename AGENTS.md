# Agentvejledning for iqchampion
## Munthe Systems og arbejdsdeling

Kent har samlet dette produkt under sit kommende Munthe Systems. Læs ved start og ved opgaver om fælles drift:
- `C:\projekter\munthe-systems\munthe-systems\docs\FAELLES-KONTEKST.md`
- `C:\projekter\munthe-systems\munthe-systems\docs\KOORDINERING.md`

Bevar projektets eksisterende regler og Kents aktuelle opgave. Fribud-forløbet fortsætter sammenlægningen af FindPizza/Fribud og deres fælles platform; andre projekter skal ikke starte en parallel migration. Selskabsrepoet samler portefølje, driftsmål og fælles leverandørforslag. Forslag udløser ikke alene deploy, køb, livebetaling eller leverandørskifte. Bevar produktadskilte data, rettigheder, afsendere og hemmeligheder. GiveAcross-agenten afslutter sin egen flytning; flyt eller ryd ikke dens filer fra andre forløb.

Brug projektets faktiske nye mappe under `C:\projekter\munthe-systems` ved filoperationer; gamle chat-/projektposter kan pege på tidligere placeringer. Kan selskabsfilerne ikke læses, oplys det og fortsæt uafhængigt arbejde.

Ved væsentlige ændringer: afstem kort produktstatus, hosting/DNS, server, database, mail/SMS og næste skridt med selskabsoversigten. Skriv aldrig credentials, private konfigurationer eller kundedata i statusfiler. Dashboardets oplysninger ligger i selskabsrepoets `dashboard-data.json` og `portfolio.json`; generér derefter `assets/dashboard-data.js` med `node tools/Build-Dashboard.mjs`, når værktøjet foreligger.

## Neutral offentlig feedback

Offentlige produkttekster må ikke annoncere tilknytning til Munthe Systems. Feedbacktekster, inklusive skærmlæsertekster, må ikke nævne Kent eller Munthe Systems; brug fx "Vi har modtaget din feedback". Bevar interne integrationer og korrekte nødvendige privatlivsoplysninger.

## Minimumssprog

Produktets offentlige brugerflader og centrale flows skal understøtte både dansk og engelsk, inklusive navigation, vejledning, validering/fejl, feedback og relevante mails. Bevar øvrige sprog. Sprogvalg skal kunne skiftes konsekvent uden at miste testtilstand; brugerdata må ikke sendes til automatisk tredjepartsoversættelse. Den fælles feedbackformular vedligeholdes af selskabsforløbet.

## Offentlig SEO

Offentligt tilgængelige sider skal være SEO-optimerede efter SEO-afsnittet i C:/projekter/munthe-systems/munthe-systems/docs/FAELLES-KONTEKST.md: læsbart indhold, relevante metadata/canonical, semantik, billeder, mobil/performance, sitemap/statuskoder og kun ægte sprogruter/hreflang samt relevante strukturerede data. Bevar adgang/noindex for private og personlige flows, staging, prototyper og kontaktformularer; disse hører ikke i sitemap. Ingen betalte SEO-tjenester som standard.

## Visuel kvalitet

Følg designafsnittet i C:/projekter/munthe-systems/munthe-systems/docs/FAELLES-KONTEKST.md: undgå dekorative nulpolstrede trinnumre, border-left alene på afrundede beholdere, overdrevne tankestreger og Unicode-emojis som UI-dekoration. Brug egne SVG-/tegnede ikoner, optisk lodret centrering af ikon/tekst og tydelige links/fokus uden overdreven understregning. Bevar opgavernes figurer/data; ingen blind global udskiftning.

Sprogsidernes kilde er index.html og assets/i18n.js. Efter ændringer: kør node tools/Build-Language-Pages.cjs, verificér --check og kør app-/SEO-checks. Redigér ikke kun de genererede da/en-sider. Bevar rigtige sprog-URLer, gensidige hreflang og canonical samt noindex på private testtilstande/404; sitemap omfatter kun offentlige kanoniske sider. Mail/SMS/admin er ikke relevante i dette statiske produkt, så opret ikke kanaler alene for at opfylde en liste.
