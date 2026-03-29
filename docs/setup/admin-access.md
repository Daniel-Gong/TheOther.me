# Admin Access Setup

## Auth model

- Admin portal uses Firebase Auth sign-in.
- Backend admin APIs require ID token with custom claim:
  - `admin: true`

## One-time admin claim bootstrap

Use Firebase Admin SDK, Cloud Functions admin utility, or secure script to set claims.

Expected claim:

```json
{ "admin": true }
```

### Included reusable script

From `../TheOtherME/backend/functions`:

- Grant: `npm run admin:claim -- grant user@example.com`
- Revoke: `npm run admin:claim -- revoke user@example.com`
- Check: `npm run admin:claim -- check user@example.com`

If running locally, make sure Admin SDK credentials are available (for example via `GOOGLE_APPLICATION_CREDENTIALS`).

## Verify admin access

1. Sign in at `/admin/`.
2. Portal should load waitlist and invite-code data.
3. If sign-in works but data load fails with `403`, claim is missing.

## Security expectations

- Do not expose admin secrets in website code.
- Keep admin endpoints token-validated server-side only.

## Public growth endpoint protections

The public waitlist and invite validation flow now expects:

- Firebase App Check token (`X-Firebase-AppCheck`)
- Server-side request validation and dedupe
- Per-IP and per-email rate limiting
