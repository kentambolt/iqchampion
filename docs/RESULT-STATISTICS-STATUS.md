# Lokal statistik og Scandinavian Light & Clean · 22. november 2026

Status: lokal implementering, ikke udgivet. Offentlig produktion er fortsat PR #12 / 150d5494. Den separate centrale IQ-modtager og ejerportalvisning ejes af selskabsforløbet og er endnu ikke afstemt/aktiveret. `iq_statistics_config.enabled=false`; ingen statistikkald eller demografiindsendelse. Den eksisterende teststart-notifikationsadapter er bevaret.

## Implementeret lokalt

- Aktive tider pr. opgave med pause ved skjult/fokusløs side og ved hjælp/afslutningsdialog. Genbesøg akkumuleres; hastighed bruger tid frem til sidst gemte svar, ikke senere inspektion. Timerens 40-minutters vægtid fortsætter som før.
- Forsøgsnøgle v5 migrerer v4/v3/v1 uden at opfinde målinger. Nye målinger gemmes med svar/starttid og et isoleret forsøgs-ID. Lukket tid regnes ikke som aktiv tid. En afsluttet/delvis test har stadig alle36 statusrækker. Browserlagring er best effort, ikke en valideret psykometrisk tidsmåler.
- Personlig statistik, valg mellem bedste øjeblik/IQ/opgavetid/korrekte mønstre og statiske anonyme da/en-share-sider. Intet deles automatisk. Facebook-caption kan kopieres; ingen alder/land eller rå svar i offentlige share-URLer. Opgaverne og facit er bevaret.
- Median- og sværheds-highlights kræver versionsmatch og tilstrækkeligt grundlag. Min30 besvarelser for korrektandel og30 gyldige korrekte tider for median. Et tidsfortrin skal være mindst1sekund og10procent af medianen for at blive fremhævet. Ingen hastighedspercentil beregnes fra en median.
- Frivillige aldersgrupper/land, eksplicit umarkeret samtykke, uforanderlig bidragspayload ved manuelt genforsøg og stubbet privacy-gated adapter er forberedt. Ingen indsamling aktiveres før fælles kontrakt/staging er bestået. Forslag: docs/IQ-STATISTICS-CONTRACT-PROPOSAL.md.

## Design

Reference er Kents vedhæftede designeroplæg, Scandinavian Light & Clean. Nyt neutralt mærke med blå firkanter, lyse kort, blå primærknap, responsive 3D-brikker tegnet i CSS og tydeligere timer/navigation. Egne SVG-ikoner; ingen eksterne fonts eller nye leverandører. Opgavefigurer og regler ændres ikke. Delingsbilleder er1200×630 PNG på da/en og matcher den lyse stil.

Screenshots og faktisk målte viewports: reports/design-20261122/. Forsiden er målt uden sidescroll ved1280×720,1024×600,768×1024,600×800,600×600 og390×844. Første opgave er også målt ved800×600 og passer uden sidescroll ved alle disse størrelser. De detaljerede opgaver19–36 får72px figurfelt på mobil for læsbarhed, hvilket bevidst kan give lodret scroll. Ingen vandret scroll er tilsigtet. Enkelte browserstyringskald fejlede senere med CDP/webview-timeout; allerede gemte screenshots og målte viewports er faktisk gennemført, ikke påstået som nye liveprøver.

## Releasegates

1. Afstem separat IQ-kontrakt, retention/kohortegrænser, syntetisk staging, privacy og ejerportal med selskabsforløbet. Ingen generic tracker-dimensioner udvides her.
2. Test fuld klient→staging→aggregate/ownerportal før collector-flag aktiveres; ingen falske produktionsbidrag eller ny rigtig teststart-push fra lokale tests.
3. Normal PR/release med da/en, bevaret normdata/scoring/timer, frontend-mobilkontrol og faktisk Pages-bevis.
4. Ved udgivelse: opdatér selskabsoversigt og den offentlige portfolio med faktisk nyt design; lokale screenshots er ikke offentligt portfolioindhold endnu.

## Central afstemning, revision 2

Efter selskabsforløbets gennemgang er offentlig v1 afgrænset til global sammenligning pr. puzzle_version. Alders-/landefiltre og krydsgrupper er fjernet fra UI og GET-stub. Frivillig demografi kræver aktivt samtykke og bruges kun i separate private enkelt-dimensionelle aggregater med små-gruppegrænser. Forslaget kræver 90 dages daglige aggregater/histogrammer og 7 dages ID/hash-kvitteringer, uden rå deltagerliste. Histogrambenchmarks vises som estimerede intervaller med forklaret tidsopløsning; highlights bruger den konservative nedre grænse. Ingen central GO eller aktivering er modtaget.
