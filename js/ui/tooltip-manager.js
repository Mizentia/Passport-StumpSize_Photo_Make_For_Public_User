import { appState } from '../core/state.js';
import { TRANSLATIONS } from '../config/i18n.js';

export function refreshAllTooltips() {
  const lang = appState.get('lang') || 'en';
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const shortcuts = appState.get('shortcuts') || {};

  // 1. All elements with data-i18n-title
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const titleKey = el.getAttribute('data-i18n-title');
    let titleText = dict[titleKey] || TRANSLATIONS.en[titleKey] || el.getAttribute('title') || '';
    
    const shortcutKey = el.getAttribute('data-shortcut-key');
    if (shortcutKey && shortcuts[shortcutKey]) {
      const sc = shortcuts[shortcutKey];
      titleText = `${titleText} [${sc}]`;
    }
    el.setAttribute('title', titleText);
    el.setAttribute('aria-label', titleText);
  });

  // 2. Stepper navigation tabs
  const tabUpload = document.querySelector('.step-btn[data-tab="upload"]');
  if (tabUpload) {
    const base = dict.tab_upload || '1. Upload Photo';
    const sc = shortcuts.tabUpload ? ` [${shortcuts.tabUpload}]` : '';
    tabUpload.setAttribute('title', `${base}${sc}`);
    tabUpload.setAttribute('aria-label', `${base}${sc}`);
  }

  const tabEditor = document.querySelector('.step-btn[data-tab="editor"]');
  if (tabEditor) {
    const base = dict.tab_editor || '2. Studio Editor';
    const sc = shortcuts.tabEditor ? ` [${shortcuts.tabEditor}]` : '';
    tabEditor.setAttribute('title', `${base}${sc}`);
    tabEditor.setAttribute('aria-label', `${base}${sc}`);
  }

  const tabSheet = document.querySelector('.step-btn[data-tab="sheet"]');
  if (tabSheet) {
    const base = dict.tab_sheet || '3. Print Sheet';
    const sc = shortcuts.tabSheet ? ` [${shortcuts.tabSheet}]` : '';
    tabSheet.setAttribute('title', `${base}${sc}`);
    tabSheet.setAttribute('aria-label', `${base}${sc}`);
  }

  const btnNavHistory = document.getElementById('btnNavHistory');
  if (btnNavHistory) {
    const base = dict.tooltip_tab_history || dict.tab_history || 'History Archive';
    const sc = shortcuts.tabHistory ? ` [${shortcuts.tabHistory}]` : '';
    btnNavHistory.setAttribute('title', `${base}${sc}`);
    btnNavHistory.setAttribute('aria-label', `${base}${sc}`);
  }

  // 3. Settings button
  const settingsBtn = document.getElementById('btnOpenSettings');
  if (settingsBtn) {
    const base = dict.title_settings || 'Studio Pro Settings';
    const sc = shortcuts.openSettings ? ` [${shortcuts.openSettings}]` : '';
    settingsBtn.setAttribute('title', `${base}${sc}`);
    settingsBtn.setAttribute('aria-label', `${base}${sc}`);
  }

  // 4. Theme button
  const themeBtn = document.getElementById('btnToggleTheme');
  if (themeBtn) {
    const isDark = (appState.get('theme') || 'dark') === 'dark';
    const base = isDark 
      ? (dict.mode_switch_light || 'Switch to Light Theme')
      : (dict.mode_switch_dark || 'Switch to Dark Theme');
    const sc = shortcuts.toggleTheme ? ` [${shortcuts.toggleTheme}]` : '';
    themeBtn.setAttribute('title', `${base}${sc}`);
    themeBtn.setAttribute('aria-label', `${base}${sc}`);
  }

  // 5. Lang button
  const langBtn = document.getElementById('btnToggleLang');
  if (langBtn) {
    const base = lang === 'bn' ? 'Switch to English' : 'বাংলা ভাষায় পরিবর্তন করুন';
    const sc = shortcuts.toggleLang ? ` [${shortcuts.toggleLang}]` : '';
    langBtn.setAttribute('title', `${base}${sc}`);
    langBtn.setAttribute('aria-label', `${base}${sc}`);
  }
}
