import { appState } from './core/state.js';
import { renderPhotoToCanvas } from './core/canvas-engine.js';
import { updateUIFromState } from './ui/editor-transform-ui.js';
import { batchManager } from './core/batch-manager.js';
import { computeAutoEnhanceSettings } from './processors/image-filters.js';
import { toastService } from './ui/toast-service.js';
import { TRANSLATIONS } from './config/i18n.js';
import { historyManager } from './core/history-manager.js';
import { setFastPassStep } from './ui/fast-pass/fast-pass-manager.js';

export function createPhotoLoadHandler(mainCanvas, tabManager) {
  return function handleLoadedImage(img, isPasted = false) {
    const defaultBg = appState.get('defaultBackdropColor') || '#ffffff';
    const autoEnhance = !!appState.get('autoEnhanceOnUpload');
    const initialFilters = autoEnhance ? computeAutoEnhanceSettings(img) : {
      brightness: 100, contrast: 100, saturation: 100, sharpness: 25, smoothing: 0, warmth: 0, exposure: 0
    };

    appState.set('originalImage', img);
    appState.set('segmentedImage', null);
    appState.set('isBackgroundRemoved', false);
    appState.set('backgroundColor', defaultBg);
    appState.set('cropOffset', { x: 0, y: 0 });
    appState.set('zoom', 1);
    appState.set('filters', initialFilters);
    appState.recordHistorySnapshot();

    batchManager.addPhoto(img);
    renderPhotoToCanvas(mainCanvas);
    updateUIFromState();
    tabManager.switchTab('editor');
    setFastPassStep('center');

    // Auto-record draft in project history
    historyManager.resetCurrentDraftId();
    historyManager.scheduleAutoDraft(800);

    const lang = appState.get('lang') || 'en';
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    toastService.show(isPasted ? dict.msg_photo_pasted : dict.msg_photo_loaded, 'success');
  };
}
