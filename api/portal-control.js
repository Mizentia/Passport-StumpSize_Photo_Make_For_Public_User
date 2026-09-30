const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  // 1. If ADMIN_STUDIO_URL is configured, fetch live portal status from Admin Studio
  if (process.env.ADMIN_STUDIO_URL) {
    try {
      const studioRes = await fetch(`${process.env.ADMIN_STUDIO_URL.replace(/\/$/, '')}/api/portal-control`);
      if (studioRes.ok) {
        const sData = await studioRes.json();
        const isAct = sData.settings?.public?.isPublicActive !== false && sData.settings?.public?.isActive !== false;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: true, isPublicActive: isAct }));
      }
    } catch (_) {}
  }

  // 2. Fallback to local server-api-keys.json
  let isPublicActive = true;
  try {
    const cfgPath = path.join(__dirname, '..', 'config', 'server-api-keys.json');
    if (fs.existsSync(cfgPath)) {
      const c = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
      if (c.is_public_active !== undefined) isPublicActive = Boolean(c.is_public_active);
    }
  } catch (_) {}

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ success: true, isPublicActive }));
};
