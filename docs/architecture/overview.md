# Architecture Overview

## Goal

Use one Firebase-backed system across:

- iOS app
- website (`oria.me`)
- admin portal
- Cloud Functions and Firestore

## Ownership Boundary

`oria.me` owns website pages, web runtime configuration, admin UI, and deployment workflow.

The sibling backend repo owns canonical backend contracts and backend internals:

- [TheOtherME backend docs](../../../TheOtherME/docs/backend/README.md)
- [TheOtherME integration docs](../../../TheOtherME/docs/integrations/oria-me.md)

## Key design

- Website is static (GitHub Pages) and calls Cloud Functions over HTTPS.
- Public growth writes are server-side via Functions (no direct browser writes to Firestore).
- Admin actions are protected by Firebase Auth ID token + custom claim `admin: true`.
- Web docs should describe how the website uses backend endpoints, not restate backend implementation internals.

## Main website runtime config

- `js/config/runtime-config.js` contains environment-level runtime values:
  - Firebase web config
  - Functions region/base URL
- `js/config/firebase-app.js` is the shared Firebase initializer used by web pages.

## Main website modules

- Landing/newsletter flow: `index.html` + `js/main.js`
- Invite deep-link landing: `invite.html` + `js/invite.js`
- Profile deep-link landing: `profile.html` + `js/profile.js`
- Admin surface: `admin/index.html`
- Optional local/dev proxy server: `server/server.js`

## Backend surfaces consumed here

- Public waitlist/newsletter endpoints
- Invite validation endpoint
- Admin waitlist and invite-code endpoints

For the canonical contract definitions and backend source files, use the sibling backend docs rather than this page.
