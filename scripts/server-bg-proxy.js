const fs = require('fs');
const path = require('path');
const { callCloudCutout } = require('./server-provider-callers.js');

const CONFIG_PATH = path.join(__dirname, '..', 'config', 'server-api-keys.json');

function loadServerApiConfig() {
  let cfg = { enabled: true, providers: {} };
  try {
    if (fs.existsSync(CONFIG_PATH)) cfg = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  } catch (_) {}
  if (!cfg.providers) cfg.providers = {};
  if (process.env.REMOVEBG_API_KEY) {
    cfg.providers.removebg = { enabled: true, api_keys: [process.env.REMOVEBG_API_KEY] };
  }
  if (process.env.GEMINI_API_KEY) {
    cfg.providers.gemini = { enabled: true, api_keys: [process.env.GEMINI_API_KEY], model: process.env.GEMINI_MODEL || 'gemini-2.0-flash' };
  }
  return cfg;
}

function getProviderApiKey(providerConfig) {
  if (!providerConfig || !providerConfig.enabled) return null;
  const keys = Array.isArray(providerConfig.api_keys) ? providerConfig.api_keys.filter(Boolean) : [];
  return keys.length ? keys[Math.floor(Math.random() * keys.length)] : null;
}

async function processCutoutPayload(parsed, res, config) {
  const { imageBase64, provider = 'auto' } = parsed || {};
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
}

async function handleServerBgRemoval(req, res) {
  try {
    const config = loadServerApiConfig();
    if (req.body && typeof req.body === 'object') return processCutoutPayload(req.body, res, config);
    if (typeof req.body === 'string') {
      try { return processCutoutPayload(JSON.parse(req.body), res, config); } catch (_) {}
    }

    let bodyData = '';
    req.on('data', chunk => {
      bodyData += chunk;
      if (bodyData.length > 20 * 1024 * 1024) {
        res.writeHead(413, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Payload too large' }));
        req.destroy();
      }
    });

    req.on('end', () => {
      try { processCutoutPayload(JSON.parse(bodyData), res, config); }
      catch (_) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }
    });
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
}

function handleServerConfigInfo(req, res) {
  const config = loadServerApiConfig();
  const safeProviders = {};
  if (config.providers) {
    for (const [key, val] of Object.entries(config.providers)) {
      safeProviders[key] = {
        enabled: !!val.enabled,
        hasKey: Array.isArray(val.api_keys) && val.api_keys.some(k => !!k?.trim()),
        model: val.model || null
      };
    }
  }
  res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify({ serverProxyAvailable: true, enabled: !!config.enabled, providers: safeProviders }));
}

module.exports = { handleServerBgRemoval, handleServerConfigInfo };
