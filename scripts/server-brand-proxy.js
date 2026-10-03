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
      for (const item of (json.fields?.value?.arrayValue?.values || [])) {
        const p = item.mapValue?.fields;
        if (!p) continue;
        const portVal = parseInt(p.port?.integerValue || p.port?.stringValue || '0', 10);
        if (portVal === targetPort || p.slug?.stringValue === slug || p.id?.stringValue === 'proj-photo-public') {
          if (p.logo?.stringValue) return { success: true, logo: p.logo.stringValue, name: p.name?.stringValue, banglaName: p.banglaName?.stringValue };
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
  for (const base of getDashboardUrls()) {
    try {
      const res = await fetch(`${base}/api/public-settings`, { headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(1500) });
      if (res.ok) {
        const json = await res.json();
        const found = (json.projects || []).find(p => p.port === targetPort || p.slug === slug || p.id === 'proj-photo-public');
        if (found?.logo) return { success: true, logo: found.logo, name: found.name, banglaName: found.banglaName };
      }
    } catch (_) {}
  }
  const firestoreResult = await fetchFromFirestore(targetPort, slug);
  if (firestoreResult?.logo) return firestoreResult;
  return { success: true, logo: DEFAULT_DB_LOGO, name: 'Passport & Stamp Photo Maker' };
}

async function handleServerProjectBrand(req, res, targetPort = 8086, slug = 'photo-public') {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  const result = await fetchProjectBrand(targetPort, slug);
  res.writeHead(200);
  res.end(JSON.stringify(result));
}

async function handleServerManifest(req, res, targetPort = 8086, slug = 'photo-public') {
  res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache');
  const brand = await fetchProjectBrand(targetPort, slug);
  const activeLogo = brand?.logo || DEFAULT_DB_LOGO;
  const manifest = {
    name: brand?.name || "Passport Photo Maker",
    short_name: "PassportPhoto",
    description: "Free High-Resolution & Custom Size Passport Photo Maker",
    start_url: "./index.html",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#2563eb",
    orientation: "any",
    icons: [
      { src: "icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
      { src: "icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
      { src: activeLogo, sizes: "512x512", type: "image/png", purpose: "any maskable" }
    ],
    categories: ["photography", "utilities", "productivity"],
    shortcuts: [{ name: "New Passport Photo", url: "./index.html?action=new", description: "Upload and create a new passport photo" }]
  };
  res.writeHead(200);
  res.end(JSON.stringify(manifest, null, 2));
}

module.exports = { handleServerProjectBrand, handleServerManifest, fetchProjectBrand, DEFAULT_DB_LOGO };
