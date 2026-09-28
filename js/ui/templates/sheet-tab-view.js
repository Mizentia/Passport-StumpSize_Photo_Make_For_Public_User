import { getSheetOptionsBoxHtml } from './sheet-options-view.js';

export function getSheetTabHtml() {
  return `
    <section id="sheetTab" class="tab-content">
      <div class="sheet-grid-layout">
        <div class="sheet-options-panel">
          <div class="tool-card">
            <div class="tool-card-title" data-i18n="card_sheet_settings">🖨️ Print Sheet Settings</div>
            
            <!-- Paper Size Selection -->
            <div class="form-group" style="margin-bottom: 10px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <label class="form-label" style="margin-bottom: 0;" data-i18n="paper_size">Paper Size (কাগজের মাপ)</label>
                <div style="display: flex; gap: 6px;">
                  <button class="btn-preset-add-header" id="btnAddNewPaperSheet" title="Add Custom Paper Size" data-i18n-title="title_add_custom_paper" type="button"><span data-i18n="btn_add_paper_short">➕ Add Paper</span></button>
                  <button class="btn-preset-add-header" id="btnEditCustomPaperSheet" title="Edit Paper Size" style="background: rgba(59, 130, 246, 0.15); color: var(--accent-primary);" type="button"><span data-i18n="btn_edit_paper_short">✏️ Edit</span></button>
                </div>
              </div>
              <select id="paperPresetSelect" class="form-select"></select>
            </div>

            <!-- Multi-Photo Print Queue List -->
            <div class="form-group" style="margin-bottom: 10px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <label class="form-label" style="margin-bottom: 0; font-weight: 700;" data-i18n="lbl_photos_on_sheet">Photos on Sheet (প্রিন্ট কিউ)</label>
                <span class="sheet-capacity-pill" id="sheetCapacityBadge" style="font-size: 0.72rem; font-weight: 700; color: var(--accent-primary); background: rgba(59, 130, 246, 0.12); padding: 2px 8px; border-radius: 12px;">6 photos</span>
              </div>
              <div id="sheetPhotoQueueList" style="display: flex; flex-direction: column; gap: 6px;"></div>
            </div>

            <!-- Margins & Gap -->
            <div class="sheet-spacing-box" style="background: var(--bg-inset); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 10px; margin-bottom: 10px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-main);" data-i18n="label_sheet_spacing">📏 Margins & Gap</span>
                <button type="button" id="btnResetSheetSpacing" title="Reset to paper default" style="background: none; border: none; font-size: 0.72rem; color: var(--accent-primary); cursor: pointer; padding: 0; font-weight: 600;">↺ Reset</button>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <div class="form-group" style="margin-bottom: 0;">
                  <label class="form-label" style="font-size: 0.72rem; margin-bottom: 2px;" data-i18n="label_paper_margin">Margin (mm)</label>
                  <input type="number" id="inputSheetMarginMm" class="form-input" min="0" max="40" step="0.5" value="4" style="height: 32px; font-size: 0.8rem;">
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                  <label class="form-label" style="font-size: 0.72rem; margin-bottom: 2px;" data-i18n="label_paper_gap">Photo Gap (mm)</label>
                  <input type="number" id="inputSheetGapMm" class="form-input" min="0" max="30" step="0.5" value="3" style="height: 32px; font-size: 0.8rem;">
                </div>
              </div>
            </div>

            ${getSheetOptionsBoxHtml()}

            <!-- Unified Export & Print Buttons -->
            <div class="sheet-export-buttons-compact" style="display: flex; flex-direction: column; gap: 6px; margin-top: 6px;">
              <div style="display: grid; grid-template-columns: 1fr 1.3fr; gap: 6px;">
                <select id="selectSheetExportFormat" class="form-select" style="height: 34px; font-size: 0.78rem; padding: 4px 6px;">
                  <option value="jpg" selected data-i18n="opt_format_jpg">JPG (300 DPI)</option>
                  <option value="png" data-i18n="opt_format_png">PNG (Lossless)</option>
                  <option value="pdf" data-i18n="opt_format_pdf">PDF (Print Ready)</option>
                </select>
                <button class="btn-primary" id="btnDownloadSheetUnified" style="height: 34px; font-size: 0.78rem; padding: 4px 10px; justify-content: center; white-space: nowrap;" data-i18n="btn_download_sheet_unified">⬇️ Download Sheet</button>
              </div>
              <button class="btn-secondary" id="btnPrintDirect" style="height: 34px; font-size: 0.78rem; justify-content: center;" data-i18n="btn_print_direct" data-i18n-title="tooltip_print_direct" data-shortcut-key="printDirect">🖨️ Direct 1-Click Print</button>
            </div>

            <!-- Session History Strip (সেশন হিস্ট্রি) -->
            <div style="margin-top: 10px; padding: 8px 10px; background: var(--bg-inset); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <span style="font-size: 0.74rem; font-weight: 700; color: var(--text-main);" data-i18n="lbl_session_tree">📸 Session History (হিস্ট্রি থেকে যোগ করুন)</span>
                <span id="sheetHistoryCountBadge" style="font-size: 0.68rem; color: var(--text-dim);"></span>
              </div>
              <div id="sheetHistoryStripContainer" style="display: flex; gap: 6px; overflow-x: auto; padding: 2px 2px 4px 2px; min-height: 60px; align-items: center;"></div>
              <div style="display: flex; justify-content: center; margin-top: 2px;">
                <button type="button" id="btnLoadMoreSheetHistory" class="btn-smart btn-sm" style="display: none; font-size: 0.7rem; padding: 2px 8px;" data-i18n="btn_load_more_short">⬇️ Load More</button>
              </div>
            </div>

          </div>
        </div>

        <!-- Preview Area -->
        <div class="sheet-preview-card">
          <div class="sheet-preview-header" style="width: 100%; display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding: 4px 8px;">
            <div class="sheet-page-info-pill" id="sheetPageInfoPill" style="font-size: 0.82rem; color: var(--text-main); font-weight: 500;">📄 <strong>Page 1 of 1</strong> &bull; 6 Photos</div>
          </div>
          <div class="sheet-pages-scroll-container" id="sheetPagesContainer" style="width: 100%; display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; align-items: flex-start;">
            <div class="sheet-page-card" data-page="1">
              <div class="sheet-page-badge" style="font-size: 0.75rem; font-weight: 700; color: var(--text-dim); margin-bottom: 6px; text-align: center;">Page 1</div>
              <div class="sheet-canvas-wrapper"><canvas id="sheetCanvas"></canvas></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
