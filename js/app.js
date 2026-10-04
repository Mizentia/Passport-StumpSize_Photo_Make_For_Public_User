import { appState } from './core/state.js';
import { renderPhotoToCanvas } from './core/canvas-engine.js';
import { setupCanvasInteractions } from './processors/cropper.js';
import { setupTabManager } from './ui/tab-manager.js';
import { setupEditorUI } from './ui/editor-ui.js';
import { setupSheetUI } from './ui/sheet-ui.js';
import { setupHistoryUI } from './ui/history-ui.js';
import { setupWebcamController } from './ui/webcam-controller.js';
import { toastService } from './ui/toast-service.js';
import { setupUploadHandlers } from './app-upload-handler.js';
import { restoreSavedSession } from './core/storage-manager.js';
import { updateUIFromState } from './ui/editor-transform-ui.js';
import { setupSettingsModal } from './ui/settings-modal-ui.js';
import { renderPrintSheet } from './export/sheet-generator.js';
import { batchManager } from './core/batch-manager.js';
import { historyManager } from './core/history-manager.js';
import { setupBatchUI } from './ui/batch-ui.js';
import { setupPwaInstaller } from './ui/pwa-installer.js';
import { createPhotoLoadHandler } from './app-image-loader.js';
import { setupAppCoreListeners } from './app-lifecycle.js';
import { setupAboutModal } from './ui/about-modal-ui.js';
import { setupNavDrawer } from './ui/nav-drawer-ui.js';

function initApp() {
  toastService.init();
  setupAboutModal();
  const mainCanvas = document.getElementById('mainCanvas');
  const sheetCanvas = document.getElementById('sheetCanvas');
  const tabManager = setupTabManager();
  setupNavDrawer(tabManager);

  setupAppCoreListeners();
  const handleLoadedImage = createPhotoLoadHandler(mainCanvas, tabManager);

  setupEditorUI(mainCanvas);
  setupSheetUI(sheetCanvas, mainCanvas);
  setupHistoryUI(tabManager);
  setupCanvasInteractions(mainCanvas, () => renderPhotoToCanvas(mainCanvas));
  setupWebcamController(handleLoadedImage);
  setupUploadHandlers(handleLoadedImage);
  setupBatchUI(mainCanvas, tabManager);

  setupSettingsModal(() => {
    renderPhotoToCanvas(mainCanvas);
    updateUIFromState();
    renderPrintSheet(sheetCanvas, mainCanvas);
  }, tabManager);

  restoreSavedSession().then((restored) => {
    if (restored && restored.originalImage) {
      if (restored.currentDraftId) {
        historyManager.setCurrentDraftId(restored.currentDraftId);
      }
      appState.update(restored, false);
      batchManager.addPhoto(restored.originalImage, 'Restored Photo');
      renderPhotoToCanvas(mainCanvas);
      updateUIFromState();
      tabManager.switchTab(restored.activeTab || 'editor');
    }
  });

  setupPwaInstaller();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initApp);
else initApp();
