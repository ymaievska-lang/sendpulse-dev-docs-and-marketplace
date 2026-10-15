# Security checklist

## Secrets

- Keep `SENDPULSE_APP_ID` and `SENDPULSE_APP_SECRET` in server-side environment variables or a secret manager. Never in frontend code, mobile apps or git.
- Store each user's `client_id` / `client_secret` encrypted at rest.
- Never log tokens, secrets or full request bodies from `/install` and `/uninstall`.

## Endpoints

- Install URL and Uninstall URL: HTTPS only, valid public certificate.
- Exchange the `code` immediately and only once. Don't store it.
- Don't echo SendPulse error text or user data back into HTML without escaping.

## User sessions

- Identify the user only through the authorization response (`user_id`), then issue your own signed, expiring session.
- Never trust a `user_id` from a query string, form field or unsigned cookie.
- The app runs in an iframe inside SendPulse, so third-party cookies may be blocked. Use a signed, short-lived token in the URL or `SameSite=None; Secure; Partitioned` cookies.
- Tokens in URLs can leak through the `Referer` header: send `Referrer-Policy: no-referrer` (or `same-origin`) and keep the session TTL short.

## Framing

- Allow only SendPulse to frame your app: `Content-Security-Policy: frame-ancestors https://login.sendpulse.com`. This also protects against clickjacking from other sites.
- Don't send `X-Frame-Options: DENY` / `SAMEORIGIN`; it overrides nothing useful here and blanks the frame.

## Uninstall

- Match `app_id` to your own app and `client_id` + `client_secret` to the stored pair before deleting anything. The uninstall request carries no signature, so the stored key pair is your proof.
- Always return `200 OK`; make the handler idempotent.
- Delete the user's keys, cached tokens and scheduled jobs.

## Scopes

- Request the minimum set. Every extra scope widens the impact of a leak and slows moderation.

## Rate limits

- Cache tokens until `expires_in`; throttle to under 10 requests per second per user. See [Calling the API](09-calling-the-api.md#rate-limits).
