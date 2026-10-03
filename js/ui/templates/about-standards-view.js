export function getAboutStandardsTableHtml() {
  return `
    <div class="about-standards-container">
      <h3 class="about-section-heading">🌐 আন্তর্জাতিক বায়োমেট্রিক ফটো সাইজ নির্দেশিকা</h3>
      <div class="about-table-wrap">
        <table class="about-table">
          <thead>
            <tr>
              <th>দেশ / ক্যাটাগরি</th><th>সাইজ (মিমি / ইঞ্চি)</th><th>প্রস্তাবিত ব্যাকগ্রাউন্ড</th>
              <th>মাথা / ফেস কভারেজ</th><th>রেজোলিউশন</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>🇧🇩 বাংলাদেশ ই-পাসপোর্ট / MRP</strong></td>
              <td>৪০ &times; ৫০ মিমি</td><td>সাদা (White)</td>
              <td>৭০% - ৮০% (৩৫ মিমি)</td><td>৩০০ DPI (472 &times; 591 px)</td>
            </tr>
            <tr>
              <td><strong>🇺🇸 মার্কিন যুক্তরাষ্ট্র (US Visa / Passport)</strong></td>
              <td>৫১ &times; ৫১ মিমি (২ &times; ২ ইঞ্চি)</td><td>সাদা (Pure White)</td>
              <td>৫০% - ৬৯% (১ - ১.৩৮ ইঞ্চি)</td><td>৩০০ DPI (600 &times; 600 px)</td>
            </tr>
            <tr>
              <td><strong>🇪🇺 শেনজেন ভিসা / ইউরোপ (Schengen)</strong></td>
              <td>৩৫ &times; ৪৫ মিমি</td><td>হালকা ধূসর / সাদা</td>
              <td>৭০% - ৮০% (৩২ - ৩৬ মিমি)</td><td>৩০০ DPI (413 &times; 531 px)</td>
            </tr>
            <tr>
              <td><strong>📌 স্ট্যাম্প সাইজ (Stamp Size BD)</strong></td>
              <td>২০ &times; ২৫ মিমি</td><td>সাদা / হালকা নীল</td>
              <td>৬০% - ৭০%</td><td>৩০০ DPI (236 &times; 295 px)</td>
            </tr>
            <tr>
              <td><strong>🇮🇳 ভারত ও মধ্যপ্রাচ্য পাসপোর্ট</strong></td>
              <td>৩৫ &times; ৩৫ মিমি / ৩৫ &times; ৪৫ মিমি</td><td>সাদা / অফ-হোয়াইট</td>
              <td>৭০% - ৭৫%</td><td>৩০০ DPI</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="about-meta-card">
      <h3 class="about-section-heading">🏢 প্রজেক্ট ও ডেভেলপমেন্ট তথ্য</h3>
      <div class="about-meta-grid">
        <div class="about-meta-item">
          <span class="meta-label">উদ্যোগ ও টিম:</span>
          <span class="meta-value"><strong>নকশা ল্যাব (Noksha Lab Architecture)</strong></span>
        </div>
        <div class="about-meta-item">
          <span class="meta-label">প্রধান ডেভেলপার ও নির্মাতা:</span>
          <span class="meta-value"><strong>Mizanur Rahman (মিজানুর রহমান)</strong></span>
        </div>
        <div class="about-meta-item">
          <span class="meta-label">সংস্করণ ও রিলিজ:</span>
          <span class="meta-value">Version 2.5 (October 2026 Edition)</span>
        </div>
        <div class="about-meta-item">
          <span class="meta-label">লাইসেন্স ও ব্যবহারের অধিকার:</span>
          <span class="meta-value">সম্পূর্ণ ফ্রি — ব্যক্তিগত, পাবলিক ও বাণিজ্যিক স্টুডিওর জন্য উন্মুক্ত</span>
        </div>
      </div>
    </div>
  `;
}
