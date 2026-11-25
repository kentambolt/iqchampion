# IQ Champion for Android

Product-owned Trusted Web Activity for https://iqchampion.com/, using Android Browser Helper 2.8.0. Package `com.iqchampion.app`, minimum API26, target API36. No login, advertising SDK, purchases or sensitive native permissions. Web analytics and optional feedback still require accurate Play Data Safety disclosure.

## Build

Use JDK17, Android SDK36 and the checksum-pinned Gradle8.13 wrapper. Set `JAVA_HOME`. `local.properties` is private machine configuration. Run `./build-release.ps1 -SdkPath <sdk>`. Upload signing uses IQ Champion's own local keystore and a Windows-user-protected DPAPI password, never another product's keys. Keys are ignored by Git. Arrange a protected recoverable backup before relying on this machine alone for future updates; DPAPI files are tied to the Windows identity.

The `.test` debug package uses a separate test key and `?qa=1` so it cannot journal real test-start notifications. Keep that guard and the shared tracker's QA/privacy exclusions. Do not create real production attempts for screenshots.

## Release gates

1. `npm test`, `npm run check:release`, `node tools/Build-Offline.cjs --check`; build, lint and bundletool validation.
2. Upload the signed AAB to the correct Play Console account. Record its app-signing SHA256 (not merely the upload certificate) in `/.well-known/assetlinks.json`.
3. Verify real HTTPS Digital Asset Links and download Google's signed universal APK. Check cold start, reopen and app link without suppressing verification. Test the 36-puzzle flow, saved deadline, language switching and offline restart on a disposable device with QA/capture protections.
4. Complete da/en store text, real native screenshots, icon/banner, privacy, audience, IARC and truthful Data Safety. Explicitly approve binding Google agreements when they are presented.
5. Distinguish uploaded/internal testing/review submitted/public availability in the project and company overview.

Do not remove `ManageDataLauncherActivity`: the helper's startup requires its manifest declaration. Keep backup disabled for the native wrapper. Browser storage and site data are managed by the TWA provider and are not necessarily removed when the wrapper is uninstalled.

## Offline assets

Run `npm run build:languages` then `node tools/Build-Offline.cjs` after changing public assets. The service worker downloads a fixed release snapshot, including all language packs and puzzles, after the first online load. It never caches external services, telemetry, submissions, feedback or Digital Asset Links. Updates wait for old tabs to close and never clear saved answers. A first-ever offline launch still requires a connection.
