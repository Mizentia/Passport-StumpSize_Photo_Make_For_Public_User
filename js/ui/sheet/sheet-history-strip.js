import { appState } from '../../core/state.js';
import { batchManager } from '../../core/batch-manager.js';
import { getHistoryRecordsPaged } from '../../core/history-query.js';
import { toBengaliNumeral } from '../../config/i18n.js';
import { toastService } from '../toast-service.js';

let historyOffset = 0;
const HISTORY_LIMIT = 14;
let loadedHistoryRecords = [];

export async function loadAndRenderSessionHistoryStrip(triggerSheetRedraw, append = false) {
  const container = document.getElementById('sheetHistoryStripContainer');
  const countBadge = document.getElementById('sheetHistoryCountBadge');
  const btnLoadMore = document.getElementById('btnLoadMoreSheetHistory');
  if (!container) return;

  if (!append) { historyOffset = 0; loadedHistoryRecords = []; container.innerHTML = '<div style="font-size: 0.75rem; color: var(--text-dim); padding: 8px;">⏳ Loading...</div>'; }

  try {
    const { items, total, hasMore } = await getHistoryRecordsPaged({ type: 'all', offset: historyOffset, limit: HISTORY_LIMIT });
    if (!append) container.innerHTML = '';
    const isBn = appState.get('lang') === 'bn';

    if (items.length === 0 && loadedHistoryRecords.length === 0) {
      container.innerHTML = `<div style="font-size: 0.74rem; color: var(--text-dim); padding: 8px; width: 100%; text-align: center;">${isBn ? 'হিস্ট্রিতে কোনো ছবি নেই।' : 'No saved history yet.'}</div>`;
      if (btnLoadMore) btnLoadMore.style.display = 'none';
      if (countBadge) countBadge.textContent = '';
      return;
    }

    loadedHistoryRecords = loadedHistoryRecords.concat(items);
    historyOffset += items.length;
    if (countBadge) countBadge.textContent = isBn ? `মোট: ${toBengaliNumeral(total)}টি` : `Total: ${total}`;

    items.forEach((rec) => {
      const card = document.createElement('div');
      card.className = 'sheet-history-thumb-card';
      card.title = `${rec.name} (Click to add to Sheet)`;
      card.style.cssText = 'display: flex; flex-direction: column; align-items: center; width: 54px; flex-shrink: 0; cursor: pointer; padding: 4px; border-radius: var(--radius-sm); background: var(--bg-card); border: 1px solid var(--border-subtle);';

      const img = document.createElement('img');
      img.src = rec.thumbDataUrl || rec.snapshot?.originalImageData || '';
      img.style.cssText = 'width: 44px; height: 54px; object-fit: cover; border-radius: 3px; background: #fff; border: 1px solid var(--border-subtle);';

      const tag = document.createElement('span');
      tag.style.cssText = 'font-size: 0.62rem; font-weight: 700; color: var(--accent-primary); margin-top: 2px; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;';
      const wMm = rec.snapshot?.customSize?.widthMm || 40, hMm = rec.snapshot?.customSize?.heightMm || 50;
      tag.textContent = `${Math.round(wMm)}x${Math.round(hMm)}`;

      card.appendChild(img); card.appendChild(tag);
      card.addEventListener('click', () => addHistoryPhotoToSheetQueue(rec, triggerSheetRedraw));
      container.appendChild(card);
    });

    if (btnLoadMore) {
      btnLoadMore.style.display = hasMore ? 'inline-block' : 'none';
      btnLoadMore.onclick = () => loadAndRenderSessionHistoryStrip(triggerSheetRedraw, true);
    }
  } catch (e) { console.warn('History strip error:', e); }
}

async function addHistoryPhotoToSheetQueue(record, triggerSheetRedraw) {
  const isBn = appState.get('lang') === 'bn';
  const existing = batchManager.getAll().find(i => i.id === record.id || i.name === record.name);
  if (existing) {
    existing.quantityOnSheet = (existing.quantityOnSheet || 4) + 2;
    toastService.show(isBn ? 'কপি সংখ্যা বাড়ানো হয়েছে (+২)' : 'Copies increased (+2)', 'info');
    triggerSheetRedraw();
    return;
  }

  const origImg = new Image();
  origImg.crossOrigin = 'Anonymous';
  await new Promise((resolve) => {
    origImg.onload = resolve; origImg.onerror = resolve;
    origImg.src = record.snapshot?.originalImageData || record.thumbDataUrl;
  });

  const snap = record.snapshot || {};
  const item = batchManager.addPhoto(origImg, record.name || 'History Photo');
  if (item) {
    item.id = record.id || item.id;
    item.thumbDataUrl = record.thumbDataUrl;
    item.quantityOnSheet = 4;
    item.allowRowSpaceSharing = true;
    item.customSize = { ...(snap.customSize || { widthMm: 40, heightMm: 50 }) };
    item.selectedPreset = snap.selectedPreset || 'bd_passport';
    item.isBackgroundRemoved = !!snap.isBackgroundRemoved;
    item.backgroundColor = snap.backgroundColor || '#ffffff';
  }
  toastService.show(isBn ? `✨ ${record.name} যুক্ত হয়েছে!` : `✨ Added ${record.name}!`, 'success');
  triggerSheetRedraw();
}
