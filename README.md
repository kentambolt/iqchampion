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
- After completion or timeout, Review answers shows a read-only overview of all 36
  questions as correct, incorrect or unanswered. Select a question or use Previous/Next
  to compare the submitted answer with the correct image and the original pattern.
  No answer is shown for skipped questions; their correct answer is still available.
  Reviewing never updates saved answers, timestamps or scores. Reload returns to the
  saved result, from which the review can be reopened, including older saved attempts.
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
Practice, seeing the correct answers and the ability to return to questions may change performance relative to
historical attempts; that limitation is disclosed in the result text.

## Verification

Run with Node.js (built-in test runner; no dependencies):

```sh
node --test checks/app.test.cjs
```

Checks cover the reference filter, low/partial/perfect scores, ties, late answers,
timeout, restart, practice isolation, reload before/after expiry, completed results,
invalid saves, storage failures, skipped questions, answer replacement, overview status,
manual completion, version 1 migration, read-only post-test review, exact answer-image
mapping, review after timeout/reload and stale submissions across tabs. They use a simulated clock and
DOM, so they do not replace visual browser testing. Check the intro, questions and
results at 320, 375, 760 and 1280 CSS pixels, including keyboard navigation.

## Hosting and project status

Part of Munthe Systems. Repository: https://github.com/kentambolt/iqchampion.
GitHub Pages publishes the root of `main` at https://iqchampion.com/ with HTTPS
enforced (configuration verified 13 November 2026). The project remains static, with no database,
mail/SMS service, login or payment infrastructure. Typography uses system fonts, with no external font request.

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

## Mobile readability iteration (14 November 2026)

The home screen now prioritises the challenge, three short facts and the practice
button. Instructions and reference details use separate expandable sections.
The test uses compact pattern/answer panels, a mobile timer header and an
expandable question overview. Results show the score and next actions first,
with methodology available on demand. Side gutters, text widths and left-aligned
body copy keep paragraphs readable. The existing scoring and timer are unchanged.

## Danish and English

The language switch is available on every screen. Both languages cover practice,
active and restored attempts, navigation, finish confirmation, results, methodology,
answer review, accessibility labels and recoverable storage errors. The saved
choice takes precedence over browser language; Danish browser locales default to
Danish and other browsers default to English. Language changes keep answers,
answer order and the original deadline unchanged. Locale preference uses a separate
localStorage key and remains usable if saving is blocked.

All translations are reviewed product copy in assets/i18n.js; no user data is sent
to a translation service. Numbers use the selected language's separators. The
product-owned feedback link follows ?lang=da/en and works even when the pinned
tracker is blocked. Automatic tracker feedback UI is disabled to avoid duplicate
links; telemetry and privacy opt-outs are otherwise preserved. The shared form
is maintained by the company project. There are no product transaction emails.

Validation: 38/38 app checks passed, including translation coverage, language
changes, reload, timeout, errors and review. Local real-browser flows passed at
actual 375px and 1280px widths with no horizontal overflow or console errors.
Preview analytics were disabled. The shared form now serves da/en HTML for
?lang=da/en, independently verified after the central release. Danish/English
shipped in PR3 (8ba5aeba); later releases retain the normal product checks.
The unfinished question-explanation iteration is excluded.

## Viewport layout iteration

Test artwork is capped at its original resolution and scales with viewport height
and width. Navigation shares one compact toolbar. Instructions, methodology, the
36-question overview and finish confirmation use a native dialog with keyboard
focus handling, Escape/close and preserved live DOM controls. Results, introduction,
practice and answer review are also compact on desktop/tablet. No body overflow is
hidden to manufacture a fit; scrolling remains available for small mobile screens,
zoom and longer dialog content. No question images, answers or scoring are changed.

38 existing app checks pass. Real browser measurements found no page or horizontal
overflow at 1366x768, 1280x720, 1024x600, 768x1024, 1024x768, 600x800 and 800x600 for the active test.
At 1024x600, introduction, practice, results and review also fit. At 375x812 the
active test retains vertical scrolling but has no horizontal overflow. Question
overview selection, continued work, finish, review and bilingual dialogs were
checked with actual controls. Preview analytics were disabled. Two SVG before/after
art studies are separate proposals, excluded from the deployed product.
