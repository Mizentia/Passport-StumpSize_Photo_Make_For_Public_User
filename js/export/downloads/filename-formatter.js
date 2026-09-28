import { appState } from '../../core/state.js';
import { t } from '../../config/i18n.js';
import { calculateDimensions } from '../../ui/editor-dimension-ui.js';

export function formatFileName({ type = 'photo', ext = 'jpg', customPreset = null, customDpi = null, pageIndex = null }) {
  const tokenOrder = appState.get('namingTokensOrder') || ['agency', 'preset', 'dimensions', 'dpi', 'date'];
  const separator = appState.get('namingSeparator') || '_';
  const studioVal = appState.get('studioName') || 'Passport & Stamp Studio Pro';
  const studioClean = studioVal.replace(/[^a-zA-Z0-9_\u0980-\u09FF-]/g, '-');
  const dpiVal = customDpi || appState.get('dpi') || 300;
  const presetKey = customPreset || appState.get('selectedPreset') || 'bd_passport';
  const customSize = appState.get('customSize') || { widthMm: 40, heightMm: 50, unit: 'mm' };
  
  const { wMm, hMm } = calculateDimensions(presetKey, customSize, dpiVal);
  const presetNameClean = (presetKey === 'custom' ? 'Custom-Size' : (t(`preset_${presetKey}`) || presetKey)).replace(/[^a-zA-Z0-9_\u0980-\u09FF-]/g, '-');
  const dimStr = `${Math.round(wMm)}x${Math.round(hMm)}mm`;
  const dateStr = new Date().toISOString().slice(0, 10);
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;

  const tokenValues = {
    agency: studioClean, preset: presetNameClean, dimensions: dimStr, dpi: `${dpiVal}DPI`, date: dateStr, time: timeStr
  };
  const parts = tokenOrder.map((tok) => tokenValues[tok]).filter(Boolean);
  if (type === 'sheet') parts.push(pageIndex ? `Sheet-Page${pageIndex}` : 'Sheet');
  const baseName = parts.length > 0 ? parts.join(separator) : `Studio_${presetNameClean}_${dpiVal}DPI`;
  return `${baseName}.${ext}`;
}
