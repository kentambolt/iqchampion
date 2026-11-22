# Languages and SEO — local draft, 22 November 2026

Production remains PR #12 / `150d549`. Nothing in this iteration has been deployed.

The draft supports a registry of 50 distinct primary languages, selected for broad international coverage and the product's European audience. This is an editorial selection, not a measured ranking of the world's top 50 languages. Native names are primary; a local SVG flag represents one associated country variant. Flags come from MIT-licensed flag-icons 7.6.0, with the license retained in images/flags.

**Complete packs: English and Danish (2/50). The other 48 translations remain pending.** The search dialog currently displays the planned catalog for local review. Do not publish it before all packs are complete. No English-only shells have been generated for the missing languages.

The frozen source corpus is reports/languages-20261122/source.json: 330 entries, including dynamic templates and all puzzle explanations, approximately 27,000 characters with stable markers. The automatic approval review rejected sending this unpublished product copy to Google Translate without specific permission. A question requesting that permission is pending. No product corpus has been sent. A short test used only already published phrases. No participant data is involved, and no new service account or paid subscription is proposed.

Local source infrastructure includes lazy-loaded self-hosted language packs, placeholder validation, preserved attempt/deadline state, language search, explicit RTL direction for Arabic/Hebrew/Persian/Urdu, and fixed LTR puzzle geometry. Feedback remains the existing Danish/English shared form, with a localized explanatory note for other languages.

SEO builds use real localized HTML routes, self-canonical URLs, reciprocal hreflang plus x-default, localized title/description/social metadata, truthful WebPage structured data and sitemap language alternates. Result/achievement share pages remain anonymous and noindex. No new tracking service or origin is added. Search ranking/indexing is not verified or promised.

Commands:

- `npm test`: functional/development checks, including the existing two complete routes.
- `node tools/Build-Language-Pages.cjs --ready-only --check`: check complete packs only during development.
- `npm run build:languages`: full 50-language build; fails if any pack is absent/incomplete.
- `npm run check:release`: strict full-catalog release gate. Currently fails deliberately at the missing Spanish pack.
- `node tools/Compile-Language-Pack.cjs <code> <source.json> <chunk.txt>...`: offline compiler; rejects missing/duplicate markers or changed placeholders.

Browser proof: desktop 1280×720 and mobile 390×844 language picker screenshots in reports/languages-20261122. Native search, Danish/English switch, retained finished result and dialog focus were verified. No real production attempt or notification was generated.

The independent statistics collector remains disabled pending the central receiver/staging/owner-portal agreement. Language routes only extend exact path validation on the existing origin; no demographic comparisons or collector activation are included.
