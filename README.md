# IQ Champion

Static visual reasoning challenge: 36 questions and a 40-minute time limit.
Open `index.html` in a browser; no build, server, account, or database is required.

## Test behavior

- An untimed, unscored practice puzzle explains the interaction before the real test.
  It uses a separate shape sequence and never contributes to the 36-question score.
- The deadline starts when Start 40-minute test is pressed. A visible countdown and a five-minute
  warning accompany automatic scoring at timeout. Switching tabs does not pause it.
- Questions can be skipped, revisited through Previous or the numbered overview,
  and answered again before finishing. Selecting an answer moves to the next
  unanswered question, wrapping around skipped questions. Previously selected answers
  are marked when revisiting. The overview shows answered/unanswered counts and status
  for all 36 questions, with the current question marked separately.
- Review and finish shows the unanswered count and asks for confirmation. Even when
  all questions are answered, the test stays open for review until explicitly finished
  or timed out. Unanswered questions count as incorrect.
- The original start timestamp, answers and current question are saved after starting,
  answering and navigating in `localStorage` (`iqchampion.attempt.v1`, payload version 2).
  Reloading resumes the same question with the original deadline; time spent with the
  page closed still counts. Version 1 saves migrate while preserving answers and time.
- Reopening an expired attempt immediately scores its stored answers. Completed
  results also survive reload. Try again opens untimed practice; only starting the
  next timed test replaces the previous saved attempt. Answer positions may shuffle
  again on reload. Use one tab; other tabs reconcile stored progress before accepting
  an answer or scoring a timeout, but localStorage is not a transactional multi-user store.
- Saving is local to this browser and origin, not an account or server backup.
  Clearing site data or using another browser removes access to the saved attempt.
  If saving is blocked or full, a visible message explains that progress may be lost;
  the test can still run in memory. Malformed or incompatible saved data is discarded.
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

Kent reports that participants were recruited through paid Facebook advertisements
and chose to take the test. This is a self-selected advertising sample. The historical
data do not quantify whether, or by how much, its cognitive performance differs from
the target population. No numerical selection-bias adjustment is applied. Establishing
one would require an independent reference sample and/or comparison against validated
measurements, with a defined target population and recruitment/nonresponse analysis.
Demographic identity alone is not a basis for adjusting an individual's result.

The historical duration field does not establish that identical timing rules were
enforced. The sample has not been established as representative. Results therefore
show raw score and participant percentile, without claiming a validated IQ estimate.
The old percentile conversion files are retained as historical data and are not loaded.
Practice and the ability to return to questions may change performance relative to
historical attempts; that limitation is disclosed in the result text.

## Verification

Run with Node.js (built-in test runner; no dependencies):

```sh
node --test checks/app.test.cjs
```

Checks cover the reference filter, low/partial/perfect scores, ties, late answers,
timeout, restart, practice isolation, reload before/after expiry, completed results,
invalid saves, storage failures, skipped questions, answer replacement, overview status,
manual completion, version 1 migration and stale submissions across tabs. They use a simulated clock and
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
