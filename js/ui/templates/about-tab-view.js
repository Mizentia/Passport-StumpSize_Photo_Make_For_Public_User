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
              <span class="about-version-tag">Version 2.5 (2026 Edition) &bull; 100% Free Public Tool</span>
            </div>
            <h2 class="about-hero-title" data-i18n="app_title">Passport Photo Maker</h2>
            <p class="about-hero-subtitle">
              নকশা ল্যাবের সাধারণ পাবলিক, শিক্ষার্থী ও প্রফেশনালদের জন্য উন্মুক্ত একটি সম্পূর্ণ ফ্রি, নিরাপদ ও আন্তর্জাতিক মানের ফটো ক্রপ ও প্রিন্ট স্টুডিও।
            </p>
            <div class="about-hero-actions">
              <button class="btn-primary" id="btnAboutStartPhoto">
                <span>📸</span><span data-i18n="tab_upload">১. ছবি তৈরি শুরু করুন</span>
              </button>
              <button class="btn-secondary" id="btnAboutGoSettings">
                <span>⚙️</span><span data-i18n="settings_title">স্টুডিও সেটিংস কনফিগার করুন</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Privacy & Security Guarantee Banner -->
        <div class="about-privacy-banner">
          <div class="privacy-icon">🔒</div>
          <div class="privacy-text">
            <h4 class="privacy-heading">১০০% সম্পূর্ণ অফলাইন ও লোকাল ক্লায়েন্ট প্রাইভেসি গ্যারান্টি</h4>
            <p class="privacy-desc">
              আপনার আপলোড করা কোনো ছবি কখনোই আমাদের বা তৃতীয় পক্ষের কোনো দূরবর্তী সার্ভারে আপলোড হয় না। প্রতিটি ছবির ফেস ডিটেকশন, ক্রপ, ব্যাকগ্রাউন্ড ও প্রিন্ট শিট তৈরি আপনার কম্পিউটারের ব্রাউজারের মেমরিতে সম্পূর্ণ গোপনে সম্পন্ন হয়।
            </p>
          </div>
        </div>

        <!-- Key Features Grid -->
        <div class="about-features-container">
          <h3 class="about-section-heading">🌟 প্রধান বৈশিষ্ঠ্য ও স্টুডিও সুবিধাসমূহ</h3>
          <div class="about-features-grid">
            <div class="about-feat-card">
              <div class="feat-icon-wrap">👁️</div>
              <h4 class="feat-title">বায়োমেট্রিক অটো-ফিট</h4>
              <p class="feat-desc">ICAO 9303 আন্তর্জাতিক স্ট্যান্ডার্ড অনুযায়ী স্বয়ংক্রিয়ভাবে চোখের অবস্থান ও ফেস হাইট (৭০-৮০%) শনাক্ত করে নিখুঁত পাসপোর্ট ফ্রেম প্রস্তুত করে।</p>
            </div>
            <div class="about-feat-card">
              <div class="feat-icon-wrap">📐</div>
              <h4 class="feat-title">কাস্টম সাইজ ও ৩০০/৬০০ DPI</h4>
              <p class="feat-desc">বাংলাদেশ পাসপোর্ট, ইউএস ভিসা, ইউরোপীয় শেনজেন, স্ট্যাম্প সাইজ বা যেকোনো কাস্টম মিলিমিটার/ইঞ্চি মাপ এবং আল্ট্রা-এইচডি DPI সাপোর্ট।</p>
            </div>
            <div class="about-feat-card">
              <div class="feat-icon-wrap">🖨️</div>
              <h4 class="feat-title">মাল্টি-ফটো প্রিন্ট শিট টাইলিং</h4>
              <p class="feat-desc">4R, 5R, A4 বা নিজস্ব কাস্টম পেপারে এক বা একাধিক বিভিন্ন ছবির নিখুঁত বর্ডার ও কাটিং গাইড লাইন সহ এক ক্লিকে প্রিন্ট শিট তৈরি।</p>
            </div>
            <div class="about-feat-card">
              <div class="feat-icon-wrap">🎨</div>
              <h4 class="feat-title">স্মার্ট ব্যাকগ্রাউন্ড রিপ্লেসমেন্ট</h4>
              <p class="feat-desc">অটোমেটিক ব্যাকড্রপ রিমুভাল, সাদা, অফিশিয়াল ব্লু, অফ-হোয়াইট ব্যাকগ্রাউন্ড প্রতিস্থাপন এবং লাইটিং-কনট্রাস্ট অ্যাডজাস্টমেন্ট।</p>
            </div>
            <div class="about-feat-card">
              <div class="feat-icon-wrap">🩹</div>
              <h4 class="feat-title">ফেস রিটাচ ও দাগ মোছার টুল</h4>
              <p class="feat-desc">মুখের অপ্রয়োজনীয় দাগ মোছার স্পট হিলিং ব্রাশ, ফ্ল্যাশ জনিত লাল চোখ দূর করার রেড-আই কারেকশন, রোটেট ও প্রিসিশন অ্যাঙ্গেল অ্যাডজাস্ট।</p>
            </div>
            <div class="about-feat-card">
              <div class="feat-icon-wrap">📜</div>
              <h4 class="feat-title">প্রজেক্ট আর্কাইভ ও ড্রাফট হিস্ট্রি</h4>
              <p class="feat-desc">কাজের প্রতিটি ধাপের অটো-সেভ ড্রাফট ও হিস্ট্রি ব্যাকআপ। এক ক্লিকে যেকোনো সময় আগের কাজ রিস্টোর, এডিট বা এক্সপোর্ট করার সুবিধা।</p>
            </div>
          </div>
        </div>

        ${getAboutStandardsTableHtml()}
      </div>
    </section>
  `;
}
