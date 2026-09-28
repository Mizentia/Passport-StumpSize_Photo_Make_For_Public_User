import { appState } from '../core/state.js';
import { calculateAutoFitTransform } from '../processors/face-detector.js';
import { getTargetDimensions } from '../core/canvas-engine.js';
import { toastService } from './toast-service.js';
import { t } from '../config/i18n.js';
import { updateFilterSliderValues } from './editor-filter-ui.js';
import { updateAttireUIFromState } from './editor-attire-ui.js';
import { updateDimensionDisplay } from './editor-dimension-ui.js';
import { updateBackdropUIFromState } from './editor-sidebar-ui.js';
import { setupGlobalHotkeys } from './editor-hotkeys.js';

export function setupEditorTransforms(triggerRedraw) {
  document.getElementById('btnAutoFit')?.addEventListener('click', () => {
    const img = appState.get('originalImage');
    if (!img) return;
    const { width, height } = getTargetDimensions();
    const fit = calculateAutoFitTransform(img, width, height);
    appState.update({ zoom: fit.zoom, cropOffset: fit.cropOffset }, true);
    triggerRedraw();
    toastService.show(t('msg_auto_fit_done'), 'success');
  });

  const zoomIn = () => {
    appState.set('zoom', Math.min(4.5, Math.round(((appState.get('zoom') || 1) + 0.1) * 100) / 100), true);
    triggerRedraw();
  };
  const zoomOut = () => {
    appState.set('zoom', Math.max(0.2, Math.round(((appState.get('zoom') || 1) - 0.1) * 100) / 100), true);
    triggerRedraw();
  };
  const zoomFit = () => {
    appState.update({ zoom: 1.0, cropOffset: { x: 0, y: 0 } }, true);
    triggerRedraw();
  };
  const rotate = () => {
    appState.set('rotation', (appState.get('rotation') + 90) % 360, true);
    triggerRedraw();
  };
  const flipH = () => {
    appState.set('flipH', !appState.get('flipH'), true);
    triggerRedraw();
  };
  const flipV = () => {
    appState.set('flipV', !appState.get('flipV'), true);
    triggerRedraw();
  };

  document.getElementById('btnZoomIn')?.addEventListener('click', zoomIn);
  document.getElementById('btnZoomOut')?.addEventListener('click', zoomOut);
  document.getElementById('btnZoomFit')?.addEventListener('click', zoomFit);
  document.getElementById('btnRotateRight')?.addEventListener('click', rotate);
  document.getElementById('btnFlipH')?.addEventListener('click', flipH);
  document.getElementById('btnFlipV')?.addEventListener('click', flipV);

  let guideMode = 1;
  const toggleGuides = () => {
    guideMode = (guideMode + 1) % 3;
    const bioOverlay = document.getElementById('cropGuides');
    const gridOverlay = document.getElementById('cropGrid');
    if (bioOverlay) bioOverlay.style.display = guideMode === 1 ? 'flex' : 'none';
    if (gridOverlay) gridOverlay.style.display = guideMode === 2 ? 'grid' : 'none';
  };
  document.getElementById('btnToggleGuides')?.addEventListener('click', toggleGuides);

  const handleUndo = () => { if (appState.undo()) { updateUIFromState(); triggerRedraw(); toastService.show(t('msg_undone'), 'info'); } };
  const handleRedo = () => { if (appState.redo()) { updateUIFromState(); triggerRedraw(); toastService.show(t('msg_redone'), 'info'); } };
  document.getElementById('btnUndo')?.addEventListener('click', handleUndo);
  document.getElementById('btnRedo')?.addEventListener('click', handleRedo);
  document.getElementById('btnResetAll')?.addEventListener('click', () => {
    appState.resetAllAdjustments();
    updateUIFromState();
    triggerRedraw();
    toastService.show(t('msg_all_reset'), 'info');
  });

  setupGlobalHotkeys({
    onUndo: handleUndo, onRedo: handleRedo,
    onZoomIn: zoomIn, onZoomOut: zoomOut, onZoomFit: zoomFit,
    onRotate: rotate, onFlipH: flipH, onFlipV: flipV, onToggleGuides: toggleGuides
  });
}

export function updateUIFromState() {
  updateFilterSliderValues(appState.get('filters') || {});
  updateAttireUIFromState();
  updateBackdropUIFromState();
  const preset = appState.get('selectedPreset');
  document.querySelectorAll('.preset-btn').forEach(b => b.classList.toggle('active', b.dataset.preset === preset));
  updateDimensionDisplay();
}
