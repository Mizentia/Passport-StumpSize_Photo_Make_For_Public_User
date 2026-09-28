import { PHOTO_PRESETS_DATA } from './presets-data.js';
import { photoPresetStore } from '../core/photo-preset-store.js';

export const PHOTO_PRESETS = new Proxy(PHOTO_PRESETS_DATA, {
  get(target, prop) {
    if (typeof prop === 'string') {
      const stored = photoPresetStore.getPreset(prop);
      if (stored) return stored;
    }
    return target[prop];
  },
  has(target, prop) {
    if (typeof prop === 'string' && photoPresetStore.getPreset(prop)) {
      return true;
    }
    return prop in target;
  }
});

export const DPI = 300;
export const MM_TO_INCH = 1 / 25.4;

export function mmToPixels(mm, dpi = DPI) {
  return Math.round((mm * MM_TO_INCH) * dpi);
}

export function pixelsToMm(px, dpi = DPI) {
  return Math.round((px / dpi) * 25.4 * 10) / 10;
}
