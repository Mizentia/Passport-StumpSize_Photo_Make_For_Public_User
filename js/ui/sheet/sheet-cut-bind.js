import { appState } from '../../core/state.js';
import { saveSettingsToStorage } from '../settings/settings-storage.js';

export function bindSheetCutMarksOptions(triggerSheetRedraw) {
  const toggleCutMarks = document.getElementById('toggleCutMarks');
  const cutStyleSelect = document.getElementById('sheetCutStyleSelect');
  const cutWidthSelect = document.getElementById('sheetCutWidthSelect');
  const cutColorInput = document.getElementById('sheetCutColorInput');
  const cutColorPreset = document.getElementById('sheetCutColorPreset');
  const rowCutMarksControls = document.getElementById('rowCutMarksControls');

  if (toggleCutMarks) {
    toggleCutMarks.checked = appState.get('includeCutMarks') !== false;
    if (rowCutMarksControls) rowCutMarksControls.style.display = toggleCutMarks.checked ? 'flex' : 'none';
    toggleCutMarks.addEventListener('change', (e) => {
      appState.set('includeCutMarks', e.target.checked);
      if (rowCutMarksControls) rowCutMarksControls.style.display = e.target.checked ? 'flex' : 'none';
      saveSettingsToStorage();
      triggerSheetRedraw();
    });
  }

  if (cutStyleSelect) {
    cutStyleSelect.value = appState.get('cutMarksStyle') || 'inter_boundary';
    cutStyleSelect.addEventListener('change', (e) => {
      appState.set('cutMarksStyle', e.target.value);
      saveSettingsToStorage();
      triggerSheetRedraw();
    });
  }

  if (cutWidthSelect) {
    cutWidthSelect.value = String(appState.get('cutMarksWidth') || 1);
    cutWidthSelect.addEventListener('change', (e) => {
      appState.set('cutMarksWidth', Number(e.target.value));
      saveSettingsToStorage();
      triggerSheetRedraw();
    });
  }

  if (cutColorInput) {
    cutColorInput.value = appState.get('cutMarksColor') || '#94a3b8';
    cutColorInput.addEventListener('input', (e) => {
      appState.set('cutMarksColor', e.target.value);
      if (cutColorPreset) cutColorPreset.value = 'custom';
      saveSettingsToStorage();
      triggerSheetRedraw();
    });
  }

  if (cutColorPreset) {
    const curCutCol = appState.get('cutMarksColor') || '#94a3b8';
    const hasOpt = Array.from(cutColorPreset.options).some(o => o.value === curCutCol);
    cutColorPreset.value = hasOpt ? curCutCol : 'custom';
    cutColorPreset.addEventListener('change', (e) => {
      if (e.target.value !== 'custom') {
        appState.set('cutMarksColor', e.target.value);
        if (cutColorInput) cutColorInput.value = e.target.value;
        saveSettingsToStorage();
        triggerSheetRedraw();
      }
    });
  }
}
