export function getAboutModalHtml() {
  return `
    <div class="modal-overlay" id="aboutModal" style="display: none;">
      <div class="modal-card about-modal-card">
        <div class="modal-header about-modal-header">
          <div class="about-brand-badge">
            <div class="about-logo-icon">📸</div>
            <div class="about-title-wrap">
              <h3 class="about-app-name" data-i18n="app_title">Passport Photo Maker</h3>
              <span class="about-version-pill">v2.5 (2026 Edition) &bull; 100% Free Public Tool</span>
            </div>
          </div>
          <button class="modal-close-btn" id="btnCloseAboutModal" title="Close">✕</button>
        </div>
        <div class="modal-body about-modal-body">
          <div class="about-mission-box">
            <p class="about-mission-text">
              <strong>Passport Photo Maker</strong> হলো নকশা ল্যাবের সাধারণ পাবলিক ও শিক্ষার্থীদের জন্য উন্মুক্ত একটি সম্পূর্ণ ফ্রি ও আধুনিক ফটো টুল। যেকোনো কম্পিউটার বা মোবাইল থেকে কোনো রকম ফি বা ওয়াটারমার্ক ছাড়া অতি সহজে আন্তর্জাতিক মানের পাসপোর্ট, ভিসা, স্ট্যাম্প ও কাস্টম সাইজের ছবি তৈরি ও শিট প্রিন্ট করার সুবিধার্থে এটি তৈরি করা হয়েছে।
            </p>
          </div>

          <div class="about-meta-grid">
            <div class="about-meta-item">
              <span class="meta-label">🏢 উদ্দ্যোগ ও কারিগরি দল:</span>
              <span class="meta-value">নকশা ল্যাব (Noksha Lab Core Architecture)</span>
            </div>
            <div class="about-meta-item">
              <span class="meta-label">👨‍💻 লিড ডেভেলপার ও নির্মাতা:</span>
              <span class="meta-value">Mizanur Rahman (মিজানুর রহমান)</span>
            </div>
            <div class="about-meta-item">
              <span class="meta-label">📅 প্রকাশ ও সংস্করণ:</span>
              <span class="meta-value">অক্টোবর ২০২৬ &bull; Version 2.5 (Public Free Release)</span>
            </div>
            <div class="about-meta-item">
              <span class="meta-label">🔒 গোপনীয়তা ও নিরাপত্তা:</span>
              <span class="meta-value">১০০% লোকাল ক্লায়েন্ট প্রসেসিং (আপনার ছবি আপনার ডিভাইসেই সুরক্ষিত থাকে)</span>
            </div>
          </div>

          <div class="about-features-section">
            <h4 class="about-features-title">🌟 মূল সুবিধাসমূহ:</h4>
            <ul class="about-features-list">
              <li>✨ <strong>বায়োমেট্রিক অটো-ফিট:</strong> চোখের লেভেল ও ফেস এরিয়া নিখুঁতভাবে ফ্রেম করা।</li>
              <li>📐 <strong>কাস্টম সাইজ ও ডিপিআই:</strong> যেকোনো মিমি/ইঞ্চি/পিক্সেল সাইজ এবং নিজস্ব DPI নির্বাচন।</li>
              <li>🖨️ <strong>মাল্টি-ফটো শিট টাইলিং:</strong> 4R, 5R, A4 ও কাস্টম পেপারে এক বা একাধিক ছবির স্বয়ংক্রিয় শিট।</li>
              <li>🪄 <strong>ব্যাকগ্রাউন্ড ও কালার রিটাচ:</strong> একক ক্লিকে সাদা/নীল/পছন্দমতো ব্যাকড্রপ ও ফটো এনহ্যান্স।</li>
            </ul>
          </div>
        </div>
        <div class="modal-footer about-modal-footer">
          <span class="about-copyright">&copy; 2026 Noksha Lab. Free for Public & Commercial Use.</span>
          <button class="btn-primary" id="btnCloseAboutBtn">ঠিক আছে (Got It)</button>
        </div>
      </div>
    </div>
  `;
}
