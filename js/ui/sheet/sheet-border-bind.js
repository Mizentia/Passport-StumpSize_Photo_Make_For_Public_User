import { appState } from '../../core/state.js';
import { saveSettingsToStorage } from '../settings/settings-storage.js';

export function bindSheetBorderOptions(triggerSheetRedraw) {
  const toggleBorder = document.getElementById('toggleBorder');
  const borderWidthSelect = document.getElementById('sheetBorderWidthSelect');
  const borderColorInput = document.getElementById('sheetBorderColorInput');
  const borderColorPreset = document.getElementById('sheetBorderColorPreset');
  const rowBorderControls = document.getElementById('rowBorderControls');

  if (toggleBorder) {
    toggleBorder.checked = appState.get('includeBorder') !== false;
    if (rowBorderControls) rowBorderControls.style.display = toggleBorder.checked ? 'flex' : 'none';
    toggleBorder.addEventListener('change', (e) => {
      appState.set('includeBorder', e.target.checked);
      if (rowBorderControls) rowBorderControls.style.display = e.target.checked ? 'flex' : 'none';
      saveSettingsToStorage();
      triggerSheetRedraw();
    });
  }

  if (borderWidthSelect) {
    borderWidthSelect.value = String(appState.get('borderWidth') || 1);
    borderWidthSelect.addEventListener('change', (e) => {
      appState.set('borderWidth', Number(e.target.value));
      saveSettingsToStorage();
      triggerSheetRedraw();
    });
  }

  if (borderColorInput) {
    borderColorInput.value = appState.get('borderColor') || '#cbd5e1';
    borderColorInput.addEventListener('input', (e) => {
      appState.set('borderColor', e.target.value);
      if (borderColorPreset) borderColorPreset.value = 'custom';
      saveSettingsToStorage();
      triggerSheetRedraw();
    });
  }

  if (borderColorPreset) {
    const curCol = appState.get('borderColor') || '#cbd5e1';
    const hasOpt = Array.from(borderColorPreset.options).some(o => o.value === curCol);
    borderColorPreset.value = hasOpt ? curCol : 'custom';
    borderColorPreset.addEventListener('change', (e) => {
      if (e.target.value !== 'custom') {
        appState.set('borderColor', e.target.value);
        if (borderColorInput) borderColorInput.value = e.target.value;
        saveSettingsToStorage();
        triggerSheetRedraw();
      }
    });
  }
}
