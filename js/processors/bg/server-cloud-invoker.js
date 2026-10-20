import { removeBgWithCloudApi } from './cloud-api.js';

const FIRESTORE_API_KEYS = 'https://firestore.googleapis.com/v1/projects/metaaccountmanager/databases/(default)/documents/ecosystem/apiKeys';

async function fetchDirectCloudKeys() {
  try {
    const res = await fetch(FIRESTORE_API_KEYS, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return [];
    const json = await res.json();
    const rawList = json.fields?.value?.arrayValue?.values || [];
    const keys = [];
    for (const it of rawList) {
      const f = it.mapValue?.fields || {};
      const platform = (f.platformId?.stringValue || f.platformName?.stringValue || '').toLowerCase();
      const status = f.status?.stringValue || 'active';
      const value = f.value?.stringValue || f.apiKey?.stringValue || '';
      const rem = Number(f.remainingCredits?.integerValue || f.remainingCredits?.doubleValue || 0);
      if (status === 'active' && value && (platform.includes('remove') || platform.includes('bg_remove'))) {
        keys.push({ platform: 'removebg', value, remaining: rem });
      }
    }
    keys.sort((a, b) => b.remaining - a.remaining);
    return keys;
  } catch (_) {
    return [];
  }
}

async function attemptCutout(url, payload) {
  try {
    const res = await fetch(url, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload), signal: AbortSignal.timeout(25000)
    });
    if (res.status === 404 || res.status === 405) return null;
    const json = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, json };
  } catch (_) { return null; }
}

let cachedDbUrls = null;
const FIRESTORE_PROJECTS = 'https://firestore.googleapis.com/v1/projects/metaaccountmanager/databases/(default)/documents/ecosystem/projects';

async function getDashboardUrlsFromDatabase() {
  if (cachedDbUrls) return cachedDbUrls;
  try {
    const res = await fetch(FIRESTORE_PROJECTS, { signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      const json = await res.json();
      for (const item of (json.fields?.value?.arrayValue?.values || [])) {
        const p = item.mapValue?.fields;
        const port = String(p?.port?.integerValue || p?.port?.stringValue || '');
        const name = String(p?.name?.stringValue || '').toLowerCase();
        if (port === '3000' || name.includes('noksha lab') || name.includes('admin dashboard')) {
          const live = (p.liveUrl?.stringValue || p.cloudUrl?.stringValue || p.url?.stringValue || '').trim();
          const local = (p.localUrl?.stringValue || 'http://localhost:3000').trim();
          cachedDbUrls = {
            localUrl: (local || 'http://localhost:3000').replace(/\/+$/, ''),
            liveUrl: (live || 'https://nl-admin.mizentia.com').replace(/\/+$/, '')
          };
          return cachedDbUrls;
        }
      }
    }
  } catch (_) {}
  return { localUrl: 'http://localhost:3000', liveUrl: 'https://nl-admin.mizentia.com' };
}

async function getCandidateEndpoints() {
  const isLocal = typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname);
  const dbUrls = await getDashboardUrlsFromDatabase();
  const list = [];
  if (isLocal) {
    list.push('/api/bg-remove');
    if (dbUrls.localUrl) list.push(`${dbUrls.localUrl}/api/api-keys/cutout`);
  }
  if (dbUrls.liveUrl) {
    list.push(`${dbUrls.liveUrl}/api/api-keys/cutout`);
  }
  if (!list.includes('https://nl-admin.mizentia.com/api/api-keys/cutout')) {
    list.push('https://nl-admin.mizentia.com/api/api-keys/cutout');
  }
  if (!isLocal && !list.includes('/api/bg-remove')) {
    list.push('/api/bg-remove');
  }
  return list;
}

