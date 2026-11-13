# Agentvejledning for iqchampion
## Munthe Systems og arbejdsdeling

Kent har samlet dette produkt under sit kommende Munthe Systems. Læs ved start og ved opgaver om fælles drift:
- `C:\projekter\munthe-systems\munthe-systems\docs\FAELLES-KONTEKST.md`
- `C:\projekter\munthe-systems\munthe-systems\docs\KOORDINERING.md`

Bevar projektets eksisterende regler og Kents aktuelle opgave. Fribud-forløbet fortsætter sammenlægningen af FindPizza/Fribud og deres fælles platform; andre projekter skal ikke starte en parallel migration. Selskabsrepoet samler portefølje, driftsmål og fælles leverandørforslag. Forslag udløser ikke alene deploy, køb, livebetaling eller leverandørskifte. Bevar produktadskilte data, rettigheder, afsendere og hemmeligheder. GiveAcross-agenten afslutter sin egen flytning; flyt eller ryd ikke dens filer fra andre forløb.

Brug projektets faktiske nye mappe under `C:\projekter\munthe-systems` ved filoperationer; gamle chat-/projektposter kan pege på tidligere placeringer. Kan selskabsfilerne ikke læses, oplys det og fortsæt uafhængigt arbejde.

Ved væsentlige ændringer: afstem kort produktstatus, hosting/DNS, server, database, mail/SMS og næste skridt med selskabsoversigten. Skriv aldrig credentials, private konfigurationer eller kundedata i statusfiler. Dashboardets oplysninger ligger i selskabsrepoets `dashboard-data.json` og `portfolio.json`; generér derefter `assets/dashboard-data.js` med `node tools/Build-Dashboard.mjs`, når værktøjet foreligger.
