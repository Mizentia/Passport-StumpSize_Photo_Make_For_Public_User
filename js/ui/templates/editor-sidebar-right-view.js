export function getEditorSidebarRightHtml() {
  return `
    <aside class="editor-sidebar">
      <div class="tool-card">
        <div class="tool-card-title" data-i18n="card_retouch">✨ Retouch, Blurry Fix & Beauty</div>
        <div class="retouch-tools-bar">
          <button class="btn-retouch-tool" id="btnToolSpotHeal" type="button" data-i18n="tool_spot_heal">🩹 Spot Heal</button>
          <button class="btn-retouch-tool" id="btnToolRedEye" type="button" data-i18n="tool_red_eye">👁️ Red-Eye Fix</button>
          <div style="display: flex; align-items: center; gap: 4px; margin-left: auto;">
            <span style="font-size: 0.72rem; color: var(--text-muted);" data-i18n="label_brush_size">Size:</span>
            <input type="range" id="slider_retouch_size" min="5" max="40" value="15" style="width: 60px; height: 4px; cursor: pointer;">
            <span id="val_retouch_size" style="font-size: 0.72rem; font-weight: 700; color: var(--accent-primary); min-width: 24px;">15px</span>
          </div>
        </div>
        <div class="form-group">
          <div class="form-label">
            <span data-i18n="quick_filters_title">🎨 One-Click Looks:</span>
            <button class="btn-smart btn-sm" id="btnResetFilters" style="padding: 2px 8px; font-size: 0.72rem;" data-i18n="btn_reset_filters" data-i18n-title="tooltip_reset_filters" data-shortcut-key="resetFilters">↺ Reset</button>
          </div>
          <div class="filter-presets-bar">
            <button class="filter-preset-chip active" data-filter="natural" data-i18n="preset_natural">Natural</button>
            <button class="filter-preset-chip" data-filter="vivid" data-i18n="preset_vivid">✨ Vivid Studio</button>
            <button class="filter-preset-chip" data-filter="warm" data-i18n="preset_warm">☀️ Warm Glow</button>
            <button class="filter-preset-chip" data-filter="cool" data-i18n="preset_cool">❄️ Cool Formal</button>
            <button class="filter-preset-chip" data-filter="bw" data-i18n="preset_bw">⬛ B&W Mono</button>
          </div>
        </div>
        <div class="form-group"><div class="form-label"><span data-i18n="filter_sharpness">Sharpness / Fix Blur</span><span id="val_sharpness">25</span></div><input type="range" id="slider_sharpness" class="range-slider" min="0" max="100" value="25"></div>
        <div class="form-group"><div class="form-label"><span data-i18n="filter_smoothing">Skin Smoothing / Beauty</span><span id="val_smoothing">0</span></div><input type="range" id="slider_smoothing" class="range-slider" min="0" max="100" value="0"></div>
        <div class="form-group"><div class="form-label"><span data-i18n="filter_brightness">Brightness</span><span id="val_brightness">100</span></div><input type="range" id="slider_brightness" class="range-slider" min="50" max="150" value="100"></div>
        <div class="form-group"><div class="form-label"><span data-i18n="filter_contrast">Contrast</span><span id="val_contrast">100</span></div><input type="range" id="slider_contrast" class="range-slider" min="50" max="150" value="100"></div>
        <div class="form-group"><div class="form-label"><span data-i18n="filter_saturation">Color Saturation</span><span id="val_saturation">100</span></div><input type="range" id="slider_saturation" class="range-slider" min="0" max="200" value="100"></div>
        <div class="form-group"><div class="form-label"><span data-i18n="filter_warmth">Warmth / Tone</span><span id="val_warmth">0</span></div><input type="range" id="slider_warmth" class="range-slider" min="-50" max="50" value="0"></div>
        <div class="form-group"><div class="form-label"><span data-i18n="filter_exposure">Exposure</span><span id="val_exposure">0</span></div><input type="range" id="slider_exposure" class="range-slider" min="-30" max="30" value="0"></div>
      </div>
      <div class="tool-card">
        <div class="tool-card-title" data-i18n="card_attire">👔 Formal Attire / Suit Changer</div>
        <div class="suit-grid">
          <div class="suit-item active" data-suit="none"><span class="suit-icon">🚫</span><span data-i18n="attire_none">Original</span></div>
          <div class="suit-item" data-suit="suit_black_tie"><span class="suit-icon">👔</span><span data-i18n="attire_black_tie">Black Suit</span></div>
          <div class="suit-item" data-suit="suit_navy_tie"><span class="suit-icon">🤵</span><span data-i18n="attire_navy_tie">Navy Suit</span></div>
          <div class="suit-item" data-suit="suit_charcoal"><span class="suit-icon">💼</span><span data-i18n="attire_charcoal">Charcoal</span></div>
          <div class="suit-item" data-suit="suit_white_shirt"><span class="suit-icon">👕</span><span data-i18n="attire_white_shirt">White Shirt</span></div>
          <div class="suit-item" data-suit="suit_female_blazer"><span class="suit-icon">👩‍💼</span><span data-i18n="attire_female_blazer">Lady Blazer</span></div>
          <div class="suit-item" data-suit="suit_female_formal"><span class="suit-icon">👚</span><span data-i18n="attire_female_formal">Lady Shirt</span></div>
          <div class="suit-item" data-suit="suit_academic_gown"><span class="suit-icon">🎓</span><span data-i18n="attire_gown">Grad Gown</span></div>
        </div>
        <div id="suitControlsPanel" class="suit-controls-box" style="display: none;">
          <div class="form-group"><label class="form-label" data-i18n="attire_scale">Attire Size (Scale)</label><input type="range" id="slider_suit_scale" class="range-slider" min="0.7" max="1.4" step="0.02" value="1.0"></div>
          <div class="form-group"><label class="form-label" data-i18n="attire_pos_x">Move Left / Right</label><input type="range" id="slider_suit_pos_x" class="range-slider" min="-60" max="60" step="1" value="0"></div>
          <div class="form-group"><label class="form-label" data-i18n="attire_pos_y">Move Up / Down</label><input type="range" id="slider_suit_pos_y" class="range-slider" min="-60" max="60" step="1" value="0"></div>
          <div class="form-group"><label class="form-label" data-i18n="attire_collar">Neck Width</label><input type="range" id="slider_suit_collar" class="range-slider" min="0.75" max="1.35" step="0.02" value="1.0"></div>
        </div>
      </div>
    </aside>
  `;
}
