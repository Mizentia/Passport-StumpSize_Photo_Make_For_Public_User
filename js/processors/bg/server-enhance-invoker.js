import { attemptCutout, getEnhanceEndpoints } from './server-endpoints.js';

export async function tryServerSideEnhance(imageElement) {
  try {
    const origW = imageElement.naturalWidth || imageElement.width || 400;
    const origH = imageElement.naturalHeight || imageElement.height || 400;
    const scale = Math.min(1, 1600 / Math.max(origW, origH));
    const targetW = Math.round(origW * scale), targetH = Math.round(origH * scale);

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    canvas.getContext('2d').drawImage(imageElement, 0, 0, targetW, targetH);

    const imageBase64 = canvas.toDataURL('image/png');
    const payload = { imageBase64, projectId: 'proj-photo-public', port: 8086 };
    const endpoints = getEnhanceEndpoints();
    let lastError = null;

    for (const url of endpoints) {
      const resp = await attemptCutout(url, payload);
      if (!resp) continue;
      const { ok, json, status } = resp;
      if (ok && json.success && json.resultImageBase64) {
        const processedImg = new Image();
        await new Promise((res, rej) => {
          processedImg.onload = res;
          processedImg.onerror = rej;
          processedImg.src = json.resultImageBase64;
        });
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
