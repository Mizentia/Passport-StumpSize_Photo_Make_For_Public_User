import { appState } from './state.js';
import { getHistoryRecordById } from './history-store.js';
import { batchManager } from './batch-manager.js';
import { historyManager } from './history-manager.js';
import { renderPhotoToCanvas } from './canvas-engine.js';
import { updateUIFromState } from '../ui/editor-transform-ui.js';

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

export async function restoreHistoryRecord(recordOrId, tabManager = null) {
  const record = typeof recordOrId === 'string' ? await getHistoryRecordById(recordOrId) : recordOrId;
  if (!record || !record.snapshot) return false;

  const s = record.snapshot;
  const [origImg, segImg] = await Promise.all([
    dataUrlToImage(s.originalImageData),
    dataUrlToImage(s.segmentedImageData)
  ]);

  if (!origImg) return false;

  appState.update({
    originalImage: origImg,
    segmentedImage: segImg,
    isBackgroundRemoved: s.isBackgroundRemoved,
    backgroundColor: s.backgroundColor,
    bgTolerance: s.bgTolerance || 45,
    selectedPreset: s.selectedPreset || 'bd_passport',
    customSize: s.customSize || { widthMm: 40, heightMm: 50, unit: 'mm' },
    zoom: s.zoom || 1,
    rotation: s.rotation || 0,
    flipH: s.flipH || false,
    flipV: s.flipV || false,
    cropOffset: s.cropOffset || { x: 0, y: 0 },
    filters: s.filters || {},
    selectedSuit: s.selectedSuit || 'none',
    suitScale: s.suitScale ?? 1.0,
    suitOffsetX: s.suitOffsetX ?? 0,
    suitOffsetY: s.suitOffsetY ?? 0,
    suitCollarWidth: s.suitCollarWidth ?? 1.0,
    suitRotation: s.suitRotation ?? 0,
    dpi: s.dpi || 300
  });

  if (record.type === 'draft') {
    historyManager.setCurrentDraftId(record.id);
  } else {
    historyManager.resetCurrentDraftId();
  }

  batchManager.addPhoto(origImg, record.name || 'Restored Photo');

  const mainCanvas = document.getElementById('mainCanvas');
  if (mainCanvas) renderPhotoToCanvas(mainCanvas);
  updateUIFromState();

  if (tabManager && typeof tabManager.switchTab === 'function') {
    tabManager.switchTab('editor');
  } else {
    document.querySelector('.step-btn[data-tab="editor"]')?.click();
  }

  return true;
}
