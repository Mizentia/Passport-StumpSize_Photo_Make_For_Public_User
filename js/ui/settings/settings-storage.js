import { appState } from '../../core/state.js';
import { getDefaultShortcuts } from '../../core/state-defaults.js';
import { clearSavedSession } from '../../core/storage-manager.js';

export const SETTINGS_STORAGE_KEY = 'passport_studio_settings';

export function loadStoredSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    appState.update({
      dpi: Number(saved.dpi) || 300, customDpi: Number(saved.customDpi) || 300,
      exportFormat: saved.exportFormat || 'image/jpeg',
      jpegQuality: saved.jpegQuality !== undefined ? Number(saved.jpegQuality) : 0.98,
      webpQuality: saved.webpQuality !== undefined ? Number(saved.webpQuality) : 0.95,
      borderColor: saved.borderColor || '#cbd5e1', borderWidth: Number(saved.borderWidth) || 1,
      cutMarksStyle: saved.cutMarksStyle || 'corner_cross',
      autoSaveEnabled: saved.autoSaveEnabled !== undefined ? saved.autoSaveEnabled : true,
      defaultPaperPreset: saved.defaultPaperPreset || 'photo_4r',
      studioName: saved.studioName || 'Passport & Stamp Studio Pro', studioPhone: saved.studioPhone || '',
      enableStudioTag: saved.enableStudioTag || false, enableWatermark: saved.enableWatermark || false,
      watermarkText: saved.watermarkText || 'SAMPLE PROOF', defaultBackdropColor: saved.defaultBackdropColor || '#ffffff',
      autoEnhanceOnUpload: saved.autoEnhanceOnUpload || false, headHeightRatio: Number(saved.headHeightRatio) || 0.75,
      namingTemplate: saved.namingTemplate || 'preset_dpi_date',
      namingTokensOrder: saved.namingTokensOrder || ['agency', 'preset', 'dimensions', 'dpi', 'date'],
      namingSeparator: saved.namingSeparator || '_', targetKbLimit: saved.targetKbLimit || null,
      shortcuts: { ...getDefaultShortcuts(), ...(saved.shortcuts || {}) },
      bgEnginesConfig: { nl_studio_ai: { enabled: true }, ...(saved.bgEnginesConfig || { local_ai: { enabled: true }, floodfill: { enabled: true } }) },
      selectedBgEngine: (saved.selectedBgEngine && saved.selectedBgEngine !== 'local_ai') ? saved.selectedBgEngine : 'nl_studio_ai',
      bgFeatherRadius: Number(saved.bgFeatherRadius) || 2,
      bgApiKey: saved.bgApiKey || '', bgCustomEndpoint: saved.bgCustomEndpoint || ''
    });
  } catch (e) { console.warn('Could not load settings', e); }
}

export function saveSettingsToStorage() {
  try {
    const keys = [
      'dpi', 'customDpi', 'exportFormat', 'jpegQuality', 'webpQuality', 'borderColor',
      'borderWidth', 'cutMarksStyle', 'autoSaveEnabled', 'defaultPaperPreset', 'studioName',
      'studioPhone', 'enableStudioTag', 'enableWatermark', 'watermarkText', 'defaultBackdropColor',
      'autoEnhanceOnUpload', 'headHeightRatio', 'namingTemplate', 'namingTokensOrder',
      'namingSeparator', 'targetKbLimit', 'shortcuts', 'bgEnginesConfig', 'selectedBgEngine',
      'bgFeatherRadius', 'bgApiKey', 'bgCustomEndpoint'
    ];
    const data = {};
    keys.forEach(k => { data[k] = appState.get(k); });
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(data));
  } catch (e) { console.warn('Could not save settings', e); }
}

export function exportSettingsJson() {
  const raw = localStorage.getItem(SETTINGS_STORAGE_KEY) || '{}';
  const blob = new Blob([raw], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `passport_studio_config_${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

export async function clearAllSessionCache() {
  clearSavedSession();
  try { sessionStorage.clear(); } catch (_) {}
}
