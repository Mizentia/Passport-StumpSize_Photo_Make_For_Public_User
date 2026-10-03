export function getSettingsBrandingAndStandardsHtml() {
  return `
    <div class="settings-tab-pane" id="panePrint">
      <div class="settings-grid-2col">
        <div class="setting-card">
          <div class="setting-section-header" data-i18n="sec_border_params">🔲 Photo Border Parameters</div>
          <div class="setting-item-row">
            <div class="setting-item-info"><span class="setting-title" data-i18n="setting_border_color_title">Border Color</span></div>
            <select id="settingBorderColorSelect" class="form-select">
              <option value="#cbd5e1" selected data-i18n="opt_color_light_gray">Light Gray (#cbd5e1)</option>
              <option value="#64748b" data-i18n="opt_color_slate">Slate (#64748b)</option>
              <option value="#000000" data-i18n="opt_color_black">Dark Black (#000000)</option>
              <option value="#3b82f6" data-i18n="opt_color_blue">Blue Tint (#3b82f6)</option>
            </select>
          </div>
          <div class="setting-item-row">
            <div class="setting-item-info"><span class="setting-title" data-i18n="setting_border_width_title">Border Thickness</span></div>
            <select id="settingBorderWidthSelect" class="form-select">
              <option value="1" selected data-i18n="opt_bw_1">1 px (Ultra Thin)</option>
              <option value="2" data-i18n="opt_bw_2">2 px (Standard Visible)</option>
            </select>
          </div>
        </div>
        <div class="setting-card">
          <div class="setting-section-header" data-i18n="sec_cutting_guides">✂️ Cutting Guide Marks</div>
          <div class="setting-item-row">
            <div class="setting-item-info"><span class="setting-title" data-i18n="setting_cut_style_title">Cut Marks Line Style</span></div>
            <select id="settingCutMarksSelect" class="form-select">
              <option value="corner_cross" selected data-i18n="opt_cut_cross">Corner Cross Ticks (+)</option>
              <option value="corner_angle" data-i18n="opt_cut_angle">Corner Angles (L-marks)</option>
              <option value="dash_box" data-i18n="opt_cut_dash">Dashed Box Border (- - -)</option>
            </select>
          </div>
        </div>
        <div class="setting-card" style="grid-column: span 2;">
          <div class="setting-section-header" data-i18n="card_custom_papers_title">📄 Studio Custom Paper Sizes</div>
          <div id="customPapersListContainer" style="margin-bottom: 14px;"></div>
          <div style="background: var(--bg-inset); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 14px;">
            <div style="font-weight: 700; font-size: 0.85rem; color: var(--text-main); margin-bottom: 10px;" data-i18n="title_add_custom_paper">➕ Add New Custom Paper Size</div>
            <div style="display: grid; grid-template-columns: 1.5fr 1fr 1fr auto 1fr; gap: 8px; align-items: flex-end; margin-bottom: 10px;">
              <div class="form-group"><label class="form-label" data-i18n="label_paper_name">Paper Name</label><input type="text" id="settingCustomPaperName" class="form-input" placeholder="e.g. DNP 4x6 Roll"></div>
              <div class="form-group"><label class="form-label" data-i18n="label_unit">Unit</label><select id="settingCustomPaperUnit" class="form-select"><option value="mm" selected>mm</option><option value="inch">inch</option><option value="cm">cm</option></select></div>
              <div class="form-group"><label class="form-label" id="settingPaperLabel1">Height</label><input type="number" id="settingPaperInput1" class="form-input" value="152" step="any"></div>
              <button class="btn-icon" id="btnSwapPaperHW" title="Swap" style="height: 38px; width: 38px;" type="button">⇄</button>
              <div class="form-group"><label class="form-label" id="settingPaperLabel2">Width</label><input type="number" id="settingPaperInput2" class="form-input" value="102" step="any"></div>
            </div>
            <div id="customPaperConversionPreview" style="margin-bottom: 10px;"></div>
            <div style="display: grid; grid-template-columns: 1fr 1fr 2fr; gap: 10px; align-items: end;">
              <div class="form-group"><label class="form-label" data-i18n="label_paper_margin">Margin (mm)</label><input type="number" id="settingCustomPaperMargin" class="form-input" value="4"></div>
              <div class="form-group"><label class="form-label" data-i18n="label_paper_gap">Gap (mm)</label><input type="number" id="settingCustomPaperGap" class="form-input" value="3"></div>
              <button class="btn-primary" id="btnAddNewCustomPaper" style="height: 38px;" data-i18n="btn_add_paper">➕ Add Paper</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="settings-tab-pane" id="paneBranding">
      <div class="settings-grid-2col">
        <div class="setting-card">
          <div class="setting-section-header" data-i18n="sec_studio_info">🏢 Studio Business Information</div>
          <div class="setting-item-row"><div class="setting-item-info"><span class="setting-title" data-i18n="setting_studio_name_title">Studio Business Name</span></div><input type="text" id="settingStudioNameInput" class="form-input" placeholder="e.g. Mizentia Digital Photo Lab" value="Passport & Stamp Studio Pro"></div>
          <div class="setting-item-row"><div class="setting-item-info"><span class="setting-title" data-i18n="setting_studio_phone_title">Studio Phone</span></div><input type="text" id="settingStudioPhoneInput" class="form-input" placeholder="e.g. +880 1700-000000"></div>
          <div class="toggle-row" style="padding: 4px 0;"><div><div class="setting-title" data-i18n="setting_studio_tag_title">Print Tagline on Sheet</div></div><label class="switch"><input type="checkbox" id="settingStudioTagToggle"><span class="slider-toggle"></span></label></div>
        </div>
        <div class="setting-card">
          <div class="setting-section-header" data-i18n="sec_proof_watermark">🛡️ Proof Watermark</div>
          <div class="toggle-row" style="padding: 4px 0;"><div><div class="setting-title" data-i18n="setting_watermark_title">Sample Watermark</div></div><label class="switch"><input type="checkbox" id="settingWatermarkToggle"><span class="slider-toggle"></span></label></div>
          <div class="setting-item-row"><div class="setting-item-info"><span class="setting-title" data-i18n="setting_watermark_text_title">Watermark Text</span></div><input type="text" id="settingWatermarkTextInput" class="form-input" value="SAMPLE PROOF"></div>
        </div>
      </div>
    </div>
  `;
}
