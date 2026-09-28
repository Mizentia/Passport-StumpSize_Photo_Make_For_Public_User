import { appState } from '../../core/state.js';

export async function getBlobWithTargetKb(canvas, format = 'image/jpeg', maxTargetKb = null) {
  if (format === 'image/png' || !maxTargetKb || maxTargetKb <= 0) {
    const quality = format === 'image/jpeg' ? (appState.get('jpegQuality') ?? 0.98) : 0.95;
    return new Promise((resolve) => canvas.toBlob(resolve, format, quality));
  }

  const maxBytes = maxTargetKb * 1024;
  let minQ = 0.05, maxQ = 1.0, bestBlob = null;

  for (let iter = 0; iter < 7; iter++) {
    const midQ = (minQ + maxQ) / 2;
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, format, midQ));
    if (blob.size <= maxBytes) { bestBlob = blob; minQ = midQ; }
    else { maxQ = midQ; }
  }

  return bestBlob || (await new Promise((resolve) => canvas.toBlob(resolve, format, 0.05)));
}

export async function estimatePhotoKbSize(canvas, format = 'image/jpeg') {
  if (!canvas) return 0;
  const targetKb = appState.get('targetKbLimit') || null;
  const blob = await getBlobWithTargetKb(canvas, format, targetKb);
  return Math.round(blob.size / 1024);
}
