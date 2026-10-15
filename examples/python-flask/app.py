"""Minimal SendPulse App Directory app in Flask: install -> keys -> token -> API call -> uninstall.
In-memory storage for the demo; use an encrypted database table in production."""
import hashlib
import hmac
import html
import os
import secrets
import time
from urllib.parse import quote

import requests
from flask import Flask, redirect, request

API = "https://api.sendpulse.com"
APP_ID = os.environ["SENDPULSE_APP_ID"]
APP_SECRET = os.environ["SENDPULSE_APP_SECRET"]
SESSION_SECRET = os.environ.get("SESSION_SECRET") or secrets.token_hex(32)

app = Flask(__name__)
users = {}   # user_id -> {"client_id", "client_secret"}
tokens = {}  # user_id -> {"token", "exp"}


@app.after_request
def iframe_headers(resp):
    # The app is shown in an iframe on login.sendpulse.com: allow only SendPulse to frame it,
    # and keep the session token in the URL from leaking via Referer.
    resp.headers["Content-Security-Policy"] = "frame-ancestors https://login.sendpulse.com"
    resp.headers["Referrer-Policy"] = "no-referrer"
    return resp


def sign_session(user_id, ttl=3600):
    exp = int(time.time()) + ttl
    mac = hmac.new(SESSION_SECRET.encode(), f"{user_id}.{exp}".encode(), hashlib.sha256).hexdigest()
    return f"{user_id}.{exp}.{mac}"


def verify_session(s):
    try:
        user_id, exp, mac = (s or "").split(".")
        good = hmac.new(SESSION_SECRET.encode(), f"{user_id}.{exp}".encode(), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(mac, good) or int(exp) < time.time():
            return None
        return int(user_id)
    except ValueError:
        return None


def exchange_code(code):
    r = requests.post(
        f"{API}/market-service/oauth/authorize",
        json={"app_id": APP_ID, "secret": APP_SECRET, "code": code},
        timeout=10,
    )
    j = r.json()
    if not j.get("result"):
        raise RuntimeError(f"authorize failed: HTTP {r.status_code}, code {j.get('code')}")
    return j["data"]


def get_token(user_id):
    c = tokens.get(user_id)
    if c and c["exp"] > time.time() + 60:
        return c["token"]
    keys = users.get(user_id)
    if not keys:
        raise RuntimeError("User is not connected. Reopen the app from SendPulse.")
    r = requests.post(
        f"{API}/oauth/access_token/market",
        json={**keys, "grant_type": "client_credentials"},
        timeout=10,
    )
    r.raise_for_status()
    j = r.json()
    tokens[user_id] = {"token": j["access_token"], "exp": time.time() + j["expires_in"]}
    return j["access_token"]


def sp_get(user_id, path):
    r = requests.get(f"{API}{path}", headers={"Authorization": f"Bearer {get_token(user_id)}"}, timeout=10)
    if r.status_code == 401:  # refresh once
        tokens.pop(user_id, None)
        r = requests.get(f"{API}{path}", headers={"Authorization": f"Bearer {get_token(user_id)}"}, timeout=10)
    r.raise_for_status()
    return r.json()


@app.route("/install", methods=["GET", "POST"])
def install():
    code = request.args.get("code") or request.form.get("code")
    lang = request.args.get("lang") or request.form.get("lang") or "en"
    if not code:
        return "Missing code", 400
    try:
        data = exchange_code(code)  # first thing: the code lives 1 minute
    except Exception as e:  # noqa: BLE001
        app.logger.error(str(e))  # never log secrets or tokens
        return "Authorization failed. Reopen the app from SendPulse.", 400
    users[data["user_id"]] = {"client_id": data["client_id"], "client_secret": data["client_secret"]}
    return redirect(f"/app?s={quote(sign_session(data['user_id']))}&lang={quote(lang)}")


@app.get("/app")
def app_page():
    user_id = verify_session(request.args.get("s"))
    if not user_id:
        return "Session expired. Reopen the app from SendPulse.", 401
    try:
        lists = sp_get(user_id, "/addressbooks")
        rows = "".join(
            f"<tr><td>{html.escape(str(l.get('id')))}</td><td>{html.escape(str(l.get('name')))}</td>"
            f"<td>{html.escape(str(l.get('all_email_qty', '')))}</td></tr>"
            for l in (lists if isinstance(lists, list) else [])
        ) or '<tr><td colspan="3" class="text-muted">No mailing lists yet</td></tr>'
    except Exception as e:  # noqa: BLE001
        rows = f'<tr class="danger"><td colspan="3">{html.escape(str(e))}</td></tr>'
    return f"""<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://cdn.sendpulse.com/dist/css/sp-marketplace-app-ui.min.css">
<title>My SendPulse app</title></head><body><h2>Your mailing lists</h2>
<table class="table blue-table"><thead><tr><th>ID</th><th>Name</th><th>Contacts</th></tr></thead>
<tbody>{rows}</tbody></table></body></html>"""


@app.post("/uninstall")
def uninstall():
    body = request.get_json(silent=True) or {}
    uid = body.get("user_id")
    stored = users.get(uid)
    if (body.get("app_id") == APP_ID and stored
            and stored["client_id"] == body.get("client_id")
            and stored["client_secret"] == body.get("client_secret")):
        users.pop(uid, None)
        tokens.pop(uid, None)
    return "", 200


if __name__ == "__main__":
    app.run(port=int(os.environ.get("PORT", 3000)))
