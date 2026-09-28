export function getSettingsQualityAndPrintHtml() {
  return `
    <div class="settings-tab-pane active" id="paneQuality">
      <div class="settings-grid-2col">
        <div class="setting-card">
          <div class="setting-section-header">📐 Output Resolution Presets</div>
          <div class="setting-item-row">
            <div class="setting-item-info">
              <span class="setting-title" data-i18n="setting_dpi_title">Print Resolution (DPI)</span>
              <p class="setting-hint" data-i18n="setting_dpi_hint">Print resolution in DPI (Standard lab quality is 300 DPI).</p>
            </div>
            <select id="settingDpiSelect" class="form-select">
              <option value="300" selected data-i18n="opt_dpi_300">300 DPI (Studio Standard)</option>
              <option value="600" data-i18n="opt_dpi_600">600 DPI (Ultra HD Print)</option>
              <option value="200" data-i18n="opt_dpi_200">200 DPI (Web & Online)</option>
              <option value="150" data-i18n="opt_dpi_150">150 DPI (Draft Preview)</option>
              <option value="custom" data-i18n="opt_dpi_custom">Custom DPI...</option>
            </select>
          </div>
          <div class="setting-item-row" id="settingCustomDpiRow" style="display: none;">
            <div class="setting-item-info"><span class="setting-title" data-i18n="setting_custom_dpi_title">Enter Custom DPI</span></div>
            <input type="number" id="settingCustomDpiInput" class="form-input" value="300" min="72" max="1200">
          </div>
          <div class="setting-item-row">
            <div class="setting-item-info">
              <span class="setting-title" data-i18n="setting_head_ratio_title">Head Height Ratio</span>
              <p class="setting-hint" data-i18n="setting_head_ratio_hint">Standard passport rules require 70-80% head coverage.</p>
            </div>
            <select id="settingHeadRatioSelect" class="form-select">
              <option value="0.70" data-i18n="opt_ratio_70">70% (Standard Relaxed)</option>
              <option value="0.72" selected data-i18n="opt_ratio_72">72% (ICAO Biometric)</option>
              <option value="0.75" data-i18n="opt_ratio_75">75% (Tight Fit)</option>
              <option value="0.80" data-i18n="opt_ratio_80">80% (EU Close-Up)</option>
            </select>
          </div>
        </div>
        <div class="setting-card">
          <div class="setting-section-header">💾 Export File Settings</div>
          <div class="setting-item-row">
            <div class="setting-item-info"><span class="setting-title" data-i18n="setting_format_title">Default Export Format</span></div>
            <select id="settingFormatSelect" class="form-select">
              <option value="image/jpeg" selected data-i18n="opt_fmt_jpg">JPEG (High Quality Print)</option>
              <option value="image/png" data-i18n="opt_fmt_png">PNG (Lossless / Transparent Alpha)</option>
              <option value="image/webp" data-i18n="opt_fmt_webp">WebP (Modern Compact)</option>
              <option value="application/pdf" data-i18n="opt_fmt_pdf">PDF (Print-Ready Document)</option>
            </select>
          </div>
          <div class="setting-item-row">
            <div class="setting-item-info">
              <span class="setting-title" data-i18n="setting_quality_title">JPEG Quality</span>
              <span id="valSettingQuality" style="font-weight: 700; color: var(--accent-primary);">98%</span>
            </div>
            <input type="range" id="settingQualitySlider" class="range-slider" min="70" max="100" value="98">
          </div>
          <div class="setting-item-row">
            <div class="setting-item-info">
              <span class="setting-title" data-i18n="setting_webp_quality_title">WebP Quality</span>
              <span id="valSettingWebpQuality" style="font-weight: 700; color: var(--accent-primary);">95%</span>
            </div>
            <input type="range" id="settingWebpQualitySlider" class="range-slider" min="70" max="100" value="95">
          </div>
          <div class="setting-item-row">
            <div class="setting-item-info"><span class="setting-title" data-i18n="setting_target_kb_title">Target Max File Size</span></div>
            <select id="settingTargetKbSelect" class="form-select">
              <option value="0" selected data-i18n="opt_kb_unlimited">Full HD (100% Quality)</option>
              <option value="50" data-i18n="opt_kb_50">Max 50 KB</option>
              <option value="100" data-i18n="opt_kb_100">Max 100 KB (Govt Form)</option>
              <option value="240" data-i18n="opt_kb_240">Max 240 KB (US Visa)</option>
              <option value="500" data-i18n="opt_kb_500">Max 500 KB</option>
            </select>
          </div>
          <div class="setting-item-row" style="flex-direction: column; align-items: stretch; gap: 8px;">
            <div class="form-group" style="margin-bottom: 2px;">
              <label class="form-label" style="font-weight: 700; color: var(--text-main); font-size: 0.78rem;" data-i18n="setting_naming_studio_label">🏢 Custom Studio Name</label>
              <input type="text" id="settingNamingStudioNameInput" class="form-input" placeholder="e.g. Mizentia Digital Photo Lab" value="Passport & Stamp Studio Pro" style="font-size: 0.82rem; height: 34px;">
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span class="setting-title" data-i18n="setting_naming_tokens_title">File Name Structure</span>
              <select id="settingNamingSeparatorSelect" class="form-select" style="width: 100px; height: 32px; font-size: 0.78rem;">
                <option value="_" selected>_ (Underscore)</option><option value="-">- (Hyphen)</option><option value=" ">  (Space)</option>
              </select>
            </div>
            <div id="namingTokensContainer" style="display: flex; flex-wrap: wrap; gap: 6px; padding: 6px; background: var(--bg-inset); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);"></div>
            <div id="settingNamingPreviewBox" style="padding: 8px 12px; background: var(--bg-inset); border: 1px dashed var(--border-subtle); border-radius: var(--radius-sm); font-size: 0.8rem; color: var(--text-muted);">
              📄 <strong data-i18n="preview_filename_title">Output Filename Preview:</strong><br>
              <span id="settingNamingPreviewText" style="color: var(--accent-primary); font-weight: 700; font-family: monospace; font-size: 0.86rem; word-break: break-all;">Mizentia-Studio_BD-Passport_40x50mm_300DPI.jpg</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
