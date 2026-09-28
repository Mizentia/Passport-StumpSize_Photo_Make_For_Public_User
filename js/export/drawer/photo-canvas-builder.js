import { getTargetDimensions, renderPhotoToCanvas } from '../../core/canvas-engine.js';
import { appState } from '../../core/state.js';
import { batchManager } from '../../core/batch-manager.js';

export function buildPhotoCanvasList(photoCanvas, totalRequestedCopies) {
  const batchItems = batchManager.getAll();
  const photoList = [];

  if (batchItems.length >= 1) {
    batchItems.forEach((item) => {
      const c = document.createElement('canvas');
      const itemState = {
        ...appState.state,
        originalImage: item.originalImage || appState.get('originalImage'),
        segmentedImage: item.segmentedImage,
        isBackgroundRemoved: item.isBackgroundRemoved ?? appState.get('isBackgroundRemoved'),
        backgroundColor: item.backgroundColor || appState.get('backgroundColor') || '#ffffff',
        cropOffset: item.cropOffset || appState.get('cropOffset'),
        zoom: item.zoom || appState.get('zoom') || 1,
        filters: item.filters || appState.get('filters'),
        selectedSuit: item.selectedSuit || appState.get('selectedSuit') || 'none',
        suitScale: item.suitScale ?? appState.get('suitScale') ?? 1.0,
        suitOffsetX: item.suitOffsetX ?? appState.get('suitOffsetX') ?? 0,
        suitOffsetY: item.suitOffsetY ?? appState.get('suitOffsetY') ?? 0,
        suitCollarWidth: item.suitCollarWidth ?? appState.get('suitCollarWidth') ?? 1.0,
        suitRotation: item.suitRotation ?? appState.get('suitRotation') ?? 0,
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
