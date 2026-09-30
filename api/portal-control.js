const { getLiveServerConfig } = require('../scripts/server-config-loader.js');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  try {
    const config = await getLiveServerConfig();
    const isPublicActive = config.is_public_active !== false;
    const allowCloudAi = config.public_cloud_allowed !== false;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, isPublicActive, allowCloudAi }));
  } catch (_) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, isPublicActive: true, allowCloudAi: true }));
  }
};
