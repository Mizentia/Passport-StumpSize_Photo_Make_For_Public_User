const { callCloudCutout } = require('./server-provider-callers.js');
const { getLiveServerConfig } = require('./server-config-loader.js');
const { checkRateLimit, isOriginAllowed } = require('./server-security-guard.js');

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

  if (config.is_public_active === false) {
    res.writeHead(503, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ success: false, error: 'সার্ভিস সাময়িকভাবে রক্ষণাবেক্ষণের জন্য বন্ধ রয়েছে।' }));
  }

  if (config.public_cloud_allowed === false) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ success: false, fallbackToLocal: true }));
  }

  const providers = config.providers || {};
  let targetProvider = provider;
  if (targetProvider === 'auto' || !providers[targetProvider]?.enabled) {
    const defaultP = config.default_provider;
    if (defaultP && providers[defaultP]?.enabled && getProviderApiKey(providers[defaultP])) {
      targetProvider = defaultP;
    } else {
      const available = Object.keys(providers).find(k => providers[k]?.enabled && getProviderApiKey(providers[k]));
      if (available) targetProvider = available;
    }
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
  if (!isOriginAllowed(req)) {
    res.writeHead(403, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'অননুমোদিত ডোমেইন থেকে রিকোয়েস্ট ব্লক করা হয়েছে।' }));
  }

  const rate = checkRateLimit(req);
  if (!rate.allowed) {
    res.writeHead(429, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: `খুব বেশি রিকোয়েস্ট পাঠানো হয়েছে। দয়া করে ${rate.retryAfter} সেকেন্ড পর চেষ্টা করুন।` }));
  }

  try {
    const config = await getLiveServerConfig();
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
  res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify({ serverProxyAvailable: true, protected: true }));
}

module.exports = { handleServerBgRemoval, handleServerConfigInfo };
