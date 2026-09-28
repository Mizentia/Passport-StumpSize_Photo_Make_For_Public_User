import { batchManager } from '../../core/batch-manager.js';
import { appState } from '../../core/state.js';
import { generateThumbDataUrl } from '../../core/history-snapshot-builder.js';
import { toBengaliNumeral } from '../../config/i18n.js';
import { loadAndRenderSessionHistoryStrip } from './sheet-history-strip.js';
import { createPhotoQueueRowElement } from './sheet-queue-row.js';

export { loadAndRenderSessionHistoryStrip };

export function renderSheetBatchTray(triggerSheetRedraw) {
  renderPhotoQueueList(triggerSheetRedraw);
  loadAndRenderSessionHistoryStrip(triggerSheetRedraw, false);
}

function ensureActivePhotoInBatch() {
  const items = batchManager.getAll();
  const origImg = appState.get('originalImage');
  if (items.length === 0 && origImg) {
    const preset = appState.get('selectedPreset') || 'bd_passport';
    const cSize = appState.get('customSize') || { widthMm: 40, heightMm: 50 };
    const name = `${preset.toUpperCase().replace('_', ' ')} (${Math.round(cSize.widthMm)}x${Math.round(cSize.heightMm)}mm)`;
    const thumb = generateThumbDataUrl();
    const item = batchManager.addPhoto(origImg, name);
    if (item) {
      item.thumbDataUrl = thumb;
      item.quantityOnSheet = appState.get('sheetCopies') || 6;
      item.allowRowSpaceSharing = true;
      item.customSize = { ...cSize };
      item.selectedPreset = preset;
    }
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
    badge.textContent = isBn ? `${toBengaliNumeral(totalPhotos)}টি ছবি কিউতে` : `${totalPhotos} photos in queue`;
  }
}
