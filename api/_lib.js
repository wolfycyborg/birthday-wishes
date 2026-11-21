const crypto = require('crypto');

// Logins. Override any of these with Vercel Environment Variables.
const GEETHA_USER = (process.env.GEETHA_USER || 'geetha').toLowerCase();
const GEETHA_PASS = process.env.GEETHA_PASS || 'geetha123';
const ADMIN_USER = (process.env.ADMIN_USER || 'varun').toLowerCase();
const ADMIN_PASS = process.env.ADMIN_PASS || 'geethavarun123';
const SECRET = process.env.AUTH_SECRET || 'geetha-bday|' + ADMIN_PASS;

const hash = v => crypto.createHash('sha256').update(String(v)).digest();
const eq = (a, b) => crypto.timingSafeEqual(hash(a), hash(b));
const hmac = v => crypto.createHmac('sha256', SECRET).update(v).digest('hex');

const sign = (role, hours) => {
  const body = role + '.' + (Date.now() + hours * 3600e3);
  return body + '.' + hmac(body);
};
const verify = (tok, role) => {
  const p = String(tok || '').split('.');
  if (p.length !== 3) return false;
  return eq(hmac(p[0] + '.' + p[1]), p[2]) && p[0] === role && Date.now() < Number(p[1]);
};
const bearer = req => (req.headers.authorization || '').replace(/^Bearer /, '');
const body = req => {
  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch { b = {}; } }
  return b || {};
};

// Storage: Upstash Redis (add it from Vercel > Storage / Marketplace).
const DB_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const DB_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const hasDb = !!(DB_URL && DB_TOKEN);
async function redis(cmd) {
  const r = await fetch(DB_URL, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + DB_TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd)
  });
  const j = await r.json();
  if (!r.ok || j.error) throw new Error(j.error || 'Redis ' + r.status);
  return j.result;
}
const KEY = 'geetha:responses';

module.exports = { GEETHA_USER, GEETHA_PASS, ADMIN_USER, ADMIN_PASS, eq, sign, verify, bearer, body, hasDb, redis, KEY };
