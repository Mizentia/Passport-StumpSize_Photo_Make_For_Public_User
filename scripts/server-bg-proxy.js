const fs = require('fs');
const path = require('path');
const { callCloudCutout } = require('./server-provider-callers.js');

const CONFIG_PATH = path.join(__dirname, '..', 'config', 'server-api-keys.json');

function loadServerApiConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    }
  } catch (err) {
    console.warn('⚠️ Could not load server-api-keys.json:', err.message);
  }
  return { enabled: false, providers: {} };
}

function getProviderApiKey(providerConfig) {
  if (!providerConfig || !providerConfig.enabled) return null;
  const keys = Array.isArray(providerConfig.api_keys) ? providerConfig.api_keys.filter(Boolean) : [];
  if (keys.length === 0) return null;
  return keys[Math.floor(Math.random() * keys.length)];
}

async function handleServerBgRemoval(req, res) {
  try {
    const config = loadServerApiConfig();
    let bodyData = '';

    req.on('data', chunk => {
      bodyData += chunk;
      if (bodyData.length > 20 * 1024 * 1024) {
        res.writeHead(413, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Payload too large' }));
        req.destroy();
      }
    });

    req.on('end', async () => {
      let parsed = {};
      try { parsed = JSON.parse(bodyData); } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }

      const { imageBase64, provider = 'auto' } = parsed;
      if (!imageBase64) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'imageBase64 is required' }));
      }

      if (config.public_cloud_allowed === false) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: false, fallbackToLocal: true }));
      }

      const providers = config.providers || {};
      let targetProvider = provider;
      if (targetProvider === 'auto' || !providers[targetProvider]?.enabled) {
        const available = Object.keys(providers).find(k => providers[k]?.enabled && getProviderApiKey(providers[k]));
        if (available) targetProvider = available;
      }

      const provConfig = providers[targetProvider];
      const apiKey = getProviderApiKey(provConfig);

      if (!apiKey && targetProvider !== 'local_ai') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: false, fallbackToLocal: true }));
      }

      try {
        const resultBase64 = await callCloudCutout(targetProvider, apiKey, imageBase64, provConfig);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, provider: 'cloud', resultImageBase64: resultBase64 }));
      } catch (upstreamErr) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, fallbackToLocal: true, error: upstreamErr.message }));
      }
    });
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
}

function handleServerConfigInfo(req, res) {
  const config = loadServerApiConfig();
  res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify({
    serverProxyAvailable: true,
    enabled: config.public_cloud_allowed !== false && !!config.enabled,
    providers: {}
  }));
}


module.exports = { handleServerBgRemoval, handleServerConfigInfo };
