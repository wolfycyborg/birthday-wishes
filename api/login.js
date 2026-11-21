const L = require('./_lib');

module.exports = (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const { username = '', password = '' } = L.body(req);
  const userOk = L.eq(String(username).trim().toLowerCase(), L.GEETHA_USER);
  const passOk = L.eq(password, L.GEETHA_PASS);
  if (userOk && passOk) {
    console.log('LOGIN: Geetha opened the surprise at ' + new Date().toISOString());
    return res.status(200).json({ token: L.sign('geetha', 12) });
  }
  res.status(401).json({ error: 'Wrong username or password. Try again.' });
};
