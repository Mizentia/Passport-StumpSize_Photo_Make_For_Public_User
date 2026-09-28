import { getSettingsQualityAndPrintHtml } from './settings-tabs-view.js';
import { getSettingsBackdropHtml } from './settings-backdrop-view.js';
import { getSettingsBrandingAndStandardsHtml } from './settings-branding-view.js';
import { getSettingsStandardsAndStorageHtml } from './settings-standards-storage-view.js';
import { getSettingsShortcutsHtml } from './settings-shortcuts-view.js';

export function getSettingsModalHtml() {
  const backdropComplete = getSettingsBackdropHtml();

  return `
    <div class="modal-backdrop" id="settingsModal">
      <div class="modal-box settings-modal-box">
        <div class="modal-header">
          <div class="modal-title" data-i18n="title_settings">⚙️ Studio Pro Master Configuration</div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 0.75rem; color: var(--text-dim);" data-i18n="settings_esc_tip">💡 Esc to exit</span>
            <button class="btn-icon" id="btnCloseSettings" title="Close" data-i18n-title="btn_close">✕</button>
          </div>
        </div>
        <div class="settings-tabs-nav">
          <button class="settings-tab-btn active" data-target="paneQuality" data-i18n="settings_tab_quality">📐 Quality & DPI</button>
          <button class="settings-tab-btn" data-target="panePrint" data-i18n="settings_tab_print">🖨️ Print & Paper</button>
          <button class="settings-tab-btn" data-target="paneBackdrop" data-i18n="settings_tab_backdrop">🎨 Backdrop & AI</button>
          <button class="settings-tab-btn" data-target="paneBranding" data-i18n="settings_tab_branding">🏢 Studio Branding</button>
          <button class="settings-tab-btn" data-target="paneStandards" data-i18n="settings_tab_standards">🌐 Biometric Guide</button>
          <button class="settings-tab-btn" data-target="paneShortcuts" data-i18n="settings_tab_shortcuts">⌨️ Hotkeys</button>
          <button class="settings-tab-btn" data-target="paneStorage" data-i18n="settings_tab_app">💾 Storage & Backup</button>
        </div>
        ${getSettingsQualityAndPrintHtml()}
        ${getSettingsBrandingAndStandardsHtml()}
        ${backdropComplete}
        ${getSettingsStandardsAndStorageHtml()}
        ${getSettingsShortcutsHtml()}
        <div class="settings-modal-footer">
          <div style="font-size: 0.78rem; color: var(--text-dim);" data-i18n="settings_esc_tip">💡 Press Esc to exit settings anytime</div>
          <button class="btn-primary" id="btnSaveSettings" data-i18n="btn_save_settings">💾 Save Preferences</button>
        </div>
      </div>
    </div>
  `;
}
