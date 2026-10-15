# Install and user authorization flow

## When it runs

The flow starts every time the integration opens:

1. Right after the user clicks **Install** and approves the [scopes](05-scopes.md).
2. Every time the user clicks **View** next to your app in their SendPulse account.

On **Install** itself SendPulse only creates the connection and sends nothing extra. If the user declines the scopes, the app is not installed.

## Step 1. SendPulse sends a code to your Install URL

```http
GET  https://YOUR_INSTALL_URL/?code={code}&lang=en
POST https://YOUR_INSTALL_URL/?code={code}&lang=en
```

SendPulse can call the Install URL with **either GET or POST**. Handle both methods on the same route and read `code` and `lang` from the query string (fall back to the body for POST).

| Parameter | Type | Description |
|---|---|---|
| `code` | string | One-time code. **Valid for 1 minute.** |
| `lang` | string | User's SendPulse interface language. Use it to localize your UI. |

## Your app opens in an iframe

The Install URL is loaded **inside an iframe** in the SendPulse interface (App Directory runs on `https://login.sendpulse.com`). Your response is what the user sees, so finish steps 2–3 and then return or redirect to your app page.

Make sure the page can be framed and keeps working inside the frame:

- **Allow framing by SendPulse.** Don't send `X-Frame-Options: DENY` or `SAMEORIGIN`. Send `Content-Security-Policy: frame-ancestors https://login.sendpulse.com` instead. A blank frame almost always means the page refused to be framed.
- **Don't rely on ordinary cookies.** Inside an iframe your site is third-party: Safari and Firefox block third-party cookies by default and Chrome can too. Carry a signed, expiring session token in the URL of every in-app link and form, or use cookies with `SameSite=None; Secure; Partitioned`.
- **No top-level redirects for login.** Third-party sign-in pages (Google, your own SSO) often refuse to load in a frame. Open them with `window.open` or `target="_blank"` and return the result to the frame.
- **Stay HTTPS everywhere**, including assets: mixed content is blocked inside the HTTPS SendPulse page.
- **Design for the frame width.** Use the [UI Kit](10-ui-kit.md) and responsive layout; don't assume a full browser window.

## Step 2. Exchange the code for app user keys

```http
POST https://api.sendpulse.com/market-service/oauth/authorize
Content-Type: application/json
```

```json
{
  "app_id": "9b0f2f98-d75f-4562-887e-2b79bc8a1eee",
  "secret": "0d028163-9c84-40e4-8508-f4927badf735",
  "code": "21efd6b100b2602cb2d75cb06c2bf37f"
}
```

| Parameter | Type | Description |
|---|---|---|
| `app_id` | string | Your app's App ID. |
| `secret` | string | Your app's Secret key. |
| `code` | string | Code from step 1. |

### Success `200`

```json
{
  "result": true,
  "data": {
    "id": "9b0f56dd-4f4d-4792-ae20-23f99659b69e",
    "user_id": 7043663,
    "app_id": "9b0fdd98-d75f-4562-887e-2b79bc8a1eee",
    "client_id": "b2bfd8a8441294fa0171c195ada8cf56",
    "client_secret": "f7064fb0bbecd392d7b3ea2e2bd77758",
    "created_at": "2024-01-10T15:50:20.000000Z",
    "updated_at": "2024-01-10T15:50:20.000000Z"
  }
}
```

| Field | Type | Description |
|---|---|---|
| `id` | uuid | Connection ID for this user and app. |
| `user_id` | int | SendPulse user ID. Use it as the primary key of your user table. |
| `app_id` | uuid | Your app ID. |
| `client_id` | string | App user key. |
| `client_secret` | string | App user key. |
| `created_at` | datetime | First connection time. |
| `updated_at` | datetime | Last connection update. |

`client_id` and `client_secret` stay the same while the app is installed. Save them so your app can work in the background (cron jobs, webhooks) without the user opening it.

### Error `422 Unprocessable Entity`

```json
{
  "result": false,
  "data": null,
  "error": "Сonnect not found!",
  "code": 5
}
```

Usual causes: the code expired (> 1 minute), was already used, or `app_id`/`secret` are wrong.

Branch on `result === false` and the numeric `code`, not on the `error` string: in the documented response the first letter of `Сonnect` is a Cyrillic `С` (U+0421), so a string comparison with `"Connect not found!"` fails.

## Step 2.5. Start your own session

The authorization response is the only trusted proof of who the user is. After it, issue your own short-lived session (signed cookie or signed token) bound to `user_id`. Never identify the user by a plain `user_id` in the URL: anyone could change it and read another account's data.

Because the app runs in an iframe, third-party cookies may be blocked. The examples in this repo pass an HMAC-signed, 1-hour token in the `s` query parameter; when it expires, the user reopens the app and a fresh `code` starts a new session.

## Step 3. Get the user token

See [User access token](07-access-token.md).

## Sequence

```text
User        SendPulse                     Your server                       SendPulse API
 │  Install/View │                              │                                  │
 │──────────────▶│ POST INSTALL_URL?code&lang   │                                  │
 │               │─────────────────────────────▶│ POST /market-service/oauth/authorize
 │               │                              │─────────────────────────────────▶│
 │               │                              │◀──── client_id, client_secret ───│
 │               │                              │ POST /oauth/access_token/market   │
 │               │                              │─────────────────────────────────▶│
 │               │                              │◀──── access_token ───────────────│
 │◀──────────────┴──────── app page ────────────│                                  │
```

## Node.js

```js
app.all('/install', async (req, res) => {
  const code = req.query.code || req.body?.code;
  const lang = req.query.lang || 'en';
  const r = await fetch('https://api.sendpulse.com/market-service/oauth/authorize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      app_id: process.env.SENDPULSE_APP_ID,
      secret: process.env.SENDPULSE_APP_SECRET,
      code,
    }),
  });
  const json = await r.json();
  if (!json.result) return res.status(400).send('Authorization failed. Reopen the app from SendPulse.');
  await saveUserKeys(json.data.user_id, json.data.client_id, json.data.client_secret);
  const session = signSession(json.data.user_id); // HMAC-signed, expires in ~1 hour
  res.redirect(`/app?s=${encodeURIComponent(session)}&lang=${encodeURIComponent(lang)}`);
});
```

## Python

```python
@app.route("/install", methods=["GET", "POST"])
def install():
    code = request.args.get("code") or request.form.get("code")
    r = requests.post(
        "https://api.sendpulse.com/market-service/oauth/authorize",
        json={"app_id": APP_ID, "secret": APP_SECRET, "code": code},
        timeout=10,
    )
    data = r.json()
    if not data.get("result"):
        return "Authorization failed. Reopen the app from SendPulse.", 400
    save_user_keys(data["data"]["user_id"], data["data"]["client_id"], data["data"]["client_secret"])
    session = sign_session(data["data"]["user_id"])  # HMAC-signed, expires in ~1 hour
    return redirect(f"/app?s={quote(session)}")
```

## PHP

The `sendpulse/market-rest-api` package wraps this flow:

```bash
composer require sendpulse/market-rest-api
```

See [Custom Telephony Starter Kit](13-telephony-starter-kit.md) for a full Laravel project.
