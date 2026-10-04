import { appState } from '../core/state.js';

export function setupNavDrawer(tabManager) {
  const drawer = document.getElementById('navDrawer');
  const backdrop = document.getElementById('navDrawerBackdrop');
  const btnOpen = document.getElementById('btnOpenNavDrawer');
  const btnClose = document.getElementById('btnCloseNavDrawer');

  const openDrawer = () => {
    drawer?.classList.add('active'); backdrop?.classList.add('active');
    document.body.classList.add('nav-drawer-open'); updateDrawerStates();
  };
  const closeDrawer = () => {
    drawer?.classList.remove('active'); backdrop?.classList.remove('active');
    document.body.classList.remove('nav-drawer-open');
  };

  btnOpen?.addEventListener('click', openDrawer);
  btnClose?.addEventListener('click', closeDrawer);
  backdrop?.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer?.classList.contains('active')) closeDrawer();
  });

  drawer?.querySelectorAll('[data-drawer-tab]').forEach((item) => {
    item.addEventListener('click', () => {
      const tab = item.getAttribute('data-drawer-tab');
      if (tabManager && tab) tabManager.switchTab(tab);
      closeDrawer();
    });
  });

  const handleInstall = () => { document.getElementById('btnInstallApp')?.click(); closeDrawer(); };
  document.getElementById('btnDrawerInstall')?.addEventListener('click', handleInstall);
  document.getElementById('drawerInstallCard')?.addEventListener('click', (e) => {
    if (e.target !== document.getElementById('btnDrawerInstall')) handleInstall();
  });

  document.getElementById('btnDrawerThemeToggle')?.addEventListener('click', () => {
    document.getElementById('btnToggleTheme')?.click(); updateDrawerStates();
  });
  document.getElementById('btnDrawerLangToggle')?.addEventListener('click', () => {
    document.getElementById('btnToggleLang')?.click(); updateDrawerStates();
  });

  function setText(id, text) { const el = document.getElementById(id); if (el) el.textContent = text; }

  function updateDrawerStates() {
    const isBn = appState.get('lang') === 'bn';
    const isDark = (appState.get('theme') || 'dark') === 'dark';

    setText('drawerThemeIcon', isDark ? '☀️' : '🌙');
    setText('drawerThemeStatus', isDark ? (isBn ? 'লাইট মোড' : 'Light Mode') : (isBn ? 'ডার্ক মোড' : 'Dark Mode'));
    setText('drawerThemeLabel', isBn ? 'থিম' : 'Theme');
    setText('drawerThemeAction', isBn ? 'সুইচ' : 'Switch');

    setText('drawerLangFlag', isBn ? '🇬🇧' : '🇧🇩');
    setText('drawerLangStatus', isBn ? 'English' : 'বাংলা');
    setText('drawerLangLabel', isBn ? 'ভাষা' : 'Language');
    setText('drawerLangAction', isBn ? 'বদলান' : 'Toggle');

    setText('drawerNavSectionTitle', isBn ? 'পেজ ও ফিচার' : 'Pages & Tools');
    setText('drawerPrefSectionTitle', isBn ? 'পছন্দসমূহ' : 'Preferences');
    setText('drawerHintHistory', isBn ? 'সংরক্ষিত ছবি ও ড্রাফট' : 'Saved photos & drafts');
    setText('drawerHintAbout', isBn ? 'প্রজেক্ট তথ্য ও পলিসি' : 'Project info & privacy');
    setText('drawerHintSettings', isBn ? 'পছন্দসমূহ, ডিপিআই ও কি' : 'Preferences, DPI & API');
    setText('drawerInstallSub', isBn ? 'সহজ ও দ্রুত মোবাইল ব্যবহার' : 'Offline & fast mobile access');
  }

  appState.on('theme', updateDrawerStates);
  appState.on('lang', updateDrawerStates);
  updateDrawerStates();

  return { openDrawer, closeDrawer };
}
