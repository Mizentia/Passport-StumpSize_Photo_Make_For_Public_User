import { getAboutStandardsTableHtml } from './about-standards-view.js';

export function getAboutTabHtml() {
  return `
    <section id="aboutTab" class="tab-content">
      <div class="about-page-container">
        <!-- Hero Section -->
        <div class="about-hero-card">
          <div class="about-hero-content">
            <div class="about-hero-badge">
              <span class="about-hero-icon">📸</span>
              <span class="about-version-tag" data-i18n="about_badge_version">Version 2.5 (2026 Edition) • 100% Free Public Tool</span>
            </div>
            <h2 class="about-hero-title" data-i18n="app_title">Passport Photo Maker</h2>
            <p class="about-hero-subtitle" data-i18n="about_hero_subtitle">
              A completely free, secure, and international-standard photo cropping and print studio open for the general public, students, and professionals.
            </p>
            <div class="about-hero-actions">
              <button class="btn-primary" id="btnAboutStartPhoto" data-i18n="about_btn_start">📸 1. Start Photo Maker</button>
              <button class="btn-secondary" id="btnAboutGoSettings" data-i18n="about_btn_settings">⚙️ Studio Master Settings</button>
            </div>
          </div>
        </div>

        <!-- Privacy & Security Guarantee Banner -->
        <div class="about-privacy-banner">
          <div class="privacy-icon">🔒</div>
          <div class="privacy-text">
            <h4 class="privacy-heading" data-i18n="about_privacy_title">100% Offline & Local Client Privacy Guarantee</h4>
            <p class="privacy-desc" data-i18n="about_privacy_desc">
              Your photos are never uploaded to any remote servers. Face detection, cropping, background removal, and print sheet generation happen completely privately within your own browser memory.
            </p>
          </div>
        </div>

        <!-- Key Features Grid -->
        <div class="about-features-container">
          <h3 class="about-section-heading" data-i18n="about_features_heading">🌟 Key Studio Features & Capabilities</h3>
          <div class="about-features-grid">
            <div class="about-feat-card">
              <div class="feat-icon-wrap">👁️</div>
              <h4 class="feat-title" data-i18n="about_feat_bio_title">Biometric Auto-Fit</h4>
              <p class="feat-desc" data-i18n="about_feat_bio_desc">Automatically detects eye level and face height (70-80%) in accordance with international ICAO 9303 standards.</p>
            </div>
            <div class="about-feat-card">
              <div class="feat-icon-wrap">📐</div>
              <h4 class="feat-title" data-i18n="about_feat_custom_title">Custom Sizes & 300/600 DPI</h4>
              <p class="feat-desc" data-i18n="about_feat_custom_desc">Full support for Bangladesh Passport, US Visa, European Schengen, Stamp Size, or custom measurements.</p>
            </div>
            <div class="about-feat-card">
              <div class="feat-icon-wrap">🖨️</div>
              <h4 class="feat-title" data-i18n="about_feat_sheet_title">Multi-Photo Print Sheet Tiling</h4>
              <p class="feat-desc" data-i18n="about_feat_sheet_desc">Generate print-ready photo sheets on 4R, 5R, A4, or custom papers with cutting guides and margins.</p>
            </div>
            <div class="about-feat-card">
              <div class="feat-icon-wrap">🎨</div>
              <h4 class="feat-title" data-i18n="about_feat_bg_title">Smart Background Replacement</h4>
              <p class="feat-desc" data-i18n="about_feat_bg_desc">Automatic background removal, solid white, official blue, off-white replacements, and studio color tone adjustments.</p>
            </div>
            <div class="about-feat-card">
              <div class="feat-icon-wrap">🩹</div>
              <h4 class="feat-title" data-i18n="about_feat_retouch_title">Face Retouch & Blemish Fix</h4>
              <p class="feat-desc" data-i18n="about_feat_retouch_desc">Spot healing brush for blemishes, flash red-eye correction, portrait rotation, and sharpness tuning.</p>
            </div>
            <div class="about-feat-card">
              <div class="feat-icon-wrap">📜</div>
              <h4 class="feat-title" data-i18n="about_feat_history_title">Project Archive & Draft History</h4>
              <p class="feat-desc" data-i18n="about_feat_history_desc">Auto-saves drafts and completed projects. Restore, re-edit, or re-export previous photos anytime.</p>
            </div>
          </div>
        </div>

        ${getAboutStandardsTableHtml()}
      </div>
    </section>
  `;
}
