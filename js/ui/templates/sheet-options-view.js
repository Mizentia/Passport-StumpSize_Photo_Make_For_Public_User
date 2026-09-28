export function getSheetOptionsBoxHtml() {
  return `
    <div style="background: var(--bg-inset); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 6px 10px; margin-bottom: 6px;">
      <div class="toggle-row" style="padding: 1px 0;">
        <span style="font-size: 0.76rem;" data-i18n="toggle_border">Thin Photo Border (বর্ডার)</span>
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
    <div style="background: var(--bg-inset); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 6px 10px; margin-bottom: 6px;">
      <div class="toggle-row" style="padding: 1px 0;">
        <span style="font-size: 0.76rem;" data-i18n="toggle_cut_marks">Scissor / Cut Marks (কাটার দাগ)</span>
        <label class="switch"><input type="checkbox" id="toggleCutMarks" checked><span class="slider-toggle"></span></label>
      </div>
      <div id="rowCutMarksControls" style="display: flex; flex-direction: column; gap: 4px; margin-top: 4px; border-top: 1px dashed var(--border-subtle); padding-top: 4px;">
        <div style="display: grid; grid-template-columns: 1.4fr 1fr; gap: 4px;">
          <select id="sheetCutStyleSelect" class="form-select" style="height: 28px; font-size: 0.74rem; padding: 2px 4px;">
            <option value="inter_boundary" selected data-i18n="opt_cut_inter_boundary">Center Line (মাঝখানের দাগ)</option>
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
            <option value="#94a3b8" selected>Slate Gray (#94a3b8)</option>
            <option value="#000000">Black (#000000)</option>
            <option value="#cbd5e1">Light Gray (#cbd5e1)</option>
            <option value="#3b82f6">Blue (#3b82f6)</option>
            <option value="#ef4444">Red Guide (#ef4444)</option>
            <option value="custom">Custom...</option>
          </select>
        </div>
      </div>
    </div>
    <div style="background: var(--bg-inset); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 6px 10px; margin-bottom: 8px;">
      <div class="toggle-row" style="padding: 1px 0;">
        <div>
          <span style="font-size: 0.76rem; font-weight: 600;" data-i18n="toggle_row_packing">Fill Row Space (ফাঁকা পূরণ)</span>
        </div>
        <label class="switch"><input type="checkbox" id="toggleRowSpaceSharing" checked><span class="slider-toggle"></span></label>
      </div>
    </div>
  `;
}
