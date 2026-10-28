import { appState } from '../core/state.js';

export function normalizeAngle(deg) {
  let a = ((Number(deg) || 0) + 180) % 360;
  if (a < 0) a += 360;
  return Math.round((a - 180) * 2) / 2;
}

export function formatAngleText(deg) {
  const val = Math.round((Number(deg) || 0) * 10) / 10;
  return `${val > 0 ? '+' : ''}${val}°`;
}

export function updateRotationUIFromState() {
  const rot = normalizeAngle(appState.get('rotation') || 0);
  const slider = document.getElementById('sliderRotationAngle');
  const valBtn = document.getElementById('btnResetRotation');
  const handleBadge = document.getElementById('canvasRotateBadge');
  if (slider) slider.value = rot;
  if (valBtn) {
    valBtn.textContent = rot === 0 ? '0°' : `${formatAngleText(rot)} ↺`;
    valBtn.classList.toggle('active', rot !== 0);
  }
  if (handleBadge) handleBadge.textContent = `↻ ${formatAngleText(rot)}`;
}

export function setupRotationController(triggerRedraw) {
  const applyRotation = (deg, record = true) => {
    const norm = normalizeAngle(deg);
    appState.set('rotation', norm, record);
    updateRotationUIFromState();
    triggerRedraw();
  };

  document.getElementById('btnRotateLeft')?.addEventListener('click', () => applyRotation((appState.get('rotation') || 0) - 90, true));
  document.getElementById('btnRotateRight')?.addEventListener('click', () => applyRotation((appState.get('rotation') || 0) + 90, true));
  document.getElementById('btnRotateStepLeft')?.addEventListener('click', () => applyRotation((appState.get('rotation') || 0) - 0.5, true));
  document.getElementById('btnRotateStepRight')?.addEventListener('click', () => applyRotation((appState.get('rotation') || 0) + 0.5, true));
  document.getElementById('btnResetRotation')?.addEventListener('click', () => applyRotation(0, true));

  const slider = document.getElementById('sliderRotationAngle');
  if (slider) {
    slider.addEventListener('input', (e) => applyRotation(Number(e.target.value), false));
    slider.addEventListener('change', () => appState.recordHistorySnapshot());
  }

  const handle = document.getElementById('canvasRotateHandle');
  const mainCanvas = document.getElementById('mainCanvas');
  if (!handle || !mainCanvas) return { applyRotation };

  let isRotating = false, startPointerAngle = 0, initialRot = 0, gridWasHidden = false;

  const getPointerAngle = (e) => {
    const rect = mainCanvas.getBoundingClientRect();
    const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
    const px = e.clientX ?? e.touches?.[0]?.clientX ?? cx;
    const py = e.clientY ?? e.touches?.[0]?.clientY ?? cy;
    return Math.atan2(py - cy, px - cx) * (180 / Math.PI);
  };

  const onDown = (e) => {
    e.stopPropagation();
    if (e.cancelable) e.preventDefault();
    isRotating = true;
    handle.classList.add('dragging');
    startPointerAngle = getPointerAngle(e);
    initialRot = Number(appState.get('rotation')) || 0;
    const grid = document.getElementById('cropGrid');
    if (grid && grid.style.display === 'none') { gridWasHidden = true; grid.style.display = 'grid'; }
  };

  const onMove = (e) => {
    if (!isRotating) return;
    if (e.cancelable) e.preventDefault();
    const delta = getPointerAngle(e) - startPointerAngle;
    applyRotation(initialRot + delta, false);
  };

  const onUp = () => {
    if (!isRotating) return;
    isRotating = false;
    handle.classList.remove('dragging');
    if (gridWasHidden) {
      const grid = document.getElementById('cropGrid');
      if (grid) grid.style.display = 'none';
      gridWasHidden = false;
    }
    appState.recordHistorySnapshot();
  };

  handle.addEventListener('mousedown', onDown);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
  handle.addEventListener('touchstart', onDown, { passive: false });
  window.addEventListener('touchmove', onMove, { passive: false });
  window.addEventListener('touchend', onUp);
  handle.addEventListener('dblclick', (e) => { e.stopPropagation(); applyRotation(0, true); });
  return { applyRotation };
}
