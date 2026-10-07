import { getSheetOptionsBoxHtml } from './sheet-options-view.js';

export function getSheetTabHtml() {
  return `
    <section id="sheetTab" class="tab-content">
      <div class="sheet-grid-layout">
        <!-- 1. Left Sidebar: Print Sheet Settings -->
        <div class="sheet-options-panel">
          <div class="tool-card sheet-tool-card">
            <div class="tool-card-title" data-i18n="card_sheet_settings">🖨️ Print Sheet Settings</div>

            <!-- Paper Size Selection -->
            <div class="form-group" style="margin-bottom: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <label class="form-label" style="margin-bottom: 0;" data-i18n="paper_size">Paper Size</label>
                <div style="display: flex; gap: 4px;">
                  <button class="btn-preset-add-header" id="btnAddNewPaperSheet" title="Add Custom Paper Size" data-i18n-title="title_add_custom_paper" type="button"><span data-i18n="btn_add_paper_short">➕ Add</span></button>
                  <button class="btn-preset-add-header" id="btnEditCustomPaperSheet" title="Edit Paper Size" style="background: rgba(59, 130, 246, 0.15); color: var(--accent-primary);" type="button"><span data-i18n="btn_edit_paper_short">✏️ Edit</span></button>
                </div>
              </div>
              <select id="paperPresetSelect" class="form-select"></select>
            </div>

            <!-- Photos in Queue List -->
            <div class="form-group" style="margin-bottom: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <label class="form-label" style="margin-bottom: 0; font-weight: 700;" data-i18n="lbl_photos_on_sheet">Photos on Sheet</label>
                <span class="sheet-capacity-pill" id="sheetCapacityBadge">6 photos</span>
              </div>
              <div id="sheetPhotoQueueList" class="sheet-queue-list-scroll"></div>
            </div>

            <!-- Unified Export & Print Buttons -->
            <div class="sheet-export-buttons-compact" style="margin-bottom: 8px;">
              <div style="display: grid; grid-template-columns: 1fr 1.3fr; gap: 6px;">
                <select id="selectSheetExportFormat" class="form-select" style="height: 34px; font-size: 0.78rem; padding: 4px 6px;">
                  <option value="jpg" selected data-i18n="opt_format_jpg">JPG (300 DPI)</option>
                  <option value="png" data-i18n="opt_format_png">PNG (Lossless)</option>
                  <option value="pdf" data-i18n="opt_format_pdf">PDF (Print Ready)</option>
                </select>
                <button class="btn-primary" id="btnDownloadSheetUnified" style="height: 34px; font-size: 0.78rem; padding: 4px 8px; justify-content: center; white-space: nowrap;" data-i18n="btn_download_sheet_unified">⬇️ Download Sheet</button>
              </div>
              <button class="btn-secondary" id="btnPrintDirect" style="height: 34px; font-size: 0.78rem; justify-content: center;" data-i18n="btn_print_direct" data-shortcut-key="printDirect">🖨️ Direct 1-Click Print</button>
            </div>

            <!-- Collapsible Advanced Options: Margins, Borders & Cut Marks -->
            ${getSheetOptionsBoxHtml()}

          </div>
        </div>

        <!-- 2. Center Panel: Sheet Preview Workspace -->
        <div class="sheet-preview-card">
          <div class="sheet-preview-header">
            <div class="sheet-page-info-pill" id="sheetPageInfoPill">📄 <strong>Page 1 of 1</strong> &bull; 6 Photos</div>
          </div>
          <div class="sheet-pages-scroll-container" id="sheetPagesContainer">
            <div class="sheet-page-card" data-page="1">
              <div class="sheet-page-badge">Page 1</div>
              <div class="sheet-canvas-wrapper"><canvas id="sheetCanvas"></canvas></div>
            </div>
          </div>
        </div>

        <!-- 3. Right Sidebar: Session History Vertical Strip -->
        <div class="sheet-history-panel">
          <div class="tool-card sheet-tool-card" style="height: 100%; display: flex; flex-direction: column;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <div class="tool-card-title" style="margin-bottom: 0;" data-i18n="lbl_session_tree">📸 Session History</div>
              <span id="sheetHistoryCountBadge" style="font-size: 0.68rem; font-weight: 700; color: var(--accent-primary); background: rgba(59, 130, 246, 0.12); padding: 2px 6px; border-radius: 10px;"></span>
            </div>
            <p style="font-size: 0.72rem; color: var(--text-dim); margin-bottom: 8px;" data-i18n="hint_history_add">Click any photo to add to sheet</p>
            <div id="sheetHistoryStripContainer" class="sheet-history-vertical-scroll"></div>
            <div style="display: flex; justify-content: center; margin-top: 6px;">
              <button type="button" id="btnLoadMoreSheetHistory" class="btn-smart btn-sm" style="display: none; font-size: 0.72rem; padding: 4px 10px;" data-i18n="btn_load_more_short">⬇️ Load More</button>
            </div>
          </div>
        </div>

      </div>
    </section>
  `;
}
