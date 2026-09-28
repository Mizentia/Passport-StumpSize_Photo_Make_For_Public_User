export function getHeaderNavHtml() {
  const customLogo = typeof localStorage !== 'undefined' ? (localStorage.getItem('public_project_logo') || localStorage.getItem('studio_project_logo') || localStorage.getItem('studio_custom_logo')) : null;
  const logoHtml = customLogo ? `<img src="${customLogo}" alt="Logo" style="width:100%;height:100%;object-fit:contain;border-radius:var(--radius-md);" />` : 'P';

  return `
    <header class="navbar">
      <div class="brand"><div class="brand-logo" style="overflow:hidden;padding:${customLogo ? '3px' : '0'};">${logoHtml}</div><div class="brand-text"><h1 data-i18n="app_title">Passport & Stamp Studio Pro</h1><p data-i18n="app_subtitle">300 DPI High-Resolution Professional Photo Maker</p></div></div>
      <nav class="stepper-nav">
        <button class="step-btn active" data-tab="upload" data-i18n="tab_upload" data-i18n-title="tooltip_tab_upload" data-shortcut-key="tabUpload">1. Upload Photo</button>
        <button class="step-btn" data-tab="editor" disabled data-i18n="tab_editor" data-i18n-title="tooltip_tab_editor" data-shortcut-key="tabEditor">2. Studio Editor</button>
        <button class="step-btn" data-tab="sheet" disabled data-i18n="tab_sheet" data-i18n-title="tooltip_tab_sheet" data-shortcut-key="tabSheet">3. Print Sheet</button>
      </nav>
      <div class="header-actions">
        <button class="btn-install-app" id="btnInstallApp" style="display: none;" title="Install Studio App on Desktop" data-i18n="btn_install_app">📲 Install App</button>
        <button class="btn-settings" id="btnOpenSettings" title="Studio Settings" data-i18n-title="title_settings" data-shortcut-key="openSettings"><span class="settings-icon">⚙️</span> <span class="settings-label" data-i18n="settings_title">Settings</span></button>
        <button class="btn-theme" id="btnToggleTheme" title="Switch Dark / Light Theme" data-i18n-title="theme_toggle_title" data-shortcut-key="toggleTheme"><span class="theme-icon">☀️</span><span class="theme-label" data-i18n="mode_light">Light</span></button>
        <button class="btn-lang" id="btnToggleLang" data-i18n-title="toggle_lang_title" data-shortcut-key="toggleLang"><span class="lang-flag">🇧🇩</span> <span class="lang-label">বাংলা</span></button>
      </div>
    </header>
  `;
}
