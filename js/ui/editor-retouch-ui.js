import { appState } from '../core/state.js';
import { applySpotHealing, applyRedEyeFix } from '../processors/retouch-engine.js';
import { toastService } from './toast-service.js';
import { mapCanvasClickToImage } from './retouch/canvas-coord-mapper.js';

let activeRetouchTool = 'none';
let brushRadius = 15;

export function setupRetouchUI(mainCanvas, triggerRedraw) {
  const btnSpot = document.getElementById('btnToolSpotHeal');
  const btnRedEye = document.getElementById('btnToolRedEye');
  const sliderSize = document.getElementById('slider_retouch_size');
  const valSize = document.getElementById('val_retouch_size');

  function setActiveTool(tool) {
    activeRetouchTool = tool;
    btnSpot?.classList.toggle('active', tool === 'spot');
    btnRedEye?.classList.toggle('active', tool === 'redeye');
    if (mainCanvas) mainCanvas.style.cursor = tool === 'none' ? 'grab' : 'crosshair';
  }

  btnSpot?.addEventListener('click', () => {
    setActiveTool(activeRetouchTool === 'spot' ? 'none' : 'spot');
    if (activeRetouchTool === 'spot') toastService.show('Spot Healing: Click blemishes to heal', 'info');
  });

  btnRedEye?.addEventListener('click', () => {
    setActiveTool(activeRetouchTool === 'redeye' ? 'none' : 'redeye');
    if (activeRetouchTool === 'redeye') toastService.show('Red-Eye Fix: Click red pupils to correct', 'info');
  });

  sliderSize?.addEventListener('input', (e) => {
    brushRadius = Number(e.target.value);
    if (valSize) valSize.textContent = `${brushRadius}px`;
  });

  mainCanvas?.addEventListener('click', (e) => {
    if (activeRetouchTool === 'none') return;
    const img = appState.get('originalImage');
    if (!img) return;

    const { imgX, imgY, scale, origW, origH } = mapCanvasClickToImage(e, mainCanvas, img, appState.get('cropOffset') || {}, appState.get('zoom') || 1);
    const offscreen = document.createElement('canvas');
    offscreen.width = origW; offscreen.height = origH;
    const octx = offscreen.getContext('2d', { willReadFrequently: true });
    octx.drawImage(img, 0, 0);

    const imgBrushR = Math.max(3, Math.round(brushRadius / scale));
    if (activeRetouchTool === 'spot') applySpotHealing(offscreen, imgX, imgY, imgBrushR);
    else if (activeRetouchTool === 'redeye') applyRedEyeFix(offscreen, imgX, imgY, imgBrushR);

    const updatedImg = new Image();
    updatedImg.onload = () => {
      appState.set('originalImage', updatedImg);
      appState.recordHistorySnapshot();
      triggerRedraw();
      toastService.show('Retouch applied!', 'success');
    };
    updatedImg.src = offscreen.toDataURL('image/png');
  });
}

export function isRetouchToolActive() {
  return activeRetouchTool !== 'none';
}
