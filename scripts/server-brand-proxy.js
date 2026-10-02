const FIRESTORE_PROJECTS_URL = 'https://firestore.googleapis.com/v1/projects/metaaccountmanager/databases/(default)/documents/ecosystem/projects';
const FIRESTORE_SETTINGS_URL = 'https://firestore.googleapis.com/v1/projects/metaaccountmanager/databases/(default)/documents/ecosystem/settings';
const DEFAULT_DB_LOGO = 'https://res.cloudinary.com/ayewcaxj/image/upload/v1790432997/ChatGPT_Image_Sep_26_2026_08_27_13_PM_ufluye.png';

function getDashboardUrls() {
  const list = [];
  if (process.env.ADMIN_DASHBOARD_URL) list.push(process.env.ADMIN_DASHBOARD_URL.replace(/\/$/, ''));
  if (process.env.ADMIN_STUDIO_URL) list.push(process.env.ADMIN_STUDIO_URL.replace(/\/$/, ''));
  list.push('http://127.0.0.1:3000', 'http://localhost:3000', 'http://127.0.0.1:3001');
  return list;
}

async function fetchFromFirestore(targetPort = 8086, slug = 'photo-public') {
  try {
    const res = await fetch(FIRESTORE_PROJECTS_URL, { signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      const json = await res.json();
      const list = json.fields?.value?.arrayValue?.values || [];
      for (const item of list) {
        const p = item.mapValue?.fields;
        if (!p) continue;
        const portVal = parseInt(p.port?.integerValue || p.port?.stringValue || '0', 10);
        const slugVal = p.slug?.stringValue;
        const idVal = p.id?.stringValue;
        if (portVal === targetPort || slugVal === slug || idVal === 'proj-photo-public') {
          const logo = p.logo?.stringValue;
          if (logo) return { success: true, logo, name: p.name?.stringValue, banglaName: p.banglaName?.stringValue };
        }
      }
    }
  } catch (_) {}

  try {
    const sRes = await fetch(FIRESTORE_SETTINGS_URL, { signal: AbortSignal.timeout(3000) });
    if (sRes.ok) {
      const sJson = await sRes.json();
      const fields = sJson.fields?.value?.mapValue?.fields;
      const logo = fields?.bizLogo?.stringValue || fields?.webLogo?.stringValue;
      if (logo) return { success: true, logo, name: fields?.bizName?.stringValue || 'Noksha Lab' };
    }
  } catch (_) {}

  return null;
}

async function fetchProjectBrand(targetPort = 8086, slug = 'photo-public') {
  // 1. Try local/configured Admin Dashboard API
  for (const base of getDashboardUrls()) {
    try {
      const res = await fetch(`${base}/api/public-settings`, {
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(1500)
      });
      if (res.ok) {
        const json = await res.json();
        const projs = json.projects || [];
        const found = projs.find(p => p.port === targetPort || p.slug === slug || p.id === 'proj-photo-public');
        if (found?.logo) return { success: true, logo: found.logo, name: found.name, banglaName: found.banglaName };
      }
    } catch (_) {}
  }

  // 2. Query Central Firestore Database directly
  const firestoreResult = await fetchFromFirestore(targetPort, slug);
  if (firestoreResult?.logo) return firestoreResult;

  // 3. Guaranteed verified database logo fallback
  return { success: true, logo: DEFAULT_DB_LOGO, name: 'Passport & Stamp Photo Maker' };
}

async function handleServerProjectBrand(req, res, targetPort = 8086, slug = 'photo-public') {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  const result = await fetchProjectBrand(targetPort, slug);
  res.writeHead(200);
  res.end(JSON.stringify(result));
}

module.exports = { handleServerProjectBrand, fetchProjectBrand, DEFAULT_DB_LOGO };
