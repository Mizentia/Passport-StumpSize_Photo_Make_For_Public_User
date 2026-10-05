import { appState } from '../../../core/state.js';
import { activeTokensOrder } from './naming-tokens-ui.js';
import { readBgEngines } from './bg-engines-ui.js';

export function readSettingsFormData() {
  const g = (id) => document.getElementById(id);
  const selectDpi = g('settingDpiSelect');
  const inputCustomDpi = g('settingCustomDpiInput');
  const selectTargetKb = g('settingTargetKbSelect');

  const dpi = selectDpi?.value === 'custom' ? (Number(inputCustomDpi?.value) || 300) : (Number(selectDpi?.value) || 300);
  const targetKbVal = Number(selectTargetKb?.value) || null;
  const bgEnginesConfig = readBgEngines();

  if (!bgEnginesConfig.nl_studio_ai) bgEnginesConfig.nl_studio_ai = { enabled: true };
  let currentSelected = appState.get('selectedBgEngine') || 'nl_studio_ai';
  if (!bgEnginesConfig[currentSelected]?.enabled) {
    currentSelected = 'nl_studio_ai';
  }

  return {
    dpi, customDpi: Number(inputCustomDpi?.value) || dpi,
    exportFormat: g('settingFormatSelect')?.value || 'image/jpeg',
    jpegQuality: (Number(g('settingQualitySlider')?.value) || 98) / 100,
    webpQuality: (Number(g('settingWebpQualitySlider')?.value) || 95) / 100,
    namingTemplate: 'custom_builder',
    namingTokensOrder: [...activeTokensOrder],
    namingSeparator: g('settingNamingSeparatorSelect')?.value || '_',
    borderColor: g('settingBorderColorSelect')?.value || '#cbd5e1',
    borderWidth: Number(g('settingBorderWidthSelect')?.value) || 1,
    cutMarksStyle: g('settingCutMarksSelect')?.value || 'inter_boundary',
    autoSaveEnabled: g('settingAutoSaveToggle') ? g('settingAutoSaveToggle').checked : true,
    studioName: g('settingNamingStudioNameInput')?.value?.trim() || g('settingStudioNameInput')?.value?.trim() || 'Passport & Stamp Studio Pro',
    studioPhone: g('settingStudioPhoneInput')?.value?.trim() || '',
    enableStudioTag: g('settingStudioTagToggle') ? g('settingStudioTagToggle').checked : false,
    enableWatermark: g('settingWatermarkToggle') ? g('settingWatermarkToggle').checked : false,
    watermarkText: g('settingWatermarkTextInput')?.value?.trim() || 'SAMPLE PROOF',
    defaultBackdropColor: g('settingDefaultBackdropSelect')?.value || '#ffffff',
    headHeightRatio: Number(g('settingHeadRatioSelect')?.value) || 0.75,
    autoEnhanceOnUpload: g('settingAutoEnhanceToggle') ? g('settingAutoEnhanceToggle').checked : false,
    bgFeatherRadius: Number(g('settingBgFeatherSlider')?.value) || 2,
    targetKbLimit: targetKbVal > 0 ? targetKbVal : null,
    bgEnginesConfig, selectedBgEngine: currentSelected,
    bgApiKey: g('inputRemoveBgKey')?.value?.trim() || '',
    bgCustomEndpoint: g('inputCustomApiEndpoint')?.value?.trim() || ''
  };
}
