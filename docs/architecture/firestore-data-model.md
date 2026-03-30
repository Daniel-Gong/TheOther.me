# Firestore Data Model (Growth + Invites)

This document is the source of truth for how invite, waitlist, and referral data is stored and interpreted across:

- Website (`oria.me`)
- Admin portal (`/admin/`)
- Backend Cloud Functions (`../TheOtherME/backend/functions/src`)
- iOS app (`../TheOtherME/ios`)

## Why this exists

There are two different invite-limit systems that can look similar:

- Code-level limits: `referralCodes/{code}.maxUses` with redemption counter `referralCodes/{code}.uses`
- User-level limits: `users/{uid}/referral/info.maxInvites` with usage `users/{uid}/referral/info.invitesUsed`

For `codeType = user`, admins often need user-level values, not only code-level fields.

## Collections and documents

## `newsletterSubscribers/{emailHash}`

Website newsletter-only list. This is intentionally separate from waitlist.

Typical fields:

- `email`, `emailHash`
- `status` (`"subscribed"`)
- `referralCode` (optional)
- `attribution` (`source/medium/campaign/term/content/channel/landingPath/landingUrl/referrer`)
- `subscribedAt`, `updatedAt`

Writer:

- `waitlist.ts` via `POST /publicJoinNewsletter`

## `referralCodes/{code}`

Used by marketing, waitlist approvals, and user-generated referrals.

Common fields:

- `userId` (`string`): `"marketing"`, `"waitlist"`, or an actual user UID
- `codeType` (`string`): `"marketing" | "waitlist" | "user_generated"` (admin UI may normalize to `"user"`)
- `status` (`string`): typically `"active" | "paused" | "revoked" | "expired"`
- `isActive` (`boolean`)
- `uses` (`number`): redemption count
- `maxUses` (`number | null`): code-level cap; `null` means unlimited
- `benefit.trialDays` (`number`): days granted on successful use (fallback is 7 when absent)
- `attribution` (`object`): source/medium/campaign/term/content/channel
- `createdAt`, `updatedAt`, `expiresAt` (`Timestamp`)

Extra waitlist-oriented fields (when created from waitlist approval):

- `isWaitlistCode` (`boolean`)
- `waitlistEmail` (`string`)

Writers:

- `growthAdmin.ts`:
  - `adminCreateInviteCodes`
  - `adminApproveWaitlist` (creates waitlist codes)
  - `adminUpdateInviteCodeStatus`
  - `adminDeleteInviteCode`
- `referral.ts`:
  - `generateReferralCode` (user-generated code creation)
  - `applyReferral` (increments `uses`)

## `users/{uid}/referral/info`

Per-user referral state used by app and backend limits.

Important fields:

- `referralCode` (`string`)
- `maxInvites` (`number`, default 5 for user referrals)
- `invitesUsed` (`number`)
- `totalReferrals` (`number`)
- `pendingRewardDays` (`number`)
- `redeemedRewardDays` (`number`)
- `referredBy` / `referredByCode` for newly referred users
- `createdAt`, `updatedAt` (`Timestamp`)

Writers/readers:

- `referral.ts` (`generateReferralCode`, `applyReferral`, `getReferralStats`)
- iOS `ReferralService.swift` (`maxInvites`, `invitesUsed`, `invitesRemaining`)

## `users/{uid}/referral/info/referrals/{referredUserId}`

Audit/history records for successful referrals from a referrer.

Typical fields:

- `referredUserId`
- `referredUserDisplayName`
- `status`
- `rewardGranted`
- `rewardDays`
- `createdAt`

## `waitlist/{emailHash}`

Waitlist queue and approval status (not newsletter signup).

Typical fields:

- `email`, `position`, `status`
- `accessCode` (invite code assigned on approval)
- `approvedBy`, `approvedAt`, `emailStatus`, `emailedAt`
- `attribution` (`source/medium/campaign/term/content/channel/landingPath/landingUrl/referrer`)
- `createdAt`, `updatedAt`

Writers/readers:

- `waitlist.ts` (public join/list helpers)
- `growthAdmin.ts` (`adminListWaitlist`, approval and retry flows)

## Source-of-truth rules (important)

1. `trialDays` for invite application comes from `referralCodes/{code}.benefit.trialDays` when present, else fallback 7 in backend validation/apply paths.
2. For marketing and waitlist codes, `maxUses` usually comes from `referralCodes/{code}.maxUses`.
3. For user-generated codes, invite limits may be enforced by `users/{uid}/referral/info.maxInvites` and `invitesUsed` even when code doc has no `maxUses`.
4. Admin list views should not assume `maxUses` always exists on code docs for user codes.

## Admin listing normalization contract

`adminListInviteCodes` should return values ready for UI rendering:

- `codeType`: normalize to `marketing | waitlist | user`
- `uses`: for user codes, may be derived from `invitesUsed`
- `maxUses`: for user codes, may be derived from `maxInvites` when code-level cap missing
- `trialDays`: normalize from `benefit.trialDays` with fallback 7

This avoids false `∞` display for user-generated codes.

## Attribution mapping

Stored attribution object uses:

- `source`, `medium`, `campaign`, `term`, `content`, `channel`

Invite landing (`js/invite.js`) maps these to query params:

- `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`

If existing URL UTM params are already non-empty, they are preserved.

## Code locations

- Backend model logic:
  - `../TheOtherME/backend/functions/src/referral.ts`
  - `../TheOtherME/backend/functions/src/waitlist.ts`
  - `../TheOtherME/backend/functions/src/growthAdmin.ts`
- Website/admin consumers:
  - `admin/index.html`
  - `js/invite.js`
  - `js/main.js`
