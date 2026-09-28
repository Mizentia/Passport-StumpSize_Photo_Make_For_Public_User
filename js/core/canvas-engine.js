import { PHOTO_PRESETS, mmToPixels } from '../config/photo-presets.js';
import { appState } from './state.js';
import { applyImageFilterEffects } from '../processors/image-filters.js';
import { drawSuitAttire } from '../processors/suit-overlay.js';
import { photoPresetStore } from './photo-preset-store.js';

export function getTargetDimensions(presetKeyOverride = null, customState = null) {
  const state = customState || appState.state;
  const presetKey = presetKeyOverride || state.selectedPreset;
  const stored = photoPresetStore.getPreset(presetKey);
  const currentDpi = stored?.dpi || state.dpi || 300;
  const clampPx = dim => ({ width: Math.min(7200, Math.max(40, Math.round(dim.width))), height: Math.min(7200, Math.max(40, Math.round(dim.height))) });

  if (presetKey === 'custom') {
    const custom = state.customSize || { widthMm: 40, heightMm: 50, unit: 'mm' };
    if (custom.exactPixels) return clampPx(custom.exactPixels);
    const wMm = Number(custom.widthMm) || 40, hMm = Number(custom.heightMm) || 50;
    return clampPx({ width: mmToPixels(wMm, currentDpi), height: mmToPixels(hMm, currentDpi) });
  }

  if (stored) {
    if (stored.exactPixels) return clampPx(stored.exactPixels);
    return clampPx({ width: mmToPixels(stored.widthMm, currentDpi), height: mmToPixels(stored.heightMm, currentDpi) });
  }

  const preset = PHOTO_PRESETS[presetKey] || PHOTO_PRESETS.bd_passport;
  if (preset.exactPixels) return clampPx(preset.exactPixels);
  return clampPx({ width: mmToPixels(preset.widthMm, currentDpi), height: mmToPixels(preset.heightMm, currentDpi) });
}

export function renderPhotoToCanvas(targetCanvas, options = {}) {
  const customState = options.state || appState.state;
  const isBgRemoved = customState.isBackgroundRemoved;
  const img = (isBgRemoved ? customState.segmentedImage : null) || customState.originalImage;
  if (!img || !targetCanvas) return;

  const { presetKey = null, transparentBg = false } = options;
  const { width, height } = getTargetDimensions(presetKey || customState.selectedPreset, customState);

  targetCanvas.width = width;
  targetCanvas.height = height;
  const ctx = targetCanvas.getContext('2d', { willReadFrequently: true });
  ctx.clearRect(0, 0, width, height);

  const photoCanvas = document.createElement('canvas');
  photoCanvas.width = width; photoCanvas.height = height;
  const pCtx = photoCanvas.getContext('2d', { willReadFrequently: true });

  pCtx.save();
  const zoom = customState.zoom || 1, rotation = customState.rotation || 0;
  const flipH = customState.flipH ? -1 : 1, flipV = customState.flipV ? -1 : 1;
  const offset = customState.cropOffset || { x: 0, y: 0 };

  pCtx.translate(width / 2 + offset.x, height / 2 + offset.y);
  pCtx.rotate((rotation * Math.PI) / 180);
  pCtx.scale(zoom * flipH, zoom * flipV);

  const origW = img.naturalWidth || img.width, origH = img.naturalHeight || img.height;
  const imgRatio = origW / origH, targetRatio = width / height;
  const drawW = imgRatio > targetRatio ? height * imgRatio : width;
  const drawH = imgRatio > targetRatio ? height : width / imgRatio;

  pCtx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
  pCtx.restore();

  applyImageFilterEffects(pCtx, width, height, customState.filters);

  if (!transparentBg && (isBgRemoved || customState.backgroundColor)) {
    ctx.fillStyle = customState.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, width, height);
  }

  ctx.drawImage(photoCanvas, 0, 0);

  const suitId = customState.selectedSuit;
  if (suitId && suitId !== 'none') drawSuitAttire(ctx, width, height, suitId, customState);
}
