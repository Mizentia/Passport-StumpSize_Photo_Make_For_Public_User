const DASHBOARD_URLS = ['http://127.0.0.1:3000', 'http://localhost:3000', 'http://127.0.0.1:3001'];

async function fetchProjectBrand(targetPort = 8086, slug = 'photo-public') {
  for (const base of DASHBOARD_URLS) {
    try {
      const res = await fetch(`${base}/api/public-settings`, { headers: { 'Content-Type': 'application/json' } });
      if (res.ok) {
        const json = await res.json();
        const projs = json.projects || [];
        const found = projs.find(p => p.port === targetPort || p.slug === slug || p.id === 'proj-photo-public');
        if (found) return { success: true, logo: found.logo || '', name: found.name, banglaName: found.banglaName };
      }
    } catch (_) {}
  }
  return { success: false, logo: '' };
}

async function handleServerProjectBrand(req, res, targetPort = 8086, slug = 'photo-public') {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  const result = await fetchProjectBrand(targetPort, slug);
  res.writeHead(200);
  res.end(JSON.stringify(result));
}

module.exports = { handleServerProjectBrand, fetchProjectBrand };
