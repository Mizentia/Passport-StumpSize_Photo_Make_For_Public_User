import { appState } from '../core/state.js';
import { drawBorder, drawCutMarks, drawSmartCutMarksForPlacedPhotos } from './drawer/cut-marks-drawer.js';
import { drawStudioFooter, drawProofWatermark, calculateSheetGridInfo } from './drawer/sheet-decorations.js';
import { buildPhotoCanvasList } from './drawer/photo-canvas-builder.js';
import { packPhotosOntoPages } from './drawer/sheet-packer.js';

export {
  drawBorder, drawCutMarks, drawSmartCutMarksForPlacedPhotos,
  drawStudioFooter, drawProofWatermark, calculateSheetGridInfo, buildPhotoCanvasList,
  packPhotosOntoPages
};

export function renderPageWithPlacedPhotos(ctx, sheetW, sheetH, margin, gap, placedPhotos, includeBorder, includeCutMarks) {
  if (!placedPhotos || placedPhotos.length === 0) return;

  // 1. Draw each photo canvas
  placedPhotos.forEach((p) => {
    if (p.canvas) {
      ctx.drawImage(p.canvas, p.x, p.y, p.w, p.h);
      if (includeBorder) {
        drawBorder(ctx, p.x, p.y, p.w, p.h);
      }
    }
  });

  // 2. Draw cut marks
  if (includeCutMarks) {
    drawSmartCutMarksForPlacedPhotos(ctx, placedPhotos, gap);
  }
}
