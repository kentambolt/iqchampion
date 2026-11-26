# IQ Champion Android 1.0.0 · 25 November 2026

## Current distribution

Package `com.iqchampion.app`, versionCode1, targetAPI36/min26. Internal track4701756453409857763 is active; Console confirms “Available to internal testers”, released25November16:37. Only the separate IQ Champion - Kent list is selected (two owner-approved accounts). On26November the same accepted bundle was added to a production release with Danish/English release notes and all available countries, as explicitly requested by Kent. The reviewed validation shows only the existing non-blocking deobfuscation warning. Production review submission is being prepared; no public availability is claimed. The temporary Play name is `com.iqchampion.app (unreviewed)`.

Internal opt-in: https://play.google.com/apps/internaltest/4701756453409857763

Privacy, unrestricted app access, no ads/advertising ID, IARC (including PEGI3), audience13+, no government/financial/health features and the owner-approved Data Safety declaration are saved. On26November Kent specifically approved the AI classification; it is submitted with only `icon-512.png`, `feature-en.png` and `feature-da.png` marked and all four unedited native screenshots unmarked. The complete Danish/English listing now shows ready to send for review. The prior automatic-approval rejection is resolved by that specific owner approval. Data Safety is saved for review, not Google-approved. See `data-safety-plan.json` for the exact categories. The separate IQ result/comparison collector remains disabled.

Support `contact@iqchampion.com` is active through the shared Zoho EU owner mailbox, forwarded to the owner's Gmail with a retained Zoho copy. Company evidence: `docs/IQCHAMPION-MAIL.md`. Gmail relay accepted the external delivery test; inbox placement and outgoing mail are untested.

## Build and signing

Gradle debug/release builds, lint, bundletool validation and APK signature verification pass. Android Browser Helper2.8.0; native backup disabled and no sensitive permissions. Google app-signing SHA256:

`61:3D:03:D4:E1:12:6D:33:4E:CA:21:10:67:F9:B3:21:F2:6C:55:D0:86:A8:DD:C0:25:98:C4:34:8B:2B:8B:30`

The Google-signed universal APK downloaded from the accepted Console artifact is installed on the disposable API36 emulator. Public `/.well-known/assetlinks.json` matches, and `pm get-app-links` reports `iqchampion.com: verified`. No verification bypass, installer spoofing, Google login or Play-protection disabling was used. Play's missing deobfuscation-file warning is non-blocking: this build does not enable R8/minification. Keep upload keys outside Git and arrange a protected recoverable backup.

## Native QA

The user explicitly authorized ADB only on `iqchampion-api36` / emulator-5582 because ordinary native computer control stalled. Chrome was initialized without an account and usage/crash reporting disabled. All test attempts used `?qa=1`; QA guards suppress real notifications/analytics, including queued replay. No real emails, Facebook posts or participant submissions were generated.

Initial emulator System UI/Chrome ANRs and one incomplete image load prevented reliable results. After an approved emulator restart and a new complete web snapshot, the following real screens were observed:

- Answering question1 moves to question2 with one answer saved.
- Force-stopping only the own app and its Chrome, then cold reopening online, retains question2, one answer and the original deadline (35:15 remaining).
- Disabling emulator Wi-Fi and mobile data, closing both processes and cold reopening offline retains question2 and one answer (33:48 remaining), with all images rendered.
- Offline Danish/English changes retain the attempt and timer.
- Explicit early finish shows the confirmation (1answered/35unanswered), then the correct incomplete-result state: no invented IQ estimate.
- Review shows the submitted answer and actual correct answer; the explanation opens offline in Danish and English. Final answers remain read-only.

Screenshots in `reports/android-play-20261125/`: `native-cold-reopen-settled.png`, `native-offline-cold.png`, `store-question-da.png`, `store-question-en.png`, `store-explanation-da.png`, `store-explanation-en.png`. The four store screenshots are unedited720×1280 native captures, after setting the disposable display to that size/density220. Native review is allowed to scroll. Network was restored after closing the QA app. On26November Kent confirmed the real Play-installed Android app opens, accepts an answer and preserves that answer and original timer after closing/reopening. The phone's installed version was not separately read; version1.0.0/code1 is the only internal release. Kent also chose all available release countries.

## Upload-key recovery backup · 26 November

The own existing upload keystore and necessary recovery metadata/password were ZIP-packed only in memory and encrypted with the existing owner age recipient. Actual local decryption in memory, recovered keystore hash and keytool verification with the recovered password pass. No plaintext file, identity upload or other product key access. Original keystore/DPAPI files are retained. Ciphertext is4119bytes, SHA256 `d6dec76d56a2a2aae59adaa6a9614ff2e60f314bb6a0170dace1c9cb8bd9cbc8`. The private local receipt is under `android/.local/backups/receipt-20261126.json`; only ciphertext has been offered to the company team for its existing separate backup target. Automatic approval review blocked the off-device transfer before execution because it requires specific owner approval of the key/recovery payload and destination. The company chat has asked Kent for that exact approval; no transfer has occurred. An additional offline copy of the owner's age identity is not verified; recovery requires that existing identity.

## Web releases and checks

PR15 publishes PWA/Android support, privacy pages, domain association and QA-only telemetry guards. PR16 publishes aligned mobile controls/footer. PR17 publishes a single3,761,261-byte compressed offline snapshot (903assets,8,018,470originalbytes), SHA256 checked before cache installation, plus a5-second navigation fallback and explicit data-deletion contacts. No scoring or puzzle construction changed.

PR17: https://github.com/kentambolt/iqchampion/pull/17 · main `16905ba89faf685725a78bf4c0cfcea325900d0b` · Pages45645953412 success. Public privacy deletion section HTTP200 verified.120tests and strict50-language/share/SEO/offline checks pass. Fresh local browser with preview server stopped resumes question2/oneanswer/originaltimer and all rendered images. This is separate from native QA, not a substitute for it.

The existing public company portfolio image, Danish/English copy and web link remain accurate. Both public cards and their language-specific IQ links were checked25November15:52UTC (HTTP200); the image's SHA256 remains `72b756c2a453f69af4187224af5ee6ff61c12708f25e9956a9184b3aad64cf38`. Evidence: `reports/android-play-20261125/portfolio-checked.json`. Do not add a public Play link until the app is actually public. Record any later production review/submission or phone-test result as a new verified milestone.
