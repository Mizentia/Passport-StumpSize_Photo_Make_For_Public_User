import { appState } from '../../core/state.js';
import { toBengaliNumeral } from '../../config/i18n.js';
import {
  getAllPaperPresets, saveAllPaperPresets, addOrUpdatePaperPreset,
  removePaperPreset, reorderPaperPreset, resetDefaultPaperPresets
} from './paper-crud.js';

export {
  getAllPaperPresets, saveAllPaperPresets, addOrUpdatePaperPreset,
  removePaperPreset, reorderPaperPreset, resetDefaultPaperPresets
};

export const getSavedPaperPresets = getAllPaperPresets;
export const saveSavedPaperPresets = saveAllPaperPresets;
export const addCustomPaperPreset = addOrUpdatePaperPreset;
export const removeCustomPaperPreset = removePaperPreset;

export function renderCustomPaperOptionsInSelect() {
  const select = document.getElementById('paperPresetSelect');
  if (!select) return;

  const list = getAllPaperPresets();
  const savedPref = (() => { try { return localStorage.getItem('passport_default_paper'); } catch (_) { return null; } })();
  const currentVal = appState.get('paperPreset') || savedPref || list[0]?.id || 'photo_4r';
  const isBn = appState.get('lang') === 'bn';

  select.innerHTML = '';

  list.forEach((paper) => {
    const opt = document.createElement('option');
    opt.value = paper.id;
    const wInch = Math.round((paper.widthMm / 25.4) * 100) / 100;
    const hInch = Math.round((paper.heightMm / 25.4) * 100) / 100;
    const wMmStr = isBn ? toBengaliNumeral(Math.round(paper.widthMm * 10) / 10) : (Math.round(paper.widthMm * 10) / 10);
    const hMmStr = isBn ? toBengaliNumeral(Math.round(paper.heightMm * 10) / 10) : (Math.round(paper.heightMm * 10) / 10);
    const wInStr = isBn ? toBengaliNumeral(wInch) : wInch;
    const hInStr = isBn ? toBengaliNumeral(hInch) : hInch;
    opt.textContent = `${paper.name} (${wInStr}x${hInStr}" / ${wMmStr}x${hMmStr} mm)`;
    select.appendChild(opt);
  });

  const exists = list.some(p => p.id === currentVal);
  if (exists) {
    select.value = currentVal;
    if (appState.get('paperPreset') !== currentVal) appState.set('paperPreset', currentVal, false);
  } else if (list.length > 0) {
    select.value = list[0].id;
    appState.set('paperPreset', list[0].id, false);
  }
}
