import { attemptCutout, getCutoutEndpoints } from './server-endpoints.js';
export { tryServerSideEnhance } from './server-enhance-invoker.js';

export async function tryServerSideBgRemoval(imageElement, provider = 'auto') {
  try {
    const origW = imageElement.naturalWidth || imageElement.width || 400;
    const origH = imageElement.naturalHeight || imageElement.height || 400;
    const scale = Math.min(1, 1280 / Math.max(origW, origH));
    const targetW = Math.round(origW * scale), targetH = Math.round(origH * scale);

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    canvas.getContext('2d').drawImage(imageElement, 0, 0, targetW, targetH);

    const imageBase64 = canvas.toDataURL('image/png');
    const payload = { imageBase64, provider, projectId: 'proj-photo-public', port: 8086 };
    const endpoints = getCutoutEndpoints();
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
        if (scale >= 1) return { success: true, image: processedImg };
        const fullCanvas = document.createElement('canvas');
        fullCanvas.width = origW;
        fullCanvas.height = origH;
        fullCanvas.getContext('2d').drawImage(processedImg, 0, 0, origW, origH);
        const fullImg = new Image();
        await new Promise((res, rej) => {
          fullImg.onload = res;
          fullImg.onerror = rej;
          fullImg.src = fullCanvas.toDataURL('image/png');
        });
        return { success: true, image: fullImg };
      }
      if (json && json.error) {
        lastError = json.error;
        if (json.fallbackToLocal) return { success: false, error: json.error, fallbackToLocal: true };
        continue;
      }
      lastError = status === 413 ? 'ছবির সাইজ ক্লাউড লিমিট (৪.৫ MB) ছাড়িয়েছে' : `সার্ভার এরর কোড: ${status}`;
    }

    return {
      success: false,
      fallbackToLocal: false,
      error: lastError || 'সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি।'
    };
  } catch (e) {
    return { success: false, fallbackToLocal: false, error: e.message };
  }
}
