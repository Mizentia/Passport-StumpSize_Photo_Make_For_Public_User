import { appState } from '../../core/state.js';
import { t } from '../../config/i18n.js';
import { photoPresetStore } from '../../core/photo-preset-store.js';

export function openCustomSizeModal(presetToEdit = null) {
  const modal = document.getElementById('customSizeModal');
  if (!modal) return;

  const titleEl = document.getElementById('customModalTitle');
  const inputName = document.getElementById('customInputName');
  const inputUnit = document.getElementById('customInputUnit');
  const input1 = document.getElementById('customInput1');
  const input2 = document.getElementById('customInput2');
  const hiddenId = document.getElementById('customEditingPresetId');
  const selectDpi = document.getElementById('customPresetDpi');
  const customDpiInput = document.getElementById('customPresetCustomDpi');
  const actionAdd = document.getElementById('customModalActionButtons');
  const actionEdit = document.getElementById('customModalEditButtons');
  const btnSwap = document.getElementById('btnSwapCustomHW');
  const isBn = appState.get('lang') === 'bn';

  if (btnSwap) btnSwap.style.transform = 'rotate(0deg)';

  let presetObj = typeof presetToEdit === 'string' ? photoPresetStore.getPreset(presetToEdit) : presetToEdit;

  if (presetObj) {
    const unit = presetObj.unit || (presetObj.exactPixels ? 'px' : 'mm');
    const dpiVal = presetObj.dpi || 300;
    let hVal = presetObj.heightMm, wVal = presetObj.widthMm;
    if (unit === 'inch') { hVal = Math.round((hVal / 25.4) * 100) / 100; wVal = Math.round((wVal / 25.4) * 100) / 100; }
    else if (unit === 'cm') { hVal = Math.round((hVal / 10) * 100) / 100; wVal = Math.round((wVal / 10) * 100) / 100; }
    else if (unit === 'px') { hVal = presetObj.exactPixels?.height ?? Math.round((hVal / 25.4) * dpiVal); wVal = presetObj.exactPixels?.width ?? Math.round((wVal / 25.4) * dpiVal); }

    if (hiddenId) hiddenId.value = presetObj.id;
    if (titleEl) titleEl.textContent = isBn ? `ছবির সাইজ এডিট: ${presetObj.name}` : `Edit Preset: ${presetObj.name}`;
    if (inputName) inputName.value = presetObj.name || '';
    if (inputUnit) inputUnit.value = unit;
    if (input1) input1.value = wVal;
    if (input2) input2.value = hVal;
    if (selectDpi) {
      if ([200, 300, 600].includes(dpiVal)) { selectDpi.value = String(dpiVal); if (customDpiInput) customDpiInput.style.display = 'none'; }
      else { selectDpi.value = 'custom'; if (customDpiInput) { customDpiInput.style.display = 'block'; customDpiInput.value = dpiVal; } }
    }
    if (actionAdd) actionAdd.style.display = 'none';
    if (actionEdit) actionEdit.style.display = 'flex';
  } else {
    const customData = appState.get('customSize');
    const dpiVal = appState.get('dpi') || 300;
    const unit = customData?.unit || 'mm';
    let hVal = 50, wVal = 40;
    if (customData) {
      if (customData.exactPixels) {
        hVal = customData.exactPixels.height;
        wVal = customData.exactPixels.width;
      } else if (unit === 'inch') {
        hVal = Math.round(((customData.heightMm || 50) / 25.4) * 100) / 100;
        wVal = Math.round(((customData.widthMm || 40) / 25.4) * 100) / 100;
      } else if (unit === 'cm') {
        hVal = Math.round(((customData.heightMm || 50) / 10) * 100) / 100;
        wVal = Math.round(((customData.widthMm || 40) / 10) * 100) / 100;
      } else {
        hVal = customData.heightMm || 50;
        wVal = customData.widthMm || 40;
      }
    }
    if (hiddenId) hiddenId.value = '';
    if (titleEl) titleEl.textContent = t('modal_add_preset_title') || (isBn ? 'নতুন ছবির সাইজ ও প্রিসেট যোগ করুন' : 'Add New Photo Preset');
    if (inputName) inputName.value = '';
    if (inputUnit) inputUnit.value = unit;
    if (input1) input1.value = wVal;
    if (input2) input2.value = hVal;
    if (selectDpi) {
      if ([200, 300, 600].includes(dpiVal)) {
        selectDpi.value = String(dpiVal);
        if (customDpiInput) customDpiInput.style.display = 'none';
      } else {
        selectDpi.value = 'custom';
        if (customDpiInput) { customDpiInput.style.display = 'block'; customDpiInput.value = dpiVal; }
      }
    }
    if (actionAdd) actionAdd.style.display = 'flex';
    if (actionEdit) actionEdit.style.display = 'none';
  }

  modal.classList.add('active');
  window.dispatchEvent(new CustomEvent('customSizeModalOpened', { detail: { isEdit: !!presetObj } }));
}
