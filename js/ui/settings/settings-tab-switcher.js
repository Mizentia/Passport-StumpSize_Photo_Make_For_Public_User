import { t } from '../../config/i18n.js';
import { toastService } from '../toast-service.js';
import { appState } from '../../core/state.js';
import { exportSettingsJson, clearAllSessionCache, SETTINGS_STORAGE_KEY, loadStoredSettings } from './settings-storage.js';
import { populateSettingsForm } from './settings-form-ui.js';
import { refreshAllTooltips } from '../tooltip-manager.js';
import { renderCustomPapersInSettings, renderCustomPaperOptionsInSelect } from '../custom-paper-manager.js';

export function setupSettingsTabsAndActions(modal, shortcutsMgr, onSettingChange) {
  document.querySelectorAll('.settings-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.settings-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.settings-tab-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.target)?.classList.add('active');
    });
  });

  document.getElementById('btnExportSettingsJson')?.addEventListener('click', () => {
    exportSettingsJson();
    toastService.show(t('msg_settings_exported'), 'success');
  });

  const fileImport = document.getElementById('importSettingsFileInput');
  document.getElementById('btnImportSettingsJson')?.addEventListener('click', () => fileImport?.click());
  fileImport?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(JSON.parse(ev.target.result)));
        loadStoredSettings(); populateSettingsForm();
        shortcutsMgr.setShortcuts(appState.get('shortcuts') || {});
        renderCustomPapersInSettings(onSettingChange);
        renderCustomPaperOptionsInSelect();
        refreshAllTooltips();
        if (onSettingChange) onSettingChange();
        toastService.show(t('msg_settings_imported'), 'success');
      } catch (_) { toastService.show(t('msg_invalid_settings_file'), 'error'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  });

  document.getElementById('btnClearSessionStorage')?.addEventListener('click', async () => {
    if (confirm(t('confirm_clear_session'))) {
      await clearAllSessionCache();
      toastService.show(t('msg_session_cleared'), 'info');
      setTimeout(() => window.location.reload(), 600);
    }
  });
}
