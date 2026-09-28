import { renderPhotoToCanvas } from './canvas-engine.js';

export function captureStateSnapshot(appState) {
  const orig = appState.get('originalImage');
  if (!orig) return null;
  const seg = appState.get('segmentedImage');

  return {
    originalImageData: imageToDataUrl(orig),
    segmentedImageData: seg ? imageToDataUrl(seg) : null,
    isBackgroundRemoved: !!appState.get('isBackgroundRemoved'),
    backgroundColor: appState.get('backgroundColor') || '#ffffff',
    bgTolerance: appState.get('bgTolerance') || 45,
    selectedPreset: appState.get('selectedPreset') || 'bd_passport',
    customSize: { ...(appState.get('customSize') || { widthMm: 40, heightMm: 50, unit: 'mm' }) },
    zoom: appState.get('zoom') || 1,
    rotation: appState.get('rotation') || 0,
    flipH: !!appState.get('flipH'),
    flipV: !!appState.get('flipV'),
    cropOffset: { ...(appState.get('cropOffset') || { x: 0, y: 0 }) },
    filters: { ...(appState.get('filters') || {}) },
    selectedSuit: appState.get('selectedSuit') || 'none',
    suitScale: appState.get('suitScale') ?? 1.0,
    suitOffsetX: appState.get('suitOffsetX') ?? 0,
    suitOffsetY: appState.get('suitOffsetY') ?? 0,
    suitCollarWidth: appState.get('suitCollarWidth') ?? 1.0,
    suitRotation: appState.get('suitRotation') ?? 0,
    dpi: appState.get('dpi') || 300,
    timestamp: Date.now()
  };
}

export function generateThumbDataUrl() {
  const thumbCanvas = document.createElement('canvas');
  renderPhotoToCanvas(thumbCanvas);
  return thumbCanvas.toDataURL('image/jpeg', 0.85);
}

export function imageToDataUrl(img) {
  if (!img) return null;
  if (typeof img === 'string') return img;
  if (img.src && img.src.startsWith('data:')) return img.src;
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth || img.width || 300;
  canvas.height = img.naturalHeight || img.height || 300;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL('image/png');
}
