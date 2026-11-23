# Viewport layout — 23 November 2026

The outer rounded/shadowed presentation card is removed on mobile, tablet and desktop. The actual viewport is the page boundary. Inner gutters retain readable text/buttons, while header, introduction and test content use the full page height. The footer sits at the bottom when content fits and follows content on shorter screens, without covering controls.

Desktop content stays within a centered reading width. Introduction copy/art are vertically balanced; mobile groups distribute spare height. Test patterns occupy the available space between the question header and navigation. Existing puzzle cards, language packs, answers, scoring, timer/storage and disabled central collector are unchanged.

Validation:

- 110 existing tests pass; all 50 language pages and anonymous share pages were regenerated with a new CSS cache version.
- Browser measurements: all 50 home and test layouts at 1024×600 fit with the footer at the bottom; all 50 test layouts at 600×800 also fit.
- Desktop home screenshot 1440×900 and test 1280×720; mobile homes at 390×844 and 430×932. Main border/radius are zero, no outer margin or shadow. Footer reaches viewport bottom.
- Five languages checked at 320×568 without horizontal scrolling. Vertical scrolling remains intentional when small/mobile screens cannot fit readable content.
- Evidence: reports/edge-to-edge-20261123. Only synthetic local attempts were started; no real production test-start notification was generated.

Publish through the normal PR/Pages process, verify the real site and refresh the existing portfolio screenshot from that release. Company status must distinguish local proof from public deployment.
