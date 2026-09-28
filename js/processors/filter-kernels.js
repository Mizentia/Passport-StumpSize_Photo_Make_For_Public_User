import { applySkinSmoothing } from './filters/skin-smoothing.js';

export { applySkinSmoothing };

export function applySharpenConvolution(ctx, w, h, strength) {
  if (strength <= 0 || w <= 2 || h <= 2) return;
  const src = ctx.getImageData(0, 0, w, h);
  const dst = ctx.createImageData(w, h);
  const sData = src.data, dData = dst.data;
  dData.set(sData);

  const k = strength * 1.5;
  const centerWeight = 1 + 4 * k;
  const rowStride = w * 4;

  for (let y = 1; y < h - 1; y++) {
    const prevRow = (y - 1) * rowStride;
    const currRow = y * rowStride;
    const nextRow = (y + 1) * rowStride;

    for (let x = 1; x < w - 1; x++) {
      const idx = currRow + (x * 4);
      const top = prevRow + (x * 4);
      const bottom = nextRow + (x * 4);
      const left = idx - 4;
      const right = idx + 4;

      for (let c = 0; c < 3; c++) {
        const val = sData[idx + c] * centerWeight - k * (sData[top + c] + sData[bottom + c] + sData[left + c] + sData[right + c]);
        dData[idx + c] = val < 0 ? 0 : val > 255 ? 255 : val;
      }
      dData[idx + 3] = sData[idx + 3];
    }
  }

  ctx.putImageData(dst, 0, 0);
}
