# Independent System

An offline-first RPG productivity tracker inspired by the broad ideas in Solo Mode System. This is an original starter project; it does not use the original product's branding or proprietary assets.

## Features in this starter
- Player dashboard with level, XP, Gold and daily login bonus
- Create and complete quests with Easy / Normal / Hard rewards
- Create and check daily habits
- Recent activity log
- Local device storage
- JSON backup export/import
- Installable PWA with a basic offline cache

## Run locally
You can open `index.html` in a browser for a quick preview. For service-worker/offline testing, use a local web server.

## Publish with GitHub Pages
1. Create a GitHub account and a new **public** repository named `independent-system`.
2. Extract this ZIP on your computer.
3. Upload the *contents* of this folder to the repository root (so `index.html` is at the top level).
4. In the repository, open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select branch `main`, folder `/ (root)`, then Save.
7. Wait for deployment. GitHub will show your site URL under Settings → Pages.

## Install on Android
1. Open the published HTTPS GitHub Pages URL in Chrome.
2. Open Chrome's menu and choose **Install app** or **Add to Home screen**.
3. Launch it from the new home-screen icon.

## Important notes
- This first version stores data in the browser on this device. Clearing browser/site data can remove it; export backups regularly.
- It is a PWA, not yet a native APK. A later phase can package it with Capacitor or rebuild it in Kotlin.
- XP and Gold values are starter defaults and can be customized in `app.js`.
- The Google Fonts import is optional; system fonts will be used if offline.
