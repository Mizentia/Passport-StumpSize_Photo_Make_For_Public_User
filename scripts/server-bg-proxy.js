const { callCloudCutout } = require('./server-provider-callers.js');
const { getLiveServerConfig } = require('./server-config-loader.js');
const { checkRateLimit, isOriginAllowed } = require('./server-security-guard.js');
const { callDashboardCutout } = require('./server-dashboard-caller.js');

function getProviderApiKey(providerConfig) {
  if (!providerConfig?.enabled) return null;
  const keys = Array.isArray(providerConfig.api_keys) ? providerConfig.api_keys.filter(Boolean) : [];
  return keys.length ? keys[Math.floor(Math.random() * keys.length)] : null;
}

async function processCutoutPayload(parsed, res, config) {
  const { imageBase64, provider = 'nl_studio_ai' } = parsed || {};
  if (!imageBase64) return res.writeHead(400, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: 'imageBase64 is required' }));
  if (config.is_public_active === false) return res.writeHead(503, { 'Content-Type': 'application/json' }).end(JSON.stringify({ success: false, error: 'সার্ভিস সাময়িকভাবে বন্ধ রয়েছে।' }));
  if (config.public_cloud_allowed === false) return res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ success: false, fallbackToLocal: true }));

  if (provider === 'nl_studio_ai' || provider === 'auto') {
    const dashResult = await callDashboardCutout(imageBase64);
    if (dashResult.success && dashResult.resultImageBase64) {
      return res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ success: true, provider: 'NL Studio AI', resultImageBase64: dashResult.resultImageBase64 }));
    }
    if (provider === 'nl_studio_ai') {
      return res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({
        success: false, fallbackToLocal: false, error: dashResult.error || 'NL Studio AI সার্ভিসে সক্রিয় ক্রেডিট নেই বা সার্ভার সাড়া দিচ্ছে না।'
      }));
    }
  }

  const providers = config.providers || {};
  let targetProvider = provider;
  if (!providers[targetProvider]?.enabled) {
    const def = config.default_provider;
    targetProvider = (def && providers[def]?.enabled) ? def : (Object.keys(providers).find(k => providers[k]?.enabled) || targetProvider);
  }

  const provConfig = providers[targetProvider];
  const apiKey = getProviderApiKey(provConfig);
  if (!apiKey && targetProvider !== 'local_ai') {
    return res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ success: false, fallbackToLocal: true }));
  }

  try {
    const resultBase64 = await callCloudCutout(targetProvider, apiKey, imageBase64, provConfig);
    res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ success: true, provider: targetProvider, resultImageBase64: resultBase64 }));
  } catch (upstreamErr) {
    res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ success: false, fallbackToLocal: true, error: upstreamErr.message }));
  }
}

async function handleServerBgRemoval(req, res) {
  if (!isOriginAllowed(req)) return res.writeHead(403, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: 'অননুমোদিত ডোমেইন থেকে রিকোয়েস্ট ব্লক করা হয়েছে।' }));
  const rate = checkRateLimit(req);
  if (!rate.allowed) return res.writeHead(429, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: `দয়া করে ${rate.retryAfter} সেকেন্ড পর চেষ্টা করুন।` }));

  try {
    const config = await getLiveServerConfig();
    if (req.body && typeof req.body === 'object') return processCutoutPayload(req.body, res, config);
    if (typeof req.body === 'string') { try { return processCutoutPayload(JSON.parse(req.body), res, config); } catch (_) {} }

    let bodyData = '';
    req.on('data', chunk => {
      bodyData += chunk;
      if (bodyData.length > 20 * 1024 * 1024) { res.writeHead(413, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: 'Too large' })); req.destroy(); }
    });
    req.on('end', () => {
      try { processCutoutPayload(JSON.parse(bodyData), res, config); }
      catch (_) { res.writeHead(400, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: 'Invalid JSON' })); }
    });
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: err.message }));
  }
}

function handleServerConfigInfo(req, res) {
  res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }).end(JSON.stringify({ serverProxyAvailable: true, protected: true }));
}

module.exports = { handleServerBgRemoval, handleServerConfigInfo };
