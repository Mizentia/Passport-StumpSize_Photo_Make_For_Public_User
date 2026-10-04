import { appState } from '../../core/state.js';
import { batchManager } from '../../core/batch-manager.js';
import { renderPhotoToCanvas } from '../../core/canvas-engine.js';
import { updateUIFromState } from '../editor-transform-ui.js';
import { toBengaliNumeral } from '../../config/i18n.js';

export function buildBatchDrawerElement(item, mainCanvas, tabManager, onClose) {
  const isBn = appState.get('lang') === 'bn';
  const drawer = document.createElement('div');
  drawer.className = 'batch-hover-drawer history-stage-drawer';

  const editorThumb = item.editorThumbDataUrl || item.thumbDataUrl || item.originalImage?.src || '';
  const presetName = (item.selectedPreset || 'passport').replace(/_/g, ' ').toUpperCase();
  const sizeText = item.customSize ? `${Math.round(item.customSize.widthMm)}x${Math.round(item.customSize.heightMm)}mm` : '';

  drawer.innerHTML = `
    <div class="drawer-inner">
      <div class="drawer-header-row">
        <span class="drawer-header-title">⚡ ${isBn ? 'স্টেজ প্রিভিউ ও জাম্প' : 'Stage Preview & Jump'}</span>
        <button class="drawer-header-close" type="button" aria-label="Close">✕</button>
      </div>
      <div class="drawer-stages-row">
        <div class="drawer-step-item drawer-editor-item" title="${isBn ? 'স্টুডিও এডিটরে খুলুন' : 'Open in Studio Editor'}">
          <div class="drawer-thumb-wrap">
            <img src="${editorThumb}" class="drawer-thumb drawer-editor-thumb" alt="Crop">
            <span class="drawer-thumb-badge">${sizeText || presetName}</span>
          </div>
          <span class="drawer-step-sub">${isBn ? '২. স্টুডিও এডিটর' : '2. Editor'}</span>
        </div>
        ${buildBatchSheetItemsHtml(isBn)}
      </div>
    </div>`;

  drawer.querySelector('.drawer-header-close')?.addEventListener('click', (e) => {
    e.stopPropagation(); onClose();
  });
  drawer.querySelector('.drawer-editor-item')?.addEventListener('click', (e) => {
    e.stopPropagation(); onClose();
    batchManager.setActive(item.id);
    if (mainCanvas) renderPhotoToCanvas(mainCanvas);
    updateUIFromState();
    tabManager?.switchTab('editor');
  });
  drawer.querySelectorAll('.drawer-sheet-item').forEach((si) => {
    si.addEventListener('click', (e) => {
      e.stopPropagation(); onClose();
      batchManager.setActive(item.id);
      tabManager?.switchTab('sheet');
    });
  });

  return drawer;
}

function buildBatchSheetItemsHtml(isBn) {
  const sheetCanvases = (typeof window !== 'undefined' && window._renderedSheetPages) || [];
  if (sheetCanvases.length > 1) {
    return sheetCanvases.map((canvas, idx) => {
      const pageStr = isBn ? toBengaliNumeral(idx + 1) : idx + 1;
      return `
        <div class="drawer-step-item drawer-sheet-item" data-page="${idx}" title="${isBn ? `প্রিন্ট শীট পৃষ্ঠা ${pageStr}` : `Print Sheet Page ${pageStr}`}">
          <div class="drawer-thumb-wrap">
            <img src="${canvas.toDataURL('image/jpeg', 0.6)}" class="drawer-thumb drawer-sheet-thumb" alt="Sheet ${idx + 1}">
            <span class="drawer-thumb-badge">${isBn ? `পৃষ্ঠা ${pageStr}` : `Page ${pageStr}`}</span>
          </div>
          <span class="drawer-step-sub">${isBn ? `৩. শীট (${pageStr})` : `3. Sheet (${pageStr})`}</span>
        </div>`;
    }).join('');
  }
  return `
    <div class="drawer-step-item drawer-sheet-item" data-page="0" title="${isBn ? 'প্রিন্ট শীটে ভিউ করুন' : 'View in Print Sheet'}">
      <div class="drawer-thumb-wrap">
        <div class="drawer-thumb drawer-sheet-placeholder">🖨️</div>
        <span class="drawer-thumb-badge">${isBn ? 'শীট ভিউ' : 'Sheet View'}</span>
      </div>
      <span class="drawer-step-sub">${isBn ? '৩. প্রিন্ট শীট' : '3. Sheet'}</span>
    </div>`;
}
