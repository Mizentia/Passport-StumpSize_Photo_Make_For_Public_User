import { putSessionRecord, getSessionRecord, deleteSessionRecord } from './indexeddb-helper.js';
import { historyManager } from './history-manager.js';

function imageToDataUrl(img) {
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

function dataUrlToImage(dataUrl) {
  return new Promise((resolve) => {
    if (!dataUrl) return resolve(null);
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = dataUrl;
  });
}

let saveTimeout = null;

export function autoSaveSession(appState) {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async () => {
    try {
      const orig = appState.get('originalImage');
      if (!orig) return;
      const origData = imageToDataUrl(orig);
      const seg = appState.get('segmentedImage');
      const segData = seg ? imageToDataUrl(seg) : null;

      const sessionData = {
        hasImage: true, originalImageData: origData, segmentedImageData: segData,
        isBackgroundRemoved: appState.get('isBackgroundRemoved') || false,
        backgroundColor: appState.get('backgroundColor') || '#ffffff',
        bgTolerance: appState.get('bgTolerance') || 45,
        selectedPreset: appState.get('selectedPreset') || 'bd_passport',
        customSize: appState.get('customSize') || { widthMm: 40, heightMm: 50, unit: 'mm' },
        activeTab: appState.get('activeTab') || 'editor',
        zoom: appState.get('zoom') || 1, rotation: appState.get('rotation') || 0,
        flipH: appState.get('flipH') || false, flipV: appState.get('flipV') || false,
        cropOffset: appState.get('cropOffset') || { x: 0, y: 0 },
        filters: appState.get('filters') || {}, selectedSuit: appState.get('selectedSuit') || 'none',
        suitScale: appState.get('suitScale') ?? 1.0, suitOffsetX: appState.get('suitOffsetX') ?? 0,
        suitOffsetY: appState.get('suitOffsetY') ?? 0, suitCollarWidth: appState.get('suitCollarWidth') ?? 1.0,
        suitRotation: appState.get('suitRotation') ?? 0, paperPreset: appState.get('paperPreset') || 'photo_4r',
        sheetLayoutMode: appState.get('sheetLayoutMode') || 'combo_4r_4p_4s',
        sheetCopies: appState.get('sheetCopies') || 6,
        includeBorder: appState.get('includeBorder') ?? true,
        includeCutMarks: appState.get('includeCutMarks') ?? true,
        currentDraftId: historyManager.getCurrentDraftId(),
        savedAt: Date.now()
      };
      await putSessionRecord(sessionData);
    } catch (err) {
      console.warn('Auto-save session warning:', err);
    }
  }, 250);
}

export async function restoreSavedSession() {
  try {
    const data = await getSessionRecord();
    if (!data || !data.originalImageData) return null;
    const [origImg, segImg] = await Promise.all([
      dataUrlToImage(data.originalImageData),
      data.segmentedImageData ? dataUrlToImage(data.segmentedImageData) : Promise.resolve(null)
    ]);
    if (!origImg) return null;
    return { ...data, originalImage: origImg, segmentedImage: segImg };
  } catch (err) {
    console.warn('Session restore warning:', err);
    return null;
  }
}

export async function clearSavedSession() {
  try { await deleteSessionRecord(); } catch (e) {}
}
