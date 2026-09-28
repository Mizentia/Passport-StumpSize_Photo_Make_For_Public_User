import { setupThemeManager } from './ui/theme-manager.js';
import { setupLanguageSwitcher } from './ui/lang-switcher.js';
import { refreshAllTooltips } from './ui/tooltip-manager.js';
import { checkPortalStatus } from './ui/portal-status.js';
import { appState } from './core/state.js';
import { autoSaveSession } from './core/storage-manager.js';
import { historyManager } from './core/history-manager.js';

export function setupAppCoreListeners() {
  setupThemeManager();
  setupLanguageSwitcher();
  refreshAllTooltips();
  checkPortalStatus();
  appState.on('shortcuts', refreshAllTooltips);

  appState.on('change', () => {
    if (appState.get('autoSaveEnabled') !== false) {
      autoSaveSession(appState);
      historyManager.scheduleAutoDraft(2500);
    }
  });
}
