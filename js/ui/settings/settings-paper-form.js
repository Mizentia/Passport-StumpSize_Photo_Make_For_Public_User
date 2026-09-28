import { appState } from '../../core/state.js';
import { toBengaliNumeral } from '../../config/i18n.js';
import { toastService } from '../toast-service.js';
import { addCustomPaperPreset, renderCustomPapersInSettings, renderCustomPaperOptionsInSelect } from '../custom-paper-manager.js';

export function setupSettingsPaperForm(onSettingChange) {
  const paperNameInput = document.getElementById('settingCustomPaperName');
  const paperUnitSelect = document.getElementById('settingCustomPaperUnit');
  const paperLabel1 = document.getElementById('settingPaperLabel1');
  const paperLabel2 = document.getElementById('settingPaperLabel2');
  const paperInput1 = document.getElementById('settingPaperInput1');
  const paperInput2 = document.getElementById('settingPaperInput2');
  const btnSwapPaper = document.getElementById('btnSwapPaperHW');
  const paperMarginInput = document.getElementById('settingCustomPaperMargin');
  const paperGapInput = document.getElementById('settingCustomPaperGap');
  const btnAddPaper = document.getElementById('btnAddNewCustomPaper');
  const paperPreview = document.getElementById('customPaperConversionPreview');

  let isPaperHeightFirst = true;

  function updatePaperLabels() {
    const isBn = appState.get('lang') === 'bn';
    if (isPaperHeightFirst) {
      if (paperLabel1) paperLabel1.textContent = isBn ? 'উচ্চতা (Height)' : 'Height (উচ্চতা)';
      if (paperLabel2) paperLabel2.textContent = isBn ? 'প্রস্থ (Width)' : 'Width (প্রস্থ)';
    } else {
      if (paperLabel1) paperLabel1.textContent = isBn ? 'প্রস্থ (Width)' : 'Width (প্রস্থ)';
      if (paperLabel2) paperLabel2.textContent = isBn ? 'উচ্চতা (Height)' : 'Height (উচ্চতা)';
    }
  }

  function updatePaperConversionPreview() {
    if (!paperPreview) return;
    const v1 = Number(paperInput1?.value) || 0, v2 = Number(paperInput2?.value) || 0;
    const hVal = isPaperHeightFirst ? v1 : v2, wVal = isPaperHeightFirst ? v2 : v1;
    const unit = paperUnitSelect?.value || 'mm';
    const isBn = appState.get('lang') === 'bn';

    let wMm = wVal, hMm = hVal;
    if (unit === 'inch') { wMm = wVal * 25.4; hMm = hVal * 25.4; }
    else if (unit === 'cm') { wMm = wVal * 10; hMm = hVal * 10; }

    const wMmStr = isBn ? toBengaliNumeral(Math.round(wMm * 10) / 10) : (Math.round(wMm * 10) / 10);
    const hMmStr = isBn ? toBengaliNumeral(Math.round(hMm * 10) / 10) : (Math.round(hMm * 10) / 10);
    const wInStr = isBn ? toBengaliNumeral(Math.round((wMm / 25.4) * 100) / 100) : (Math.round((wMm / 25.4) * 100) / 100);
    const hInStr = isBn ? toBengaliNumeral(Math.round((hMm / 25.4) * 100) / 100) : (Math.round((hMm / 25.4) * 100) / 100);

    paperPreview.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div><strong>${isBn ? '📏 সাইজ প্রিভিউ:' : '📏 Size Preview:'}</strong> <span style="color: var(--accent-primary); font-weight: 700;">${wInStr} x ${hInStr}"</span> &bull; <span>${wMmStr} x ${hMmStr} mm</span></div>
      </div>`;
  }

  btnSwapPaper?.addEventListener('click', () => {
    const temp = paperInput1.value; paperInput1.value = paperInput2.value; paperInput2.value = temp;
    isPaperHeightFirst = !isPaperHeightFirst;
    updatePaperLabels(); updatePaperConversionPreview();
  });

  paperInput1?.addEventListener('input', updatePaperConversionPreview);
  paperInput2?.addEventListener('input', updatePaperConversionPreview);
  paperUnitSelect?.addEventListener('change', updatePaperConversionPreview);

  btnAddPaper?.addEventListener('click', () => {
    let name = paperNameInput?.value?.trim();
    const v1 = Number(paperInput1?.value) || 0, v2 = Number(paperInput2?.value) || 0;
    const hVal = isPaperHeightFirst ? v1 : v2, wVal = isPaperHeightFirst ? v2 : v1;
    const unit = paperUnitSelect?.value || 'mm';
    let wMm = wVal, hMm = hVal;
    if (unit === 'inch') { wMm = wVal * 25.4; hMm = hVal * 25.4; }
    else if (unit === 'cm') { wMm = wVal * 10; hMm = hVal * 10; }
    if (!name) name = `${Math.round(wMm)}x${Math.round(hMm)}mm`;

    addCustomPaperPreset({ id: `custom_paper_${Date.now()}`, name, widthMm: Math.round(wMm * 10) / 10, heightMm: Math.round(hMm * 10) / 10, marginMm: Number(paperMarginInput?.value) || 4, gapMm: Number(paperGapInput?.value) || 3, supportsCombo: false });
    renderCustomPapersInSettings(onSettingChange);
    renderCustomPaperOptionsInSelect();
    if (paperNameInput) paperNameInput.value = '';
    toastService.show(`Custom paper '${name}' added 📄`, 'success');
  });

  return { updatePaperLabels, updatePaperConversionPreview };
}
