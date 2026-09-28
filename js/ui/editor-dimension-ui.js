import { appState } from '../core/state.js';
import { calculateDimensions, formatNumber } from './dimensions/dimension-calculator.js';
import { updateDimensionDisplay } from './dimensions/dimension-display.js';
import { openCustomSizeModal } from './dimensions/custom-size-modal-dialog.js';
import { updateLiveCustomPreview } from './dimensions/custom-size-preview.js';
import { setupModalActions } from './dimensions/custom-size-modal-actions.js';

export { calculateDimensions, updateDimensionDisplay, openCustomSizeModal, formatNumber };

export function setupCustomSizeModal(onRedraw) {
  const modal = document.getElementById('customSizeModal');
  const elements = {
    modal, btnClose: document.getElementById('btnCloseCustomModal'),
    btnApply: document.getElementById('btnApplyCustomSize'), btnSavePreset: document.getElementById('btnSaveCustomPreset'),
    btnSaveEdit: document.getElementById('btnSavePresetChanges'), btnDeleteModal: document.getElementById('btnDeletePresetModal'),
    btnSwap: document.getElementById('btnSwapCustomHW'), label1: document.getElementById('customLabel1'),
    label2: document.getElementById('customLabel2'), input1: document.getElementById('customInput1'),
    input2: document.getElementById('customInput2'), inputName: document.getElementById('customInputName'),
    selectUnit: document.getElementById('customInputUnit'), selectDpi: document.getElementById('customPresetDpi'),
    customDpiInput: document.getElementById('customPresetCustomDpi'), previewBox: document.getElementById('customConversionPreview'),
    warningBox: document.getElementById('customValidationWarning'), hiddenId: document.getElementById('customEditingPresetId')
  };

  const state = { isHeightFirst: true, previousUnit: elements.selectUnit?.value || 'mm' };
  const closeModal = () => modal?.classList.remove('active');

  elements.selectDpi?.addEventListener('change', () => {
    if (elements.selectDpi.value === 'custom' && elements.customDpiInput) { elements.customDpiInput.style.display = 'block'; elements.customDpiInput.focus(); }
    else if (elements.customDpiInput) { elements.customDpiInput.style.display = 'none'; }
    updateLiveCustomPreview(elements, state);
  });
  elements.customDpiInput?.addEventListener('input', () => updateLiveCustomPreview(elements, state));
  elements.btnSwap?.addEventListener('click', () => {
    const temp = elements.input1.value; elements.input1.value = elements.input2.value; elements.input2.value = temp;
    state.isHeightFirst = !state.isHeightFirst;
    elements.btnSwap.style.transform = state.isHeightFirst ? 'rotate(0deg)' : 'rotate(180deg)';
    updateLiveCustomPreview(elements, state);
  });
  elements.input1?.addEventListener('input', () => updateLiveCustomPreview(elements, state));
  elements.input2?.addEventListener('input', () => updateLiveCustomPreview(elements, state));
  elements.selectUnit?.addEventListener('change', () => {
    state.previousUnit = elements.selectUnit.value;
    updateLiveCustomPreview(elements, state);
  });
  elements.btnClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  window.addEventListener('customSizeModalOpened', () => {
    state.isHeightFirst = true; state.previousUnit = elements.selectUnit?.value || 'mm';
    updateLiveCustomPreview(elements, state);
  });

  setupModalActions(elements, state, onRedraw, closeModal);
  appState.on('lang', () => updateLiveCustomPreview(elements, state));
  updateLiveCustomPreview(elements, state);
}
