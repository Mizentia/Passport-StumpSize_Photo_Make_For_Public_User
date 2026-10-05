async function attemptCutout(url, payload) {
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

let cachedDbUrls = null;
const FIRESTORE_PROJECTS = 'https://firestore.googleapis.com/v1/projects/metaaccountmanager/databases/(default)/documents/ecosystem/projects';

async function getDashboardUrlsFromDatabase() {
  if (cachedDbUrls) return cachedDbUrls;
  try {
    const res = await fetch(FIRESTORE_PROJECTS, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const json = await res.json();
      for (const item of (json.fields?.value?.arrayValue?.values || [])) {
        const p = item.mapValue?.fields;
        const port = String(p?.port?.integerValue || p?.port?.stringValue || '');
        if (port === '3000' || p?.name?.stringValue === 'Noksha Lab') {
          cachedDbUrls = {
            localUrl: (p.localUrl?.stringValue || 'http://localhost:3000').replace(/\/+$/, ''),
            liveUrl: (p.liveUrl?.stringValue || p.cloudUrl?.stringValue || p.url?.stringValue || 'https://nl-admin-dashboard.vercel.app').replace(/\/+$/, '')
          };
          return cachedDbUrls;
        }
      }
    }
  } catch (_) {}
  return { localUrl: 'http://localhost:3000', liveUrl: 'https://nl-admin-dashboard.vercel.app' };
}

async function getCandidateEndpoints() {
  const isLocal = typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname);
  const dbUrls = await getDashboardUrlsFromDatabase();
  if (isLocal) {
    return ['/api/bg-remove', `${dbUrls.localUrl}/api/api-keys/cutout`, 'http://127.0.0.1:8086/api/bg-remove', `${dbUrls.liveUrl}/api/api-keys/cutout`];
  }
  return [`${dbUrls.liveUrl}/api/api-keys/cutout`, '/api/bg-remove'];
}

export async function tryServerSideBgRemoval(imageElement, provider = 'auto') {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = imageElement.naturalWidth || imageElement.width || 400;
    canvas.height = imageElement.naturalHeight || imageElement.height || 400;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imageElement, 0, 0);

    const imageBase64 = canvas.toDataURL('image/png');
    const payload = { imageBase64, provider, projectId: 'proj-photo-public', port: 8086 };
    const endpoints = await getCandidateEndpoints();
    let lastError = null;

    for (const url of endpoints) {
      const resp = await attemptCutout(url, payload);
      if (!resp) continue;

      const { ok, json, status } = resp;
      if (ok && json.success && json.resultImageBase64) {
        const processedImg = new Image();
        await new Promise((resolve, reject) => {
          processedImg.onload = resolve;
          processedImg.onerror = reject;
          processedImg.src = json.resultImageBase64;
        });
        return { success: true, image: processedImg };
      }

      if (json && json.error) return { success: false, error: json.error, fallbackToLocal: json.fallbackToLocal ?? false };
      lastError = `সার্ভার এরর কোড: ${status}`;
    }

    return { success: false, fallbackToLocal: false, error: lastError || 'সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি।' };
  } catch (e) {
    return { success: false, fallbackToLocal: false, error: e.message };
  }
}
