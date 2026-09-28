import { appState } from '../../core/state.js';
import { getTargetDimensions } from '../../core/canvas-engine.js';

export function drawStudioFooter(ctx, sheetW, sheetH, margin) {
  if (!appState.get('enableStudioTag')) return;
  const studioName = appState.get('studioName') || 'Passport & Stamp Studio Pro';
  const phone = appState.get('studioPhone');
  const dpi = appState.get('dpi') || 300;
  const label = phone ? `${studioName} • ${phone} • ${dpi} DPI Lab Print` : `${studioName} • ${dpi} DPI High-Resolution Lab Print`;

  ctx.save();
  const fontSize = Math.max(11, Math.round(sheetW * 0.016));
  ctx.font = `600 ${fontSize}px sans-serif`;
  ctx.fillStyle = '#94a3b8';
  ctx.textAlign = 'center';
  ctx.fillText(label, sheetW / 2, sheetH - Math.max(8, margin / 2));
  ctx.restore();
}

export function drawProofWatermark(ctx, sheetW, sheetH) {
  if (!appState.get('enableWatermark')) return;
  const text = appState.get('watermarkText') || 'SAMPLE PROOF';
  ctx.save();
  ctx.translate(sheetW / 2, sheetH / 2);
  ctx.rotate((-30 * Math.PI) / 180);
  const fontSize = Math.max(28, Math.round(sheetW * 0.075));
  ctx.font = `800 ${fontSize}px sans-serif`;
  ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

export function calculateSheetGridInfo(sheetW, sheetH, margin, gap, overrideDimensions = null) {
  const { width: pW, height: pH } = overrideDimensions || getTargetDimensions();
  const footerSpace = appState.get('enableStudioTag') ? Math.max(24, margin) : 0;
  const availableW = Math.max(1, sheetW - 2 * margin);
  const availableH = Math.max(1, sheetH - 2 * margin - footerSpace);
  const cols = Math.max(1, Math.floor((availableW + gap) / (pW + gap)));
  const rows = Math.max(1, Math.floor((availableH + gap) / (pH + gap)));
  const capacityPerPage = Math.max(1, cols * rows);
  return { pW, pH, cols, rows, capacityPerPage, startX: margin, startY: margin };
}
