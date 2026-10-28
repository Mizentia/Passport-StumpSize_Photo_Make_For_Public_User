const { isOriginAllowed, checkRateLimit } = require('./server-security-guard.js');
const { callDashboardEnhance } = require('./server-dashboard-caller.js');

async function processEnhancePayload(payload, res) {
  const { imageBase64 } = payload || {};
  if (!imageBase64) {
    return res.writeHead(400, { 'Content-Type': 'application/json' })
      .end(JSON.stringify({ error: 'imageBase64 is required' }));
  }
  const result = await callDashboardEnhance(imageBase64);
  if (result.success && result.resultImageBase64) {
    return res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({
      success: true,
      provider: 'Cloudinary AI',
      resultImageBase64: result.resultImageBase64
    }));
  }
  return res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({
    success: false,
    error: result.error || 'AI Enhance সার্ভিসে সংযোগ সম্ভব হয়নি।'
  }));
}

async function handleServerEnhance(req, res) {
  if (!isOriginAllowed(req)) {
    return res.writeHead(403, { 'Content-Type': 'application/json' })
      .end(JSON.stringify({ error: 'অননুমোদিত ডোমেইন থেকে রিকোয়েস্ট ব্লক করা হয়েছে।' }));
  }
  const rate = checkRateLimit(req);
  if (!rate.allowed) {
    return res.writeHead(429, { 'Content-Type': 'application/json' })
      .end(JSON.stringify({ error: `দয়া করে ${rate.retryAfter} সেকেন্ড পর চেষ্টা করুন।` }));
  }

  try {
    if (req.body && typeof req.body === 'object') return processEnhancePayload(req.body, res);
    if (typeof req.body === 'string') {
      try { return processEnhancePayload(JSON.parse(req.body), res); } catch (_) {}
    }

    let bodyData = '';
    req.on('data', chunk => {
      bodyData += chunk;
      if (bodyData.length > 20 * 1024 * 1024) {
        res.writeHead(413, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: 'Too large' }));
        req.destroy();
      }
    });
    req.on('end', () => {
      try { processEnhancePayload(JSON.parse(bodyData), res); }
      catch (_) { res.writeHead(400, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: 'Invalid JSON' })); }
    });
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: err.message }));
  }
}

module.exports = { handleServerEnhance };
