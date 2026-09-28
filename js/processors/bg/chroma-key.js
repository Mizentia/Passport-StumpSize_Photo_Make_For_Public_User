import { sampleBorderColors, runFloodFillSegmentation } from '../bg-floodfill.js';

export async function removeBgChromaKey(imageElement, options = {}) {
  const keyHex = options.keyColor || '#00ff00';
  const tolerance = options.tolerance || 40;
  const parsedHex = keyHex.replace('#', '');
  const kr = parseInt(parsedHex.substring(0, 2), 16) || 0;
  const kg = parseInt(parsedHex.substring(2, 4), 16) || 255;
  const kb = parseInt(parsedHex.substring(4, 6), 16) || 0;

  const canvas = document.createElement('canvas');
  const w = imageElement.naturalWidth || imageElement.width;
  const h = imageElement.naturalHeight || imageElement.height;
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(imageElement, 0, 0, w, h);
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  const softRange = 18;
  const threshLow = tolerance;
  const threshHigh = tolerance + softRange;

  for (let i = 0; i < w * h; i++) {
    const idx = i * 4;
    const r = data[idx], g = data[idx + 1], b = data[idx + 2];
    const dist = Math.sqrt((r - kr) ** 2 + (g - kg) ** 2 + (b - kb) ** 2);
    if (dist <= threshLow) {
      data[idx + 3] = 0;
    } else if (dist < threshHigh) {
      data[idx + 3] = Math.round(((dist - threshLow) / softRange) * 255);
      if (kg > kr && kg > kb) data[idx + 1] = Math.min(g, (r + b) / 2);
      else if (kb > kr && kb > kg) data[idx + 2] = Math.min(b, (r + g) / 2);
    }
  }

  ctx.putImageData(imgData, 0, 0);
  const processedImg = new Image();
  await new Promise((resolve) => { processedImg.onload = resolve; processedImg.src = canvas.toDataURL('image/png'); });
  return processedImg;
}

export async function removeBgFloodFill(imageElement, options = {}) {
  const tolerance = options.tolerance || 45;
  const featherRadius = options.featherRadius || 2;
  const canvas = document.createElement('canvas');
  const w = imageElement.naturalWidth || imageElement.width;
  const h = imageElement.naturalHeight || imageElement.height;
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(imageElement, 0, 0, w, h);
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  const distHelpers = sampleBorderColors(data, w, h);
  const { isBg } = runFloodFillSegmentation(data, w, h, tolerance, distHelpers);
  const r = Math.max(1, Math.min(5, Math.round(featherRadius)));

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      if (isBg[idx] === 1) {
        data[idx * 4 + 3] = 0;
      }
    }
  }
  ctx.putImageData(imgData, 0, 0);
  const processedImg = new Image();
  await new Promise((resolve) => { processedImg.onload = resolve; processedImg.src = canvas.toDataURL('image/png'); });
  return processedImg;
}
