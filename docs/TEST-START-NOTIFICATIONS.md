# Teststart-notifikationer · 19. november 2026

Status: PR #11 er udgivet som 36dcd91; browserstart/reload/sprogskift og præcis én Android-notifikation blev verificeret 19. november. Adapteren er aktiv kun på https://iqchampion.com med queued-ack. Ingen ntfy-login eller klientnøgle.

## Trigger og data

Kun `start_test()` efter genoptagelses-/aktivt-forsøgskontrollen opretter UUID og UTC-tidspunkt. Sidevisning, genindlæsning, sprogskift, navigation og afslutning opretter ingen event. De syv kontraktfelter er version, id, project=iqchampion, environment=production, type=test_started, occurred_at og data={}. Ingen svar, score, navn eller besøgs-ID.

Payload gemmes som `startNotification` i samme localStorage-skrivning som forsøget; først efter vellykket skrivning forsøges IndexedDB-enqueue. Den særskilte v4-forsøgsnøgle migrerer v3/v1 uden retrospektive events. Gamle capture-intents fra den tidligere lokale forberedelse bruges ikke. Der er et best-effort-vindue mellem localStorage og IndexedDB; genoptagelse forsøger igen med det gemte ID. Blokeret lagring, manglende asset eller crypto og netværksfejl må ikke blokere testen.

## Lokal leveringskø

IndexedDB readwrite-transaktioner serialiserer indsættelse og 30-sekunders leases mellem faner. Transport starter først efter transaktionscommit. Højst 100 poster; 7 dages TTL; højst 10 sendeforsøg med eksponentiel backoff/jitter og Retry-After. Uafklarede, udløbne og permanente fejl beholdes til review uden ny ID eller stille eviction. Central deduplikering er autoritativ; browserlagring kan slettes/tabes, og der loves ikke exactly-once mobilvisning.

Credentialless CORS til kontrakt-URL, ingen Authorization, cookies eller referrer. DNT/GPC, eksisterende analytics-fravalg, bot/webdriver, forkert origin/path, preview og staging blokerer opsamling/transport. Privatlivsfravalg rydder eksisterende IndexedDB-journal ved næste adapterkald.

Kun 2xx, gyldigt JSON, accepted=true, matchende id, boolesk duplicate og forventet delivery fjerner posten, atomisk med lokal kvittering. Standard forventer queued. Den isolerede capture-probe vælger captureOnly=true og forventer capture. Tabt HTTP-kvittering genforsøger samme bytes/ID.

## Beviser og releasegates

- `npm test`: 85 beståede tests, inklusive autoritativ trigger, genoptagelse, legacy-migration, to faner, mistet ack, leases, queuegrænse, offline, TTL, fejl og privatliv.
- `reports/notification-capture-20261119.json`: adapter til faktisk HTTPS-central, 202 duplicate=false efterfulgt af 200 duplicate=true ved syntetisk tabt ack; samme UUID og delivery=capture. Lokal ack-kvittering forhindrer ny enqueue.
- Capture-proben bruger Node-fetch med eksplicit Origin og kontrollerer CORS-svar. Den er ikke bevis på rigtig browser-CORS-håndhævelse eller mobilmodtagelse. Kør kun `node checks/notification-capture.cjs` efter konkret koordineret capture-tilladelse; aldrig del af npm test.
- Før release: separat go, præcis origin/profilkonfiguration, rigtig browser-CORS-kontrol, da/en-testflow, statistik/feedback og Pages-kontrol. Ingen ændring af tracker/SRI eller analytics-allowlist.
- Før rigtig push: gatewayens liveprofil og Kents Android-abonnement/reconnect/leveringsprøve skal være bekræftet. Denne kontrol blev bestået ved den koordinerede PR #11-release.

PR #11 ændrede ikke det synlige produktdesign. Ved fjernelsen af øveopgaven 22. november skal portfolioens tidligere øvebillede erstattes med en aktuel offentlig visning.

## Direkte start · 22. november 2026

Øveopgaven er fjernet efter Kents ønske. Forsidens startknap og resultatets Prøv igen kalder start_test direkte. Den eksisterende aktivt-forsøgskontrol, gemte starttid, stabile event-ID og DNT/GPC-gates bevares. Lokal browserprøve bruger localhost, som ikke kan afsende produktionsnotifikationer.
