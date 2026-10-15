# Node.js + Express example

Implements the full SendPulse App Directory flow: Install URL → app user keys → user token → REST API call (`GET /addressbooks`, scope `emails`) → Uninstall URL.

```bash
npm install
cp .env.example .env    # set SENDPULSE_APP_ID and SENDPULSE_APP_SECRET
npm start
```

Expose port 3000 over HTTPS and set in the app settings:

- Install URL: `https://<your-host>/install`
- Uninstall URL: `https://<your-host>/uninstall`

After authorization the server issues an HMAC-signed session token (1 hour), so users can't open each other's data by changing an ID in the URL. All values rendered into HTML are escaped.

Storage is in-memory. Replace the `users` map with an encrypted database table before production.
