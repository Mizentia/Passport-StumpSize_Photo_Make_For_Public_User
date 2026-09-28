import { batchManager } from '../core/batch-manager.js';
import { renderPhotoToCanvas } from '../core/canvas-engine.js';
import { updateUIFromState } from './editor-transform-ui.js';

export function setupBatchUI(mainCanvas, tabManager) {
  const trayContainer = document.getElementById('batchPhotoTray');

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
        batchManager.removeItem(item.id);
      });

      card.appendChild(thumb);
      card.appendChild(info);
      card.appendChild(btnDelete);

      card.addEventListener('click', () => {
        batchManager.setActive(item.id);
        if (mainCanvas) renderPhotoToCanvas(mainCanvas);
        updateUIFromState();
        if (tabManager && typeof tabManager.switchTab === 'function') {
          tabManager.switchTab('editor');
        } else {
          document.querySelector('.step-btn[data-tab="editor"]')?.click();
        }
      });

      trayContainer.appendChild(card);
    });
  }

  batchManager.onChange((items, activeId) => {
    renderTray(items, activeId);
  });
}
