export function getSettingsShortcutsHtml() {
  return `
    <div class="settings-tab-pane" id="paneShortcuts">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
        <div>
          <div class="setting-section-header">⌨️ Customizable Studio Keyboard Shortcuts</div>
          <p class="setting-hint" data-i18n="shortcut_custom_hint">Click any shortcut button below, then press key combination to rebind.</p>
        </div>
        <button class="btn-smart btn-sm" id="btnResetShortcuts" style="padding: 4px 12px; font-size: 0.78rem;" data-i18n="btn_reset_shortcuts">↺ Reset Hotkeys</button>
      </div>
      <div class="shortcuts-container">
        <div class="shortcut-category-card">
          <div class="shortcut-category-header" data-i18n="shortcut_cat_nav">🧭 App Navigation</div>
          <div class="shortcuts-category-grid">
            <div class="shortcut-row"><div class="shortcut-info"><strong data-i18n="action_tab_upload">Upload Photo</strong></div><button class="btn-hotkey-record" data-action="tabUpload">Alt+1</button></div>
            <div class="shortcut-row"><div class="shortcut-info"><strong data-i18n="action_tab_editor">Studio Editor</strong></div><button class="btn-hotkey-record" data-action="tabEditor">Alt+2</button></div>
            <div class="shortcut-row"><div class="shortcut-info"><strong data-i18n="action_tab_sheet">Print Sheet</strong></div><button class="btn-hotkey-record" data-action="tabSheet">Alt+3</button></div>
            <div class="shortcut-row"><div class="shortcut-info"><strong data-i18n="action_open_settings">Settings</strong></div><button class="btn-hotkey-record" data-action="openSettings">Alt+S</button></div>
            <div class="shortcut-row"><div class="shortcut-info"><strong data-i18n="action_toggle_theme">Theme</strong></div><button class="btn-hotkey-record" data-action="toggleTheme">Alt+T</button></div>
            <div class="shortcut-row"><div class="shortcut-info"><strong data-i18n="action_toggle_lang">Language</strong></div><button class="btn-hotkey-record" data-action="toggleLang">Alt+L</button></div>
          </div>
        </div>
        <div class="shortcut-category-card">
          <div class="shortcut-category-header" data-i18n="shortcut_cat_ai">🎨 Studio Backdrop & AI</div>
          <div class="shortcuts-category-grid">
            <div class="shortcut-row"><div class="shortcut-info"><strong data-i18n="action_choose_file">Choose File</strong></div><button class="btn-hotkey-record" data-action="chooseFile">Alt+O</button></div>
            <div class="shortcut-row"><div class="shortcut-info"><strong data-i18n="action_open_webcam">Open Webcam</strong></div><button class="btn-hotkey-record" data-action="openWebcam">Alt+W</button></div>
            <div class="shortcut-row"><div class="shortcut-info"><strong data-i18n="action_auto_fit">Auto-Fit Face</strong></div><button class="btn-hotkey-record" data-action="autoFit">F</button></div>
            <div class="shortcut-row"><div class="shortcut-info"><strong data-i18n="action_auto_enhance">Auto Enhance</strong></div><button class="btn-hotkey-record" data-action="autoEnhance">E</button></div>
            <div class="shortcut-row"><div class="shortcut-info"><strong data-i18n="action_remove_bg">AI Remove BG</strong></div><button class="btn-hotkey-record" data-action="removeBg">Alt+B</button></div>
            <div class="shortcut-row"><div class="shortcut-info"><strong data-i18n="action_restore_bg">Restore BG</strong></div><button class="btn-hotkey-record" data-action="restoreBg">Alt+Shift+B</button></div>
          </div>
        </div>
        <div class="shortcut-category-card">
          <div class="shortcut-category-header" data-i18n="shortcut_cat_canvas">🔍 Canvas Manipulations</div>
          <div class="shortcuts-category-grid">
            <div class="shortcut-row"><div class="shortcut-info"><strong data-i18n="action_undo">Undo</strong></div><button class="btn-hotkey-record" data-action="undo">Ctrl+Z</button></div>
            <div class="shortcut-row"><div class="shortcut-info"><strong data-i18n="action_redo">Redo</strong></div><button class="btn-hotkey-record" data-action="redo">Ctrl+Y</button></div>
            <div class="shortcut-row"><div class="shortcut-info"><strong data-i18n="action_reset_all">Reset Adjustments</strong></div><button class="btn-hotkey-record" data-action="resetAll">Alt+R</button></div>
            <div class="shortcut-row"><div class="shortcut-info"><strong data-i18n="action_reset_filters">Reset Filters</strong></div><button class="btn-hotkey-record" data-action="resetFilters">Alt+F</button></div>
            <div class="shortcut-row"><div class="shortcut-info"><strong data-i18n="action_zoom_in">Zoom In</strong></div><button class="btn-hotkey-record" data-action="zoomIn">+</button></div>
            <div class="shortcut-row"><div class="shortcut-info"><strong data-i18n="action_zoom_out">Zoom Out</strong></div><button class="btn-hotkey-record" data-action="zoomOut">-</button></div>
            <div class="shortcut-row"><div class="shortcut-info"><strong data-i18n="action_zoom_fit">Fit & Center</strong></div><button class="btn-hotkey-record" data-action="zoomFit">0</button></div>
            <div class="shortcut-row"><div class="shortcut-info"><strong data-i18n="action_rotate">Rotate 90°</strong></div><button class="btn-hotkey-record" data-action="rotate">R</button></div>
            <div class="shortcut-row"><div class="shortcut-info"><strong data-i18n="action_flip_h">Flip Horizontal</strong></div><button class="btn-hotkey-record" data-action="flipH">H</button></div>
            <div class="shortcut-row"><div class="shortcut-info"><strong data-i18n="action_flip_v">Flip Vertical</strong></div><button class="btn-hotkey-record" data-action="flipV">V</button></div>
            <div class="shortcut-row"><div class="shortcut-info"><strong data-i18n="action_guides">Guides</strong></div><button class="btn-hotkey-record" data-action="guides">G</button></div>
          </div>
        </div>
        <div class="shortcut-category-card">
          <div class="shortcut-category-header" data-i18n="shortcut_cat_export">🖨️ Export & Print</div>
          <div class="shortcuts-category-grid">
            <div class="shortcut-row"><div class="shortcut-info"><strong data-i18n="action_download_single">Single JPG</strong></div><button class="btn-hotkey-record" data-action="downloadSingle">Ctrl+S</button></div>
            <div class="shortcut-row"><div class="shortcut-info"><strong data-i18n="action_download_png">Single PNG</strong></div><button class="btn-hotkey-record" data-action="downloadPng">Ctrl+Shift+S</button></div>
            <div class="shortcut-row"><div class="shortcut-info"><strong data-i18n="action_download_sheet">Sheet (JPG)</strong></div><button class="btn-hotkey-record" data-action="downloadSheet">Ctrl+P</button></div>
            <div class="shortcut-row"><div class="shortcut-info"><strong data-i18n="action_download_pdf">PDF Sheet</strong></div><button class="btn-hotkey-record" data-action="downloadPdf">Ctrl+Shift+P</button></div>
            <div class="shortcut-row"><div class="shortcut-info"><strong data-i18n="action_print_direct">Direct Print</strong></div><button class="btn-hotkey-record" data-action="printDirect">Ctrl+Shift+D</button></div>
          </div>
        </div>
      </div>
    </div>
  `;
}
