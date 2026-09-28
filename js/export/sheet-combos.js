import { mmToPixels } from '../config/photo-presets.js';
import { renderPhotoToCanvas } from '../core/canvas-engine.js';
import { drawBorder, drawCutMarks } from './sheet-drawer.js';

export function render4RCombo4P4S(ctx, sheetW, sheetH, margin, gap, includeBorder, includeCutMarks, dpi = 300) {
  const passCanvas = document.createElement('canvas');
  renderPhotoToCanvas(passCanvas, { presetKey: 'bd_passport' });
  const stampCanvas = document.createElement('canvas');
  renderPhotoToCanvas(stampCanvas, { presetKey: 'bd_stamp' });

  const pW = mmToPixels(40, dpi), pH = mmToPixels(50, dpi), sW = mmToPixels(20, dpi), sH = mmToPixels(25, dpi);
  const totalPassW = 2 * pW + gap;
  const startX = margin + Math.max(0, (sheetW - 2 * margin - totalPassW) / 2);
  const startY = margin + Math.max(0, (sheetH - 2 * margin - (2 * pH + gap + sH + 12)) / 2);

  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 2; c++) {
      const x = startX + c * (pW + gap), y = startY + r * (pH + gap);
      ctx.drawImage(passCanvas, x, y, pW, pH);
      if (includeBorder) drawBorder(ctx, x, y, pW, pH);
      if (includeCutMarks) drawCutMarks(ctx, x, y, pW, pH);
    }
  }

  const stampStartY = startY + 2 * (pH + gap) + 10;
  const totalStampW = 4 * sW + 3 * gap;
  const stampStartX = margin + Math.max(0, (sheetW - 2 * margin - totalStampW) / 2);

  for (let i = 0; i < 4; i++) {
    const x = stampStartX + i * (sW + gap), y = stampStartY;
    ctx.drawImage(stampCanvas, x, y, sW, sH);
    if (includeBorder) drawBorder(ctx, x, y, sW, sH);
    if (includeCutMarks) drawCutMarks(ctx, x, y, sW, sH);
  }
}

export function render4RCombo6P2S(ctx, sheetW, sheetH, margin, gap, includeBorder, includeCutMarks, dpi = 300) {
  const passCanvas = document.createElement('canvas');
  renderPhotoToCanvas(passCanvas, { presetKey: 'bd_passport' });
  const stampCanvas = document.createElement('canvas');
  renderPhotoToCanvas(stampCanvas, { presetKey: 'bd_stamp' });

  const pW = mmToPixels(40, dpi), pH = mmToPixels(50, dpi), sW = mmToPixels(20, dpi), sH = mmToPixels(25, dpi);
  const passTotalW = 3 * pW + 2 * gap, stampTotalW = sW;
  const totalContentW = passTotalW + gap * 2 + stampTotalW;
  const startX = margin + Math.max(0, (sheetW - 2 * margin - totalContentW) / 2);
  const startY = margin + Math.max(0, (sheetH - 2 * margin - (2 * pH + gap)) / 2);

  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 3; c++) {
      const x = startX + c * (pW + gap), y = startY + r * (pH + gap);
      ctx.drawImage(passCanvas, x, y, pW, pH);
      if (includeBorder) drawBorder(ctx, x, y, pW, pH);
      if (includeCutMarks) drawCutMarks(ctx, x, y, pW, pH);
    }
  }

  const stampStartX = startX + passTotalW + gap * 2;
  for (let r = 0; r < 2; r++) {
    const x = stampStartX, y = startY + r * (sH + gap);
    ctx.drawImage(stampCanvas, x, y, sW, sH);
    if (includeBorder) drawBorder(ctx, x, y, sW, sH);
    if (includeCutMarks) drawCutMarks(ctx, x, y, sW, sH);
  }
}
