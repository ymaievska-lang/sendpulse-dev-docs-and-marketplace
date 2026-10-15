# Quickstart: first SendPulse app in 15 minutes

Goal: a private app that installs in your own SendPulse account and lists your mailing lists through the REST API.

## 1. Run an HTTPS endpoint

Use one of the examples and expose it over HTTPS (for local development, a tunnel such as ngrok or cloudflared works).

```bash
cd examples/node-express
npm install
cp .env.example .env   # fill SENDPULSE_APP_ID and SENDPULSE_APP_SECRET after step 3
npm start              # listens on :3000
ngrok http 3000        # gives https://<id>.ngrok-free.app
```

## 2. Create a developer account

In SendPulse go to **App directory → Home → + Become developer** and enter a developer name.

## 3. Add the app

1. Click **Add solution** → choose **Private app** → **Continue**.
2. **Name**: `My first app`. **SendPulse tool**: Email. **Scopes**: `emails`.
3. **Install URL**: `https://<id>.ngrok-free.app/install`
4. **Uninstall URL**: `https://<id>.ngrok-free.app/uninstall`
5. Add description, support email, Privacy Policy link, logo → **Save**.
6. Open **App directory → Created → ⋯ → Edit**, copy **App ID** and **Secret key** into `.env`, restart the server.

## 4. Find the app

As the creator you already have access to your private app: it appears under **App directory → Available to me**. To let a teammate test it, add their SendPulse account email in the **App availability** tab.

## 5. Install and open

Click **Install**, approve the scope. SendPulse sends `code` to `/install`. The example server:

```text
code ──POST /market-service/oauth/authorize──▶ client_id, client_secret (saved)
client_id/secret ──POST /oauth/access_token/market──▶ access_token
access_token ──GET /addressbooks──▶ your mailing lists (rendered on the page)
```

If the page shows your mailing lists, the whole flow works. Clicking **View** next to the app later repeats the same flow with a new `code`.

## 6. Uninstall

Remove the app in SendPulse. Your `/uninstall` endpoint receives the user's data; the example deletes stored keys and returns `200 OK`.

Next: [Create an app — every field](04-create-app.md), [Authorization flow](06-authorization-flow.md).
