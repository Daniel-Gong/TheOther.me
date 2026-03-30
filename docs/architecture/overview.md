# Architecture Overview

## Goal

Use one Firebase project (`theotherme-33e92`) for:

- iOS app
- website (`oria.me`)
- admin portal
- Cloud Functions and Firestore

## Key design

- Website is static (GitHub Pages) and calls Cloud Functions over HTTPS.
- Public growth writes are server-side via Functions (no direct browser writes to Firestore).
- Admin actions are protected by Firebase Auth ID token + custom claim `admin: true`.

## Main website runtime config

- `js/config/runtime-config.js` contains environment-level runtime values:
  - Firebase web config
  - Functions region/base URL
- `js/config/firebase-app.js` is the shared Firebase initializer used by web pages.

## Main backend growth modules

- `../TheOtherME/backend/functions/src/waitlist.ts`
- `../TheOtherME/backend/functions/src/referral.ts`
- `../TheOtherME/backend/functions/src/growthAdmin.ts`

## Data collections

- `newsletterSubscribers/{emailHash}`: website newsletter-only subscribers.
- `waitlist/{emailHash}`: waitlist entries plus attribution and status.
- `referralCodes/{code}`: user, waitlist, and marketing invite codes.

## Deep data model

For full Firestore schema, source-of-truth rules, and admin normalization details, see:

- [Firestore Data Model](./firestore-data-model.md)
