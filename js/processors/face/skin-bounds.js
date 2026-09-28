/**
 * Biometric Skin Chrominance & Landmark Detector
 */

export function detectFaceBounds(imageElement) {
  const canvas = document.createElement('canvas');
  const sampleW = 240;
  const sampleH = Math.round((imageElement.naturalHeight || imageElement.height) / (imageElement.naturalWidth || imageElement.width) * sampleW);
  canvas.width = sampleW; canvas.height = sampleH;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(imageElement, 0, 0, sampleW, sampleH);
  const data = ctx.getImageData(0, 0, sampleW, sampleH).data;

  const skinPixels = [];
  let minX = sampleW, maxX = 0, minY = sampleH, maxY = 0;

  for (let y = 0; y < sampleH; y++) {
    for (let x = 0; x < sampleW; x++) {
      const idx = (y * sampleW + x) * 4;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];
      const yVal = 0.299 * r + 0.587 * g + 0.114 * b;
      const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
      const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;

      if (cb >= 75 && cb <= 138 && cr >= 128 && cr <= 182 && yVal >= 35 && yVal <= 245 && r > g && g > b * 0.8 && y < sampleH * 0.82) {
        skinPixels.push({ x, y });
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
    }
  }

  const origW = imageElement.naturalWidth || imageElement.width;
  const origH = imageElement.naturalHeight || imageElement.height;

  if (skinPixels.length > 100 && maxX > minX && maxY > minY) {
    const scaleX = origW / sampleW; const scaleY = origH / sampleH;
    let sumX = 0, sumY = 0;
    skinPixels.forEach((p) => { sumX += p.x; sumY += p.y; });
    return {
      found: true,
      centerX: (sumX / skinPixels.length) * scaleX,
      centerY: (sumY / skinPixels.length) * scaleY,
      faceWidth: (maxX - minX) * scaleX,
      faceHeight: (maxY - minY) * scaleY,
      headTopY: Math.max(0, (minY - (maxY - minY) * 0.28) * scaleY),
      chinY: maxY * scaleY,
      eyeY: (minY + (maxY - minY) * 0.42) * scaleY,
      tiltAngle: 0
    };
  }

  return {
    found: false,
    centerX: origW / 2, centerY: origH * 0.42,
    faceWidth: origW * 0.45, faceHeight: origH * 0.45,
    headTopY: origH * 0.12, chinY: origH * 0.72,
    eyeY: origH * 0.38, tiltAngle: 0
  };
}
