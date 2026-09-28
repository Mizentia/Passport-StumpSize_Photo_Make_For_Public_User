import { appState } from '../core/state.js';
import {
  getAllPaperPresets, getSavedPaperPresets, saveSavedPaperPresets,
  addOrUpdatePaperPreset, addCustomPaperPreset, removePaperPreset,
  removeCustomPaperPreset, renderCustomPaperOptionsInSelect, resetDefaultPaperPresets
} from './paper/paper-storage.js';
import { renderCustomPapersInSettings } from './paper/paper-settings-list.js';
import { setupPaperModalDialog } from './paper/paper-modal-dialog.js';
import { setupPaperModalActions } from './paper/paper-modal-actions.js';

export {
  getAllPaperPresets, getSavedPaperPresets, saveSavedPaperPresets,
  addOrUpdatePaperPreset, addCustomPaperPreset, removePaperPreset,
  removeCustomPaperPreset, renderCustomPaperOptionsInSelect, renderCustomPapersInSettings,
  resetDefaultPaperPresets
};

export function setupCustomPaperModalController(onPaperSaved) {
  const modal = document.getElementById('customPaperModal');
  const elements = {
    modal,
    btnClose: document.getElementById('btnCloseCustomPaperModal'),
    inputId: document.getElementById('editingCustomPaperId'),
    inputName: document.getElementById('modalCustomPaperName'),
    selectUnit: document.getElementById('modalCustomPaperUnit'),
    label1: document.getElementById('modalPaperLabel1'),
    label2: document.getElementById('modalPaperLabel2'),
    input1: document.getElementById('modalPaperInput1'),
    input2: document.getElementById('modalPaperInput2'),
    btnSwap: document.getElementById('btnModalSwapPaperHW'),
    inputMargin: document.getElementById('modalCustomPaperMargin'),
    inputGap: document.getElementById('modalCustomPaperGap'),
    preview: document.getElementById('modalPaperCapacityPreview'),
    addActions: document.getElementById('modalPaperAddActions'),
    editActions: document.getElementById('modalPaperEditActions'),
    btnSaveNew: document.getElementById('btnSaveNewPaperModal'),
    btnUpdate: document.getElementById('btnUpdatePaperModal'),
    btnDelete: document.getElementById('btnDeletePaperModal'),
    btnMoveUp: document.getElementById('btnMovePaperUp'),
    btnMoveDown: document.getElementById('btnMovePaperDown')
  };

  const state = { isHeightFirst: true };
  const closeModal = () => modal?.classList.remove('active');
  elements.btnClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  const { updateLabels, updateModalPreview } = setupPaperModalDialog(elements, state);

  elements.btnSwap?.addEventListener('click', () => {
    const temp = elements.input1.value;
    elements.input1.value = elements.input2.value;
    elements.input2.value = temp;
    state.isHeightFirst = !state.isHeightFirst;
    updateLabels();
    elements.btnSwap.style.transform = state.isHeightFirst ? 'rotate(0deg)' : 'rotate(180deg)';
    updateModalPreview();
  });

  elements.input1?.addEventListener('input', updateModalPreview);
  elements.input2?.addEventListener('input', updateModalPreview);
  elements.inputMargin?.addEventListener('input', updateModalPreview);
  elements.inputGap?.addEventListener('input', updateModalPreview);
  elements.selectUnit?.addEventListener('change', updateModalPreview);

  setupPaperModalActions(elements, state, onPaperSaved, closeModal);

  // Wire up Print Sheet Tab buttons
  document.getElementById('btnAddNewPaperSheet')?.addEventListener('click', () => {
    if (window.openCustomPaperModal) window.openCustomPaperModal(null);
  });

  document.getElementById('btnEditCustomPaperSheet')?.addEventListener('click', () => {
    const currentPaper = appState.get('paperPreset') || 'photo_4r';
    if (window.openCustomPaperModal) window.openCustomPaperModal(currentPaper);
  });
}
