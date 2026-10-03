import { appState } from '../../core/state.js';
import { restoreHistoryRecord } from '../../core/history-restorer.js';
import { positionFloatingDrawer } from '../drawer-position-helper.js';

let activeHistoryDrawer = null;
let drawerHideTimer = null;

export function removeActiveHistoryDrawer() {
  if (drawerHideTimer) { clearTimeout(drawerHideTimer); drawerHideTimer = null; }
  if (activeHistoryDrawer) { activeHistoryDrawer.remove(); activeHistoryDrawer = null; }
}

export function attachHistoryCardHoverDrawer(card, record, tabManager) {
  card.addEventListener('mouseenter', () => {
    if (drawerHideTimer) { clearTimeout(drawerHideTimer); drawerHideTimer = null; }
    removeActiveHistoryDrawer();
    showHistoryDrawer(card, record, tabManager);
  });
  card.addEventListener('mouseleave', (e) => {
    if (activeHistoryDrawer && e.relatedTarget && activeHistoryDrawer.contains(e.relatedTarget)) return;
    drawerHideTimer = setTimeout(removeActiveHistoryDrawer, 220);
  });
}

function showHistoryDrawer(card, record, tabManager) {
  const isBn = appState.get('lang') === 'bn';
  const drawer = document.createElement('div');
  drawer.className = 'batch-hover-drawer history-stage-drawer';
  activeHistoryDrawer = drawer;

  const originalThumb = record.snapshot?.originalImageData || record.thumbDataUrl;
  const editorThumb = record.thumbDataUrl;
  const snap = record.snapshot || {};
  const presetLabel = (snap.selectedPreset || record.preset || 'Passport').replace(/_/g, ' ').toUpperCase();
  const cSize = snap.customSize ? `${Math.round(snap.customSize.widthMm)}x${Math.round(snap.customSize.heightMm)}mm` : '';

  drawer.innerHTML = `
    <div class="drawer-inner">
      <div class="drawer-header-title">⚡ ${isBn ? 'কুইক স্টেজ জাম্প (হিস্টোরি):' : 'Quick Stage Jump (History):'}</div>
      <div class="drawer-stages-row">
        <div class="drawer-step-item drawer-history-original" title="${isBn ? 'মূল ছবি এডিটরে খুলুন' : 'Open original photo in editor'}">
          <div class="drawer-thumb-wrap">
            <img src="${originalThumb}" class="drawer-thumb" alt="Original Photo">
            <span class="drawer-thumb-badge">${isBn ? 'মূল ছবি' : 'Original'}</span>
          </div>
          <span class="drawer-step-sub">${isBn ? '১. মূল ছবি' : '1. Original'}</span>
        </div>
        <div class="drawer-step-item drawer-history-editor" title="${isBn ? 'ক্রপ ও এডিট মোডে খুলুন' : 'Open cropped in Studio Editor'}">
          <div class="drawer-thumb-wrap">
            <img src="${editorThumb}" class="drawer-thumb" alt="Editor Crop">
            <span class="drawer-thumb-badge">${cSize || presetLabel}</span>
          </div>
          <span class="drawer-step-sub">${isBn ? '২. এডিটর' : '2. Editor'}</span>
        </div>
        <div class="drawer-step-item drawer-history-sheet" title="${isBn ? 'প্রিন্ট শীটে ভিউ করুন' : 'View in Print Sheet'}">
          <div class="drawer-thumb-wrap">
            <img src="${editorThumb}" class="drawer-thumb drawer-sheet-thumb" alt="Sheet View">
            <span class="drawer-thumb-badge">${isBn ? 'শীট ভিউ' : 'Sheet'}</span>
          </div>
          <span class="drawer-step-sub">${isBn ? '৩. প্রিন্ট শীট' : '3. Sheet'}</span>
        </div>
      </div>
    </div>`;

  drawer.addEventListener('mouseenter', () => {
    if (drawerHideTimer) { clearTimeout(drawerHideTimer); drawerHideTimer = null; }
  });
  drawer.addEventListener('mouseleave', (e) => {
    if (e.relatedTarget && card.contains(e.relatedTarget)) return;
    drawerHideTimer = setTimeout(removeActiveHistoryDrawer, 220);
  });

  drawer.querySelector('.drawer-history-original')?.addEventListener('click', async (e) => {
    e.stopPropagation();
    removeActiveHistoryDrawer();
    await restoreHistoryRecord(record, tabManager);
  });
  drawer.querySelector('.drawer-history-editor')?.addEventListener('click', async (e) => {
    e.stopPropagation();
    removeActiveHistoryDrawer();
    await restoreHistoryRecord(record, tabManager);
  });
  drawer.querySelector('.drawer-history-sheet')?.addEventListener('click', async (e) => {
    e.stopPropagation();
    removeActiveHistoryDrawer();
    await restoreHistoryRecord(record, tabManager);
    tabManager?.switchTab('sheet');
  });

  document.body.appendChild(drawer);
  positionFloatingDrawer(drawer, card);
}
