# Troubleshooting and FAQ

## `422` "Сonnect not found!" (code 5) on `/market-service/oauth/authorize`

- The `code` is older than 1 minute. Exchange it in the same request handler, before any slow work.
- The `code` was already used. Each open of the app sends a fresh code; don't reuse old ones.
- `app_id` or `secret` is wrong or from another app. Copy them from **Created → ⋯ → Edit**.

## `401 invalid_client` on `/oauth/access_token/market`

- You sent the user's account API keys instead of app user keys. Use `client_id` / `client_secret` from the authorization response.
- You called `/oauth/access_token` instead of `/oauth/access_token/market`.
- The user uninstalled the app; their keys are revoked.

## The app frame is blank

Your server or framework sends `X-Frame-Options: DENY`/`SAMEORIGIN` or a CSP without SendPulse in `frame-ancestors` (Helmet, Django, Rails and Laravel security middleware often do this by default). Allow `https://login.sendpulse.com` in `frame-ancestors`. Also check the browser console for mixed-content errors.

## User gets logged out on every click inside the app

Your session cookie is blocked as a third-party cookie inside the iframe. Pass a signed session token in the URL of every link and form, or set `SameSite=None; Secure; Partitioned` on the cookie.

## Install URL never receives the code

- URL must be public HTTPS (no self-signed certs, no localhost). Use a tunnel for local dev.
- SendPulse may call it with GET or POST. Handle both on the same route and read `code` and `lang` from the query string, with the body as fallback.
- Check the URL saved in the app settings has no typos and no trailing path mismatch.

## App works when opened but not in background jobs

You are not storing `client_id` / `client_secret`. Save them by `user_id` at install time and use them to get tokens later.

## Getting blocked or rate-limited

Cache tokens until `expires_in`; don't request a token per API call. Add backoff on `429`.

## Private app not visible to a user

Add their SendPulse **account email** in **App availability** (not a numeric ID). They will see it in **App directory → Available to me**.

## Error string comparison never matches

The documented `"Сonnect not found!"` starts with a Cyrillic `С`. Check `result === false` and the numeric `code` instead of the text.

## Users see each other's data

You identify users by a `user_id` in the URL or an unsigned cookie. Issue a signed session after the authorization flow. See [Security](16-security.md).

## Status is "Needs fix" or "Blocked"

Needs fix: the moderator's comments arrive at your support email; fix and resubmit. Blocked: contact SendPulse support. See [Manage your solutions](15-manage-solutions.md).

## Can I change public ↔ private later?

No. The solution type is fixed at creation. Create a new solution. Note: submitting a private app for review makes it public after approval.

## Where do I find App ID and Secret key?

**App directory → Created → ⋯ → Edit**.

## Is there a sandbox?

There is no separate sandbox environment. Use a private app in your own account (status Draft): it runs the same install, token and uninstall flows without moderation, against your real account data. Use a test account if you don't want to touch production data.

## Review timing

Up to 2 business days; results arrive at your support email.

## Support

https://sendpulse.com/support?utm_source=context7&utm_medium=docs&utm_campaign=dev-docs&utm_content=14-troubleshooting · Help Center: https://sendpulse.com/knowledge-base/app-directory/developers?utm_source=context7&utm_medium=docs&utm_campaign=dev-docs&utm_content=14-troubleshooting
