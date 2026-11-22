# Forslag: IQ-sammenligninger v1, revision 2 · 22. november 2026

**Forslag, ikke livekontrakt eller central GO. Collector forbliver deaktiveret.** Selskabsforløbet skal godkende endpoints/schema og udgive/verificere separat modtager, staging og ejerportal før nogen indsamling. Ingen rå svar, demografi eller forsøgs-ID i generisk tracker/ntfy. Produktion er fortsat PR #12; PR #13 er draft.

## Resultat, frivillighed og samtykke

Egne tider/statusrækker og basisdeling fungerer uden bidrag, også ved delvise tests. En umarkeret samtykkeboks kræver et aktivt valg og klik efter afslutning/timeout, før anonym opgavestatistik og eventuelt valgt aldersgruppe/land sendes. Alder er en grov gruppe, ikke præcis alder eller fødselsdato; land er frivilligt. Ingen navn, email, rå svar, IP/UA eller vedvarende besøgs-ID gemmes. DNT/GPC/bot/preview spærrer transport. Historiske forsøg får ikke opfundne opgavetider.

**V1 offentlige sammenligninger er udelukkende globale pr. puzzle_version.** Ingen offentlige alders-/landefiltre eller krydsgrupper, heller ikke når en bruger bidrager med frivillig demografi. Brugerfladen forklarer, at disse oplysninger alene bruges i private aggregater. Mere specifikke offentlige sammenligninger er ikke en del af denne version.

## Foreslået separat POST

`POST /systems/v1/iq-attempts` på munthesystems.dk. Credentialless CORS for præcis https://iqchampion.com, ingen frontendnøgle. Højst 8192 bytes, eksakte felter:

```json
{"version":1,"id":"canonical UUID pr. afsluttet forsøg","puzzle_version":3,"completion":"finished","elapsed_ms":120000,"questions":[{"question":1,"status":"correct","active_ms":5000,"answer_ms":5000,"changes":1}],"demographics":{"age_group":null,"country":null}}
```

questions har præcis alle 36 entydige id'er 1–36, sorteret. status=correct/incorrect/unanswered. active_ms er synlig/fokuseret opgavetid; answer_ms er kumuleret aktiv tid indtil sidst gemte svar, null ved ubesvaret. Senere inspektion ændrer ikke tiden frem til svaret. changes er antal gemte svar. Heltal: 0–2400000 ms; answer_ms<=active_ms; sum(active_ms)<=elapsed_ms<=2400000. completion=finished/timeout. Kun kendte puzzle_version, uden sammenblanding af ændrede opgaveregler.

age_group=null/under18/18-24/25-34/35-44/45-54/55-64/65plus. country=null eller allowlistet ISO3166-1 alpha2. Aktivt samtykke omfatter de faktisk valgte frivillige oplysninger. Ingen automatisk indsendelse ved feltændring og ingen demografisk forespørgsel fra klienten.

Første varige atomiske optælling: 202 `{accepted:true,id,duplicate:false}`. Identisk genforsøg: 200 duplicate=true. Ændret payload med samme ID: 409. Samme payload/ID bevares ved manuelt netværksgenforsøg; demografi ændres ikke efter indsendelse. Klienten gemmer først den samtykkede, frosne payload med forsøget. Der er ingen automatisk baggrundsindsendelse.

## Central lagring og afgrænsning

Modtageren validerer i hukommelsen og opdaterer **daglige aggregater og tidshistogrammer**, ikke en rå 36-rækkers deltagerliste. Intet råt body i database, request-/fejllogs eller ejerportal. Ingen individuel profil eller kobling af demografi og forsøgs-ID.

- Aggregater/histogrammer: 90 dage, separat pr. puzzle_version og miljø.
- Dedupe: kun tilfældigt hændelses-ID, normaliseret payloadhash og kvitterings-/modtagelsestid i 7 dage. Ikke en besøgsidentitet.
- Statusoptælling er separat fra gyldig hastighed. Ubesvarede opgaver er ikke i sig selv svære.
- Korrektrate bruger besvarede opgaver som nævner. Kun gyldige korrekte tider tæller i histogrammerne; fx under 1000 ms eller ufuldstændige/mistænkelige målinger udelades fra hastighed, mens status stadig kan tælles.
- Demografi holdes i separate enkelt-dimensionelle ejeraggregater: aldersgruppe **eller** land. Ingen age×country-krydsgrupper, rå deltagerprofiler eller offentlig filterflade. Små grupper skjules centralt; minimum 30 relevante bidrag før en dimension vises.
- Rate-/lagringsgrænser og histogramgrænser afstemmes centralt før aktivering. Alle værdier er klientrapporterede, uden anti-cheat- eller normeringsgaranti.

## Foreslået global GET

`GET /systems/v1/iq-comparisons?version=3` giver kun globale aggregater. Andre queryfelter, især country/age_group, skal afvises; klientstubben afviser filtre før ethvert kald. Forslag:

```json
{"version":1,"timing_method":"histogram","puzzle_version":3,"sample_size":120,"minimum_sample":30,"period_days":90,"questions":[{"question":1,"answered":100,"correct":70,"timed_correct":60,"median_lower_ms":13000,"median_upper_ms":15000}]}
```

Minimum 30 version-matchende bidrag før sammenligninger. Opgavens korrektrate kræver 30 besvarelser, tidsbenchmark kræver 30 gyldige korrekte tider. Spørgsmål med utilstrækkeligt grundlag udelades eller har null-tidsfelter; central API må ikke udlevere små gruppers skjulte grundtal. Klienten forsvarer samme minimum, men er ikke serverens privacygrænse.

`median_lower_ms`/`median_upper_ms` er grænserne for det histograminterval, der indeholder den estimerede median. **Det er tidsopløsning, ikke et konfidensinterval eller en eksakt median.** Begge er null uden tidsgrundlag. UI og deling viser fx “Estimeret medianinterval: 13–15 s”, med forklaring og sampletal; ingen hastighedspercentil beregnes fra intervallet. En hurtig præstation fremhæves kun, hvis egen tid er mindst 1 sekund og 10 procent under den konservative nedre intervalgrænse.

Frivillige forsøg er ikke et repræsentativt befolkningsudsnit. Ingen nationale IQ-ranglister eller numerisk korrektion af IQ efter alder/land.

## Ejerportal og release

Selskabsforløbet ejer den eksisterende loginbeskyttede visning: gennemførte/delvise forsøg pr. dag, korrekt/forkert/ubesvaret pr. opgave, gyldige korrekte tider og histogramestimater samt afgrænset demografisk dækning. Kun aggregater, enkeltvise demografiske dimensioner og små-gruppegrænser; ingen rå deltagerliste. Eksisterende Google/Origin/CSRF- og staging-/produktionsgrænser bevares.

Statiske da/en-shares og kopiértekst er uafhængige af bidrag. Ingen offentlig token-/demografiprofil eller automatisk Facebook-publicering. Eksisterende IQ-share bruges kun ved komplet forsøg. Collector enabled=false bevares, indtil konkret modtager, syntetisk staging, aggregeret GET og ejerportal er verificeret og afstemt.
