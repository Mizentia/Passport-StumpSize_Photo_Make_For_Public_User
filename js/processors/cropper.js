import { appState } from '../core/state.js';
import { isRetouchToolActive } from '../ui/editor-retouch-ui.js';

export function setupCanvasInteractions(canvasElement, onUpdate) {
  let isDragging = false, startX = 0, startY = 0, initialOffset = { x: 0, y: 0 };
  let initialPinchDistance = null, initialPinchZoom = 1;

  const getCanvasScaleRatio = () => {
    const rect = canvasElement.getBoundingClientRect();
    return rect.width === 0 ? 1 : canvasElement.width / rect.width;
  };

  const handlePointerDown = (e) => {
    if (isRetouchToolActive()) return;

    if (e.touches && e.touches.length === 2) {
      if (e.cancelable) e.preventDefault();
      isDragging = false;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      initialPinchDistance = Math.sqrt(dx * dx + dy * dy);
      initialPinchZoom = appState.get('zoom');
      return;
    }
    isDragging = true;
    if (e.cancelable && e.touches) e.preventDefault();
    startX = e.clientX || (e.touches && e.touches[0].clientX);
    startY = e.clientY || (e.touches && e.touches[0].clientY);
    initialOffset = { ...appState.get('cropOffset') };
  };

  const handlePointerMove = (e) => {
    if (isRetouchToolActive()) return;

    if (e.touches && e.touches.length === 2 && initialPinchDistance) {
      if (e.cancelable) e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const scaleDelta = Math.sqrt(dx * dx + dy * dy) / initialPinchDistance;
      appState.set('zoom', Math.round(Math.max(0.2, Math.min(4.5, initialPinchZoom * scaleDelta)) * 100) / 100);
      if (onUpdate) onUpdate();
      return;
    }
    if (!isDragging) return;
    if (e.cancelable && e.touches) e.preventDefault();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    const scale = getCanvasScaleRatio();
    appState.set('cropOffset', {
      x: Math.round(initialOffset.x + (clientX - startX) * scale),
      y: Math.round(initialOffset.y + (clientY - startY) * scale)
    });
    if (onUpdate) onUpdate();
  };

  const handlePointerUp = () => {
    if (isDragging) appState.recordHistorySnapshot();
    isDragging = false;
    initialPinchDistance = null;
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomDelta = e.deltaY > 0 ? -0.05 : 0.05;
    appState.set('zoom', Math.round(Math.max(0.2, Math.min(4.5, appState.get('zoom') + zoomDelta)) * 100) / 100);
    if (onUpdate) onUpdate();
  };

  canvasElement.addEventListener('mousedown', handlePointerDown);
  window.addEventListener('mousemove', handlePointerMove);
  window.addEventListener('mouseup', handlePointerUp);
  canvasElement.addEventListener('touchstart', handlePointerDown, { passive: false });
  window.addEventListener('touchmove', handlePointerMove, { passive: false });
  window.addEventListener('touchend', handlePointerUp);
  canvasElement.addEventListener('wheel', handleWheel, { passive: false });
}
