import { getHistoryRecordsPaged } from '../core/history-query.js';
import { deleteHistoryRecord, clearHistoryStore } from '../core/history-store.js';
import { createHistoryCardElement } from './templates/history-card-renderer.js';
import { toastService } from './toast-service.js';
import { t } from '../config/i18n.js';
import { batchManager } from '../core/batch-manager.js';

export function createHistoryController({ gridContainer, emptyState, paginationArea, loadMoreBtn, onOpenRecord, tabManager }) {
  let activeFilter = 'all';
  let searchQuery = '';
  let currentOffset = 0;
  const pageSize = 24;
  let isLoading = false;

  async function loadPage(reset = false) {
    if (isLoading) return;
    isLoading = true;
    if (reset) {
      currentOffset = 0;
      gridContainer.innerHTML = '';
    }

    try {
      const res = await getHistoryRecordsPaged({
        type: activeFilter, query: searchQuery, offset: currentOffset, limit: pageSize
      });

      if (reset && res.items.length === 0) {
        emptyState.style.display = 'flex';
        paginationArea.style.display = 'none';
      } else {
        emptyState.style.display = 'none';
        res.items.forEach((rec, idx) => {
          const serialNum = currentOffset + idx + 1;
          const el = createHistoryCardElement(
            rec,
            serialNum,
            (item) => onOpenRecord(item),
            (item) => {
              if (item.snapshot?.originalImageData) {
                const img = new Image();
                img.onload = () => { batchManager.addPhoto(img, item.name); toastService.show(t('btn_add_to_sheet'), 'success'); };
                img.src = item.snapshot.originalImageData;
              }
            },
            async (item) => {
              if (confirm(t('confirm_delete_history_item'))) {
                await deleteHistoryRecord(item.id);
                loadPage(true);
              }
            },
            tabManager
          );
          gridContainer.appendChild(el);
        });

        currentOffset += res.items.length;
        paginationArea.style.display = res.hasMore ? 'block' : 'none';
      }
    } finally {
      isLoading = false;
    }
  }

  function setFilter(filter) { activeFilter = filter; loadPage(true); }
  function setSearch(query) { searchQuery = query; loadPage(true); }

  async function clearAll() {
    if (confirm(t('confirm_clear_all_history'))) {
      await clearHistoryStore(activeFilter);
      loadPage(true);
      toastService.show(t('btn_clear_all_history'), 'info');
    }
  }

  return { loadPage, setFilter, setSearch, clearAll };
}
