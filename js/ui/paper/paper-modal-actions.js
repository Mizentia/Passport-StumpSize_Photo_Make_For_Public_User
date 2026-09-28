import { appState } from '../../core/state.js';
import { t } from '../../config/i18n.js';
import { toastService } from '../toast-service.js';
import { addOrUpdatePaperPreset, removePaperPreset, reorderPaperPreset, renderCustomPaperOptionsInSelect, getAllPaperPresets } from './paper-storage.js';

export function setupPaperModalActions(elements, state, onPaperSaved, closeModal) {
  const { input1, input2, selectUnit, inputMargin, inputGap, inputName, inputId, btnSaveNew, btnUpdate, btnDelete, btnMoveUp, btnMoveDown } = elements;

  function getCalculated() {
    const v1 = Number(input1?.value) || 0, v2 = Number(input2?.value) || 0;
    const hVal = state.isHeightFirst ? v1 : v2, wVal = state.isHeightFirst ? v2 : v1;
    const unit = selectUnit?.value || 'mm';
    let wMm = wVal, hMm = hVal;
    if (unit === 'inch') { wMm = wVal * 25.4; hMm = hVal * 25.4; }
    else if (unit === 'cm') { wMm = wVal * 10; hMm = hVal * 10; }
    let name = inputName?.value?.trim() || `${Math.round(wMm)}x${Math.round(hMm)}mm`;
    return { name, wMm: Math.round(wMm * 10) / 10, hMm: Math.round(hMm * 10) / 10 };
  }

  btnSaveNew?.addEventListener('click', () => {
    const { name, wMm, hMm } = getCalculated();
    const newPaper = {
      id: `custom_paper_${Date.now()}`,
      name,
      widthMm: wMm,
      heightMm: hMm,
      marginMm: Number(inputMargin?.value) || 4,
      gapMm: Number(inputGap?.value) || 3
    };
    addOrUpdatePaperPreset(newPaper);
    appState.set('paperPreset', newPaper.id, true);
    appState.set('sheetMarginMm', newPaper.marginMm, false);
    appState.set('sheetGapMm', newPaper.gapMm, false);
    renderCustomPaperOptionsInSelect();
    const sel = document.getElementById('paperPresetSelect');
    if (sel) sel.value = newPaper.id;
    closeModal();
    if (onPaperSaved) onPaperSaved();
    toastService.show(t('msg_paper_added') || 'Custom paper saved! 📄', 'success');
  });

  btnUpdate?.addEventListener('click', () => {
    const paperId = inputId?.value;
    if (!paperId) return;
    const { name, wMm, hMm } = getCalculated();
    const updated = {
      id: paperId,
      name,
      widthMm: wMm,
      heightMm: hMm,
      marginMm: Number(inputMargin?.value) || 4,
      gapMm: Number(inputGap?.value) || 3
    };
    addOrUpdatePaperPreset(updated);
    appState.set('paperPreset', paperId, true);
    appState.set('sheetMarginMm', updated.marginMm, false);
    appState.set('sheetGapMm', updated.gapMm, false);
    renderCustomPaperOptionsInSelect();
    closeModal();
    if (onPaperSaved) onPaperSaved();
    toastService.show(t('msg_paper_updated') || 'Paper updated successfully! 💾', 'success');
  });

  btnDelete?.addEventListener('click', () => {
    const paperId = inputId?.value;
    if (!paperId) return;
    const isBn = appState.get('lang') === 'bn';
    if (confirm(isBn ? 'আপনি কি নিশ্চিত এই কাগজটি মুছে ফেলতে চান?' : 'Delete this photo paper preset?')) {
      const remaining = removePaperPreset(paperId);
      const nextPaper = remaining[0]?.id || 'photo_4r';
      appState.set('paperPreset', nextPaper, true);
      renderCustomPaperOptionsInSelect();
      closeModal();
      if (onPaperSaved) onPaperSaved();
      toastService.show(t('msg_paper_deleted') || 'Paper deleted', 'info');
    }
  });

  btnMoveUp?.addEventListener('click', () => {
    const paperId = inputId?.value;
    if (!paperId) return;
    reorderPaperPreset(paperId, 'up');
    renderCustomPaperOptionsInSelect();
    if (onPaperSaved) onPaperSaved();
    toastService.show('⬆️ Paper moved up in priority', 'info');
  });

  btnMoveDown?.addEventListener('click', () => {
    const paperId = inputId?.value;
    if (!paperId) return;
    reorderPaperPreset(paperId, 'down');
    renderCustomPaperOptionsInSelect();
    if (onPaperSaved) onPaperSaved();
    toastService.show('⬇️ Paper moved down in priority', 'info');
  });
}
