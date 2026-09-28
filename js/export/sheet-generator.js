import { mmToPixels } from '../config/photo-presets.js';
import { appState } from '../core/state.js';
import { getActivePaperConfig } from './paper-config-helper.js';
import {
  drawStudioFooter, drawProofWatermark, buildPhotoCanvasList,
  packPhotosOntoPages, renderPageWithPlacedPhotos
} from './sheet-drawer.js';

export { getActivePaperConfig };

export function renderPrintSheet(primaryCanvas, photoCanvas) {
  if (!primaryCanvas || !photoCanvas) return { pages: [], totalPages: 1 };
  const { paper, marginMm, gapMm } = getActivePaperConfig();
  const dpi = appState.get('dpi') || 300;
  const includeBorder = appState.get('includeBorder') !== false;
  const includeCutMarks = appState.get('includeCutMarks') !== false;

  const sheetW = mmToPixels(paper.widthMm, dpi);
  const sheetH = mmToPixels(paper.heightMm, dpi);
  const margin = mmToPixels(marginMm, dpi);
  const gap = mmToPixels(gapMm, dpi);

  const totalRequestedCopies = Math.max(1, appState.get('sheetCopies') || 6);
  const photoCanvases = buildPhotoCanvasList(photoCanvas, totalRequestedCopies);

  const packedPages = packPhotosOntoPages(photoCanvases, sheetW, sheetH, margin, gap);
  const totalPages = Math.max(1, packedPages.length);
  const pages = [];

  for (let pageIdx = 0; pageIdx < totalPages; pageIdx++) {
    const canvas = pageIdx === 0 ? primaryCanvas : document.createElement('canvas');
    canvas.width = sheetW;
    canvas.height = sheetH;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, sheetW, sheetH);

    const placedPhotos = packedPages[pageIdx] || [];
    renderPageWithPlacedPhotos(ctx, sheetW, sheetH, margin, gap, placedPhotos, includeBorder, includeCutMarks);

    drawStudioFooter(ctx, sheetW, sheetH, margin);
    drawProofWatermark(ctx, sheetW, sheetH);
    pages.push(canvas);
  }

  if (typeof window !== 'undefined') window._renderedSheetPages = pages;
  return {
    pages,
    totalPages,
    capacityPerPage: packedPages[0]?.length || 1,
    totalPhotos: photoCanvases.length
  };
}
