# HTTP Endpoints Reference

All endpoints are Firebase Functions under `functionsBaseUrl`.

## Public endpoints

### `POST /publicJoinNewsletter`

Purpose: website newsletter intake (separate from waitlist queue).

Headers:

- `X-Firebase-AppCheck: <token>` (required)

Request body:

```json
{
  "email": "user@example.com",
  "referralCode": "ABC123",
  "attribution": {
    "source": "twitter",
    "medium": "social",
    "campaign": "spring_launch",
    "term": null,
    "content": null,
    "channel": "web",
    "landingPath": "/",
    "landingUrl": "https://oria.me/",
    "referrer": "https://x.com/"
  }
}
```

Response fields:

- `success`
- `alreadySubscribed`
- `emailHash`

### `POST /publicJoinWaitlist`

Purpose: waitlist intake (for waitlist flow, separate from newsletter).

Headers:

- `X-Firebase-AppCheck: <token>` (required)

Request body:

```json
{
  "email": "user@example.com",
  "referralCode": "ABC123",
  "attribution": {
    "source": "twitter",
    "medium": "social",
    "campaign": "spring_launch",
    "term": null,
    "content": null,
    "channel": "web",
    "landingPath": "/",
    "landingUrl": "https://oria.me/",
    "referrer": "https://x.com/"
  }
}
```

Protections:

- strict email validation
- dedupe by email hash in Firestore
- per-IP and per-email rate limiting

### `GET /validateInviteForLanding?code=XXXXXX`

Purpose: validate invite code before website deep-linking.

Headers:

- `X-Firebase-AppCheck: <token>` (required)

Response (example):

```json
{
  "valid": true,
  "code": "ABC123",
  "codeType": "marketing",
  "trialDays": 7,
  "attribution": {
    "source": "partner",
    "medium": "campaign",
    "campaign": "summer2026",
    "channel": "web"
  }
}
```

## Admin endpoints (require Bearer ID token with `admin: true`)

- `GET /adminListWaitlist?limit=100`
- `POST /adminApproveWaitlist`
- `POST /adminIgnoreWaitlist`
- `POST /adminRetryWaitlistEmails`
- `POST /adminCreateInviteCodes`
- `GET /adminListInviteCodes?limit=100`
- `POST /adminUpdateInviteCodeStatus`
- `POST /adminDeleteInviteCode`

### Admin invite-code payload notes

- `adminCreateInviteCodes` supports:
  - `count` (number of codes to create)
  - generated marketing codes are 6-character uppercase alphanumeric
  - `maxUses` (`0` or omitted means unlimited)
  - `trialDays` (1-60)
  - `source`, `medium`, `campaign`, `term`, `content`, `channel` attribution fields
- `adminListInviteCodes` returns per code:
  - `code`, `status`, `codeType`, `uses`, `maxUses`, `trialDays`, `attribution`
  - for `codeType=user`, when `referralCodes/{code}.maxUses` is absent, max usage is derived from `users/{uid}/referral/info.maxInvites` and usage from `invitesUsed`
- `adminUpdateInviteCodeStatus` supports editing:
  - `status`, `maxUses`, `trialDays`, `attribution`
- `adminDeleteInviteCode` hard-deletes `referralCodes/{code}`.

## Backend source of truth

- `../TheOtherME/backend/functions/src/waitlist.ts`
- `../TheOtherME/backend/functions/src/referral.ts`
- `../TheOtherME/backend/functions/src/growthAdmin.ts`
