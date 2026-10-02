import { appState } from '../core/state.js';
import { t } from '../config/i18n.js';
import { refreshAllTooltips } from './tooltip-manager.js';

export function setupThemeManager() {
  const themeToggleBtn = document.getElementById('btnToggleTheme');

  function updateThemeButton(theme) {
    if (!themeToggleBtn) return;
    const isDark = theme === 'dark';
    const icon = isDark ? '☀️' : '🌙';
    const labelKey = isDark ? 'mode_light' : 'mode_dark';
    const labelText = t(labelKey);

    themeToggleBtn.innerHTML = `
      <span class="btn-icon theme-icon">${icon}</span>
      <span class="btn-label theme-label" data-i18n="${labelKey}">${labelText}</span>
    `;
    refreshAllTooltips();
  }

  function applyTheme(theme) {
    appState.set('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('passport_app_theme', theme);
    } catch (e) {}
    updateThemeButton(theme);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = appState.get('theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }

  // Reactive updates on language and theme state changes
  appState.on('lang', () => {
    updateThemeButton(appState.get('theme') || 'dark');
  });

  appState.on('theme', (theme) => {
    updateThemeButton(theme);
  });

  // Initial theme check
  let initialTheme = 'dark';
  try {
    const saved = localStorage.getItem('passport_app_theme');
    if (saved && (saved === 'dark' || saved === 'light')) {
      initialTheme = saved;
    }
  } catch (e) {}

  applyTheme(initialTheme);

  return { applyTheme };
}
