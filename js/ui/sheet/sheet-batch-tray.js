import { batchManager } from '../../core/batch-manager.js';
import { appState } from '../../core/state.js';
import { generateThumbDataUrl } from '../../core/history-snapshot-builder.js';
import { toBengaliNumeral } from '../../config/i18n.js';
import { loadAndRenderSessionHistoryStrip } from './sheet-history-strip.js';
import { createPhotoQueueRowElement } from './sheet-queue-row.js';

export { loadAndRenderSessionHistoryStrip };

export function renderSheetBatchTray(triggerSheetRedraw) {
  renderPhotoQueueList(triggerSheetRedraw);
}

let isSyncing = false;

export function initFreshStudioSheetQueue() {
  if (isSyncing) return;
  isSyncing = true;
  try {
    const origImg = appState.get('originalImage');
    if (!origImg) return;

    const preset = appState.get('selectedPreset') || 'bd_passport';
    const cSize = appState.get('customSize') || { widthMm: 40, heightMm: 50 };
    const name = `${preset.toUpperCase().replace('_', ' ')} (${Math.round(cSize.widthMm)}x${Math.round(cSize.heightMm)}mm)`;
    let thumb = null;
    try { thumb = generateThumbDataUrl(); } catch (_) {}

    const id = 'photo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    const item = {
      id, name, originalImage: origImg, segmentedImage: appState.get('segmentedImage') || null,
      isBackgroundRemoved: !!appState.get('isBackgroundRemoved'), backgroundColor: appState.get('backgroundColor') || '#ffffff',
      cropOffset: { ...(appState.get('cropOffset') || { x: 0, y: 0 }) }, zoom: appState.get('zoom') || 1,
      rotation: appState.get('rotation') || 0, flipH: !!appState.get('flipH'), flipV: !!appState.get('flipV'),
      filters: { ...(appState.get('filters') || {}) }, selectedSuit: appState.get('selectedSuit') || 'none',
      suitScale: appState.get('suitScale') ?? 1.0, suitOffsetX: appState.get('suitOffsetX') ?? 0, suitOffsetY: appState.get('suitOffsetY') ?? 0,
      suitCollarWidth: appState.get('suitCollarWidth') ?? 1.0, suitRotation: appState.get('suitRotation') ?? 0,
      selectedPreset: preset, customSize: { ...cSize }, dpi: appState.get('dpi') || 300,
      quantityOnSheet: appState.get('sheetCopies') || 6, allowRowSpaceSharing: true, enabledForPrint: true,
      thumbDataUrl: thumb, editorThumbDataUrl: thumb, timestamp: Date.now()
    };

    batchManager.items = [item];
    batchManager.activeId = item.id;
  } finally {
    isSyncing = false;
  }
}

function ensureActivePhotoInBatch() {
  if (isSyncing) return;
  const items = batchManager.getAll();
  const origImg = appState.get('originalImage');
  if (items.length === 0 && origImg) {
    initFreshStudioSheetQueue();
  }
}

export function renderPhotoQueueList(triggerSheetRedraw) {
  const container = document.getElementById('sheetPhotoQueueList');
  if (!container) return;

  ensureActivePhotoInBatch();
  const items = batchManager.getAll();
  const isBn = appState.get('lang') === 'bn';

  if (items.length === 0) {
    container.innerHTML = `<div style="padding: 12px; text-align: center; color: var(--text-dim); font-size: 0.8rem; background: var(--bg-inset); border-radius: var(--radius-md); border: 1px dashed var(--border-subtle);">${isBn ? '⚠️ কোনো ছবি পাওয়া যায়নি।' : '⚠️ No photo loaded.'}</div>`;
    return;
  }

  container.innerHTML = '';
  let totalPhotos = 0;

  items.forEach((item) => {
    totalPhotos += Math.max(1, Number(item.quantityOnSheet) || 1);
    const row = createPhotoQueueRowElement(item, items.length, isBn, triggerSheetRedraw);
    container.appendChild(row);
  });

  const badge = document.getElementById('sheetCapacityBadge');
  if (badge) {
    badge.textContent = isBn ? `${toBengaliNumeral(totalPhotos)}টি ছবি` : `${totalPhotos} photos`;
  }
}
