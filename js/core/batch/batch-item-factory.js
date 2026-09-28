import { appState } from '../state.js';
import { renderPhotoToCanvas } from '../canvas-engine.js';
import { imageToDataUrl } from '../history-snapshot-builder.js';

export function createBatchItem(img, name, count) {
  const id = 'photo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
  let thumbDataUrl = null;
  try {
    thumbDataUrl = imageToDataUrl(img);
  } catch (_) {}

  return {
    id, name: `${name} ${count + 1}`, originalImage: img, segmentedImage: null,
    isBackgroundRemoved: false, backgroundColor: appState.get('defaultBackdropColor') || '#ffffff',
    cropOffset: { x: 0, y: 0 }, zoom: 1, rotation: 0, flipH: false, flipV: false,
    filters: { brightness: 100, contrast: 100, saturation: 100, sharpness: 25, smoothing: 0, warmth: 0, exposure: 0 },
    selectedSuit: 'none', suitScale: 1.0, suitOffsetX: 0, suitOffsetY: 0, suitCollarWidth: 1.0, suitRotation: 0,
    selectedPreset: appState.get('selectedPreset') || 'bd_passport',
    customSize: { ...(appState.get('customSize') || { widthMm: 40, heightMm: 50, unit: 'mm' }) },
    dpi: appState.get('dpi') || 300, quantityOnSheet: 4, enabledForPrint: true,
    thumbDataUrl, timestamp: Date.now()
  };
}

export function createHistoryItem(customName) {
  const orig = appState.get('originalImage');
  if (!orig) return null;
  const id = 'history_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
  const preset = appState.get('selectedPreset') || 'passport';
  const cSize = appState.get('customSize') || { widthMm: 40, heightMm: 50, unit: 'mm' };
  const name = customName || `${preset.toUpperCase()} (${Math.round(cSize.widthMm)}x${Math.round(cSize.heightMm)}mm)`;

  const thumbCanvas = document.createElement('canvas');
  renderPhotoToCanvas(thumbCanvas);
  const thumbDataUrl = thumbCanvas.toDataURL('image/jpeg', 0.85);

  return {
    id, name, originalImage: orig, segmentedImage: appState.get('segmentedImage'),
    isBackgroundRemoved: !!appState.get('isBackgroundRemoved'),
    backgroundColor: appState.get('backgroundColor') || '#ffffff',
    cropOffset: { ...(appState.get('cropOffset') || { x: 0, y: 0 }) },
    zoom: appState.get('zoom') || 1, rotation: appState.get('rotation') || 0,
    flipH: !!appState.get('flipH'), flipV: !!appState.get('flipV'),
    filters: { ...(appState.get('filters') || {}) },
    selectedSuit: appState.get('selectedSuit') || 'none', suitScale: appState.get('suitScale') || 1.0,
    suitOffsetX: appState.get('suitOffsetX') || 0, suitOffsetY: appState.get('suitOffsetY') || 0,
    suitCollarWidth: appState.get('suitCollarWidth') || 1.0, suitRotation: appState.get('suitRotation') || 0,
    selectedPreset: preset, customSize: { ...cSize }, dpi: appState.get('dpi') || 300,
    quantityOnSheet: 4, enabledForPrint: true, thumbDataUrl, timestamp: Date.now()
  };
}
