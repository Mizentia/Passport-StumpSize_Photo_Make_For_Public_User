export function getAboutModalHtml() {
  return `
    <div class="modal-overlay" id="aboutModal" style="display: none;">
      <div class="modal-card about-modal-card">
        <div class="modal-header about-modal-header">
          <div class="about-brand-badge">
            <div class="about-logo-icon">📸</div>
            <div class="about-title-wrap">
              <h3 class="about-app-name" data-i18n="app_title">Passport Photo Maker</h3>
              <span class="about-version-pill" data-i18n="about_badge_version">Version 2.5 (2026 Edition) • 100% Free Public Tool</span>
            </div>
          </div>
          <button class="modal-close-btn" id="btnCloseAboutModal" title="Close">✕</button>
        </div>
        <div class="modal-body about-modal-body">
          <div class="about-mission-box">
            <p class="about-mission-text" data-i18n="about_modal_mission">
              Passport Photo Maker is a free, modern photo tool created by Noksha Lab for the public and students. It enables easy creation and sheet printing of international standard passport, visa, stamp, and custom photos without fees or watermarks from any device.
            </p>
          </div>

          <div class="about-meta-grid">
            <div class="about-meta-item">
              <span class="meta-label" data-i18n="about_meta_initiative_label">Initiative & Team:</span>
              <span class="meta-value" data-i18n="about_meta_initiative_val">Noksha Lab Architecture</span>
            </div>
            <div class="about-meta-item">
              <span class="meta-label" data-i18n="about_meta_dev_label">Lead Developer:</span>
              <span class="meta-value" data-i18n="about_meta_dev_val">Mizanur Rahman</span>
            </div>
            <div class="about-meta-item">
              <span class="meta-label" data-i18n="about_meta_release_label">Version & Release:</span>
              <span class="meta-value" data-i18n="about_meta_release_val">Version 2.5 (October 2026 Edition)</span>
            </div>
            <div class="about-meta-item">
              <span class="meta-label" data-i18n="about_modal_privacy_label">Privacy & Security:</span>
              <span class="meta-value" data-i18n="about_modal_privacy_val">100% local client processing (your photos stay on your device)</span>
            </div>
          </div>

          <div class="about-features-section">
            <h4 class="about-features-title" data-i18n="about_modal_features_title">🌟 Key Capabilities:</h4>
            <ul class="about-features-list">
              <li data-i18n="about_modal_feat_1">✨ Biometric Auto-Fit: Precise eye level and face ratio framing.</li>
              <li data-i18n="about_modal_feat_2">📐 Custom Sizes & DPI: Any mm/inch/pixel size with ultra-HD DPI.</li>
              <li data-i18n="about_modal_feat_3">🖨️ Multi-Photo Tiling: Automated sheets on 4R, 5R, A4, or custom papers.</li>
              <li data-i18n="about_modal_feat_4">🪄 Backdrop & Retouch: 1-click solid backdrop change and photo enhancement.</li>
            </ul>
          </div>
        </div>
        <div class="modal-footer about-modal-footer">
          <span class="about-copyright" data-i18n="about_modal_copyright">© 2026 Noksha Lab. Free for Public & Commercial Use.</span>
          <button class="btn-primary" id="btnCloseAboutBtn" data-i18n="btn_got_it">Got It</button>
        </div>
      </div>
    </div>
  `;
}
