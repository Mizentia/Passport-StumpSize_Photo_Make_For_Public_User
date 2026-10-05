async function callDashboardCutout(imageBase64) {
  const candidateUrls = [
    process.env.ADMIN_DASHBOARD_URL,
    'http://127.0.0.1:3000',
    'http://localhost:3000',
    'https://nl-admin-dashboard.vercel.app'
  ].filter(Boolean);

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
      if (json && json.error) {
        return { success: false, error: json.error };
      }
      return { success: false, error: `ড্যাশবোর্ড রেসপন্স কোড: ${res.status}` };
    } catch (err) {
      lastError = err.message;
    }
  }
  return { success: false, error: lastError ? `ড্যাশবোর্ড অফলাইন (${lastError})` : 'ড্যাশবোর্ড সার্ভারে সংযোগ সম্ভব হয়নি।' };
}

module.exports = { callDashboardCutout };
