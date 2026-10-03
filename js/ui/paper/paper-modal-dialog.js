import { appState } from '../../core/state.js';
import { toBengaliNumeral, t } from '../../config/i18n.js';
import { mmToPixels } from '../../config/photo-presets.js';
import { getTargetDimensions } from '../../core/canvas-engine.js';
import { getAllPaperPresets } from './paper-storage.js';

export function setupPaperModalDialog(elements, state) {
  const { input1, input2, selectUnit, inputMargin, inputGap, label1, label2, preview, btnSwap, modal, inputId, inputName, addActions, editActions } = elements;

  function updateLabels() {
    const isBn = appState.get('lang') === 'bn';
    if (state.isHeightFirst) {
      if (label1) label1.textContent = isBn ? 'উচ্চতা' : 'Height';
      if (label2) label2.textContent = isBn ? 'প্রস্থ' : 'Width';
      btnSwap?.setAttribute('title', isBn ? 'পোর্ট্রেট মোড ↕' : 'Portrait Mode ↕');
    } else {
      if (label1) label1.textContent = isBn ? 'প্রস্থ' : 'Width';
      if (label2) label2.textContent = isBn ? 'উচ্চতা' : 'Height';
      btnSwap?.setAttribute('title', isBn ? 'ল্যান্ডস্কেপ মোড ↔' : 'Landscape Mode ↔');
    }
  }

  function updateModalPreview() {
    if (!preview) return;
    const v1 = Number(input1?.value) || 0, v2 = Number(input2?.value) || 0;
    const hVal = state.isHeightFirst ? v1 : v2, wVal = state.isHeightFirst ? v2 : v1;
    const unit = selectUnit?.value || 'mm';
    const margin = Number(inputMargin?.value) || 0, gap = Number(inputGap?.value) || 0;
    const isBn = appState.get('lang') === 'bn';

    let wMm = wVal, hMm = hVal;
    if (unit === 'inch') { wMm = wVal * 25.4; hMm = hVal * 25.4; }
    else if (unit === 'cm') { wMm = wVal * 10; hMm = hVal * 10; }

    const { width: pW, height: pH } = getTargetDimensions();
    const dpi = appState.get('dpi') || 300;
    const sheetWPx = mmToPixels(wMm, dpi), sheetHPx = mmToPixels(hMm, dpi);
    const marginPx = mmToPixels(margin, dpi), gapPx = mmToPixels(gap, dpi);
    const cols = Math.max(1, Math.floor((sheetWPx - 2 * marginPx + gapPx) / (pW + gapPx)));
    const rows = Math.max(1, Math.floor((sheetHPx - 2 * marginPx + gapPx) / (pH + gapPx)));
    const cap = cols * rows;

    const wMmStr = isBn ? toBengaliNumeral(Math.round(wMm * 10) / 10) : (Math.round(wMm * 10) / 10);
    const hMmStr = isBn ? toBengaliNumeral(Math.round(hMm * 10) / 10) : (Math.round(hMm * 10) / 10);
    const wInStr = isBn ? toBengaliNumeral(Math.round((wMm / 25.4) * 100) / 100) : (Math.round((wMm / 25.4) * 100) / 100);
    const hInStr = isBn ? toBengaliNumeral(Math.round((hMm / 25.4) * 100) / 100) : (Math.round((hMm / 25.4) * 100) / 100);

    preview.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <div style="display: flex; justify-content: space-between;">
          <span><strong>${isBn ? '📏 সাইজ:' : '📏 Size:'}</strong> ${wInStr} x ${hInStr}" (${wMmStr} x ${hMmStr} ${isBn ? 'মিমি' : 'mm'})</span>
          <span style="color: var(--accent-primary); font-weight: 700;">${state.isHeightFirst ? (isBn ? '↕ পোর্ট্রেট' : '↕ Portrait') : (isBn ? '↔ ল্যান্ডস্কেপ' : '↔ Landscape')}</span>
        </div>
        <div style="font-size: 0.76rem; color: #10b981; font-weight: 600;">
          ✨ ${isBn ? `১ পেজে ধরে: ${toBengaliNumeral(cap)}টি ছবি (${toBengaliNumeral(cols)} কলাম x ${toBengaliNumeral(rows)} সারি)` : `Capacity: ${cap} photos/page (${cols} cols x ${rows} rows)`}
        </div>
      </div>`;
  }

  window.openCustomPaperModal = (paperIdToEdit = null) => {
    state.isHeightFirst = true;
    updateLabels();
    const isBn = appState.get('lang') === 'bn';

    if (paperIdToEdit) {
      const allPapers = getAllPaperPresets();
      const p = allPapers.find(i => i.id === paperIdToEdit);
      if (p) {
        if (inputId) inputId.value = p.id;
        if (inputName) inputName.value = p.name;
        if (selectUnit) selectUnit.value = 'mm';
        if (input1) input1.value = p.heightMm;
        if (input2) input2.value = p.widthMm;
        if (inputMargin) inputMargin.value = p.marginMm != null ? p.marginMm : 4;
        if (inputGap) inputGap.value = p.gapMm != null ? p.gapMm : 3;
        const title = document.getElementById('customPaperModalTitle');
        if (title) title.textContent = isBn ? `কাগজের মাপ পরিবর্তন: ${p.name}` : `Edit Paper: ${p.name}`;
        if (addActions) addActions.style.display = 'none';
        if (editActions) editActions.style.display = 'flex';
      }
    } else {
      if (inputId) inputId.value = '';
      if (inputName) inputName.value = '';
      if (selectUnit) selectUnit.value = 'mm';
      if (input1) input1.value = '152.4';
      if (input2) input2.value = '101.6';
      if (inputMargin) inputMargin.value = '4';
      if (inputGap) inputGap.value = '3';
      const title = document.getElementById('customPaperModalTitle');
      if (title) title.textContent = t('title_custom_paper_modal') || '📄 Custom Photo Paper & Spacing';
      if (addActions) addActions.style.display = 'flex';
      if (editActions) editActions.style.display = 'none';
    }
    updateModalPreview();
    modal?.classList.add('active');
  };

  return { updateLabels, updateModalPreview };
}
