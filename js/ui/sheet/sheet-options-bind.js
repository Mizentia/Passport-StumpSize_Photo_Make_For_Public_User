import { appState } from '../../core/state.js';
import { getActivePaperConfig } from '../../export/sheet-generator.js';
import { saveSettingsToStorage } from '../settings/settings-storage.js';
import { bindSheetBorderOptions } from './sheet-border-bind.js';
import { bindSheetCutMarksOptions } from './sheet-cut-bind.js';

export function bindSheetOptions(triggerSheetRedraw) {
  const inputMargin = document.getElementById('inputSheetMarginMm');
  const inputGap = document.getElementById('inputSheetGapMm');

  const { marginMm, gapMm } = getActivePaperConfig();
  if (inputMargin) inputMargin.value = marginMm;
  if (inputGap) inputGap.value = gapMm;

  inputMargin?.addEventListener('input', (e) => {
    appState.set('sheetMarginMm', Number(e.target.value));
    triggerSheetRedraw();
  });

  inputGap?.addEventListener('input', (e) => {
    appState.set('sheetGapMm', Number(e.target.value));
    triggerSheetRedraw();
  });

  document.getElementById('btnResetSheetSpacing')?.addEventListener('click', () => {
    const { paper } = getActivePaperConfig();
    appState.set('sheetMarginMm', paper.marginMm || 4);
    appState.set('sheetGapMm', paper.gapMm || 3);
    if (inputMargin) inputMargin.value = paper.marginMm || 4;
    if (inputGap) inputGap.value = paper.gapMm || 3;
    triggerSheetRedraw();
  });

  bindSheetBorderOptions(triggerSheetRedraw);
  bindSheetCutMarksOptions(triggerSheetRedraw);

  const toggleRowSpace = document.getElementById('toggleRowSpaceSharing');
  if (toggleRowSpace) {
    toggleRowSpace.checked = appState.get('allowRowSpaceSharing') !== false;
    toggleRowSpace.addEventListener('change', (e) => {
      appState.set('allowRowSpaceSharing', e.target.checked);
      saveSettingsToStorage();
      triggerSheetRedraw();
    });
  }
}
