# Custom Telephony Starter Kit (PHP / Laravel)

Connect any third-party telephony provider to SendPulse CRM: click-to-call from CRM, call pop-ups, tasks for missed calls. The kit ships ready routes, Laravel examples, Docker, and uses the `sendpulse/market-rest-api` package for the marketplace auth flow.

Package: https://packagist.org/packages/sendpulse/market-rest-api

## Requirements

- PHP 8.2+, Composer.
- A database for state and queues (recommended).
- Docker / Docker Compose for local deployment (optional).

## Configure

Create `.env` in the project root:

```dotenv
SENDPULSE_APP_ID=your-app-id
SENDPULSE_APP_SECRET=your-app-secret
APP_URL=https://your-domain.example
```

```bash
composer install
docker compose up -d   # optional
```

## Register with SendPulse

Contact SendPulse support with:

- application name;
- application ID;
- icon, PNG 64×64 px;
- URL for call initiation.

## Authentication

The built-in `install` route receives `code`, exchanges it with `SENDPULSE_APP_ID` / `SENDPULSE_APP_SECRET` for `client_id` / `client_secret`, then gets the user's token. Same as [Authorization flow](06-authorization-flow.md) and [User access token](07-access-token.md).

## Routes

### Call initiation — `POST /custom-telephony/call`

SendPulse CRM calls it when the user starts a call; your code passes it to the telephony provider.

```json
{
  "integrationId": 123,
  "phone": "+380631234567"
}
```

| Field | Type | Description |
|---|---|---|
| `integrationId` | number | Solution integration ID. |
| `phone` | string | Phone in international format. |

Return `200 OK` on success.

### Telephony webhooks — `POST /custom-telephony/webhooks`

Map your provider's events to these parameters (exact set depends on the provider):

| Field | Type | Description |
|---|---|---|
| `call_id` | string | Unique call ID. |
| `event` | string | Call start or call end. |
| `type` | string | Incoming or outgoing. |
| `phone` | string | International format. |
| `duration` | number | Call duration. |
| `is_success` | boolean | Whether the call connected. |
| `token` | string | Webhook authorization token. |

Missed call → CRM creates a task. Call end → the call pop-up closes.

### Uninstall — `POST /custom-telephony/uninstall`

Removes the app user. See [Uninstall webhook](08-uninstall-webhook.md).

### Auth test — `GET /api/boards`

Returns CRM boards as JSON to check that auth and REST calls work.

## Project structure

```text
app/
  Controllers/
  Models/
  Repositories/
  Requests/
routes/
  web.php
  api.php
```
