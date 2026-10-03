export function getSettingsBackdropHtml() {
  return `
    <div class="settings-tab-pane" id="paneBackdrop">
      <div class="settings-grid-2col">
        <div class="setting-card">
          <div class="setting-section-header" data-i18n="card_backdrop_title">🎨 Default Studio Backdrop</div>
          <p class="setting-hint" data-i18n="setting_backdrop_info_hint" style="margin-bottom: 10px;">Primary backdrop applied on new upload or background removal.</p>
          <div class="setting-item-row">
            <div class="setting-item-info"><span class="setting-title" data-i18n="setting_default_backdrop_title">Default Backdrop Color</span></div>
            <select id="settingDefaultBackdropSelect" class="form-select">
              <option value="#ffffff" selected data-i18n="color_white">Pure White (#ffffff) - BD, US, EU, Job</option>
              <option value="#38bdf8" data-i18n="color_embassy_blue">Embassy Blue (#38bdf8) - Gulf / Embassy</option>
              <option value="#93c5fd" data-i18n="color_sky_blue">Sky Blue (#93c5fd) - BD Stamp, Malaysia</option>
              <option value="#1e40af" data-i18n="color_deep_blue">Deep Blue (#1e40af) - Corporate / ID</option>
              <option value="#f8fafc" data-i18n="color_off_white">Off White (#f8fafc) - UK / Schengen</option>
              <option value="#dc2626" data-i18n="color_red">Red Backdrop (#dc2626) - Vietnam</option>
            </select>
          </div>
        </div>
        <div class="setting-card">
          <div class="setting-section-header" data-i18n="card_auto_enhance_title">🌟 Smart Auto-Enhance Engine</div>
          <div class="toggle-row" style="padding: 4px 0;">
            <div>
              <div class="setting-title" data-i18n="setting_auto_enhance_title">Auto-Enhance Lighting on Upload</div>
              <p class="setting-hint" data-i18n="setting_auto_enhance_hint">Auto balances contrast, sharpness & lighting on load.</p>
            </div>
            <label class="switch"><input type="checkbox" id="settingAutoEnhanceToggle"><span class="slider-toggle"></span></label>
          </div>
        </div>
        <div class="setting-card" style="grid-column: span 2;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
            <div class="setting-section-header" style="margin-bottom: 0;" data-i18n="ai_bg_remover_title">🤖 Smart AI Background Removal</div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <label class="form-label" style="margin-bottom: 0; font-size: 0.76rem;" data-i18n="setting_bg_feather_title">Edge Feather:</label>
              <input type="range" id="settingBgFeatherSlider" class="range-slider" min="1" max="5" value="2" style="width: 80px;">
              <span id="valSettingBgFeather" style="font-weight: 700; color: var(--accent-primary); font-size: 0.8rem;">2px</span>
            </div>
          </div>
          <div style="margin-top: 12px; padding: 14px; border-radius: 12px; background: var(--badge-bg-subtle, rgba(255,255,255,0.04)); border: 1px solid var(--border-color, rgba(255,255,255,0.1)); display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 1.4rem;">✨</span>
              <div>
                <div style="font-weight: 700; font-size: 0.9rem; color: var(--text-main);" data-i18n="ai_bg_remover_title">AI Background Remover Engine</div>
                <div style="font-size: 0.78rem; color: var(--text-dim);" data-i18n="ai_bg_remover_desc">High-precision face edge detection and background extraction powered by in-browser neural networks.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
