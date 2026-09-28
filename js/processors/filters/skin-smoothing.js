/**
 * Fast Separable Bilateral Skin Smoothing
 */

export function applySkinSmoothing(ctx, w, h, strength) {
  if (strength <= 0 || w <= 0 || h <= 0) return;
  const src = ctx.getImageData(0, 0, w, h);
  const sData = src.data;
  const tempBuf = new Uint8ClampedArray(sData.length);
  tempBuf.set(sData);

  const radius = Math.max(1, Math.min(6, Math.round(strength * 3.5)));
  const edgeThreshold = 38 * 3;
  const blend = Math.min(0.85, strength * 0.85);
  const invBlend = 1 - blend;

  // Pass 1: Horizontal
  for (let y = 0; y < h; y++) {
    const rowOffset = y * w * 4;
    for (let x = 0; x < w; x++) {
      const idx = rowOffset + x * 4;
      const r = sData[idx], g = sData[idx + 1], b = sData[idx + 2];
      let sumR = r, sumG = g, sumB = b, weight = 1;
      const minX = Math.max(0, x - radius);
      const maxX = Math.min(w - 1, x + radius);

      for (let nx = minX; nx <= maxX; nx++) {
        if (nx === x) continue;
        const nIdx = rowOffset + nx * 4;
        const diff = Math.abs(r - sData[nIdx]) + Math.abs(g - sData[nIdx + 1]) + Math.abs(b - sData[nIdx + 2]);
        if (diff < edgeThreshold) { sumR += sData[nIdx]; sumG += sData[nIdx + 1]; sumB += sData[nIdx + 2]; weight++; }
      }
      tempBuf[idx] = (r * invBlend + (sumR / weight) * blend);
      tempBuf[idx + 1] = (g * invBlend + (sumG / weight) * blend);
      tempBuf[idx + 2] = (b * invBlend + (sumB / weight) * blend);
      tempBuf[idx + 3] = sData[idx + 3];
    }
  }

  // Pass 2: Vertical
  const dst = ctx.createImageData(w, h);
  const dData = dst.data;
  for (let x = 0; x < w; x++) {
    const colOffset = x * 4;
    for (let y = 0; y < h; y++) {
      const idx = y * w * 4 + colOffset;
      const r = tempBuf[idx], g = tempBuf[idx + 1], b = tempBuf[idx + 2];
      let sumR = r, sumG = g, sumB = b, weight = 1;
      const minY = Math.max(0, y - radius);
      const maxY = Math.min(h - 1, y + radius);

      for (let ny = minY; ny <= maxY; ny++) {
        if (ny === y) continue;
        const nIdx = ny * w * 4 + colOffset;
        const diff = Math.abs(r - tempBuf[nIdx]) + Math.abs(g - tempBuf[nIdx + 1]) + Math.abs(b - tempBuf[nIdx + 2]);
        if (diff < edgeThreshold) { sumR += tempBuf[nIdx]; sumG += tempBuf[nIdx + 1]; sumB += tempBuf[nIdx + 2]; weight++; }
      }
      dData[idx] = (r * invBlend + (sumR / weight) * blend);
      dData[idx + 1] = (g * invBlend + (sumG / weight) * blend);
      dData[idx + 2] = (b * invBlend + (sumB / weight) * blend);
      dData[idx + 3] = tempBuf[idx + 3];
    }
  }
  ctx.putImageData(dst, 0, 0);
}
