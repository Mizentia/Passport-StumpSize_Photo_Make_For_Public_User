import { batchManager } from '../core/batch-manager.js';
import { renderPhotoToCanvas } from '../core/canvas-engine.js';
import { updateUIFromState } from './editor-transform-ui.js';
import { attachCardHoverDrawer } from './batch/batch-card-drawer.js';
import { toastService } from './toast-service.js';
import { t } from '../config/i18n.js';
import { appState } from '../core/state.js';

export function setupBatchUI(mainCanvas, tabManager) {
  const trayContainer = document.getElementById('batchPhotoTray');

  function handleDelete(item, card) {
    const isActive = item.id === batchManager.activeId;
    if (isActive) {
      card.classList.add('shake-anim');
      setTimeout(() => card.classList.remove('shake-anim'), 500);
      toastService.show(t('msg_active_photo_delete_warn'), 'warning');

      if (window.confirm(t('confirm_close_active_photo'))) {
        const remaining = batchManager.items.filter((i) => i.id !== item.id);
        if (remaining.length > 0) {
          batchManager.removeItem(item.id);
          batchManager.setActive(remaining[0].id);
          if (mainCanvas) renderPhotoToCanvas(mainCanvas);
          updateUIFromState();
        } else {
          batchManager.removeItem(item.id);
          appState.update({ originalImage: null, segmentedImage: null });
          if (mainCanvas) {
            const ctx = mainCanvas.getContext('2d');
            ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
          }
          document.querySelectorAll('.step-btn').forEach((btn) => {
            if (btn.dataset.tab !== 'upload') btn.setAttribute('disabled', 'true');
          });
          tabManager?.switchTab('upload');
        }
      }
    } else {
      batchManager.removeItem(item.id);
    }
  }

  function renderTray(items, activeId) {
    if (!trayContainer) return;
    trayContainer.innerHTML = '';

    if (items.length === 0) {
      trayContainer.parentElement.style.display = 'none';
      return;
    }
    trayContainer.parentElement.style.display = 'block';

    items.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = `batch-item-card ${item.id === activeId ? 'active' : ''}`;

      const thumb = document.createElement('img');
      thumb.className = 'batch-item-thumb';
      thumb.src = item.thumbDataUrl || item.originalImage.src;

      const info = document.createElement('div');
      info.className = 'batch-item-info';
      info.textContent = item.name || `Photo ${index + 1}`;

      const btnDelete = document.createElement('button');
      btnDelete.className = 'batch-item-del';
      btnDelete.innerHTML = '&times;';
      btnDelete.title = 'Remove photo from queue';
      btnDelete.addEventListener('click', (e) => {
        e.stopPropagation();
        handleDelete(item, card);
      });

      card.appendChild(thumb);
      card.appendChild(info);
      card.appendChild(btnDelete);

      attachCardHoverDrawer(card, item, mainCanvas, tabManager);

      card.addEventListener('click', () => {
        batchManager.setActive(item.id);
        if (mainCanvas) renderPhotoToCanvas(mainCanvas);
        updateUIFromState();
        tabManager?.switchTab('editor');
      });

      trayContainer.appendChild(card);
    });
  }

  batchManager.onChange((items, activeId) => {
    renderTray(items, activeId);
  });
}
