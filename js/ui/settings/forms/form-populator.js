import { appState } from '../../../core/state.js';
import { setActiveTokensOrder, renderNamingTokensUI, updateNamingPreview } from './naming-tokens-ui.js';
import { populateBgEngines } from './bg-engines-ui.js';

export function populateSettingsForm() {
  const g = (id) => document.getElementById(id);
  const dpiVal = appState.get('dpi') || 300;
  const isCustomDpi = ![150, 200, 300, 600].includes(Number(dpiVal));

  if (g('settingDpiSelect')) g('settingDpiSelect').value = isCustomDpi ? 'custom' : String(dpiVal);
  if (g('settingCustomDpiRow')) g('settingCustomDpiRow').style.display = isCustomDpi ? 'flex' : 'none';
  if (g('settingCustomDpiInput')) g('settingCustomDpiInput').value = appState.get('customDpi') || dpiVal;
  if (g('settingFormatSelect')) g('settingFormatSelect').value = appState.get('exportFormat') || 'image/jpeg';

  const quality = Math.round((appState.get('jpegQuality') ?? 0.98) * 100);
  if (g('settingQualitySlider')) g('settingQualitySlider').value = quality;
  if (g('valSettingQuality')) g('valSettingQuality').textContent = `${quality}%`;

  const webpQ = Math.round((appState.get('webpQuality') ?? 0.95) * 100);
  if (g('settingWebpQualitySlider')) g('settingWebpQualitySlider').value = webpQ;
  if (g('valSettingWebpQuality')) g('valSettingWebpQuality').textContent = `${webpQ}%`;

  const savedTokens = appState.get('namingTokensOrder');
  if (Array.isArray(savedTokens) && savedTokens.length > 0) setActiveTokensOrder(savedTokens);
  if (g('settingNamingSeparatorSelect')) g('settingNamingSeparatorSelect').value = appState.get('namingSeparator') || '_';
  renderNamingTokensUI();

  if (g('settingBorderColorSelect')) g('settingBorderColorSelect').value = appState.get('borderColor') || '#cbd5e1';
  if (g('settingBorderWidthSelect')) g('settingBorderWidthSelect').value = String(appState.get('borderWidth') || 1);
  if (g('settingCutMarksSelect')) g('settingCutMarksSelect').value = appState.get('cutMarksStyle') || 'inter_boundary';
  if (g('settingAutoSaveToggle')) g('settingAutoSaveToggle').checked = appState.get('autoSaveEnabled') !== false;

  const studioNameVal = appState.get('studioName') || 'Passport & Stamp Studio Pro';
  if (g('settingStudioNameInput')) g('settingStudioNameInput').value = studioNameVal;
  if (g('settingNamingStudioNameInput')) g('settingNamingStudioNameInput').value = studioNameVal;
  if (g('settingStudioPhoneInput')) g('settingStudioPhoneInput').value = appState.get('studioPhone') || '';
  if (g('settingStudioTagToggle')) g('settingStudioTagToggle').checked = !!appState.get('enableStudioTag');
  if (g('settingWatermarkToggle')) g('settingWatermarkToggle').checked = !!appState.get('enableWatermark');
  if (g('settingWatermarkTextInput')) g('settingWatermarkTextInput').value = appState.get('watermarkText') || 'SAMPLE PROOF';
  if (g('settingDefaultBackdropSelect')) g('settingDefaultBackdropSelect').value = appState.get('defaultBackdropColor') || '#ffffff';
  if (g('settingHeadRatioSelect')) g('settingHeadRatioSelect').value = (Number(appState.get('headHeightRatio')) || 0.75).toFixed(2);
  if (g('settingAutoEnhanceToggle')) g('settingAutoEnhanceToggle').checked = !!appState.get('autoEnhanceOnUpload');

  const featherVal = Number(appState.get('bgFeatherRadius')) || 2;
  if (g('settingBgFeatherSlider')) g('settingBgFeatherSlider').value = featherVal;
  if (g('valSettingBgFeather')) g('valSettingBgFeather').textContent = `${featherVal}px`;
  if (g('settingTargetKbSelect')) g('settingTargetKbSelect').value = String(appState.get('targetKbLimit') || '0');

  const engines = appState.get('bgEnginesConfig') || { local_ai: { enabled: true }, floodfill: { enabled: true } };
  populateBgEngines(engines);

  document.querySelectorAll('.btn-toggle-pw').forEach(btn => {
    if (!btn._hasListener) {
      btn._hasListener = true;
      btn.addEventListener('click', () => {
        const inp = document.getElementById(btn.dataset.target);
        if (inp) { const isPw = inp.type === 'password'; inp.type = isPw ? 'text' : 'password'; btn.textContent = isPw ? '🙈' : '👁️'; }
      });
    }
  });

  document.querySelectorAll('.bg-engine-guide-toggle').forEach(btn => {
    if (!btn._hasGuideListener) {
      btn._hasGuideListener = true;
      btn.addEventListener('click', (e) => { e.preventDefault(); document.getElementById(btn.dataset.target)?.classList.toggle('open'); });
    }
  });

  if (g('settingBgFeatherSlider') && !g('settingBgFeatherSlider')._hasListener) {
    g('settingBgFeatherSlider')._hasListener = true;
    g('settingBgFeatherSlider').addEventListener('input', (e) => { if (g('valSettingBgFeather')) g('valSettingBgFeather').textContent = `${e.target.value}px`; });
  }

  updateNamingPreview();
}
