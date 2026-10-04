import { DEFAULT_DB_LOGO } from './header-nav-view.js';

export function getNavDrawerHtml() {
  const customLogo = typeof localStorage !== 'undefined' ? (localStorage.getItem('public_project_logo') || localStorage.getItem('studio_project_logo') || localStorage.getItem('studio_custom_logo')) : null;
  const activeLogo = customLogo || DEFAULT_DB_LOGO;
  const logoHtml = `<img src="${activeLogo}" alt="Logo" class="drawer-logo-img" onerror="this.onerror=null;this.src='${DEFAULT_DB_LOGO}'" />`;

  return `
    <div class="nav-drawer-backdrop" id="navDrawerBackdrop" aria-hidden="true"></div>
    <aside class="nav-drawer" id="navDrawer" role="dialog" aria-modal="true" aria-label="Navigation Menu">
      <div class="nav-drawer-header">
        <div class="drawer-brand">
          <div class="drawer-logo" id="drawerBrandLogo">${logoHtml}</div>
          <div class="drawer-brand-text">
            <span class="drawer-title" data-i18n="app_title">Passport Photo Maker</span>
            <span class="drawer-badge">Pro Studio</span>
          </div>
        </div>
        <button class="btn-close-drawer" id="btnCloseNavDrawer" aria-label="Close Menu" title="Close Menu">✕</button>
      </div>
      <div class="nav-drawer-body">
        <div class="drawer-install-card" id="drawerInstallCard">
          <div class="drawer-card-icon">📲</div>
          <div class="drawer-card-info">
            <span class="drawer-card-title" id="drawerInstallTitle" data-i18n="btn_install_app">Install App</span>
            <span class="drawer-card-sub" id="drawerInstallSub">Offline & Fast Mobile App</span>
          </div>
          <button class="drawer-action-pill" id="btnDrawerInstall">Install</button>
        </div>
        <div class="drawer-section">
          <div class="drawer-section-title" id="drawerNavSectionTitle">Pages & Tools</div>
          <div class="drawer-nav-list">
            <button class="drawer-nav-item" data-drawer-tab="history">
              <span class="drawer-nav-icon">📜</span>
              <div class="drawer-nav-text">
                <span class="drawer-nav-label" data-i18n="nav_history">History</span>
                <span class="drawer-nav-hint" id="drawerHintHistory">Saved photos & drafts</span>
              </div>
              <span class="drawer-nav-arrow">›</span>
            </button>
            <button class="drawer-nav-item" data-drawer-tab="about">
              <span class="drawer-nav-icon">ℹ️</span>
              <div class="drawer-nav-text">
                <span class="drawer-nav-label" data-i18n="nav_about">About</span>
                <span class="drawer-nav-hint" id="drawerHintAbout">Project info & privacy</span>
              </div>
              <span class="drawer-nav-arrow">›</span>
            </button>
            <button class="drawer-nav-item" data-drawer-tab="settings">
              <span class="drawer-nav-icon">⚙️</span>
              <div class="drawer-nav-text">
                <span class="drawer-nav-label" data-i18n="settings_title">Settings</span>
                <span class="drawer-nav-hint" id="drawerHintSettings">Preferences, DPI & API</span>
              </div>
              <span class="drawer-nav-arrow">›</span>
            </button>
          </div>
        </div>
        <div class="drawer-section">
          <div class="drawer-section-title" id="drawerPrefSectionTitle">Preferences</div>
          <div class="drawer-toggles-grid">
            <button class="drawer-toggle-box" id="btnDrawerThemeToggle" type="button">
              <div class="drawer-toggle-left">
                <span class="drawer-toggle-icon" id="drawerThemeIcon">☀️</span>
                <div class="drawer-toggle-text">
                  <span class="drawer-toggle-label" id="drawerThemeLabel">Theme</span>
                  <span class="drawer-toggle-status" id="drawerThemeStatus">Light</span>
                </div>
              </div>
              <span class="drawer-toggle-action" id="drawerThemeAction">Switch</span>
            </button>
            <button class="drawer-toggle-box" id="btnDrawerLangToggle" type="button">
              <div class="drawer-toggle-left">
                <span class="drawer-toggle-icon" id="drawerLangFlag">🇧🇩</span>
                <div class="drawer-toggle-text">
                  <span class="drawer-toggle-label" id="drawerLangLabel">Language</span>
                  <span class="drawer-toggle-status" id="drawerLangStatus">বাংলা</span>
                </div>
              </div>
              <span class="drawer-toggle-action" id="drawerLangAction">Toggle</span>
            </button>
          </div>
        </div>
      </div>
      <div class="nav-drawer-footer">
        <p class="drawer-copyright">Noksha Lab • Public Studio Edition</p>
      </div>
    </aside>
  `;
}