export async function tryServerSideBgRemoval(imageElement, provider = 'auto') {
  try {
    const origW = imageElement.naturalWidth || imageElement.width || 400;
    const origH = imageElement.naturalHeight || imageElement.height || 400;
    const scale = Math.min(1, 1280 / Math.max(origW, origH));
    const targetW = Math.round(origW * scale), targetH = Math.round(origH * scale);

    const canvas = document.createElement('canvas');
    canvas.width = targetW; canvas.height = targetH;
    canvas.getContext('2d').drawImage(imageElement, 0, 0, targetW, targetH);

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
        await new Promise((res, rej) => { processedImg.onload = res; processedImg.onerror = rej; processedImg.src = json.resultImageBase64; });
        if (scale >= 1) return { success: true, image: processedImg };
        const fullCanvas = document.createElement('canvas');
        fullCanvas.width = origW; fullCanvas.height = origH;
        fullCanvas.getContext('2d').drawImage(processedImg, 0, 0, origW, origH);
        const fullImg = new Image();
        await new Promise((res, rej) => { fullImg.onload = res; fullImg.onerror = rej; fullImg.src = fullCanvas.toDataURL('image/png'); });
        return { success: true, image: fullImg };
      }
      if (json && json.error) {
        lastError = json.error;
        if (json.fallbackToLocal) return { success: false, error: json.error, fallbackToLocal: true };
        continue;
      }
      lastError = status === 413 ? 'ছবির সাইজ ক্লাউড লিমিট (৪.৫ MB) ছাড়িয়েছে' : `সার্ভার এরর কোড: ${status}`;
    }

    // Direct fallback: If dashboard endpoints failed (e.g., deployed on GitHub Pages), try calling Remove.bg directly
    try {
      const directKeys = await fetchDirectCloudKeys();
      for (const k of directKeys) {
        try {
          const directImg = await removeBgWithCloudApi(imageElement, k.platform, k.value);
          if (directImg) return { success: true, image: directImg };
        } catch (err) {
          console.warn('Direct Remove.bg fallback failed for key:', err.message);
        }
      }
    } catch (_) {}

    return { success: false, fallbackToLocal: false, error: lastError || 'সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি।' };
  } catch (e) {
    return { success: false, fallbackToLocal: false, error: e.message };
  }
}

async function getCandidateEnhanceEndpoints() {
  const isLocal = typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname);
  const dbUrls = await getDashboardUrlsFromDatabase();
  const list = [];
  if (isLocal) {
    list.push('/api/enhance');
    if (dbUrls.localUrl) list.push(`${dbUrls.localUrl}/api/api-keys/enhance`);
  }
  if (dbUrls.liveUrl) {
    list.push(`${dbUrls.liveUrl}/api/api-keys/enhance`);
  }
  if (!list.includes('https://nl-admin.mizentia.com/api/api-keys/enhance')) {
    list.push('https://nl-admin.mizentia.com/api/api-keys/enhance');
  }
  if (!isLocal && !list.includes('/api/enhance')) {
    list.push('/api/enhance');
  }
  return list;
}

export async function tryServerSideEnhance(imageElement) {
  try {
    const origW = imageElement.naturalWidth || imageElement.width || 400;
    const origH = imageElement.naturalHeight || imageElement.height || 400;
    const scale = Math.min(1, 1600 / Math.max(origW, origH));
    const targetW = Math.round(origW * scale), targetH = Math.round(origH * scale);

    const canvas = document.createElement('canvas');
    canvas.width = targetW; canvas.height = targetH;
    canvas.getContext('2d').drawImage(imageElement, 0, 0, targetW, targetH);

    const imageBase64 = canvas.toDataURL('image/png');
    const payload = { imageBase64, projectId: 'proj-photo-public', port: 8086 };
    const endpoints = await getCandidateEnhanceEndpoints();
    let lastError = null;

    for (const url of endpoints) {
      const resp = await attemptCutout(url, payload);
      if (!resp) continue;
      const { ok, json, status } = resp;
      if (ok && json.success && json.resultImageBase64) {
        const processedImg = new Image();
        await new Promise((res, rej) => { processedImg.onload = res; processedImg.onerror = rej; processedImg.src = json.resultImageBase64; });
        return { success: true, image: processedImg, provider: json.provider || 'Cloudinary AI' };
      }
      if (json && json.error) {
        lastError = json.error;
        continue;
      }
      lastError = status === 413 ? 'ছবির সাইজ ক্লাউড লিমিট ছাড়িয়েছে' : `সার্ভার এরর: ${status}`;
    }
    return { success: false, error: lastError || 'AI Enhance সার্ভারে সংযোগ স্থাপন করা সম্ভব হয়নি।' };
  } catch (e) {
    return { success: false, error: e.message };
  }
}
