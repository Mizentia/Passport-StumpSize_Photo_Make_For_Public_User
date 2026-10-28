import { appState } from '../../core/state.js';

export function mapCanvasClickToImage(e, mainCanvas, img, cropOffset, zoom) {
  const rect = mainCanvas.getBoundingClientRect();
  const clickCanvasX = (e.clientX - rect.left) * (mainCanvas.width / rect.width);
  const clickCanvasY = (e.clientY - rect.top) * (mainCanvas.height / rect.height);
  const origW = img.naturalWidth || img.width;
  const origH = img.naturalHeight || img.height;
  const canvasW = mainCanvas.width, canvasH = mainCanvas.height;

  const imgRatio = origW / origH, targetRatio = canvasW / canvasH;
  const drawW = imgRatio > targetRatio ? canvasH * imgRatio : canvasW;
  const dx = clickCanvasX - (canvasW / 2 + (cropOffset.x || 0));
  const dy = clickCanvasY - (canvasH / 2 + (cropOffset.y || 0));
  const rad = -((appState.get('rotation') || 0) * Math.PI) / 180;
  const rx = dx * Math.cos(rad) - dy * Math.sin(rad);
  const ry = dx * Math.sin(rad) + dy * Math.cos(rad);
  const scale = (drawW / origW) * (zoom || 1);

  const imgX = (rx * (appState.get('flipH') ? -1 : 1)) / scale + origW / 2;
  const imgY = (ry * (appState.get('flipV') ? -1 : 1)) / scale + origH / 2;
  return { imgX, imgY, scale, origW, origH };
}
