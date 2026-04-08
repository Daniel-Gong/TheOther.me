# Firebase Project Setup

## Required project

- Project ID: `theotherme-33e92`

## Required console setup

1. Ensure `oria.me` and `www.oria.me` are in Firebase Auth authorized domains.
2. Ensure a Web App exists in this same project (used by website runtime config).
3. Ensure Cloud Functions + Firestore are enabled.
4. Ensure `RESEND_API_KEY` secret is set for Functions.

## Runtime config file

Use `js/config/runtime-config.js` at runtime.

- `firebaseConfig.*` values from Firebase Web App
- `functionsRegion`
- `functionsBaseUrl`
- `appCheckSiteKey` (Firebase App Check reCAPTCHA v3 site key)

For GitHub Pages deploy, this file is generated in CI from workflow environment values (see `.github/workflows/static.yml`).

For local/dev preview:

1. Copy `js/config/runtime-config.example.js` to `js/config/runtime-config.js`
2. Fill in your project values

`js/config/runtime-config.js` is gitignored and should never be committed.

## Notes for GitHub Pages

- `_redirects` is not used by GitHub Pages.
- Dynamic invite URLs (`/invite/<code>`) are handled by `404.html` fallback + `invite.html` bootstrap logic.

## Required CI variables/secrets for runtime config generation

- `FIREBASE_API_KEY` (secret)
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`
- `FIREBASE_FUNCTIONS_REGION` (optional; defaults to `us-central1`)
- `FIREBASE_FUNCTIONS_BASE_URL`
- `FIREBASE_APP_CHECK_SITE_KEY`
