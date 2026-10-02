import { getSettingsQualityAndPrintHtml } from './settings-tabs-view.js';
import { getSettingsBackdropHtml } from './settings-backdrop-view.js';
import { getSettingsBrandingAndStandardsHtml } from './settings-branding-view.js';
import { getSettingsStandardsAndStorageHtml } from './settings-standards-storage-view.js';
import { getSettingsShortcutsHtml } from './settings-shortcuts-view.js';

export function getSettingsTabHtml() {
  const backdropComplete = getSettingsBackdropHtml();

  return `
    <section id="settingsTab" class="tab-content">
      <div class="settings-page-card" id="settingsPageCard">
        <div class="settings-page-header">
          <div class="settings-header-info">
            <div class="settings-badge">
              <span>⚙️</span>
              <span class="settings-badge-text">Studio Master Preferences</span>
            </div>
            <h2 class="settings-page-title" data-i18n="title_settings">⚙️ Studio Pro Master Configuration</h2>
            <p class="settings-page-subtitle">Configure DPI resolution, default paper sizes, print margins, hotkeys, and automated backup rules.</p>
          </div>
          <div class="settings-header-actions">
            <button class="btn-primary" id="btnSaveSettingsTop">
              <span>💾</span>
              <span data-i18n="btn_save_settings">Save Preferences</span>
            </button>
            <button class="btn-secondary" id="btnSettingsBackToStudio">
              <span>←</span>
              <span>স্টুডিওতে ফিরুন (Back)</span>
            </button>
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

        <div class="settings-panes-wrapper">
          ${getSettingsQualityAndPrintHtml()}
          ${getSettingsBrandingAndStandardsHtml()}
          ${backdropComplete}
          ${getSettingsStandardsAndStorageHtml()}
          ${getSettingsShortcutsHtml()}
        </div>

        <div class="settings-page-footer">
          <div class="settings-footer-tip" data-i18n="settings_esc_tip">💡 সেটিংসে করা পরিবর্তন সেভ করলে স্টুডিও ও প্রিন্ট শিটে সাথে সাথে কার্যকর হবে।</div>
          <div class="settings-footer-actions">
            <button class="btn-primary" id="btnSaveSettings" data-i18n="btn_save_settings">💾 Save Preferences</button>
          </div>
        </div>
      </div>
    </section>
  `;
}
