export function getAboutStandardsTableHtml() {
  return `
    <div class="about-standards-container">
      <h3 class="about-section-heading" data-i18n="about_standards_heading">🌐 International Biometric Photo Standards Guide</h3>
      <div class="about-table-wrap">
        <table class="about-table">
          <thead>
            <tr>
              <th data-i18n="about_col_country">Country / Category</th>
              <th data-i18n="about_col_dimensions">Size (mm / inch)</th>
              <th data-i18n="about_col_backdrop">Recommended Backdrop</th>
              <th data-i18n="about_col_head">Head / Face Coverage</th>
              <th data-i18n="about_col_dpi">Resolution</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong data-i18n="about_std_bd_name">🇧🇩 Bangladesh E-Passport / MRP</strong></td>
              <td>40 &times; 50 mm</td><td data-i18n="about_std_bd_bg">Pure White</td>
              <td data-i18n="about_std_bd_head">70% - 80% (35 mm)</td><td>300 DPI (472 &times; 591 px)</td>
            </tr>
            <tr>
              <td><strong data-i18n="about_std_us_name">🇺🇸 United States (US Visa / Passport)</strong></td>
              <td data-i18n="about_std_us_dim">51 &times; 51 mm (2 &times; 2 in)</td><td data-i18n="about_std_us_bg">Pure White</td>
              <td data-i18n="about_std_us_head">50% - 69% (1 - 1.38 in)</td><td>300 DPI (600 &times; 600 px)</td>
            </tr>
            <tr>
              <td><strong data-i18n="about_std_eu_name">🇪🇺 Schengen Visa / Europe</strong></td>
              <td>35 &times; 45 mm</td><td data-i18n="about_std_eu_bg">Light Grey / White</td>
              <td data-i18n="about_std_eu_head">70% - 80% (32 - 36 mm)</td><td>300 DPI (413 &times; 531 px)</td>
            </tr>
            <tr>
              <td><strong data-i18n="about_std_stamp_name">📌 Stamp Size (BD Stamp)</strong></td>
              <td>20 &times; 25 mm</td><td data-i18n="about_std_stamp_bg">White / Sky Blue</td>
              <td>60% - 70%</td><td>300 DPI (236 &times; 295 px)</td>
            </tr>
            <tr>
              <td><strong data-i18n="about_std_in_name">🇮🇳 India & Middle East Passport</strong></td>
              <td>35 &times; 35 mm / 35 &times; 45 mm</td><td data-i18n="about_std_in_bg">White / Off-White</td>
              <td>70% - 75%</td><td>300 DPI</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="about-meta-card">
      <h3 class="about-section-heading" data-i18n="about_meta_heading">🏢 Project & Architecture Information</h3>
      <div class="about-meta-grid">
        <div class="about-meta-item">
          <span class="meta-label" data-i18n="about_meta_initiative_label">Initiative & Team:</span>
          <span class="meta-value"><strong data-i18n="about_meta_initiative_val">Noksha Lab Architecture</strong></span>
        </div>
        <div class="about-meta-item">
          <span class="meta-label" data-i18n="about_meta_dev_label">Lead Developer:</span>
          <span class="meta-value"><strong data-i18n="about_meta_dev_val">Mizanur Rahman</strong></span>
        </div>
        <div class="about-meta-item">
          <span class="meta-label" data-i18n="about_meta_release_label">Version:</span>
          <span class="meta-value" data-i18n="about_meta_release_val">Version 2.5 (October 2026 Edition)</span>
        </div>
        <div class="about-meta-item">
          <span class="meta-label" data-i18n="about_meta_license_label">License:</span>
          <span class="meta-value" data-i18n="about_meta_license_val">100% Free — Open for Personal, Public, and Commercial Studio Use</span>
        </div>
      </div>
    </div>
  `;
}
