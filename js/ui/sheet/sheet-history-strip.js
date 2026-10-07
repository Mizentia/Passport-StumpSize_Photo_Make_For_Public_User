import { appState } from '../../core/state.js';
import { getHistoryRecordsPaged } from '../../core/history-query.js';
import { toBengaliNumeral } from '../../config/i18n.js';
import { addHistoryPhotoToSheetQueue } from './sheet-history-action.js';

let historyOffset = 0;
const HISTORY_LIMIT = 14;
let loadedHistoryRecords = [];
let isFetchingHistory = false;

export { addHistoryPhotoToSheetQueue };

export async function loadAndRenderSessionHistoryStrip(triggerSheetRedraw, append = false, forceRefresh = false) {
  const container = document.getElementById('sheetHistoryStripContainer');
  const countBadge = document.getElementById('sheetHistoryCountBadge');
  const btnLoadMore = document.getElementById('btnLoadMoreSheetHistory');
  if (!container || isFetchingHistory) return;

  if (!append && !forceRefresh && loadedHistoryRecords.length > 0 && container.children.length > 0) {
    return;
  }

  isFetchingHistory = true;
  if (!append) { historyOffset = 0; loadedHistoryRecords = []; container.innerHTML = '<div style="font-size: 0.74rem; color: var(--text-dim); padding: 8px;">⏳ Loading...</div>'; }

  try {
    const { items, total, hasMore } = await getHistoryRecordsPaged({ type: 'all', offset: historyOffset, limit: HISTORY_LIMIT });
    if (!append) container.innerHTML = '';
    const isBn = appState.get('lang') === 'bn';

    if (items.length === 0 && loadedHistoryRecords.length === 0) {
      container.innerHTML = `<div style="font-size: 0.74rem; color: var(--text-dim); padding: 12px; width: 100%; text-align: center;">${isBn ? 'হিস্ট্রিতে কোনো ছবি নেই।' : 'No saved history yet.'}</div>`;
      if (btnLoadMore) btnLoadMore.style.display = 'none';
      if (countBadge) countBadge.textContent = '';
      return;
    }

    loadedHistoryRecords = loadedHistoryRecords.concat(items);
    historyOffset += items.length;
    if (countBadge) countBadge.textContent = isBn ? `${toBengaliNumeral(total)}টি` : `${total}`;

    items.forEach((rec) => {
      const card = document.createElement('div');
      card.className = 'sheet-history-thumb-card';
      card.title = `${rec.name} (Click to add to sheet)`;

      const img = document.createElement('img');
      img.src = rec.thumbDataUrl || rec.snapshot?.originalImageData || '';
      img.style.cssText = 'width: 36px; height: 44px; object-fit: cover; border-radius: 4px; background: #fff; border: 1px solid var(--border-subtle); flex-shrink: 0;';

      const info = document.createElement('div');
      info.style.cssText = 'flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px;';
      const wMm = rec.snapshot?.customSize?.widthMm || 40, hMm = rec.snapshot?.customSize?.heightMm || 50;
      const wStr = isBn ? toBengaliNumeral(Math.round(wMm)) : Math.round(wMm);
      const hStr = isBn ? toBengaliNumeral(Math.round(hMm)) : Math.round(hMm);
      info.innerHTML = `
        <div style="font-size: 0.76rem; font-weight: 700; color: var(--text-main); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${rec.name}</div>
        <div style="font-size: 0.68rem; color: var(--accent-primary); font-weight: 600;">${wStr}x${hStr} mm</div>
      `;

      const addBtn = document.createElement('span');
      addBtn.style.cssText = 'font-size: 0.75rem; color: var(--accent-primary); padding: 2px 6px; font-weight: 700;';
      addBtn.textContent = '➕';

      card.appendChild(img); card.appendChild(info); card.appendChild(addBtn);
      card.addEventListener('click', () => addHistoryPhotoToSheetQueue(rec, triggerSheetRedraw));
      container.appendChild(card);
    });

    if (btnLoadMore) {
      btnLoadMore.style.display = hasMore ? 'inline-block' : 'none';
      btnLoadMore.onclick = () => loadAndRenderSessionHistoryStrip(triggerSheetRedraw, true);
    }
  } catch (e) { console.warn('History strip error:', e); }
  finally { isFetchingHistory = false; }
}
