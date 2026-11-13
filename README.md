# IQ Champion

Static visual reasoning challenge: 36 questions and a 40-minute time limit.
Open `index.html` in a browser; no build, server, account, or database is required.

## Test behavior

- The deadline starts when Start is pressed. A visible countdown and a five-minute
  warning accompany automatic scoring at timeout. Switching tabs does not pause it.
- Answers are final. Unanswered questions count as incorrect. Reloading clears the
  current attempt; Try again starts a fresh attempt with newly shuffled answer positions.
- This is a client-side challenge. The timer and answers are not protected against
  deliberate manipulation, and results are not suitable for verified rankings.

## Scoring and reference data

Each correct answer earns one point, for a total of 0–36. There is no guessing floor.
The reference group contains 10,216 historical attempts with recorded durations
greater than 60 seconds and no more than 2,400 seconds. Attempts outside that range
remain in the source data but are excluded from comparisons.

The reported percentile is `100 × (lower scores + same scores / 2) / group size`.
The result also reports the percentages scoring lower and scoring the same.
Nonzero percentages below 0.1 and percentages above 99.9 but below 100 are shown
as inequalities so rounding cannot imply zero or 100 percent.

The historical duration field does not establish that identical timing rules were
enforced. The visitors are not a representative population sample. Results therefore
show raw score and participant percentile, without claiming a validated IQ estimate.
The old percentile conversion files are retained as historical data and are not loaded.

## Verification

Run with Node.js (built-in test runner; no dependencies):

```sh
node --test checks/app.test.cjs
```

Checks cover the reference filter, low/partial/perfect scores, ties, late answers,
timeout, restart, and stale or invalid submissions. They use a simulated clock and
DOM, so they do not replace visual browser testing. Check the intro, questions and
results at 320, 375, 760 and 1280 CSS pixels, including keyboard navigation.

## Hosting and project status

Part of Munthe Systems. Repository: https://github.com/kentambolt/iqchampion.
GitHub Pages publishes the root of `main` at https://iqchampion.com/ with HTTPS
enforced (configuration verified 13 November 2026). The project remains static, with no database,
mail/SMS service, login or payment infrastructure. Google Fonts is an external asset.

The first iteration adds timing, corrected scoring, participant-based result text,
responsive grids and keyboard-accessible answer buttons. Pushes to `main` trigger
publication through the existing GitHub Pages configuration; no DNS change is needed. Next: visual checks on phones and
verification of the historical timing data before stronger score interpretations.

## Follow-up audit (13 November 2026)

Run `node checks/audit-reference.cjs` to regenerate `reports/reference-audit.json`.
The CSV contains 14,216 attempts; the JavaScript table used by the site contains
14,187. The 29 additional CSV rows all have perfect scores (36). There are no rows
exclusive to JavaScript. Neither the reason for that exclusion nor the original
collection/filtering process is documented in the available Git history. Keep the
datasets unchanged until their provenance is established.

Of the 3,840 JavaScript attempts exceeding 40 minutes, 2,573 are within the next
minute. This concentration could reflect recording/submission delays, but the data
cannot establish that explanation. The active 10,216-attempt comparison remains a
provisional duration-filtered group, especially at the highest scores.

Asset references include a release version to prevent an old stylesheet overriding
the new layout after publication. Update that version when changing shipped assets.
