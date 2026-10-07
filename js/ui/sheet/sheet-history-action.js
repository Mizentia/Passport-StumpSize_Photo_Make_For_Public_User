import { appState } from '../../core/state.js';
import { batchManager } from '../../core/batch-manager.js';
import { toastService } from '../toast-service.js';

export async function addHistoryPhotoToSheetQueue(record, triggerSheetRedraw) {
  const isBn = appState.get('lang') === 'bn';
  const existing = batchManager.getAll().find(i => i.id === record.id || (i.name === record.name && i.thumbDataUrl === record.thumbDataUrl));
  if (existing) {
    existing.quantityOnSheet = (existing.quantityOnSheet || 4) + 2;
    toastService.show(isBn ? 'কপি বাড়ানো হয়েছে (+২)' : 'Copies increased (+2)', 'info');
    triggerSheetRedraw();
    return;
  }

  const snap = record.snapshot || {};
  const origImg = new Image();
  origImg.crossOrigin = 'Anonymous';
  await new Promise((res) => { origImg.onload = res; origImg.onerror = res; origImg.src = snap.originalImageData || record.thumbDataUrl; });

  let segImg = null;
  if (snap.segmentedImageData) {
    segImg = new Image(); segImg.crossOrigin = 'Anonymous';
    await new Promise((res) => { segImg.onload = res; segImg.onerror = res; segImg.src = snap.segmentedImageData; });
  }

  const prevActiveId = batchManager.activeId;
  const item = batchManager.addPhoto(origImg, record.name || 'History Photo');
  if (prevActiveId) batchManager.activeId = prevActiveId;

  if (item) {
    item.id = record.id || item.id;
    item.thumbDataUrl = record.thumbDataUrl || item.thumbDataUrl;
    item.editorThumbDataUrl = record.thumbDataUrl || item.thumbDataUrl;
    item.segmentedImage = segImg;
    item.isBackgroundRemoved = !!snap.isBackgroundRemoved;
    item.backgroundColor = snap.backgroundColor || '#ffffff';
    item.cropOffset = { ...(snap.cropOffset || { x: 0, y: 0 }) };
    item.zoom = snap.zoom ?? 1; item.rotation = snap.rotation ?? 0;
    item.flipH = !!snap.flipH; item.flipV = !!snap.flipV;
    item.filters = { ...(snap.filters || {}) };
    item.selectedSuit = snap.selectedSuit || 'none'; item.suitScale = snap.suitScale ?? 1.0;
    item.suitOffsetX = snap.suitOffsetX ?? 0; item.suitOffsetY = snap.suitOffsetY ?? 0;
    item.suitCollarWidth = snap.suitCollarWidth ?? 1.0; item.suitRotation = snap.suitRotation ?? 0;
    item.customSize = { ...(snap.customSize || { widthMm: 40, heightMm: 50, unit: 'mm' }) };
    item.selectedPreset = snap.selectedPreset || 'bd_passport'; item.dpi = snap.dpi || 300;
    item.quantityOnSheet = 4; item.allowRowSpaceSharing = true; item.enabledForPrint = true;
  }
  toastService.show(isBn ? `✨ ${record.name} যুক্ত হয়েছে!` : `✨ Added ${record.name}!`, 'success');
  triggerSheetRedraw();
}
