import { appState } from '../core/state.js';
import { toastService } from './toast-service.js';
import { t } from '../config/i18n.js';
import { batchManager } from '../core/batch-manager.js';
import { getEngineMeta, updateBgEngineSelectorUI } from './sidebar/engine-meta.js';
import { hexToHsl, hslToHex, updateBackdropUIFromState } from './sidebar/color-shade-utils.js';
import { setupBgRemovalListeners } from './sidebar/bg-removal-controller.js';
import {
  getSavedBackdropColors, saveBackdropColor, renderSavedBackdropSwatches
} from './sidebar/sidebar-palette-manager.js';

export {
  getEngineMeta, updateBgEngineSelectorUI, updateBackdropUIFromState,
  getSavedBackdropColors, saveBackdropColor, renderSavedBackdropSwatches
};

export function setupEditorSidebar(triggerRedraw) {
  let baseColorHex = appState.get('backgroundColor') || '#ffffff';
  renderSavedBackdropSwatches(triggerRedraw);

  const customColor = document.getElementById('customBgColor');
  if (customColor) {
    customColor.value = baseColorHex;
    customColor.addEventListener('input', (e) => {
      baseColorHex = e.target.value;
      appState.set('backgroundColor', e.target.value);
      triggerRedraw();
    });
    customColor.addEventListener('change', (e) => {
      saveBackdropColor(e.target.value);
      renderSavedBackdropSwatches(triggerRedraw);
      appState.recordHistorySnapshot();
    });
  }

  document.getElementById('selectActiveBgEngine')?.addEventListener('change', (e) => {
    appState.set('selectedBgEngine', e.target.value);
    updateBgEngineSelectorUI();
    toastService.show(`${t('msg_engine_selected') || 'Active Method:'} ${getEngineMeta(e.target.value).name}`, 'info');
  });

  document.getElementById('btnQuickConfigBgEngines')?.addEventListener('click', () => {
    document.getElementById('btnOpenSettings')?.click();
    document.querySelector('.settings-tab-btn[data-target="paneBackdrop"]')?.click();
  });

  document.querySelectorAll('.btn-quick-chroma').forEach(btn => {
    btn.addEventListener('click', () => {
      const color = btn.dataset.color;
      const inputChroma = document.getElementById('inputChromaKeyColor');
      if (inputChroma) inputChroma.value = color;
      const engines = appState.get('bgEnginesConfig') || {};
      if (engines.chromakey) {
        engines.chromakey.keyColor = color;
        appState.set('bgEnginesConfig', { ...engines });
      }
    });
  });

  const sliderShade = document.getElementById('sliderBackdropShade');
  if (sliderShade) {
    sliderShade.addEventListener('input', (e) => {
      const pct = Number(e.target.value);
      document.getElementById('valBackdropShade').textContent = `${pct}%`;
      const hsl = hexToHsl(baseColorHex);
      const adjustedHex = hslToHex(hsl.h, hsl.s, Math.max(5, Math.min(98, pct)));
      appState.set('backgroundColor', adjustedHex);
      if (customColor) customColor.value = adjustedHex;
      triggerRedraw();
    });
  }

  document.getElementById('btnAddToBatchHistory')?.addEventListener('click', () => {
    const item = batchManager.addCurrentAsHistoryItem();
    if (item) toastService.show(appState.get('lang') === 'bn' ? 'ছবিটি সফলভাবে হিস্টোরিতে যুক্ত হয়েছে ⭐' : 'Photo added to History ⭐', 'success');
  });

  setupBgRemovalListeners(triggerRedraw);
  appState.on('backgroundColor', () => { updateBackdropUIFromState(); renderSavedBackdropSwatches(triggerRedraw); });
  appState.on('bgTolerance', () => updateBackdropUIFromState());
  appState.on('selectedBgEngine', () => updateBgEngineSelectorUI());
  appState.on('bgEnginesConfig', () => updateBgEngineSelectorUI());
  appState.on('lang', () => updateBgEngineSelectorUI());
  updateBgEngineSelectorUI();
}
