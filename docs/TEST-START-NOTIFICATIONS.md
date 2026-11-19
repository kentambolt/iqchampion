# test_started: lokal forberedelse, 19. november 2026

Status: **kun capture, ikke udgivet**. Ingen endpoint, gatewayadapter, ntfy-klient, credentials, topics eller rigtige push er oprettet. Eksisterende produktion e8a2fd2 og dens statistik er uændret.

## Autoritativ trigger

`assets/app.js:start_test()` efter `restore_attempt()` og `if (!finished) return`. Funktionen kaldes af `practice-start-link`, ikke af forsiden eller valg af et øvesvar. Her nulstilles svar, starttid og deadline, og et nyt forsøg går fra afsluttet/ingen til aktivt. Capture-intent oprettes kun i denne overgang, før det samlede forsøg gemmes. `restore_attempt`, timeout, sprogskift, refresh, review og navigation opretter ingen ny hændelse. En genoptagelse kan senere genforsøge levering af samme allerede gemte ID, men må aldrig generere et nyt.

## Produktets faktiske lagring

Produktet er statisk HTML/JS på GitHub Pages. Ingen produktbackend, DB, worker eller eksisterende outbox. Derfor kan backendkravet om DB-commit ikke implementeres i dette repo. En ny, neutral capture-journal gemmes i samme ene `localStorage.setItem` som det accepterede forsøg. Data er først tilgængelige for inspektion efter en vellykket skrivning. Ny nøgle `iqchampion.attempt.v4` migrerer v3/v1 uden at oprette start-events og uden at slette de gamle kopier. Det undgår, at gamle åbne klienter fjerner journalen.

Journalen har `version:1`, `mode:capture` og højst 32 `pending`-poster. Hver post består kun af `id` (tilfældigt UUID v4) og `kind:test_started`. Ingen navn, email, rå URL, svar, resultat, starttid eller vedvarende besøgs-ID. Samme ID bevares ved lagring/genindlæsning; nye forsøg får nye ID'er, også inden for samme millisekund. Flere ventende start-intents bevares ved et nyt forsøg. Ukendte felter, dubletter og ugyldige værdier bortfiltreres. Fyldt capture-journal bevarer gamle poster og stopper ny opsamling; den afbryder ikke testen.

`captured_test_start_intents()` er alene lokal inspektion. **Capture-poster må aldrig videresendes til produktion eller promoveres til rigtige notifikationer.** Der er bevidst ingen send/ack/retry-funktion før ingresskontrakten. DNT og GPC blokerer opsamling og inspektion. Manglende crypto/lagring forhindrer ikke den almindelige test.

## Grænser og kontraktbehov

Browserlagring er best effort. Privat browsing, sletning, lukning og kvote kan tabe data. Der hævdes ikke backendholdbarhed eller fuld flerfanekonsistens; samtidige read-modify-write-operationer på journalen skal serialiseres/erstattes med en egnet transaktionel klientkø i den endelige adapter. Stabilt event-ID er dedupnøglen, ikke et løfte om nøjagtigt én mobilvisning.

Selskabsforløbet skal levere den faktiske anonyme ingresskontrakt: produkt-/event-allowlist, idempotensfelt, miljømarkering, CORS/origin, rategrænse, størrelsesgrænse, og hvad der tæller som holdbar accept. Ingen backendnøgle eller ntfy-login må bygges ind i browseren. Det eksisterende, pinnede Umami/Systems-script genbruges ikke med et ukendt event; ingen statistik-allowlist er udvidet her.

Den centrale modtagelse skal deduplikere `(project,event type,event ID)` og oprette sin holdbare notifikations-outbox i samme DB-transaktion, før kvittering. Genforsøg bruger det samme ID. Central backend håndterer ntfy-adapter, retries og eventuel uklar afsendelseskvittering. Staging/test skal have capture-only uden mulighed for real push. Produktets offentlige branding ændres ikke.

## Releasegate

1. Ingen merge/Pages-release af forberedelsen endnu. Afvent konkret ingresskontrakt.
2. Implementér og prøv anonym adapter, central holdbar dedup/outbox, klientkøens flerfanekonsistens, privatlivsfravalg, begrænsede genforsøg og ack efter faktisk holdbar accept. Gamle capture-data kasseres, ikke afsendes.
3. Prøv fake/capture: dobbeltklik, refresh, genoptagelse, to faner, timeout, mistet HTTP-kvittering, serverfejl, offline, genforsøg og staging uden push. Samme start må skabe højst én central event.
4. Følg normal PR/Pages-proces med da/en, testflow, gemte forsøg, statistik/feedback og versionslåst SRI. En egentlig mobilnotifikation kræver en særskilt kontrolleret liveprøve; den er ikke bestået her.
5. Opdatér privat selskabsoversigt med faktisk lokal/staging/live-status. Ingen offentlig portfolioændring er nødvendig for denne uudgivne, usynlige forberedelse.

## Validering

`node --test checks/*.test.cjs`: 77 tests. De otte nye cases dækker autoritativ start, stabilt ID ved genoptagelse, flere forsøg, lagrings-/crypto-fejl, DNT/GPC, v3-migrering, journalens anonymitet/afgrænsning og blokeret helper-asset uden afbrydelse af testen. Eksisterende regler/scoring/timer og da/en/SEO-checks bevares. Ingen netværks- eller mobilpushprøve er foretaget.
