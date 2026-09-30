const fs = require('fs');
const path = require('path');

const CONFIG_FILE = path.join(__dirname, '..', 'config', 'server-api-keys.json');
const FIRESTORE_URL = 'https://firestore.googleapis.com/v1/projects/metaaccountmanager/databases/(default)/documents/ecosystem/portalSettings';

let cache = { data: null, expiresAt: 0 };

function parseFirestoreFields(fields) {
  if (!fields) return {};
  const res = {};
  for (const [k, v] of Object.entries(fields)) {
    if (v.stringValue !== undefined) res[k] = v.stringValue;
    else if (v.booleanValue !== undefined) res[k] = v.booleanValue;
    else if (v.integerValue !== undefined) res[k] = parseInt(v.integerValue, 10);
    else if (v.doubleValue !== undefined) res[k] = parseFloat(v.doubleValue);
    else if (v.mapValue) res[k] = parseFirestoreFields(v.mapValue.fields);
    else if (v.arrayValue) res[k] = (v.arrayValue.values || []).map(item => {
      if (item.stringValue !== undefined) return item.stringValue;
      if (item.mapValue) return parseFirestoreFields(item.mapValue.fields);
      return item;
    });
  }
  return res;
}

async function fetchFromRemote() {
  try {
    const res = await fetch(FIRESTORE_URL, { signal: AbortSignal.timeout(3500) });
    if (res.ok) {
      const json = await res.json();
      return parseFirestoreFields(json.fields?.value?.mapValue?.fields);
    }
  } catch (_) {}

  const candidateUrls = [process.env.ADMIN_DASHBOARD_URL, process.env.ADMIN_STUDIO_URL].filter(Boolean);
  for (const base of candidateUrls) {
    try {
      const res = await fetch(`${base.replace(/\/$/, '')}/api/portal-control`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const json = await res.json();
        if (json.settings) return json.settings;
      }
    } catch (_) {}
  }
  return null;
}

function loadLocalFileConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  } catch (_) {}
  return { enabled: true, is_public_active: true, public_cloud_allowed: true, providers: {} };
}

async function getLiveServerConfig() {
  const now = Date.now();
  if (cache.data && now < cache.expiresAt) return cache.data;

  const remote = await fetchFromRemote();
  let resolved;
  if (remote) {
    resolved = {
      enabled: true,
      is_public_active: remote.public?.isPublicActive !== false && remote.public?.isActive !== false,
      public_cloud_allowed: remote.public?.allowCloudAi !== false,
      default_provider: remote.aiConfig?.default_provider || 'removebg',
      providers: remote.aiConfig?.providers || {}
    };
  } else {
    resolved = loadLocalFileConfig();
  }

  if (process.env.REMOVEBG_API_KEY && (!resolved.providers?.removebg?.api_keys || !resolved.providers.removebg.api_keys.length)) {
    if (!resolved.providers) resolved.providers = {};
    resolved.providers.removebg = { enabled: true, api_keys: [process.env.REMOVEBG_API_KEY] };
  }
  if (process.env.GEMINI_API_KEY && (!resolved.providers?.gemini?.api_keys || !resolved.providers.gemini.api_keys.length)) {
    if (!resolved.providers) resolved.providers = {};
    resolved.providers.gemini = { enabled: true, api_keys: [process.env.GEMINI_API_KEY], model: process.env.GEMINI_MODEL || 'gemini-2.0-flash' };
  }

  cache = { data: resolved, expiresAt: now + 30000 };
  return resolved;
}

module.exports = { getLiveServerConfig };
