import { appState } from '../../core/state.js';
import { getTargetDimensions } from '../../core/canvas-engine.js';
import { PHOTO_PRESETS } from '../../config/photo-presets.js';
import { t, toBengaliNumeral } from '../../config/i18n.js';
import { photoPresetStore } from '../../core/photo-preset-store.js';
import { formatNumber, calculateDimensions } from './dimension-calculator.js';

export function updateDimensionDisplay() {
  const presetKey = appState.get('selectedPreset') || 'bd_passport';
  const custom = appState.get('customSize') || { widthMm: 38.1, heightMm: 50.8, unit: 'mm' };
  const storedPreset = photoPresetStore.getPreset(presetKey);
  const currentDpi = storedPreset?.dpi || appState.get('dpi') || 300;
  const zoom = Math.round((appState.get('zoom') || 1) * 100);
  const { width: pxW, height: pxH } = getTargetDimensions();
  const isBn = appState.get('lang') === 'bn';

  const { wMm, hMm, wInch, hInch } = calculateDimensions(presetKey, custom, currentDpi);
  const mmUnit = isBn ? 'মিমি' : 'mm';
  const inchUnit = isBn ? 'ইঞ্চি' : 'in';
  const pxUnit = isBn ? 'পিক্সেল' : 'px';

  const wMmStr = formatNumber(wMm, isBn);
  const hMmStr = formatNumber(hMm, isBn);
  const wInchStr = formatNumber(wInch, isBn);
  const hInchStr = formatNumber(hInch, isBn);
  const pxWFormatted = isBn ? toBengaliNumeral(pxW) : pxW;
  const pxHFormatted = isBn ? toBengaliNumeral(pxH) : pxH;
  const zoomFormatted = isBn ? toBengaliNumeral(zoom) : zoom;
  const dpiFormatted = isBn ? `${toBengaliNumeral(currentDpi)} DPI` : `${currentDpi} DPI`;

  let nameStr = 'BD Passport';
  if (storedPreset) {
    if (storedPreset.isBuiltin && !storedPreset.isCustomized) {
      nameStr = t(`preset_${storedPreset.id}`) || storedPreset.name;
    } else {
      nameStr = `⭐ ${storedPreset.name}`;
    }
  } else if (presetKey === 'custom') {
    nameStr = t('preset_custom') || 'Custom Size';
  } else {
    nameStr = t(`preset_${presetKey}`) || PHOTO_PRESETS[presetKey]?.name || presetKey;
  }

  const elTitle = document.getElementById('dimPresetTitle');
  const elMm = document.getElementById('dimMmDetails');
  const elInch = document.getElementById('dimInchDetails');
  const elPx = document.getElementById('dimPxDetails');
  const elDpi = document.getElementById('dimDpiDetails');
  const elZoom = document.getElementById('dimZoomPercent');
  const elRulerW = document.getElementById('rulerWidthText');
  const elRulerH = document.getElementById('rulerHeightText');

  if (elTitle) elTitle.textContent = nameStr;
  if (elMm) elMm.textContent = `${wMmStr} x ${hMmStr} ${mmUnit}`;
  if (elInch) elInch.textContent = `${wInchStr} x ${hInchStr}"`;
  if (elPx) elPx.textContent = `${pxWFormatted} x ${pxHFormatted} ${pxUnit}`;
  if (elDpi) elDpi.textContent = dpiFormatted;
  if (elZoom) elZoom.textContent = `🔍 ${zoomFormatted}%`;
  if (elRulerW) elRulerW.textContent = `${wMmStr} ${mmUnit} (${pxWFormatted}px)`;
  if (elRulerH) elRulerH.textContent = `${hMmStr} ${mmUnit} (${pxHFormatted}px)`;

  const canvasContainer = document.querySelector('.canvas-container');
  if (canvasContainer && pxW && pxH) {
    canvasContainer.style.aspectRatio = `${pxW} / ${pxH}`;
  }
}
