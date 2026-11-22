# Languages and SEO — 22 November 2026

The local PR #13 iteration now contains **50 complete language packs**. Production is still PR #12 until the normal product release is performed. The separate statistics collector remains disabled.

The catalog selects 50 distinct primary languages for broad international reach and the European audience; it is an editorial selection, not a measured global ranking. Each choice displays its native name and one associated country flag. MIT-licensed flag-icons 7.6.0 SVGs are self-hosted with their license; no flag CDN or translation service is called by visitors.

Kent specifically approved Google Translate for the approximately 27,000 characters of product UI and explanations, including unpublished draft copy. Translations were captured from the normal Google Translate UI; no participant data, age, country, answer, account credential or new paid subscription was involved. English/Danish remain maintained originals. The other 48 packs are machine translated with structural checks and targeted corrections, **not professionally proofread by native speakers in all 48 languages**.

The frozen corpus has 330 entries, including all 36 puzzle explanations and 27 dynamic templates. The importer requires complete ordered blocks, logs marker spelling repairs, preserves dynamic placeholders and product naming, and applies four explicit copy corrections (Bulgarian/Hausa missing braces, an omitted Telugu fragment and a Korean variable converted to a fixed number). Brand inflections are corrected for Tamil/Malayalam. Raw captures, import audit and correction sources remain reproducible. Numerical-copy differences were inspected: non-Latin translations may spell numbers out, and the existing Danish explanation already spells out the 3-by-3 grid. No puzzle assets, answer keys or norm data changed.

The introduction shows the historical attempt count as a separate short phrase, avoiding word-order problems from translating a sentence around an inserted number. Cohort size/filter and methodological qualifications are unchanged.

Runtime: self-hosted lazy packs; validated messages/templates before applying; native searchable picker; restored saved/browser preference even from the root URL; explicit RTL for Arabic/Hebrew/Persian/Urdu; LTR pattern rows and answer grids. Answers and original deadline survive language switches/reloads. Failed loads leave the current test intact. Feedback remains the existing da/en form with an explicit localized note for other languages.

SEO: all 50 real localized HTML routes have self-canonical URLs, reciprocal hreflang/x-default, localized title/description/social metadata, truthful WebPage schema and sitemap alternates. Anonymous score/question/pattern share routes are localized and noindex. The 404 is noindex. Indexing/ranking has not been measured or promised. Existing tracker pin/SRI, origin, DNT/GPC/bot/QA handling and neutral product branding are preserved.

Validation:

- 110 automated tests pass, including all-pack coverage/placeholders, product naming, 50 static routes/metadata/share privacy, RTL, state preservation and failed-load recovery.
- Full 50-language release generation/check passes. Ready-only mode exists solely for incomplete development work.
- Browser: all 50 test layouts at 1280×720 fit without horizontal/vertical scroll; all 50 home and test layouts at 1024×600 fit. Active attempt stayed on question 2 during all language switches with its original running timer.
- Initial desktop home check exposed overflow in Bengali/Tamil; content-aware compact spacing/font sizing resolves longer translations. Test tile sizing reserves the actual translated controls' height on laptops/tablets. Mobile retains readable figures and may scroll vertically.
- Nine mobile languages checked on home/test at 390×844 with no horizontal overflow. Arabic finish/partial-result/share/review/explanation flow and root-language restoration were checked without console errors. This is browser viewport testing, not a new physical Android test.
- Screenshots and JSON measurements are in reports/languages-20261122. No real production test-start notification or statistics contribution was generated.

Commands: npm test; npm run build:languages; npm run check:release. Offline tooling: tools/Compile-Language-Pack.cjs, tools/Import-Captured-Translations.cjs and tools/Translation-Corrections.json.

Release work still required: publish the completed product PR through its existing gates, verify public routes/assets/feedback, update company status as live only after evidence, and refresh the public portfolio from the actual published light design. Central statistics collection/benchmarks remain a separate disabled integration pending receiver/staging/owner-portal agreement.
