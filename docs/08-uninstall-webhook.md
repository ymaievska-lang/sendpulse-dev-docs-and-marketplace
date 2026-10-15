# Uninstall webhook

When a user uninstalls your app, SendPulse sends a POST request with the user's connection data to your **Uninstall URL**.

## Request from SendPulse

```http
POST https://YOUR_UNINSTALL_URL
Content-Type: application/json
```

```json
{
  "id": "9b0f56dd-4f4d-4792-ae20-23f99659b69e",
  "user_id": 7043663,
  "app_id": "9b0fdd98-d75f-4562-887e-2b79bc8a1eee",
  "client_id": "b2bfd8a8441294fa0171c195ada8cf56",
  "client_secret": "f7064fb0bbecd392d7b3ea2e2bd77758",
  "created_at": "2024-01-10T15:50:20.000000Z",
  "updated_at": "2024-01-10T15:50:20.000000Z"
}
```

| Field | Type | Description |
|---|---|---|
| `id` | uuid | SendPulse user / connection ID. |
| `user_id` | int | SendPulse user ID. |
| `app_id` | uuid | Your app ID. |
| `client_id` | string | App user key being revoked. |
| `client_secret` | string | App user key being revoked. |
| `created_at` | datetime | First connection time. |
| `updated_at` | datetime | Last connection update. |

## Your response

Return `200 OK`. The connection is removed **regardless of your response**: after uninstall your app can no longer access this user's data.

## What to do on receipt

- Delete or deactivate the stored `client_id` / `client_secret` and cached tokens for that user.
- Stop background jobs and outgoing webhooks for that user.
- Verify the request: match `app_id` to yours and `client_id` + `client_secret` to the pair you stored. Ignore requests that don't match.
- Make the handler idempotent: a repeated request for an already removed user should still return `200`.

```js
app.post('/uninstall', express.json(), async (req, res) => {
  const { user_id, app_id, client_id, client_secret } = req.body || {};
  if (app_id === process.env.SENDPULSE_APP_ID) {
    const stored = await loadUserKeys(user_id);
    if (stored && stored.client_id === client_id && stored.client_secret === client_secret) {
      await deleteUser(user_id);
    }
  }
  res.sendStatus(200);
});
```
