import { TRANSLATIONS } from '../config/i18n.js';
import { appState } from '../core/state.js';
import { updateDimensionDisplay } from './editor-dimension-ui.js';
import { refreshAllTooltips } from './tooltip-manager.js';

export function setupLanguageSwitcher() {
  const langToggleBtn = document.getElementById('btnToggleLang');

  function applyLanguage(lang) {
    appState.set('lang', lang);
    try {
      localStorage.setItem('passport_app_lang', lang);
    } catch (e) {}

    document.documentElement.lang = lang;
    if (document.body) {
      document.body.classList.toggle('lang-bn', lang === 'bn');
    }

    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;

    // Translate all standard text elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) {
        el.setAttribute('placeholder', dict[key]);
      }
    });

    // Translate title tooltips
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (dict[key]) {
        el.setAttribute('title', dict[key]);
      }
    });

    // Update language toggle button label with distinct national flag icons
    if (langToggleBtn) {
      if (lang === 'bn') {
        langToggleBtn.innerHTML = '<span class="lang-flag">🇬🇧</span> <span class="lang-label">English</span>';
      } else {
        langToggleBtn.innerHTML = '<span class="lang-flag">🇧🇩</span> <span class="lang-label">বাংলা</span>';
      }
    }

    // Refresh all tooltips & shortcut badges
    refreshAllTooltips();

    // Update live dimension header and ruler text in Bengali / English
    updateDimensionDisplay();
  }

  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      const current = appState.get('lang') || 'en';
      const next = current === 'en' ? 'bn' : 'en';
      applyLanguage(next);
    });
  }

  // Initial language check from localStorage
  let initialLang = 'en';
  try {
    const saved = localStorage.getItem('passport_app_lang');
    if (saved && (saved === 'en' || saved === 'bn')) {
      initialLang = saved;
    }
  } catch (e) {}

  applyLanguage(initialLang);

  return { applyLanguage };
}
