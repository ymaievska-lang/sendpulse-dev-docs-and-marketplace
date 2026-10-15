# User access token

An app user token authorizes SendPulse REST API requests on behalf of one installing user, limited to the scopes they approved.

## Request

```http
POST https://api.sendpulse.com/oauth/access_token/market
Content-Type: application/json
```

```json
{
  "client_id": "b2bfd8a8441294fa0171c195ada8cf56",
  "client_secret": "f7064fb0bbecd392d7b3ea2e2bd77758",
  "grant_type": "client_credentials"
}
```

| Parameter | Type | Description |
|---|---|---|
| `client_id` | string | App user key from the [authorization flow](06-authorization-flow.md). |
| `client_secret` | string | App user key from the authorization flow. |
| `grant_type` | string | Always `client_credentials`. |

App user keys are **not** the API keys a user sees in their SendPulse account settings. They exist only for your app and are obtained only through the authorization flow.

Use the `/oauth/access_token/market` endpoint for app user keys. The regular `/oauth/access_token` endpoint is for a user's own account keys (Settings → API) and is not part of the marketplace flow.

| | Marketplace app | Direct API access |
|---|---|---|
| Who gets the keys | Your app, per installing user | Account owner, in Settings → API |
| Token endpoint | `POST /oauth/access_token/market` | `POST /oauth/access_token` |
| Access limited by | Scopes the user approved | Full account |
| Revoked when | User uninstalls the app | Owner deletes the key |

## Success `200`

```json
{
  "token_type": "Bearer",
  "expires_in": 7200,
  "access_token": "eyJ0eXAiOiJKV1Q...Bv1L"
}
```

| Field | Type | Description |
|---|---|---|
| `token_type` | string | `Bearer`. |
| `expires_in` | int | Lifetime in seconds. Read it from every response; don't hardcode a duration. |
| `access_token` | string | Token for the `Authorization` header. |

## Error `401 Unauthorized`

```json
{
  "error": "invalid_client",
  "error_description": "Client authentication failed",
  "message": "Client authentication failed"
}
```

Check the keys. If the user uninstalled the app, the keys are revoked and you must stop calling the API for that user.

## Caching

The token is short-lived. Cache it per user and refresh shortly before `expires_in` runs out. Do not request a token on every API call: frequent requests overload SendPulse and can get blocked.

```js
const cache = new Map(); // userId -> { token, exp }

async function getToken(userId) {
  const c = cache.get(userId);
  if (c && c.exp > Date.now() + 60_000) return c.token;
  const { client_id, client_secret } = await loadUserKeys(userId);
  const r = await fetch('https://api.sendpulse.com/oauth/access_token/market', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id, client_secret, grant_type: 'client_credentials' }),
  });
  if (!r.ok) throw new Error(`Token request failed: ${r.status}`);
  const j = await r.json();
  cache.set(userId, { token: j.access_token, exp: Date.now() + j.expires_in * 1000 });
  return j.access_token;
}
```

```python
_cache = {}

def get_token(user_id):
    c = _cache.get(user_id)
    if c and c["exp"] > time.time() + 60:
        return c["token"]
    keys = load_user_keys(user_id)
    r = requests.post(
        "https://api.sendpulse.com/oauth/access_token/market",
        json={**keys, "grant_type": "client_credentials"},
        timeout=10,
    )
    r.raise_for_status()
    j = r.json()
    _cache[user_id] = {"token": j["access_token"], "exp": time.time() + j["expires_in"]}
    return j["access_token"]
```
