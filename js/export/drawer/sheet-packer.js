import { appState } from '../../core/state.js';

export function packPhotosOntoPages(photoList, sheetW, sheetH, margin, gap) {
  if (!photoList || photoList.length === 0) return [];

  const globalSpaceSharing = appState.get('allowRowSpaceSharing') !== false;
  const pages = [];
  let currentPagePhotos = [];

  let curX = margin;
  let curY = margin;
  let rowMaxH = 0;
  let lastPhotoName = null;

  for (let i = 0; i < photoList.length; i++) {
    const photo = photoList[i];
    const w = photo.pW;
    const h = photo.pH;

    const isDifferentPhoto = lastPhotoName !== null && lastPhotoName !== photo.name;
    const allowSharing = globalSpaceSharing && photo.allowRowSpaceSharing !== false;

    // If different photo type and sharing is disabled, force wrap to next row
    if (isDifferentPhoto && !allowSharing && curX > margin) {
      curY += rowMaxH + gap;
      curX = margin;
      rowMaxH = 0;
    }

    // Check if fits horizontally in current row
    if (curX + w <= sheetW - margin + 1) {
      // Check if row overflows page height
      if (curY + h > sheetH - margin + 1 && currentPagePhotos.length > 0) {
        pages.push(currentPagePhotos);
        currentPagePhotos = [];
        curX = margin;
        curY = margin;
        rowMaxH = 0;
      }

      currentPagePhotos.push({
        ...photo,
        x: curX,
        y: curY,
        w,
        h
      });

      rowMaxH = Math.max(rowMaxH, h);
      curX += w + gap;
    } else {
      // Advance to next row
      curY += rowMaxH + gap;
      curX = margin;
      rowMaxH = h;

      // Check if new row overflows page height
      if (curY + h > sheetH - margin + 1 && currentPagePhotos.length > 0) {
        pages.push(currentPagePhotos);
        currentPagePhotos = [];
        curX = margin;
        curY = margin;
        rowMaxH = h;
      }

      currentPagePhotos.push({
        ...photo,
        x: curX,
        y: curY,
        w,
        h
      });

      curX += w + gap;
    }

    lastPhotoName = photo.name;
  }

  if (currentPagePhotos.length > 0) {
    pages.push(currentPagePhotos);
  }

  return pages;
}
