# Deploy and Verify

## Deploy order

1. Deploy backend Functions first.
2. Deploy website (GitHub Pages) after Functions are healthy.

## Backend deploy

From `../TheOtherME/backend/functions`:

- `npm run build`
- deploy with your standard Firebase target (staging/prod alias)

## Website deploy

- Push to `main` to trigger GitHub Pages workflow.
- Confirm deployed artifact includes:
  - `js/config/runtime-config.js`
  - `js/config/firebase-app.js`
  - updated `js/main.js`, `js/invite.js`, `admin/index.html`

## Smoke tests

1. **Homepage waitlist submit**
   - Submit email on `/#newsletter`.
   - Verify success response and entry in Firestore `waitlist`.
   - Verify invalid email or excessive retries are blocked.
2. **Invite validation**
   - Open `/invite/<code>`.
   - Verify invalid code is blocked and valid code deep-links/fallbacks correctly.
   - Verify request succeeds with valid App Check token.
3. **Admin auth**
   - Sign in at `/admin/`.
   - Verify waitlist load + create marketing codes works.
4. **Email flow**
   - Approve waitlist entries and confirm email send status updates.

## Rollback notes

- If public endpoints fail, website should still show non-crashing fallback UI.
- Revert website deploy independently from backend if needed.
