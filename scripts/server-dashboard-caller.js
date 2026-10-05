const FIRESTORE_PROJECTS = 'https://firestore.googleapis.com/v1/projects/metaaccountmanager/databases/(default)/documents/ecosystem/projects';

async function getDashboardUrlsFromDatabase() {
  try {
    const res = await fetch(FIRESTORE_PROJECTS, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const json = await res.json();
      for (const item of (json.fields?.value?.arrayValue?.values || [])) {
        const p = item.mapValue?.fields;
        const port = String(p?.port?.integerValue || p?.port?.stringValue || '');
        if (port === '3000' || p?.name?.stringValue === 'Noksha Lab') {
          return [
            (p.localUrl?.stringValue || '').replace(/\/+$/, ''),
            (p.liveUrl?.stringValue || p.cloudUrl?.stringValue || p.url?.stringValue || '').replace(/\/+$/, '')
          ].filter(Boolean);
        }
      }
    }
  } catch (_) {}
  return [];
}

async function callDashboardCutout(imageBase64) {
  const dbUrls = await getDashboardUrlsFromDatabase();
  const candidateUrls = [...new Set([
    process.env.ADMIN_DASHBOARD_URL,
    ...dbUrls,
    'http://127.0.0.1:3000',
    'http://localhost:3000',
    'https://nl-admin-dashboard.vercel.app'
  ].filter(Boolean))];

  let lastError = null;

  for (const base of candidateUrls) {
    try {
      const res = await fetch(`${base.replace(/\/$/, '')}/api/api-keys/cutout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, projectId: 'proj-photo-public', port: 8086 }),
        signal: AbortSignal.timeout(15000)
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success && json.resultImageBase64) {
        return { success: true, resultImageBase64: json.resultImageBase64, platform: json.platform || 'NL Studio AI' };
      }
      if (json && json.error) return { success: false, error: json.error };
      return { success: false, error: `ড্যাশবোর্ড রেসপন্স কোড: ${res.status}` };
    } catch (err) {
      lastError = err.message;
    }
  }
  return { success: false, error: lastError ? `ড্যাশবোর্ড অফলাইন (${lastError})` : 'ড্যাশবোর্ড সার্ভারে সংযোগ সম্ভব হয়নি।' };
}

module.exports = { callDashboardCutout };
