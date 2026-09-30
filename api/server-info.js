const { handleServerConfigInfo } = require('../scripts/server-bg-proxy.js');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Api-Key');
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }
  return handleServerConfigInfo(req, res);
};
