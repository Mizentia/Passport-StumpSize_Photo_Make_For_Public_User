import { appState } from '../../core/state.js';
import { t } from '../../config/i18n.js';
import { toastService } from '../toast-service.js';
import { photoPresetStore } from '../../core/photo-preset-store.js';
import { renderSavedPhotoPresetsInSidebar } from '../custom-preset-manager.js';
import { updateDimensionDisplay } from './dimension-display.js';
import { formatNumber } from './dimension-calculator.js';

export function setupModalActions(elements, state, onRedraw, closeModal) {
  const { btnApply, btnSavePreset, btnSaveEdit, btnDeleteModal, inputName, selectUnit, selectDpi, customDpiInput, hiddenId, input1, input2 } = elements;

  function getCalculatedPresetData() {
    const v1 = Number(input1?.value) || 0, v2 = Number(input2?.value) || 0;
    const heightVal = state.isHeightFirst ? v1 : v2;
    const widthVal = state.isHeightFirst ? v2 : v1;
    const unit = selectUnit?.value || 'mm';
    const targetDpi = selectDpi?.value === 'custom' ? (Number(customDpiInput?.value) || 300) : (Number(selectDpi?.value) || 300);

    let wMm = widthVal, hMm = heightVal, exactPixels = null;
    if (unit === 'inch') { wMm = widthVal * 25.4; hMm = heightVal * 25.4; }
    else if (unit === 'cm') { wMm = widthVal * 10; hMm = heightVal * 10; }
    else if (unit === 'px') { exactPixels = { width: Math.round(widthVal), height: Math.round(heightVal) }; wMm = (widthVal / targetDpi) * 25.4; hMm = (heightVal / targetDpi) * 25.4; }
    return { wMm: Math.round(wMm * 100) / 100, hMm: Math.round(hMm * 100) / 100, exactPixels, unit, targetDpi };
  }

  btnApply?.addEventListener('click', () => {
    const { wMm, hMm, exactPixels, unit, targetDpi } = getCalculatedPresetData();
    appState.set('dpi', targetDpi, false);
    appState.set('customSize', { widthMm: wMm, heightMm: hMm, exactPixels, unit }, false);
    appState.set('selectedPreset', 'custom', true);
    closeModal();
    renderSavedPhotoPresetsInSidebar(onRedraw);
    onRedraw();
    updateDimensionDisplay();
    const isBn = appState.get('lang') === 'bn';
    toastService.show(`${t('msg_custom_applied') || 'Custom size applied'}: ${formatNumber(wMm, isBn)} x ${formatNumber(hMm, isBn)} mm @ ${targetDpi} DPI`, 'success');
  });

  btnSavePreset?.addEventListener('click', () => {
    const { wMm, hMm, exactPixels, unit, targetDpi } = getCalculatedPresetData();
    const isBn = appState.get('lang') === 'bn';
    let name = inputName?.value?.trim() || (unit === 'px' && exactPixels ? `${exactPixels.width}x${exactPixels.height}px` : `${Math.round(wMm)}x${Math.round(hMm)}mm`);
    const newPreset = photoPresetStore.addPreset({ name, widthMm: wMm, heightMm: hMm, exactPixels, dpi: targetDpi, unit });
    appState.set('dpi', targetDpi, true);
    appState.set('customSize', { widthMm: newPreset.widthMm, heightMm: newPreset.heightMm, exactPixels, unit });
    appState.set('selectedPreset', newPreset.id, true);
    closeModal();
    renderSavedPhotoPresetsInSidebar(onRedraw);
    onRedraw();
    updateDimensionDisplay();
    toastService.show(isBn ? `প্রিসেট '${name}' সফলভাবে সেভ করা হয়েছে ⭐` : `Preset '${name}' saved ⭐`, 'success');
  });

  btnSaveEdit?.addEventListener('click', () => {
    const presetId = hiddenId?.value;
    if (!presetId) return;
    const { wMm, hMm, exactPixels, unit, targetDpi } = getCalculatedPresetData();
    let name = inputName?.value?.trim() || `${Math.round(wMm)}x${Math.round(hMm)}mm`;
    photoPresetStore.updatePreset(presetId, { name, widthMm: wMm, heightMm: hMm, exactPixels, dpi: targetDpi, unit });
    appState.set('dpi', targetDpi, true);
    appState.set('customSize', { widthMm: wMm, heightMm: hMm, exactPixels, unit });
    appState.set('selectedPreset', presetId, true);
    closeModal();
    renderSavedPhotoPresetsInSidebar(onRedraw);
    onRedraw();
    updateDimensionDisplay();
    toastService.show(appState.get('lang') === 'bn' ? `প্রিসেট '${name}' আপডেট হয়েছে 💾` : `Preset '${name}' updated 💾`, 'success');
  });

  btnDeleteModal?.addEventListener('click', () => {
    const presetId = hiddenId?.value;
    if (!presetId) return;
    const p = photoPresetStore.getPreset(presetId);
    if (confirm(`Delete preset '${p ? p.name : presetId}'?`)) {
      photoPresetStore.deletePreset(presetId);
      closeModal();
      if (appState.get('selectedPreset') === presetId) appState.set('selectedPreset', 'bd_passport', true);
      renderSavedPhotoPresetsInSidebar(onRedraw);
      onRedraw();
    }
  });
}
