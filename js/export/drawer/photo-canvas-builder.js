import { getTargetDimensions, renderPhotoToCanvas } from '../../core/canvas-engine.js';
import { appState } from '../../core/state.js';
import { batchManager } from '../../core/batch-manager.js';

export function buildPhotoCanvasList(photoCanvas, totalRequestedCopies) {
  batchManager.saveActiveSnapshot();
  const batchItems = batchManager.getAll();
  const photoList = [];

  if (batchItems.length >= 1) {
    batchItems.forEach((item) => {
      const c = document.createElement('canvas');
      const isActive = item.id === batchManager.activeId;
      const itemState = {
        ...appState.state,
        originalImage: item.originalImage || appState.get('originalImage'),
        segmentedImage: isActive ? (appState.get('segmentedImage') || item.segmentedImage) : (item.segmentedImage || null),
        isBackgroundRemoved: isActive ? !!appState.get('isBackgroundRemoved') : !!item.isBackgroundRemoved,
        backgroundColor: (isActive ? appState.get('backgroundColor') : item.backgroundColor) || '#ffffff',
        cropOffset: isActive ? { ...(appState.get('cropOffset') || { x: 0, y: 0 }) } : (item.cropOffset || { x: 0, y: 0 }),
        zoom: isActive ? (appState.get('zoom') || 1) : (item.zoom || 1),
        rotation: isActive ? (appState.get('rotation') || 0) : (item.rotation || 0),
        flipH: isActive ? !!appState.get('flipH') : !!item.flipH,
        flipV: isActive ? !!appState.get('flipV') : !!item.flipV,
        filters: isActive ? { ...(appState.get('filters') || {}) } : (item.filters || {}),
        selectedSuit: (isActive ? appState.get('selectedSuit') : item.selectedSuit) || 'none',
        suitScale: (isActive ? appState.get('suitScale') : item.suitScale) ?? 1.0,
        suitOffsetX: (isActive ? appState.get('suitOffsetX') : item.suitOffsetX) ?? 0,
        suitOffsetY: (isActive ? appState.get('suitOffsetY') : item.suitOffsetY) ?? 0,
        suitCollarWidth: (isActive ? appState.get('suitCollarWidth') : item.suitCollarWidth) ?? 1.0,
        suitRotation: (isActive ? appState.get('suitRotation') : item.suitRotation) ?? 0,
        selectedPreset: item.selectedPreset || appState.get('selectedPreset'),
        customSize: item.customSize || appState.get('customSize')
      };

      renderPhotoToCanvas(c, { state: itemState });
      const { width: pW, height: pH } = getTargetDimensions(itemState.selectedPreset, itemState);
      const qty = Math.max(1, Number(item.quantityOnSheet) || 1);
      const allowRowSpaceSharing = item.allowRowSpaceSharing !== false;

      for (let i = 0; i < qty; i++) {
        photoList.push({
          canvas: c,
          pW,
          pH,
          name: item.name,
          allowRowSpaceSharing,
          itemIndex: photoList.length
        });
      }
    });
  } else {
    const { width: pW, height: pH } = getTargetDimensions();
    const copies = Math.max(1, totalRequestedCopies || appState.get('sheetCopies') || 6);
    for (let i = 0; i < copies; i++) {
      photoList.push({
        canvas: photoCanvas,
        pW,
        pH,
        name: 'Active Photo',
        allowRowSpaceSharing: true,
        itemIndex: i
      });
    }
  }

  return photoList;
}
