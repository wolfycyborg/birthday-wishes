const L = require('./_lib');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { username = '', password = '' } = L.body(req);
    const userOk = L.eq(String(username).trim().toLowerCase(), L.ADMIN_USER);
    const passOk = L.eq(password, L.ADMIN_PASS);
    if (userOk && passOk) return res.status(200).json({ token: L.sign('admin', 8) });
    return res.status(401).json({ error: 'Wrong admin username or password.' });
  }
  if (req.method === 'GET') {
    if (!L.verify(L.bearer(req), 'admin')) return res.status(401).json({ error: 'Log in again.' });
    if (!L.hasDb) return res.status(200).json({ configured: false, items: [] });
    try {
      const raw = await L.redis(['LRANGE', L.KEY, 0, -1]);
      const items = (raw || []).map(x => { try { return JSON.parse(x); } catch { return null; } }).filter(Boolean);
      return res.status(200).json({ configured: true, items });
    } catch (e) {
      return res.status(500).json({ error: 'Could not read responses.' });
    }
  }
  res.status(405).json({ error: 'Method not allowed' });
};
