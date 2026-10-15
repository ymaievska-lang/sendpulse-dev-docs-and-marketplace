// Minimal SendPulse App Directory app: install → keys → token → API call → uninstall.
// Storage is in-memory for the demo. Use an encrypted database table in production.
import 'dotenv/config';
import crypto from 'node:crypto';
import express from 'express';

const {
  SENDPULSE_APP_ID,
  SENDPULSE_APP_SECRET,
  SESSION_SECRET = crypto.randomBytes(32).toString('hex'),
  PORT = 3000,
} = process.env;
const API = 'https://api.sendpulse.com';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// The app is shown in an iframe on login.sendpulse.com: allow only SendPulse to frame it,
// and keep the session token in the URL from leaking via Referer.
app.use((req, res, next) => {
  res.set('Content-Security-Policy', 'frame-ancestors https://login.sendpulse.com');
  res.set('Referrer-Policy', 'no-referrer');
  next();
});

const users = new Map();  // user_id -> { client_id, client_secret }
const tokens = new Map(); // user_id -> { token, exp }

// --- helpers -------------------------------------------------------------

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Signed, expiring session token: "<userId>.<exp>.<hmac>"
function signSession(userId, ttlSec = 3600) {
  const exp = Math.floor(Date.now() / 1000) + ttlSec;
  const mac = crypto.createHmac('sha256', SESSION_SECRET).update(`${userId}.${exp}`).digest('hex');
  return `${userId}.${exp}.${mac}`;
}

function verifySession(s) {
  const [userId, exp, mac] = String(s || '').split('.');
  if (!userId || !exp || !mac) return null;
  const good = crypto.createHmac('sha256', SESSION_SECRET).update(`${userId}.${exp}`).digest('hex');
  if (mac.length !== good.length || !crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(good))) return null;
  if (Number(exp) < Date.now() / 1000) return null;
  return Number(userId);
}

async function exchangeCode(code) {
  const r = await fetch(`${API}/market-service/oauth/authorize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ app_id: SENDPULSE_APP_ID, secret: SENDPULSE_APP_SECRET, code }),
  });
  const j = await r.json().catch(() => ({}));
  if (!j.result) throw new Error(`authorize failed: HTTP ${r.status}, code ${j.code}`);
  return j.data; // { id, user_id, app_id, client_id, client_secret, created_at, updated_at }
}

async function getToken(userId) {
  const c = tokens.get(userId);
  if (c && c.exp > Date.now() + 60_000) return c.token;
  const keys = users.get(userId);
  if (!keys) throw new Error('User is not connected. Reopen the app from SendPulse.');
  const r = await fetch(`${API}/oauth/access_token/market`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...keys, grant_type: 'client_credentials' }),
  });
  if (!r.ok) throw new Error(`token failed: HTTP ${r.status}`);
  const j = await r.json();
  tokens.set(userId, { token: j.access_token, exp: Date.now() + j.expires_in * 1000 });
  return j.access_token;
}

async function spGet(userId, path) {
  let r = await fetch(`${API}${path}`, { headers: { Authorization: `Bearer ${await getToken(userId)}` } });
  if (r.status === 401) { // token may have expired early: refresh once
    tokens.delete(userId);
    r = await fetch(`${API}${path}`, { headers: { Authorization: `Bearer ${await getToken(userId)}` } });
  }
  if (!r.ok) throw new Error(`GET ${path}: HTTP ${r.status}`);
  return r.json();
}

// --- routes --------------------------------------------------------------

// Install URL: SendPulse sends ?code=...&lang=... every time the app opens.
app.all('/install', async (req, res) => {
  const code = req.query.code || req.body?.code;
  const lang = req.query.lang || req.body?.lang || 'en';
  if (!code) return res.status(400).send('Missing code');
  try {
    const data = await exchangeCode(code); // first thing: the code lives 1 minute
    users.set(data.user_id, { client_id: data.client_id, client_secret: data.client_secret });
    res.redirect(`/app?s=${encodeURIComponent(signSession(data.user_id))}&lang=${encodeURIComponent(lang)}`);
  } catch (e) {
    console.error(e.message); // never log secrets or tokens
    res.status(400).send('Authorization failed. Reopen the app from SendPulse.');
  }
});

// App page, styled with the App Directory UI Kit.
app.get('/app', async (req, res) => {
  const userId = verifySession(req.query.s);
  if (!userId) return res.status(401).send('Session expired. Reopen the app from SendPulse.');
  let rows;
  try {
    const lists = await spGet(userId, '/addressbooks');
    rows = (Array.isArray(lists) ? lists : [])
      .map((l) => `<tr><td>${esc(l.id)}</td><td>${esc(l.name)}</td><td>${esc(l.all_email_qty)}</td></tr>`)
      .join('') || '<tr><td colspan="3" class="text-muted">No mailing lists yet</td></tr>';
  } catch (e) {
    rows = `<tr class="danger"><td colspan="3">${esc(e.message)}</td></tr>`;
  }
  res.send(`<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://cdn.sendpulse.com/dist/css/sp-marketplace-app-ui.min.css">
<title>My SendPulse app</title></head><body>
<h2>Your mailing lists</h2>
<table class="table blue-table"><thead><tr><th>ID</th><th>Name</th><th>Contacts</th></tr></thead>
<tbody>${rows}</tbody></table></body></html>`);
});

// Uninstall URL: always answer 200; remove keys only if the request matches what we stored.
app.post('/uninstall', (req, res) => {
  const { user_id, app_id, client_id, client_secret } = req.body || {};
  const stored = users.get(user_id);
  if (app_id === SENDPULSE_APP_ID && stored &&
      stored.client_id === client_id && stored.client_secret === client_secret) {
    users.delete(user_id);
    tokens.delete(user_id);
  }
  res.sendStatus(200);
});

app.listen(PORT, () => console.log(`Listening on :${PORT}`));
