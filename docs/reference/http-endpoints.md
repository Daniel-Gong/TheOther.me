# HTTP Endpoints Reference

All endpoints are Firebase Functions under `functionsBaseUrl`.

## Public endpoints

### `POST /publicJoinWaitlist`

Purpose: website waitlist/newsletter intake.

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

## Backend source of truth

- `../TheOtherME/backend/functions/src/waitlist.ts`
- `../TheOtherME/backend/functions/src/referral.ts`
- `../TheOtherME/backend/functions/src/growthAdmin.ts`
