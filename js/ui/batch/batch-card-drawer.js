import { appState } from '../../core/state.js';
import { batchManager } from '../../core/batch-manager.js';
import { renderPhotoToCanvas } from '../../core/canvas-engine.js';
import { updateUIFromState } from '../editor-transform-ui.js';
import { toBengaliNumeral } from '../../config/i18n.js';
import { positionFloatingDrawer } from '../drawer-position-helper.js';

let activeDrawer = null;
let drawerHideTimer = null;

export function removeActiveDrawer() {
  if (drawerHideTimer) { clearTimeout(drawerHideTimer); drawerHideTimer = null; }
  if (activeDrawer) { activeDrawer.remove(); activeDrawer = null; }
}

export function attachCardHoverDrawer(card, item, mainCanvas, tabManager) {
  card.addEventListener('mouseenter', () => {
    if (drawerHideTimer) { clearTimeout(drawerHideTimer); drawerHideTimer = null; }
    removeActiveDrawer();
    showDrawer(card, item, mainCanvas, tabManager);
  });
  card.addEventListener('mouseleave', (e) => {
    if (activeDrawer && e.relatedTarget && activeDrawer.contains(e.relatedTarget)) return;
    drawerHideTimer = setTimeout(removeActiveDrawer, 220);
  });
}

function buildSheetItemsHtml(isBn) {
  const sheetCanvases = (typeof window !== 'undefined' && window._renderedSheetPages) || [];
  if (sheetCanvases.length > 0) {
    return sheetCanvases.map((canvas, idx) => {
      const pageStr = isBn ? toBengaliNumeral(idx + 1) : idx + 1;
      return `<div class="drawer-step-item drawer-sheet-item" data-page="${idx}">
        <div class="drawer-thumb-wrap">
          <img src="${canvas.toDataURL('image/jpeg', 0.6)}" class="drawer-thumb drawer-sheet-thumb" alt="Sheet ${idx + 1}">
          <span class="drawer-thumb-badge">${isBn ? `পৃষ্ঠা ${pageStr}` : `Page ${pageStr}`}</span>
        </div>
        <span class="drawer-step-sub">${isBn ? '৩. প্রিন্ট শীট' : 'Step 3: Sheet'}</span>
      </div>`;
    }).join('');
  }
  return `<div class="drawer-step-item drawer-sheet-item" data-page="0">
    <div class="drawer-thumb-wrap"><div class="drawer-thumb drawer-sheet-placeholder">🖨️</div>
      <span class="drawer-thumb-badge">${isBn ? 'শীট ভিউ' : 'Sheet View'}</span></div>
    <span class="drawer-step-sub">${isBn ? '৩. প্রিন্ট শীট' : 'Step 3: Sheet'}</span>
  </div>`;
}

function showDrawer(card, item, mainCanvas, tabManager) {
  const isBn = appState.get('lang') === 'bn';
  const drawer = document.createElement('div');
  drawer.className = 'batch-hover-drawer';
  activeDrawer = drawer;

  const editorThumb = item.editorThumbDataUrl || item.thumbDataUrl || item.originalImage?.src || '';
  const presetName = (item.selectedPreset || 'passport').replace(/_/g, ' ').toUpperCase();
  const sizeText = item.customSize ? `${Math.round(item.customSize.widthMm)}x${Math.round(item.customSize.heightMm)}mm` : '';

  drawer.innerHTML = `
    <div class="drawer-inner">
      <div class="drawer-header-title">⚡ ${isBn ? 'দ্রুত স্টেজ প্রিভিউ ও জাম্প:' : 'Quick Stage Jump:'}</div>
      <div class="drawer-stages-row">
        <div class="drawer-step-item drawer-editor-item">
          <div class="drawer-thumb-wrap">
            <img src="${editorThumb}" class="drawer-thumb drawer-editor-thumb" alt="Crop">
            <span class="drawer-thumb-badge">${sizeText || presetName}</span>
          </div>
          <span class="drawer-step-sub">${isBn ? '২. স্টুডিও এডিটর' : 'Step 2: Editor'}</span>
        </div>
        ${buildSheetItemsHtml(isBn)}
      </div>
    </div>`;

  drawer.addEventListener('mouseenter', () => { if (drawerHideTimer) clearTimeout(drawerHideTimer); });
  drawer.addEventListener('mouseleave', (e) => {
    if (e.relatedTarget && card.contains(e.relatedTarget)) return;
    drawerHideTimer = setTimeout(removeActiveDrawer, 220);
  });
  drawer.querySelector('.drawer-editor-item')?.addEventListener('click', (e) => {
    e.stopPropagation();
    removeActiveDrawer();
    batchManager.setActive(item.id);
    if (mainCanvas) renderPhotoToCanvas(mainCanvas);
    updateUIFromState();
    tabManager?.switchTab('editor');
  });
  drawer.querySelectorAll('.drawer-sheet-item').forEach((si) => {
    si.addEventListener('click', (e) => {
      e.stopPropagation();
      removeActiveDrawer();
      batchManager.setActive(item.id);
      tabManager?.switchTab('sheet');
    });
  });

  document.body.appendChild(drawer);
  positionFloatingDrawer(drawer, card);
}
