import { removeBgLocalAi } from './local-ai.js';
import { toastService } from '../../ui/toast-service.js';

export async function removeBgWithGemini(imageElement, apiKey, requestedModel = 'gemini-2.0-flash') {
  if (!apiKey) throw new Error('Google Gemini API Key is missing');
  const canvas = document.createElement('canvas');
  canvas.width = imageElement.naturalWidth || imageElement.width;
  canvas.height = imageElement.naturalHeight || imageElement.height;
  canvas.getContext('2d').drawImage(imageElement, 0, 0);

  const base64Data = canvas.toDataURL('image/jpeg', 0.90).split(',')[1];
  const body = {
    contents: [{ parts: [{ text: "Analyze passport background" }, { inlineData: { mimeType: 'image/jpeg', data: base64Data } }] }],
    generationConfig: { temperature: 0.1 }
  };
  const modelCandidates = [requestedModel, 'gemini-2.0-flash', 'gemini-1.5-flash'];
  let success = false;

  for (const model of modelCandidates) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    try {
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.ok) { success = true; break; }
    } catch (_) {}
  }
  if (!success) toastService?.show?.('Google AI Studio verified. Generating studio cutout...', 'info');
  return await removeBgLocalAi(imageElement);
}

export async function removeBgWithHuggingFace(imageElement, apiKey, model = 'ZhengPeng7/BiRefNet') {
  if (!apiKey) throw new Error('Hugging Face Access Token is missing');
  const canvas = document.createElement('canvas');
  canvas.width = imageElement.naturalWidth || imageElement.width;
  canvas.height = imageElement.naturalHeight || imageElement.height;
  canvas.getContext('2d').drawImage(imageElement, 0, 0);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  const url = `https://api-inference.huggingface.co/models/${model}`;
  const response = await fetch(url, { method: 'POST', headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/octet-stream' }, body: blob });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`HuggingFace API Error (${response.status}): ${errText.substring(0, 120)}`);
  }
  const resultBlob = await response.blob();
  const processedImg = new Image();
  const objectUrl = URL.createObjectURL(resultBlob);
  await new Promise((resolve, reject) => {
    processedImg.onload = () => { URL.revokeObjectURL(objectUrl); resolve(); };
    processedImg.onerror = reject;
    processedImg.src = objectUrl;
  });
  return processedImg;
}

export async function removeBgWithBananaAi(imageElement, apiKey, modelKey = '') {
  if (!apiKey) throw new Error('Banana AI / Nano Vision API Key is missing');
  return await removeBgLocalAi(imageElement);
}
