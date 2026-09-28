export function getHistoryTabHtml() {
  return `
    <section id="historyTab" class="tab-content">
      <div class="history-page-card">
        <div class="history-header">
          <div class="history-title-area">
            <h2 class="history-title" data-i18n="history_title">📸 Photo & Project History Archive</h2>
            <p class="history-subtitle" data-i18n="history_subtitle">Manage saved projects and auto-saved drafts with 1-click restore</p>
          </div>
          <div class="history-header-actions">
            <button class="btn-secondary btn-sm" id="btnExportHistory" data-i18n="btn_export_history">📥 Export History</button>
            <button class="btn-secondary btn-sm" id="btnImportHistory" data-i18n="btn_import_history">📤 Import History</button>
            <input type="file" id="inputImportHistoryFile" accept=".json" style="display: none;">
            <button class="btn-secondary btn-sm" id="btnClearAllHistory" data-i18n="btn_clear_all_history">🗑️ Clear History</button>
          </div>
        </div>

        <div class="history-toolbar">
          <div class="history-search-box">
            <span class="history-search-icon">🔍</span>
            <input type="text" id="inputHistorySearch" class="form-input" placeholder="Search history by photo name or size..." data-i18n-placeholder="history_search_placeholder">
          </div>
          <div class="history-filter-pills">
            <button class="history-filter-pill active" data-filter="all" data-i18n="history_filter_all">All History</button>
            <button class="history-filter-pill" data-filter="completed" data-i18n="history_filter_saved">⭐ Saved & Completed</button>
            <button class="history-filter-pill" data-filter="draft" data-i18n="history_filter_drafts">📝 Auto-saved Drafts</button>
          </div>
        </div>

        <div class="history-grid-container" id="historyGridContainer"></div>

        <div class="history-pagination-area" id="historyPaginationArea" style="display: none;">
          <button class="btn-primary" id="btnLoadMoreHistory" data-i18n="btn_load_more_history">Load More History (আরও দেখুন)</button>
        </div>

        <div class="history-empty-state" id="historyEmptyState" style="display: none;">
          <div class="history-empty-icon">📂</div>
          <h3 class="history-empty-title" data-i18n="history_empty_title">No History Records Found</h3>
          <p class="history-empty-desc" data-i18n="history_empty_desc">Photos you upload and projects you save will appear here automatically.</p>
        </div>
      </div>
    </section>
  `;
}
