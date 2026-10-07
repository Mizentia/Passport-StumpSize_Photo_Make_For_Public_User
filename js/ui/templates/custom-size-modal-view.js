export function getCustomSizeModalHtml() {
  return `
    <div class="modal-backdrop" id="customSizeModal">
      <div class="modal-box" style="max-width: 490px;">
        <div class="modal-header">
          <div class="modal-title" id="customModalTitle" data-i18n="custom_modal_title">Custom Photo Dimensions & Preset</div>
          <button class="btn-icon" id="btnCloseCustomModal" title="Close" data-i18n-title="btn_close">✕</button>
        </div>
        <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 6px;">
          <input type="hidden" id="customEditingPresetId" value="">
          <div class="custom-quick-templates">
            <span style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted);" data-i18n="quick_templates_title">⚡ Popular Quick Sizes:</span>
            <div class="custom-template-chips">
              <button type="button" class="btn-template-chip" data-w="40" data-h="50" data-u="mm" data-dpi="300">🇧🇩 40×50 mm</button>
              <button type="button" class="btn-template-chip" data-w="20" data-h="25" data-u="mm" data-dpi="300">🎫 20×25 mm</button>
              <button type="button" class="btn-template-chip" data-w="300" data-h="300" data-u="px" data-dpi="300">📋 300×300 px</button>
              <button type="button" class="btn-template-chip" data-w="35" data-h="45" data-u="mm" data-dpi="300">🇪🇺 35×45 mm</button>
              <button type="button" class="btn-template-chip" data-w="2" data-h="2" data-u="inch" data-dpi="300">🇺🇸 2×2 in</button>
              <button type="button" class="btn-template-chip" data-w="300" data-h="80" data-u="px" data-dpi="300">✍️ 300×80 px</button>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 8px; align-items: flex-end;">
            <div class="form-group" style="margin: 0;">
              <label class="form-label" id="customLabel1" data-i18n="label_width">1. Width (↔)</label>
              <input type="number" id="customInput1" class="form-input custom-dim-input" value="40" step="any" min="1" placeholder="40">
            </div>
            <button class="btn-icon btn-swap-dim" id="btnSwapCustomHW" title="Swap Orientation (Width ⇄ Height)" data-i18n-title="tooltip_swap_hw" type="button">⇄</button>
            <div class="form-group" style="margin: 0;">
              <label class="form-label" id="customLabel2" data-i18n="label_height">2. Height (↕)</label>
              <input type="number" id="customInput2" class="form-input custom-dim-input" value="50" step="any" min="1" placeholder="50">
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div class="form-group" style="margin: 0;">
              <label class="form-label" data-i18n="label_unit">📐 Unit of Measurement</label>
              <select id="customInputUnit" class="form-select">
                <option value="mm" selected data-i18n="unit_mm">Millimeters (mm)</option>
                <option value="px" data-i18n="unit_px">Pixels (px)</option>
                <option value="inch" data-i18n="unit_inch">Inches (in / ")</option>
                <option value="cm" data-i18n="unit_cm">Centimeters (cm)</option>
              </select>
            </div>
            <div class="form-group" style="margin: 0;">
              <label class="form-label" data-i18n="preset_dpi_label">🎯 Target DPI</label>
              <select id="customPresetDpi" class="form-select">
                <option value="300" selected data-i18n="opt_dpi_300">300 DPI (Standard)</option>
                <option value="600" data-i18n="opt_dpi_600">600 DPI (Ultra HD)</option>
                <option value="200" data-i18n="opt_dpi_200">200 DPI (Web/Form)</option>
                <option value="custom" data-i18n="opt_dpi_custom">Custom DPI...</option>
              </select>
              <input type="number" id="customPresetCustomDpi" class="form-input" value="300" min="72" max="1200" style="display: none; margin-top: 4px;" placeholder="DPI">
            </div>
          </div>
          <div class="form-group" style="margin: 0;">
            <label class="form-label" data-i18n="label_preset_name">🏷️ Preset Name (Optional)</label>
            <input type="text" id="customInputName" class="form-input" placeholder="e.g. BD Passport, School ID, US Visa" data-i18n-placeholder="placeholder_preset_name">
          </div>
          <div id="customValidationWarning" style="display: none; padding: 8px 12px; background: rgba(239, 68, 68, 0.12); border: 1px solid #ef4444; border-radius: var(--radius-md); font-size: 0.78rem; color: #ef4444; line-height: 1.4;"></div>
          <div id="customConversionPreview" style="padding: 10px 12px; background: var(--bg-inset); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); font-size: 0.8rem; color: var(--text-muted); line-height: 1.5;"></div>
          <div style="display: flex; gap: 8px; margin-top: 2px;" id="customModalActionButtons">
            <button class="btn-primary" id="btnApplyCustomSize" style="flex: 1;" data-i18n="btn_apply_size">Apply Custom Size</button>
            <button class="btn-secondary" id="btnSaveCustomPreset" style="flex: 1;" data-i18n="btn_save_and_apply">⭐ Save & Apply</button>
          </div>
          <div style="display: none; gap: 8px; margin-top: 2px;" id="customModalEditButtons">
            <button class="btn-primary" id="btnSavePresetChanges" style="flex: 2;" data-i18n="btn_save_preset_changes">💾 Save Changes</button>
            <button class="btn-secondary" id="btnDeletePresetModal" style="flex: 1; border-color: rgba(239, 68, 68, 0.4); color: #ef4444;" data-i18n="btn_delete_this_preset">🗑️ Delete</button>
          </div>
        </div>
      </div>
    </div>
  `;
}
