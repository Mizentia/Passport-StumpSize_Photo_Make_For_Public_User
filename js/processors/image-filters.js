import { applySkinSmoothing, applySharpenConvolution } from './filter-kernels.js';

export function applyImageFilterEffects(ctx, width, height, filters) {
  if (!filters) return;
  const {
    brightness = 100, contrast = 100, saturation = 100,
    sharpness = 0, smoothing = 0, warmth = 0, exposure = 0
  } = filters;

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  const contrastFactor = (259 * (contrast + 155)) / (255 * (259 - contrast));
  const brightAdj = (brightness - 100) * 1.5 + (exposure * 2.0);
  const satFactor = saturation / 100;
  const warmthFactor = warmth || 0;

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue;
    let r = data[i], g = data[i + 1], b = data[i + 2];

    r = contrastFactor * (r + brightAdj - 128) + 128;
    g = contrastFactor * (g + brightAdj - 128) + 128;
    b = contrastFactor * (b + brightAdj - 128) + 128;

    const gray = 0.2989 * r + 0.587 * g + 0.114 * b;
    r = gray + satFactor * (r - gray) + warmthFactor * 0.8;
    g = gray + satFactor * (g - gray);
    b = gray + satFactor * (b - gray) - warmthFactor * 0.8;

    data[i] = Math.min(255, Math.max(0, r));
    data[i + 1] = Math.min(255, Math.max(0, g));
    data[i + 2] = Math.min(255, Math.max(0, b));
  }

  ctx.putImageData(imgData, 0, 0);

  if (smoothing > 0) applySkinSmoothing(ctx, width, height, smoothing / 100);
  if (sharpness > 0) applySharpenConvolution(ctx, width, height, sharpness / 100);
}

export function computeAutoEnhanceSettings(imageElement) {
  return {
    brightness: 104,
    contrast: 108,
    saturation: 106,
    sharpness: 35,
    smoothing: 20,
    warmth: 2,
    exposure: 3
  };
}
