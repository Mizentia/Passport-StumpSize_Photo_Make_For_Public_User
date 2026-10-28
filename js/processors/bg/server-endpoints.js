// Safe candidate endpoints for background cutout and AI enhance (No client secrets)
export async function attemptCutout(url, payload) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(25000)
    });
    if (res.status === 404 || res.status === 405) return null;
    const json = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, json };
  } catch (_) {
    return null;
  }
}

export function getCutoutEndpoints() {
  const isLocal = typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname);
  const list = ['/api/bg-remove'];
  if (isLocal) {
    list.push('http://localhost:3000/api/api-keys/cutout');
  }
  list.push('https://nl-admin.mizentia.com/api/api-keys/cutout');
  return list;
}

export function getEnhanceEndpoints() {
  const isLocal = typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname);
  const list = ['/api/enhance'];
  if (isLocal) {
    list.push('http://localhost:3000/api/api-keys/enhance');
  }
  list.push('https://nl-admin.mizentia.com/api/api-keys/enhance');
  return list;
}
