import { historyManager } from '../core/history-manager.js';
import { restoreHistoryRecord } from '../core/history-restorer.js';
import { createHistoryController } from './history-controller.js';
import { setupHistoryImportExport } from './history-import-export-ui.js';
import { appState } from '../core/state.js';

export function setupHistoryUI(tabManager) {
  const gridContainer = document.getElementById('historyGridContainer');
  const emptyState = document.getElementById('historyEmptyState');
  const paginationArea = document.getElementById('historyPaginationArea');
  const loadMoreBtn = document.getElementById('btnLoadMoreHistory');
  const searchInput = document.getElementById('inputHistorySearch');
  const clearBtn = document.getElementById('btnClearAllHistory');
  const filterPills = document.querySelectorAll('.history-filter-pill');

  if (!gridContainer) return;

  const controller = createHistoryController({
    gridContainer,
    emptyState,
    paginationArea,
    loadMoreBtn,
    tabManager,
    onOpenRecord: (record) => {
      restoreHistoryRecord(record, tabManager);
    }
  });

  setupHistoryImportExport(controller);

  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      filterPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      controller.setFilter(pill.dataset.filter || 'all');
    });
  });

  let searchTimer = null;
  searchInput?.addEventListener('input', (e) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      controller.setSearch(e.target.value);
    }, 250);
  });

  loadMoreBtn?.addEventListener('click', () => controller.loadPage(false));
  clearBtn?.addEventListener('click', () => controller.clearAll());

  historyManager.onChange(() => {
    if (appState.get('activeTab') === 'history') controller.loadPage(true);
  });

  appState.on('activeTab', (tab) => {
    if (tab === 'history') controller.loadPage(true);
  });

  appState.on('lang', () => {
    if (appState.get('activeTab') === 'history') controller.loadPage(true);
  });
}
