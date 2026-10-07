export function getSettingsStandardsAndStorageHtml() {
  return `
    <div class="settings-tab-pane" id="paneStandards">
      <div class="setting-section-header" data-i18n="bio_guide_title">🌐 International Biometric Passport Standards</div>
      <div class="biometric-table-wrapper">
        <table class="biometric-table">
          <thead>
            <tr>
              <th data-i18n="bio_col_country">Country / Format</th>
              <th data-i18n="bio_col_dim">Dimensions</th>
              <th data-i18n="bio_col_bg">Backdrop</th>
              <th data-i18n="bio_col_head">Head Ratio</th>
              <th data-i18n="bio_col_notes">Notes</th>
              <th data-i18n="bio_col_action">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr><td><strong>🇧🇩 BD Passport</strong></td><td>38.1x50.8 mm (1.5x2")</td><td>Pure White</td><td>70-80%</td><td>Standard 1.5x2"</td><td><button class="btn-smart btn-sm btn-apply-bio-preset" data-preset="bd_passport" data-i18n="bio_btn_apply">Apply</button></td></tr>
            <tr><td><strong>🇧🇩 BD Stamp</strong></td><td>20x25 mm (0.79x0.98")</td><td>Sky Blue / White</td><td>70%</td><td>Official forms</td><td><button class="btn-smart btn-sm btn-apply-bio-preset" data-preset="bd_stamp" data-i18n="bio_btn_apply">Apply</button></td></tr>
            <tr><td><strong>🇧🇩 Govt Job</strong></td><td>300x300 px (1x1")</td><td>Pure White</td><td>Full Face</td><td>Max 100 KB</td><td><button class="btn-smart btn-sm btn-apply-bio-preset" data-preset="bd_job" data-i18n="bio_btn_apply">Apply</button></td></tr>
            <tr><td><strong>🇺🇸 US Visa</strong></td><td>2x2" (50.8x50.8 mm)</td><td>Pure White</td><td>50-69%</td><td>No glasses</td><td><button class="btn-smart btn-sm btn-apply-bio-preset" data-preset="us_passport" data-i18n="bio_btn_apply">Apply</button></td></tr>
            <tr><td><strong>🇪🇺 Schengen / UK</strong></td><td>35x45 mm (1.38x1.77")</td><td>Light Grey / White</td><td>70-80%</td><td>ICAO Doc 9303</td><td><button class="btn-smart btn-sm btn-apply-bio-preset" data-preset="schengen_passport" data-i18n="bio_btn_apply">Apply</button></td></tr>
            <tr><td><strong>🇮🇳 India Passport</strong></td><td>35x45 mm (1.38x1.77")</td><td>Pure White</td><td>70-80%</td><td>Even lighting</td><td><button class="btn-smart btn-sm btn-apply-bio-preset" data-preset="india_passport" data-i18n="bio_btn_apply">Apply</button></td></tr>
            <tr><td><strong>🇸🇦 Saudi / Hajj</strong></td><td>40x60 mm (1.57x2.36")</td><td>Pure White</td><td>70-80%</td><td>Nusuk portal standard</td><td><button class="btn-smart btn-sm btn-apply-bio-preset" data-preset="saudi_passport" data-i18n="bio_btn_apply">Apply</button></td></tr>
            <tr><td><strong>🇦🇪 UAE / Dubai</strong></td><td>40x60 mm (1.57x2.36")</td><td>Pure White</td><td>70-80%</td><td>GDRFA & ICP</td><td><button class="btn-smart btn-sm btn-apply-bio-preset" data-preset="dubai_passport" data-i18n="bio_btn_apply">Apply</button></td></tr>
            <tr><td><strong>🇨🇦 Canada Visa</strong></td><td>50x70 mm (1.97x2.76")</td><td>Pure White</td><td>31-36 mm head</td><td>Neutral expression</td><td><button class="btn-smart btn-sm btn-apply-bio-preset" data-preset="canada_passport" data-i18n="bio_btn_apply">Apply</button></td></tr>
            <tr><td><strong>🇲🇾 Malaysia Visa</strong></td><td>35x50 mm (1.38x1.97")</td><td>White / Blue</td><td>60-70%</td><td>EMGS student</td><td><button class="btn-smart btn-sm btn-apply-bio-preset" data-preset="malaysia_passport" data-i18n="bio_btn_apply">Apply</button></td></tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="settings-tab-pane" id="paneStorage">
      <div class="settings-grid-2col">
        <div class="storage-backup-box">
          <div class="setting-section-header">📥 Backup & Restore Settings</div>
          <p class="setting-hint" data-i18n="storage_backup_desc">Download or import studio parameters as JSON.</p>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="btn-secondary btn-sm" id="btnExportSettingsJson" data-i18n="btn_export_backup">📥 Export Settings (JSON)</button>
            <button class="btn-secondary btn-sm" id="btnImportSettingsJson" data-i18n="btn_import_backup">📤 Import Settings (JSON)</button>
            <input type="file" id="importSettingsFileInput" accept=".json" style="display: none;">
          </div>
          <div style="font-size: 0.75rem; color: var(--text-dim); margin-top: 4px;" id="storageStatusDisplay" data-i18n="storage_status_active">IndexedDB Session Active</div>
        </div>
        <div class="setting-card">
          <div class="setting-section-header">💾 Session Management</div>
          <div class="toggle-row" style="padding: 4px 0;">
            <div><div class="setting-title" data-i18n="setting_autosave_title">Auto-Save Photo Session</div></div>
            <label class="switch"><input type="checkbox" id="settingAutoSaveToggle" checked><span class="slider-toggle"></span></label>
          </div>
          <div class="storage-cleanup-box" style="margin-top: 8px;">
            <div class="setting-title" style="color: var(--accent-danger);" data-i18n="setting_clearcache_title">Reset Saved Session</div>
            <button class="btn-danger-outline" id="btnClearSessionStorage" data-i18n="btn_clear_storage">🗑️ Clear Cache & Reset</button>
          </div>
        </div>
      </div>
    </div>
  `;
}
