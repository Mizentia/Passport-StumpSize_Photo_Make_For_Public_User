import { appState } from '../../core/state.js';
import { t } from '../../config/i18n.js';
import { toastService } from '../toast-service.js';
import {
  getAllPaperPresets, removePaperPreset, reorderPaperPreset,
  resetDefaultPaperPresets, renderCustomPaperOptionsInSelect
} from './paper-storage.js';
import { renderPaperItemRowHtml } from './paper-settings-card.js';

export function renderCustomPapersInSettings(onListChange) {
  const container = document.getElementById('customPapersListContainer');
  if (!container) return;

  const list = getAllPaperPresets();
  const isBn = appState.get('lang') === 'bn';

  if (list.length === 0) {
    container.innerHTML = `<div style="padding: 12px; text-align: center; color: var(--text-dim); font-size: 0.82rem; background: var(--bg-inset); border-radius: var(--radius-md);">${isBn ? 'কোনো কাগজ পাওয়া যায়নি।' : 'No paper presets found.'}</div>`;
    return;
  }

  let html = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
      <span style="font-size: 0.76rem; color: var(--text-dim);">${isBn ? 'তালিকার প্রথম কাগজটি ডিফল্ট হিসেবে আগে প্রদর্শিত হবে।' : 'Top paper appears first in selection.'}</span>
      <button type="button" id="btnResetPapersDefault" class="btn-smart btn-sm" style="font-size: 0.72rem; color: var(--accent-primary);" title="Reset to standard 5 paper sizes">↺ ${isBn ? 'ডিফল্ট রিসেট' : 'Reset Defaults'}</button>
    </div>
    <div style="display: flex; flex-direction: column; gap: 8px;">
  `;

  list.forEach((paper, index) => {
    html += renderPaperItemRowHtml(paper, index, list.length, isBn);
  });
  html += `</div>`;
  container.innerHTML = html;

  container.querySelector('#btnResetPapersDefault')?.addEventListener('click', () => {
    if (confirm(isBn ? 'কাগজের সাইজগুলো ডিফল্ট প্রিসেটে রিসেট করতে চান?' : 'Reset paper presets to default standard sizes?')) {
      resetDefaultPaperPresets();
      renderCustomPapersInSettings(onListChange);
      renderCustomPaperOptionsInSelect();
      if (onListChange) onListChange();
      toastService.show('Paper presets reset to factory defaults', 'info');
    }
  });

  container.querySelectorAll('.btn-move-paper-up').forEach((btn) => {
    btn.addEventListener('click', () => {
      reorderPaperPreset(btn.dataset.id, 'up');
      renderCustomPapersInSettings(onListChange);
      renderCustomPaperOptionsInSelect();
      if (onListChange) onListChange();
    });
  });

  container.querySelectorAll('.btn-move-paper-down').forEach((btn) => {
    btn.addEventListener('click', () => {
      reorderPaperPreset(btn.dataset.id, 'down');
      renderCustomPapersInSettings(onListChange);
      renderCustomPaperOptionsInSelect();
      if (onListChange) onListChange();
    });
  });

  container.querySelectorAll('.btn-edit-custom-paper').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (window.openCustomPaperModal) window.openCustomPaperModal(btn.dataset.id);
    });
  });

  container.querySelectorAll('.btn-delete-custom-paper').forEach((btn) => {
    btn.addEventListener('click', () => {
      const pId = btn.dataset.id;
      if (confirm(isBn ? `কাগজটি মুছে ফেলতে চান?` : `Delete this paper preset?`)) {
        removePaperPreset(pId);
        renderCustomPapersInSettings(onListChange);
        renderCustomPaperOptionsInSelect();
        if (appState.get('paperPreset') === pId) appState.set('paperPreset', 'photo_4r', true);
        if (onListChange) onListChange();
        toastService.show(t('msg_paper_deleted') || 'Paper deleted', 'info');
      }
    });
  });
}
