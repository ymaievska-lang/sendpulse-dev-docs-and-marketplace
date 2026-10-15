# Calling the SendPulse REST API from your app

Base URL: `https://api.sendpulse.com`
Auth header: `Authorization: Bearer {access_token}` (token from [User access token](07-access-token.md)).
Full method reference: https://sendpulse.com/integrations/api

Your app can call only the methods covered by the scopes the user approved.

## Example: list mailing lists (`emails` scope)

```bash
curl -s https://api.sendpulse.com/addressbooks \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

```js
async function listMailingLists(userId) {
  const token = await getToken(userId);
  const r = await fetch('https://api.sendpulse.com/addressbooks', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (r.status === 401) { invalidateToken(userId); throw new Error('Token expired or app uninstalled'); }
  return r.json();
}
```

```python
def list_mailing_lists(user_id):
    r = requests.get(
        "https://api.sendpulse.com/addressbooks",
        headers={"Authorization": f"Bearer {get_token(user_id)}"},
        timeout=10,
    )
    r.raise_for_status()
    return r.json()
```

## Background work

Because `client_id` / `client_secret` persist while the app is installed, you can call the API from cron jobs, queues or incoming webhooks without the user opening your app: load the user's keys → get or reuse a cached token → call the API.

## Rate limits

Limits depend on the SendPulse pricing plan of the account you call on behalf of:

| Plan | Requests per minute | Requests per day |
|---|---|---|
| Free | 1,000 | 500,000 |
| Standard | 2,000 | 1,000,000 |
| Enterprise | 3,000 | 3,000,000 |

Exceeding a quota returns `429 Too many requests`. A separate error code `2020202020` means more than 10 requests per second. Throttle per user to stay under 10 RPS, and cache tokens: a token request is a request too.

## Error handling

| Status | Meaning | What to do |
|---|---|---|
| `401` | Token expired, invalid, or app uninstalled | Drop the cached token, request a new one once; if it fails again, mark the user inactive. |
| `4xx` on a method from another tool | The method is outside the scopes the user approved | Add the scope in app settings; check which scope covers the method in [Scopes](05-scopes.md). |
| `429` | Quota exceeded | Back off (exponential, with jitter) and retry. Batch where the API allows it. |
| `5xx` | Temporary server error | Retry with exponential backoff. |

Many API errors also carry a numeric SendPulse code with a description, for example `8` No data, `707` account balance depleted, `800` invalid operation. Full table: https://sendpulse.com/integrations/api

## Which methods your app can call

See the API reference linked for each scope in [Scopes](05-scopes.md).
