export function getSheetOptionsBoxHtml() {
  return `
    <details class="sheet-advanced-accordion" id="detailsSheetAdvanced">
      <summary class="sheet-advanced-summary">
        <span data-i18n="summary_advanced_sheet_options">⚙️ Margins, Borders & Cut Marks</span>
        <span class="sheet-summary-arrow">▾</span>
      </summary>
      <div class="sheet-advanced-content">
        <div class="sheet-opt-group">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span style="font-size: 0.76rem; font-weight: 700; color: var(--text-main);" data-i18n="label_sheet_spacing">📏 Margins & Gap</span>
            <button type="button" id="btnResetSheetSpacing" title="Reset to paper default" style="background: none; border: none; font-size: 0.72rem; color: var(--accent-primary); cursor: pointer; padding: 0; font-weight: 600;">↺ Reset</button>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
            <div>
              <label class="form-label" style="font-size: 0.7rem; margin-bottom: 2px;" data-i18n="label_paper_margin">Margin (mm)</label>
              <input type="number" id="inputSheetMarginMm" class="form-input" min="0" max="40" step="0.5" value="4" style="height: 28px; font-size: 0.76rem;">
            </div>
            <div>
              <label class="form-label" style="font-size: 0.7rem; margin-bottom: 2px;" data-i18n="label_paper_gap">Photo Gap (mm)</label>
              <input type="number" id="inputSheetGapMm" class="form-input" min="0" max="30" step="0.5" value="3" style="height: 28px; font-size: 0.76rem;">
            </div>
          </div>
        </div>

        <div class="sheet-opt-group">
          <div class="toggle-row" style="padding: 1px 0;">
            <span style="font-size: 0.76rem;" data-i18n="toggle_border">Thin Photo Border</span>
            <label class="switch"><input type="checkbox" id="toggleBorder" checked><span class="slider-toggle"></span></label>
          </div>
          <div id="rowBorderControls" style="display: flex; gap: 6px; align-items: center; margin-top: 4px; border-top: 1px dashed var(--border-subtle); padding-top: 4px;">
            <div style="flex: 1;">
              <select id="sheetBorderWidthSelect" class="form-select" style="height: 28px; font-size: 0.74rem; padding: 2px 4px;">
                <option value="1" selected>1 px</option><option value="2">2 px</option><option value="3">3 px</option><option value="4">4 px</option><option value="5">5 px</option>
              </select>
            </div>
            <div style="flex: 1.4; display: flex; gap: 4px; align-items: center;">
              <input type="color" id="sheetBorderColorInput" value="#cbd5e1" style="width: 28px; height: 28px; padding: 0; border: none; border-radius: 4px; cursor: pointer;">
              <select id="sheetBorderColorPreset" class="form-select" style="height: 28px; font-size: 0.74rem; padding: 2px 4px; flex: 1;">
                <option value="#cbd5e1" selected>Light Gray</option><option value="#64748b">Slate</option><option value="#000000">Dark Black</option><option value="#3b82f6">Blue</option><option value="custom">Custom...</option>
              </select>
            </div>
          </div>
        </div>

        <div class="sheet-opt-group">
          <div class="toggle-row" style="padding: 1px 0;">
            <span style="font-size: 0.76rem;" data-i18n="toggle_cut_marks">Scissor / Cut Marks</span>
            <label class="switch"><input type="checkbox" id="toggleCutMarks" checked><span class="slider-toggle"></span></label>
          </div>
          <div id="rowCutMarksControls" style="display: flex; flex-direction: column; gap: 4px; margin-top: 4px; border-top: 1px dashed var(--border-subtle); padding-top: 4px;">
            <div style="display: grid; grid-template-columns: 1.4fr 1fr; gap: 4px;">
              <select id="sheetCutStyleSelect" class="form-select" style="height: 28px; font-size: 0.74rem; padding: 2px 4px;">
                <option value="inter_boundary" selected data-i18n="opt_cut_inter_boundary">Smart Center Line</option>
                <option value="corner_cross" data-i18n="opt_cut_cross">Corner Cross (+)</option>
                <option value="corner_angle" data-i18n="opt_cut_angle">Corner Angles (L)</option>
                <option value="dash_box" data-i18n="opt_cut_dash">Dashed Box (- -)</option>
                <option value="dot_box" data-i18n="opt_cut_dot">Dotted Box (. .)</option>
              </select>
              <select id="sheetCutWidthSelect" class="form-select" style="height: 28px; font-size: 0.74rem; padding: 2px 4px;">
                <option value="1" selected>1 px</option><option value="2">2 px</option><option value="3">3 px</option><option value="4">4 px</option>
              </select>
            </div>
            <div style="display: flex; gap: 4px; align-items: center;">
              <input type="color" id="sheetCutColorInput" value="#94a3b8" style="width: 28px; height: 28px; padding: 0; border: none; border-radius: 4px; cursor: pointer;">
              <select id="sheetCutColorPreset" class="form-select" style="height: 28px; font-size: 0.74rem; padding: 2px 4px; flex: 1;">
                <option value="#94a3b8" selected>Slate Gray</option><option value="#000000">Black</option><option value="#cbd5e1">Light Gray</option><option value="#3b82f6">Blue</option><option value="#ef4444">Red Guide</option><option value="custom">Custom...</option>
              </select>
            </div>
          </div>
        </div>

        <div class="sheet-opt-group">
          <div class="toggle-row" style="padding: 1px 0;">
            <span style="font-size: 0.76rem; font-weight: 600;" data-i18n="toggle_row_packing">Fill Row Space</span>
            <label class="switch"><input type="checkbox" id="toggleRowSpaceSharing" checked><span class="slider-toggle"></span></label>
          </div>
        </div>
      </div>
    </details>
  `;
}
