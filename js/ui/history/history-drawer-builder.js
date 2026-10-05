import { appState } from '../../core/state.js';
import { toBengaliNumeral } from '../../config/i18n.js';
import { restoreHistoryRecord } from '../../core/history-restorer.js';

export function buildHistoryDrawerElement(record, tabManager, onClose) {
  const isBn = appState.get('lang') === 'bn';
  const drawer = document.createElement('div');
  drawer.className = 'batch-hover-drawer history-stage-drawer';

  const editThumb = record.thumbDataUrl;
  const snap = record.snapshot || {};
  const presetLabel = (snap.selectedPreset || record.preset || 'Passport').replace(/_/g, ' ').toUpperCase();
  const cSize = snap.customSize ? `${Math.round(snap.customSize.widthMm)}x${Math.round(snap.customSize.heightMm)}mm` : '';

  drawer.innerHTML = `
    <div class="drawer-inner">
      <div class="drawer-header-row">
        <span class="drawer-header-title">⚡ ${isBn ? 'স্টেজ প্রিভিউ ও জাম্প' : 'Stage Preview & Jump'}</span>
        <button class="drawer-header-close" type="button" aria-label="Close">✕</button>
      </div>
      <div class="drawer-stages-row">
        <div class="drawer-step-item drawer-history-editor" title="${isBn ? 'স্টুডিও এডিটরে খুলুন' : 'Open in Studio Editor'}">
          <div class="drawer-thumb-wrap">
            <img src="${editThumb}" class="drawer-thumb" alt="Studio Edit">
            <span class="drawer-thumb-badge">${cSize || presetLabel}</span>
          </div>
          <span class="drawer-step-sub">${isBn ? '২. স্টুডিও এডিটর' : '2. Editor'}</span>
        </div>
        ${buildHistorySheetPagesHtml(editThumb, isBn)}
      </div>
    </div>`;

  drawer.querySelector('.drawer-header-close')?.addEventListener('click', (e) => {
    e.stopPropagation(); onClose();
  });
  drawer.querySelector('.drawer-history-editor')?.addEventListener('click', async (e) => {
    e.stopPropagation(); onClose();
    await restoreHistoryRecord(record, tabManager);
    tabManager?.switchTab('editor');
  });
  drawer.querySelectorAll('.drawer-history-sheet').forEach((el) => {
    el.addEventListener('click', async (e) => {
      e.stopPropagation(); onClose();
      await restoreHistoryRecord(record, tabManager);
      tabManager?.switchTab('sheet');
      const p = el.dataset.page;
      if (p !== undefined) setTimeout(() => document.querySelector(`.sheet-page-card[data-page="${Number(p) + 1}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 120);
    });
  });

  return drawer;
}

function buildHistorySheetPagesHtml(fallbackThumb, isBn) {
  const pages = (typeof window !== 'undefined' && window._renderedSheetPages) || [];
  if (pages.length >= 1) {
    return pages.map((canvas, i) => {
      const p = isBn ? toBengaliNumeral(i + 1) : i + 1;
      return `
        <div class="drawer-step-item drawer-history-sheet" data-page="${i}" title="${isBn ? `প্রিন্ট শীট পৃষ্ঠা ${p}` : `Print Sheet Page ${p}`}">
          <div class="drawer-thumb-wrap">
            <img src="${canvas.toDataURL('image/jpeg', 0.6)}" class="drawer-thumb drawer-sheet-thumb" alt="Sheet Page ${i + 1}">
            <span class="drawer-thumb-badge">${isBn ? `পৃষ্ঠা ${p}` : `Page ${p}`}</span>
          </div>
          <span class="drawer-step-sub">${isBn ? `৩. শীট (${p})` : `3. Sheet (${p})`}</span>
        </div>`;
    }).join('');
  }
  return `
    <div class="drawer-step-item drawer-history-sheet" data-page="0" title="${isBn ? 'প্রিন্ট শীটে ভিউ করুন' : 'View in Print Sheet'}">
      <div class="drawer-thumb-wrap">
        <img src="${fallbackThumb}" class="drawer-thumb drawer-sheet-thumb" alt="Sheet View">
        <span class="drawer-thumb-badge">${isBn ? 'শীট ভিউ' : 'Sheet'}</span>
      </div>
      <span class="drawer-step-sub">${isBn ? '৩. প্রিন্ট শীট' : '3. Sheet'}</span>
    </div>`;
}
