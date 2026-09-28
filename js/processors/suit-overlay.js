import { renderRealisticSuit } from '../config/suit-assets.js';
import { appState } from '../core/state.js';

export function drawSuitAttire(ctx, canvasW, canvasH, suitId, customState = null) {
  if (!suitId || suitId === 'none') return;
  const state = customState || appState.state;

  const suitOptions = {
    scale: state.suitScale || 1.0,
    offsetX: state.suitOffsetX || 0,
    offsetY: state.suitOffsetY || 0,
    collarWidth: state.suitCollarWidth || 1.0,
    rotation: state.suitRotation || 0,
    brightness: state.suitBrightness || 100
  };

  renderRealisticSuit(ctx, canvasW, canvasH, suitId, suitOptions);
}
