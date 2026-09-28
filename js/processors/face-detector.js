import { appState } from '../core/state.js';
import { detectFaceBounds } from './face/skin-bounds.js';

export { detectFaceBounds };

export function calculateAutoFitTransform(imageElement, targetWidth, targetHeight) {
  const origW = imageElement.naturalWidth || imageElement.width || 1;
  const origH = imageElement.naturalHeight || imageElement.height || 1;
  const imgRatio = origW / origH;
  const targetRatio = targetWidth / targetHeight;

  let drawW, drawH;
  if (imgRatio > targetRatio) {
    drawH = targetHeight; drawW = targetHeight * imgRatio;
  } else {
    drawW = targetWidth; drawH = targetWidth / imgRatio;
  }

  const baseScale = drawH / origH;
  const face = detectFaceBounds(imageElement);
  const ratio = (typeof appState !== 'undefined' ? (appState.get('headHeightRatio') || 0.75) : 0.75);
  const desiredHeadH = targetHeight * ratio;
  const actualHeadH = (face.chinY - face.headTopY) * baseScale;
  const zoom = Math.max(0.6, Math.min(3.5, (desiredHeadH / Math.max(1, actualHeadH))));

  const targetEyeY = targetHeight * 0.42;
  const currentEyeY = face.eyeY * baseScale * zoom;
  const offsetY = Math.round((targetEyeY - currentEyeY) / zoom);

  const targetCenterX = targetWidth / 2;
  const currentCenterX = face.centerX * baseScale * zoom;
  const offsetX = Math.round((targetCenterX - currentCenterX) / zoom);

  return { zoom, offsetX, offsetY, face };
}
