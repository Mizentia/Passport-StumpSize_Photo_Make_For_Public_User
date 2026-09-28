export function mapCanvasClickToImage(e, mainCanvas, img, cropOffset, zoom) {
  const rect = mainCanvas.getBoundingClientRect();
  const clickCanvasX = (e.clientX - rect.left) * (mainCanvas.width / rect.width);
  const clickCanvasY = (e.clientY - rect.top) * (mainCanvas.height / rect.height);
  const origW = img.naturalWidth || img.width;
  const origH = img.naturalHeight || img.height;
  const canvasW = mainCanvas.width, canvasH = mainCanvas.height;

  const imgRatio = origW / origH, targetRatio = canvasW / canvasH;
  const drawW = imgRatio > targetRatio ? canvasH * imgRatio : canvasW;
  const imgCenterX = canvasW / 2 + (cropOffset.x || 0);
  const imgCenterY = canvasH / 2 + (cropOffset.y || 0);
  const scale = (drawW / origW) * (zoom || 1);

  const imgX = (clickCanvasX - imgCenterX) / scale + origW / 2;
  const imgY = (clickCanvasY - imgCenterY) / scale + origH / 2;
  return { imgX, imgY, scale, origW, origH };
}
