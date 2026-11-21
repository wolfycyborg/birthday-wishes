const L = require('./_lib');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!L.verify(L.bearer(req), 'geetha')) return res.status(401).json({ error: 'Please log in again.' });
  const b = L.body(req);
  const rating = Math.min(5, Math.max(0, parseInt(b.rating, 10) || 0));
  const comment = String(b.comment || '').slice(0, 2000);
  if (!rating && !comment) return res.status(400).json({ error: 'Empty response.' });
  const entry = { rating, comment, at: new Date().toISOString() };
  console.log('GEETHA RESPONSE ' + JSON.stringify(entry)); // also visible in Vercel > Logs
  try {
    if (L.hasDb) await L.redis(['LPUSH', L.KEY, JSON.stringify(entry)]);
    res.status(200).json({ ok: true, stored: L.hasDb });
  } catch (e) {
    console.error('STORE FAILED', e.message);
    res.status(500).json({ error: 'Could not save.' });
  }
};
