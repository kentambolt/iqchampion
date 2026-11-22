# Forslag: IQ-sammenligninger v1 · 22. november 2026

**Forslag, ikke livekontrakt. Collector skal forblive deaktiveret, indtil selskabsforløbet har godkendt schema, origin og privacy-/kohortegrænser, udgivet modtageren og verificeret syntetisk staging.** Ingen rå svar/demografi/attempt-ID sendes gennem den generiske tracker eller ntfy.

## Formål og samtykke

Lokale personlige opgavetider og basisdeling kræver intet bidrag. En separat, umarkeret samtykkeboks forklarer, at anonym teststatistik og eventuelt valgte aldersgruppe/land indgår i sammenligninger. Indsendelse sker kun på brugerens eksplicitte klik efter finish eller timeout, også ved delvise tests. Aldersgruppe og land er frivillige; ingen navn, præcis alder, fødselsdato, email, IP/UA, rå svar eller vedvarende besøgs-ID gemmes. DNT/GPC/bot/preview skal blokere transport. Intet historisk forsøg får opfundne opgavetider.

## Foreslået separat API

`POST /systems/v1/iq-attempts` på munthesystems.dk, credentialless CORS for præcis https://iqchampion.com; ingen frontendnøgle. Højst 8192 bytes. Eksakte felter:

```json
{"version":1,"id":"canonical UUID pr. afsluttet forsøg","puzzle_version":3,"completion":"finished","elapsed_ms":120000,"questions":[{"question":1,"status":"correct","active_ms":5000,"answer_ms":5000,"changes":1}],"demographics":{"age_group":null,"country":null}}
```

questions indeholder præcis alle 36 entydige id'er 1–36, sorteret. status=correct/incorrect/unanswered. active_ms er aktiv, synlig/fokuseret opgavetid, ikke vægtid; answer_ms er kumuleret tid indtil sidst gemte svar og er null ved ubesvaret. changes er antal gemte svar, ikke klik på et vist facit. Alle tider er heltal 0–2400000, answer_ms<=active_ms og samlet active_ms<=elapsed_ms<=2400000. completion=finished/timeout. Kun kendte puzzle_version: historiske data med ændrede regler må ikke blandes. Tider under1000ms og mistænkelige/ufuldstændige målinger udelades fra hastighedssammenligning; svarstatus kan stadig indgå i optælling. Klientrapporteret test uden anti-cheatgaranti.

age_group=null/under18/18-24/25-34/35-44/45-54/55-64/65plus. country=null eller allowlistet ISO3166-1 alpha2. Grove dimensioner; ikke landenes gennemsnitlige IQ eller befolkningspåstande.

Første atomiske optælling202 `{accepted:true,id,duplicate:false}`; identisk genforsøg200 duplicate:true; ændret payload med samme id409. Samme payload bevares ved netværksgenforsøg; ingen automatisk ændring af demografi efter accept. Dedupe lagrer id/hash/retention, ikke en brugerprofil. Ingen modtagerkvittering uden varigt commit. Perioderetention og quotas fastlægges centralt (forslag90dage aggregater/7dage dedupe).

`GET /systems/v1/iq-comparisons?version=3[&age_group=...][&country=...]` giver **kun aggregater**. Forslag:

```json
{"version":1,"puzzle_version":3,"sample_size":120,"minimum_sample":30,"period_days":90,"questions":[{"question":1,"answered":100,"correct":70,"timed_correct":60,"median_correct_ms":14000}]}
```

Ingen små kohorter/rå rækker; ved n<30 returneres utilstrækkeligt-grundlag. Opgavens korrektandel kræver mindst30 besvarelser, korrekt-tidsmedian mindst30 gyldige korrekte tider. Ubesvarede slutopgaver vises separat og bruges ikke alene som sværhedsbevis. Land/alder afspejler frivillige bidrag, ikke repræsentativ norm. Endpoint/schema/detailgrænser afstemmes før aktivering. Ingen påstand om hurtigere end X procent ud fra en median alene; klienten viser egen tid/median/sampletal.

## Ejerportal

Selskabsforløbet ejer eksisterende loginbeskyttede IQ-statistik: gennemførte/delvise forsøg pr. dag, korrekt/forkert/ubesvaret pr. opgave, korrektrate blandt besvarede, gyldige korrekte tider/median og demografisk dækning med små-gruppegrænser. Ingen rå deltagerrækker eller individuel profil. Bevar staging-/produktionsadskillelse og eksisterende Google/Origin/CSRF-grænser.

## Deling

Statiske da/en-opgaveshares på iqchampion.com samt kopiértekst med egen tid. Ingen offentlig token-/demografiprofil eller automatisk Facebook-publicering. Eksisterende IQ-share bruges kun ved et komplet forsøg. Bedste highlight vælges ud fra gyldigt eget resultat og reelle versionsmatchende aggregater; uden sammenligningsdata vises kun egen præstation med tydelig mangel på sammenligning.
