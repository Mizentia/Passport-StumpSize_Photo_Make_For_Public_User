export const DEFAULT_DB_LOGO = 'https://res.cloudinary.com/ayewcaxj/image/upload/v1790432997/ChatGPT_Image_Sep_26_2026_08_27_13_PM_ufluye.png';

export function getHeaderNavHtml() {
  const customLogo = typeof localStorage !== 'undefined' ? (localStorage.getItem('public_project_logo') || localStorage.getItem('studio_project_logo') || localStorage.getItem('studio_custom_logo')) : null;
  const activeLogo = customLogo || DEFAULT_DB_LOGO;
  const logoHtml = `<img src="${activeLogo}" alt="Logo" class="brand-logo-img" onerror="this.onerror=null;this.src='${DEFAULT_DB_LOGO}'" />`;

  return `
    <header class="navbar">
      <div class="brand">
        <div class="brand-logo" id="headerBrandLogo">${logoHtml}</div>
        <div class="brand-text">
          <h1 data-i18n="app_title">Passport Photo Maker</h1>
          <p data-i18n="app_subtitle">Free High-Resolution & Custom Size Photo Maker</p>
        </div>
      </div>
      <nav class="stepper-nav">
        <button class="step-btn active" data-tab="upload" data-i18n="tab_upload" data-i18n-title="tooltip_tab_upload" data-shortcut-key="tabUpload">1. Upload Photo</button>
        <button class="step-btn" data-tab="editor" disabled data-i18n="tab_editor" data-i18n-title="tooltip_tab_editor" data-shortcut-key="tabEditor">2. Studio Editor</button>
        <button class="step-btn" data-tab="sheet" disabled data-i18n="tab_sheet" data-i18n-title="tooltip_tab_sheet" data-shortcut-key="tabSheet">3. Print Sheet</button>
      </nav>
      <div class="header-actions">
        <div class="header-install-wrap">
          <button class="btn-install-app" id="btnInstallApp" style="display: none;" title="Install App" data-i18n-title="btn_install_app">
            <span class="install-icon">📲</span>
            <span class="install-text" id="installBtnText" data-i18n="btn_install_app">Install App</span>
          </button>
        </div>
        <div class="header-actions-group">
          <button class="nav-page-btn btn-history-nav" id="btnNavHistory" data-tab="history" title="History Archive" data-i18n-title="tooltip_nav_history" data-shortcut-key="tabHistory"><span class="btn-icon">📜</span><span class="btn-label" data-i18n="nav_history">History</span></button>
          <button class="nav-page-btn btn-about-nav" id="btnOpenAbout" data-tab="about" title="About Project" data-i18n-title="tooltip_nav_about"><span class="btn-icon">ℹ️</span><span class="btn-label" data-i18n="nav_about">About</span></button>
          <button class="nav-page-btn btn-settings" id="btnOpenSettings" data-tab="settings" title="Settings" data-i18n-title="title_settings" data-shortcut-key="openSettings"><span class="btn-icon settings-icon">⚙️</span><span class="btn-label settings-label" data-i18n="settings_title">Settings</span></button>
          <button class="nav-action-btn btn-theme" id="btnToggleTheme" title="Switch Dark / Light Theme" data-i18n-title="theme_toggle_title" data-shortcut-key="toggleTheme"><span class="btn-icon theme-icon">☀️</span><span class="btn-label theme-label" data-i18n="mode_light">Light</span></button>
          <button class="nav-action-btn btn-lang" id="btnToggleLang" data-i18n-title="toggle_lang_title" data-shortcut-key="toggleLang"><span class="btn-icon lang-flag">🇧🇩</span><span class="btn-label lang-label">বাংলা</span></button>
        </div>
      </div>
      <button class="nav-drawer-toggle-btn" id="btnOpenNavDrawer" title="Menu" aria-label="Open Menu">
        <span class="drawer-hamburger-icon">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>
    </header>
  `;
}
