import { appState } from '../core/state.js';
import { renderPhotoToCanvas } from '../core/canvas-engine.js';
import { downloadSinglePhoto } from '../export/download-handler.js';
import { updateDimensionDisplay, setupCustomSizeModal } from './editor-dimension-ui.js';
import { setupEditorSidebar } from './editor-sidebar-ui.js';
import { setupEditorFilters } from './editor-filter-ui.js';
import { setupEditorAttire } from './editor-attire-ui.js';
import { setupEditorTransforms } from './editor-transform-ui.js';
import { setupRetouchUI } from './editor-retouch-ui.js';
import { renderSavedPhotoPresetsInSidebar } from './custom-preset-manager.js';
import { setupEditorTabsController } from './editor-tabs-controller.js';
import { historyManager } from '../core/history-manager.js';
import { toastService } from './toast-service.js';
import { t } from '../config/i18n.js';

export function setupEditorUI(canvasElement) {
  const triggerRedraw = () => {
    renderPhotoToCanvas(canvasElement);
    updateDimensionDisplay();
  };

  setupEditorSidebar(triggerRedraw);
  setupEditorFilters(triggerRedraw);
  setupEditorAttire(triggerRedraw);
  setupEditorTransforms(triggerRedraw);
  setupRetouchUI(canvasElement, triggerRedraw);
  setupCustomSizeModal(triggerRedraw);
  renderSavedPhotoPresetsInSidebar(triggerRedraw);
  setupEditorTabsController();

  document.getElementById('btnChangePhoto')?.addEventListener('click', () => {
    document.getElementById('fileUploadInput')?.click();
  });
  document.getElementById('btnDownloadSingleJpg')?.addEventListener('click', () => {
    downloadSinglePhoto('image/jpeg');
  });
  document.getElementById('btnDownloadSinglePng')?.addEventListener('click', () => {
    downloadSinglePhoto('image/png');
  });
  document.getElementById('btnSaveProjectToHistory')?.addEventListener('click', async () => {
    const item = await historyManager.saveCompleted();
    if (item) toastService.show(t('msg_history_saved'), 'success');
  });

  appState.on('zoom', updateDimensionDisplay);
  appState.on('selectedPreset', updateDimensionDisplay);
  appState.on('customSize', updateDimensionDisplay);
  appState.on('lang', () => {
    updateDimensionDisplay();
    renderSavedPhotoPresetsInSidebar(triggerRedraw);
  });

  updateDimensionDisplay();
}
