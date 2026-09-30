const ipRequests = new Map();
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 6;

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.socket?.remoteAddress || '127.0.0.1';
}

function checkRateLimit(req) {
  const ip = getClientIp(req);
  const now = Date.now();
  const entry = ipRequests.get(ip) || { count: 0, resetAt: now + WINDOW_MS };

  if (now > entry.resetAt) {
    entry.count = 1;
    entry.resetAt = now + WINDOW_MS;
    ipRequests.set(ip, entry);
    return { allowed: true };
  }

  entry.count += 1;
  ipRequests.set(ip, entry);

  if (entry.count > MAX_REQUESTS) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  return { allowed: true };
}

function isOriginAllowed(req) {
  const origin = req.headers.origin || req.headers.referer || '';
  if (!origin) return true;
  try {
    const host = new URL(origin).hostname.toLowerCase();
    if (host === 'localhost' || host === '127.0.0.1') return true;
    if (host.endsWith('.vercel.app')) return true;
    if (host.includes('nokshalab') || host.includes('mizentia')) return true;
    return false;
  } catch (_) {
    return true;
  }
}

module.exports = { checkRateLimit, isOriginAllowed };
