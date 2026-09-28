export function getCustomSizeModalHtml() {
  return `
    <div class="modal-backdrop" id="customSizeModal">
      <div class="modal-box" style="max-width: 480px;">
        <div class="modal-header">
          <div class="modal-title" id="customModalTitle" data-i18n="custom_modal_title">Custom Photo Dimensions & Preset</div>
          <button class="btn-icon" id="btnCloseCustomModal" title="Close" data-i18n-title="btn_close">✕</button>
        </div>
        <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 8px;">
          <input type="hidden" id="customEditingPresetId" value="">
          <div class="form-group">
            <label class="form-label" data-i18n="label_preset_name">Preset Name</label>
            <input type="text" id="customInputName" class="form-input" placeholder="e.g. BD Passport, School ID, US Visa" data-i18n-placeholder="placeholder_preset_name">
          </div>
          <div class="form-group">
            <label class="form-label" data-i18n="label_unit">1. Unit of Measurement</label>
            <select id="customInputUnit" class="form-select">
              <option value="mm" selected data-i18n="unit_mm">Millimeters (mm)</option>
              <option value="inch" data-i18n="unit_inch">Inches (in / ")</option>
              <option value="cm" data-i18n="unit_cm">Centimeters (cm)</option>
              <option value="px" data-i18n="unit_px">Pixels (px)</option>
            </select>
          </div>
          <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 8px; align-items: flex-end;">
            <div class="form-group">
              <label class="form-label" id="customLabel1">2. Height (উচ্চতা)</label>
              <input type="number" id="customInput1" class="form-input" value="50" step="any" min="1">
            </div>
            <button class="btn-icon" id="btnSwapCustomHW" title="Swap Orientation (Height ⇄ Width)" style="height: 38px; width: 38px; margin-bottom: 1px; transition: transform 0.25s ease;" type="button">⇄</button>
            <div class="form-group">
              <label class="form-label" id="customLabel2">3. Width (প্রস্থ)</label>
              <input type="number" id="customInput2" class="form-input" value="40" step="any" min="1">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label" data-i18n="preset_dpi_label">Target DPI</label>
            <div style="display: grid; grid-template-columns: 1fr auto; gap: 8px;">
              <select id="customPresetDpi" class="form-select">
                <option value="300" selected data-i18n="opt_dpi_300">300 DPI (Standard Print)</option>
                <option value="600" data-i18n="opt_dpi_600">600 DPI (Ultra HD Lab)</option>
                <option value="200" data-i18n="opt_dpi_200">200 DPI (Online Form / Web)</option>
                <option value="custom" data-i18n="opt_dpi_custom">Custom DPI...</option>
              </select>
              <input type="number" id="customPresetCustomDpi" class="form-input" value="300" min="72" max="1200" style="width: 90px; display: none;" placeholder="DPI">
            </div>
          </div>
          <div id="customValidationWarning" style="display: none; padding: 8px 12px; background: rgba(239, 68, 68, 0.12); border: 1px solid #ef4444; border-radius: var(--radius-md); font-size: 0.78rem; color: #ef4444; line-height: 1.4;"></div>
          <div id="customConversionPreview" style="padding: 10px 12px; background: var(--bg-inset); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); font-size: 0.8rem; color: var(--text-muted); line-height: 1.5;"></div>
          <div style="display: flex; gap: 8px; margin-top: 4px;" id="customModalActionButtons">
            <button class="btn-primary" id="btnApplyCustomSize" style="flex: 1;" data-i18n="btn_apply_size">Apply Custom Size</button>
            <button class="btn-secondary" id="btnSaveCustomPreset" style="flex: 1;" data-i18n="btn_save_and_apply">⭐ Save & Apply</button>
          </div>
          <div style="display: none; gap: 8px; margin-top: 4px;" id="customModalEditButtons">
            <button class="btn-primary" id="btnSavePresetChanges" style="flex: 2;" data-i18n="btn_save_preset_changes">💾 Save Changes</button>
            <button class="btn-secondary" id="btnDeletePresetModal" style="flex: 1; border-color: rgba(239, 68, 68, 0.4); color: #ef4444;" data-i18n="btn_delete_this_preset">🗑️ Delete</button>
          </div>
        </div>
      </div>
    </div>
  `;
}
