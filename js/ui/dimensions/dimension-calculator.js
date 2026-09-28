import { appState } from '../../core/state.js';
import { PHOTO_PRESETS } from '../../config/photo-presets.js';
import { toBengaliNumeral } from '../../config/i18n.js';
import { photoPresetStore } from '../../core/photo-preset-store.js';

export function formatNumber(num, isBn) {
  const rounded = Math.round(num * 100) / 100;
  const str = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2).replace(/\.?0+$/, '');
  return isBn ? toBengaliNumeral(str) : str;
}

export function calculateDimensions(presetKey, custom, currentDpi = 300) {
  let wMm = 40, hMm = 50, wInch = 1.57, hInch = 1.97, nameKey = 'bd_passport';
  const storedPreset = photoPresetStore.getPreset(presetKey);

  if (presetKey === 'custom') {
    nameKey = 'custom';
    const activeData = custom || appState.get('customSize') || { widthMm: 40, heightMm: 50, unit: 'mm' };
    if (activeData.exactPixels) {
      wMm = (activeData.exactPixels.width / currentDpi) * 25.4;
      hMm = (activeData.exactPixels.height / currentDpi) * 25.4;
      wInch = activeData.exactPixels.width / currentDpi;
      hInch = activeData.exactPixels.height / currentDpi;
    } else {
      wMm = Number(activeData.widthMm) || 40;
      hMm = Number(activeData.heightMm) || 50;
      wInch = wMm / 25.4;
      hInch = hMm / 25.4;
    }
  } else if (storedPreset) {
    nameKey = storedPreset.id;
    const presetDpi = storedPreset.dpi || currentDpi;
    if (storedPreset.exactPixels) {
      wMm = (storedPreset.exactPixels.width / presetDpi) * 25.4;
      hMm = (storedPreset.exactPixels.height / presetDpi) * 25.4;
      wInch = storedPreset.exactPixels.width / presetDpi;
      hInch = storedPreset.exactPixels.height / presetDpi;
    } else {
      wMm = storedPreset.widthMm; hMm = storedPreset.heightMm;
      wInch = storedPreset.widthMm / 25.4; hInch = storedPreset.heightMm / 25.4;
    }
  } else if (PHOTO_PRESETS[presetKey]) {
    const p = PHOTO_PRESETS[presetKey];
    nameKey = presetKey;
    if (p.exactPixels) {
      wMm = (p.exactPixels.width / currentDpi) * 25.4; hMm = (p.exactPixels.height / currentDpi) * 25.4;
      wInch = p.exactPixels.width / currentDpi; hInch = p.exactPixels.height / currentDpi;
    } else {
      wMm = p.widthMm; hMm = p.heightMm; wInch = p.widthMm / 25.4; hInch = p.heightMm / 25.4;
    }
  }

  return { wMm, hMm, wInch, hInch, nameKey };
}
