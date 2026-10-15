# Python + Flask example

Same flow as the Node example: Install URL → app user keys → user token → `GET /addressbooks` → Uninstall URL.

```bash
pip install flask requests
export SENDPULSE_APP_ID=your-app-id
export SENDPULSE_APP_SECRET=your-app-secret
export SESSION_SECRET=$(openssl rand -hex 32)
python app.py
```

Expose port 3000 over HTTPS and set Install URL `https://<your-host>/install`, Uninstall URL `https://<your-host>/uninstall`.
