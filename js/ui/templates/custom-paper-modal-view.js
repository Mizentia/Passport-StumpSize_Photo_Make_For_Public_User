export function getCustomPaperModalHtml() {
  return `
    <div class="modal-backdrop" id="customPaperModal">
      <div class="modal-box" style="max-width: 500px;">
        <div class="modal-header">
          <div class="modal-title" id="customPaperModalTitle" data-i18n="title_custom_paper_modal">📄 Photo Paper Settings & Custom Size</div>
          <button class="btn-icon" id="btnCloseCustomPaperModal" title="Close" data-i18n-title="btn_close">✕</button>
        </div>
        <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 8px;">
          <input type="hidden" id="editingCustomPaperId" value="">
          <div class="form-group">
            <label class="form-label" data-i18n="label_paper_name">Paper Name / Title (কাগজের নাম)</label>
            <input type="text" id="modalCustomPaperName" class="form-input" placeholder="e.g. 4R Photo Paper / DNP 4x6 / Matte 5x7" data-i18n-placeholder="placeholder_paper_name">
          </div>
          <div class="form-group">
            <label class="form-label" data-i18n="label_unit">Unit of Measurement (পরিমাপের একক)</label>
            <select id="modalCustomPaperUnit" class="form-select">
              <option value="mm" selected data-i18n="unit_mm">Millimeters (mm)</option>
              <option value="inch" data-i18n="unit_inch">Inches (in / ")</option>
              <option value="cm" data-i18n="unit_cm">Centimeters (cm)</option>
            </select>
          </div>
          <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 8px; align-items: flex-end;">
            <div class="form-group">
              <label class="form-label" id="modalPaperLabel1">Height (উচ্চতা)</label>
              <input type="number" id="modalPaperInput1" class="form-input" value="152.4" step="any" min="10">
            </div>
            <button class="btn-icon" id="btnModalSwapPaperHW" title="Swap Orientation (Height ⇄ Width)" style="height: 38px; width: 38px; margin-bottom: 1px; transition: transform 0.25s ease;" type="button">⇄</button>
            <div class="form-group">
              <label class="form-label" id="modalPaperLabel2">Width (প্রস্থ)</label>
              <input type="number" id="modalPaperInput2" class="form-input" value="101.6" step="any" min="10">
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div class="form-group">
              <label class="form-label" data-i18n="label_paper_margin">Page Margin (মার্জিন mm)</label>
              <input type="number" id="modalCustomPaperMargin" class="form-input" value="4" min="0" max="40" step="0.5">
            </div>
            <div class="form-group">
              <label class="form-label" data-i18n="label_paper_gap">Photo Gap (ছবির ফাঁক mm)</label>
              <input type="number" id="modalCustomPaperGap" class="form-input" value="3" min="0" max="30" step="0.5">
            </div>
          </div>
          <div id="modalPaperCapacityPreview" style="padding: 10px 12px; background: var(--bg-inset); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); font-size: 0.8rem; color: var(--text-muted); line-height: 1.5;"></div>
          
          <div style="display: flex; gap: 8px; margin-top: 4px;" id="modalPaperAddActions">
            <button class="btn-primary" id="btnSaveNewPaperModal" style="flex: 1;" data-i18n="btn_save_paper">💾 Save & Select Paper</button>
          </div>
          
          <div style="display: none; flex-direction: column; gap: 8px; margin-top: 4px;" id="modalPaperEditActions">
            <div style="display: flex; gap: 8px;">
              <button class="btn-primary" id="btnUpdatePaperModal" style="flex: 2;" data-i18n="btn_save_paper_changes">💾 Save Changes</button>
              <button class="btn-secondary" id="btnDeletePaperModal" style="flex: 1; border-color: rgba(239, 68, 68, 0.4); color: #ef4444;" data-i18n="btn_delete_this_paper">🗑️ Delete</button>
            </div>
            <div style="display: flex; gap: 6px; justify-content: space-between; align-items: center; padding-top: 6px; border-top: 1px dashed var(--border-subtle);">
              <span style="font-size: 0.75rem; color: var(--text-dim);" data-i18n="lbl_reorder_paper">Change Priority / Order:</span>
              <div style="display: flex; gap: 6px;">
                <button type="button" class="btn-smart btn-sm" id="btnMovePaperUp" title="Move paper up in list (সবচেয়ে বেশি ব্যবহৃত উপরে রাখুন)">⬆️ Move Up</button>
                <button type="button" class="btn-smart btn-sm" id="btnMovePaperDown" title="Move paper down in list">⬇️ Move Down</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
