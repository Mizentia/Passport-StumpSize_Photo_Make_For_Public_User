import { appState } from '../core/state.js';
import { t } from '../config/i18n.js';
import { toastService } from './toast-service.js';
import { loadStoredSettings, saveSettingsToStorage } from './settings/settings-storage.js';
import { setupShortcutsRebinding } from './settings/settings-shortcuts-ui.js';
import { populateSettingsForm, readSettingsFormData } from './settings/settings-form-ui.js';
import { refreshAllTooltips } from './tooltip-manager.js';
import { renderCustomPapersInSettings, renderCustomPaperOptionsInSelect } from './custom-paper-manager.js';
import { photoPresetStore } from '../core/photo-preset-store.js';
import { setupSettingsTabsAndActions } from './settings/settings-tab-switcher.js';
import { setupSettingsPaperForm } from './settings/settings-paper-form.js';

export { loadStoredSettings, saveSettingsToStorage };

export function setupSettingsModal(onSettingChange, tabManager) {
  const container = document.getElementById('settingsTab') || document.getElementById('settingsModal');
  const shortcutsMgr = setupShortcutsRebinding(appState.get('shortcuts') || {});
  setupSettingsTabsAndActions(container, shortcutsMgr, onSettingChange);
  const paperForm = setupSettingsPaperForm(onSettingChange);

  const refreshSettingsPageData = () => {
    populateSettingsForm();
    shortcutsMgr.setShortcuts(appState.get('shortcuts') || {});
    paperForm.updatePaperLabels();
    renderCustomPapersInSettings(onSettingChange);
    paperForm.updatePaperConversionPreview();
  };

  const handleSave = () => {
    try {
      const formData = readSettingsFormData();
      const currentShortcuts = shortcutsMgr ? shortcutsMgr.getCurrentShortcuts() : (appState.get('shortcuts') || {});
      appState.update({ ...formData, shortcuts: currentShortcuts });
      saveSettingsToStorage();
      refreshAllTooltips();
      if (onSettingChange) onSettingChange();
      toastService.show(t('msg_settings_saved') || 'Studio settings saved! 💾', 'success');
    } catch (err) {
      toastService.show('Failed to save: ' + (err.message || err), 'error');
    }
  };

  document.getElementById('btnSaveSettings')?.addEventListener('click', handleSave);
  document.getElementById('btnSaveSettingsTop')?.addEventListener('click', handleSave);

  document.querySelectorAll('.btn-apply-bio-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.preset;
      const stored = photoPresetStore.getPreset(id);
      if (stored) {
        if (stored.dpi) appState.set('dpi', stored.dpi, false);
        appState.set('customSize', { widthMm: stored.widthMm, heightMm: stored.heightMm, exactPixels: stored.exactPixels ? { ...stored.exactPixels } : null, unit: stored.unit || 'mm' }, false);
        photoPresetStore.recordUsage(id);
      }
      appState.set('selectedPreset', id, true);
      if (onSettingChange) onSettingChange();
      toastService.show(`${t('bio_btn_apply')}: ${t(`preset_${id}`) || id}`, 'success');
      if (tabManager) {
        tabManager.switchTab(appState.get('originalImage') ? 'editor' : 'upload');
      }
    });
  });

  window.addEventListener('app:tabchange', (e) => {
    if (e.detail?.tabId === 'settings') {
      refreshSettingsPageData();
    }
  });

  appState.on('lang', () => {
    paperForm.updatePaperLabels();
    paperForm.updatePaperConversionPreview();
  });

  renderCustomPaperOptionsInSelect();
  loadStoredSettings();
  refreshSettingsPageData();
}
