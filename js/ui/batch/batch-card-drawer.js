import { positionFloatingDrawer } from '../drawer-position-helper.js';
import { buildBatchDrawerElement } from './batch-drawer-builder.js';

let activeDrawer = null;
let activeBackdrop = null;
let hideTimer = null;

export function removeActiveDrawer() {
  if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
  if (activeDrawer) { activeDrawer.remove(); activeDrawer = null; }
  if (activeBackdrop) { activeBackdrop.remove(); activeBackdrop = null; }
}

export function attachCardHoverDrawer(card, item, mainCanvas, tabManager) {
  // Desktop Hover
  card.addEventListener('mouseenter', () => {
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
    removeActiveDrawer();
    openBatchDrawer(card, item, mainCanvas, tabManager, false);
  });
  card.addEventListener('mouseleave', (e) => {
    if (activeDrawer && e.relatedTarget && activeDrawer.contains(e.relatedTarget)) return;
    hideTimer = setTimeout(removeActiveDrawer, 220);
  });

  // Mobile Context Menu Prevention
  card.addEventListener('contextmenu', (e) => { e.preventDefault(); e.stopPropagation(); });

  // Mobile Long-Press (Press & Hold)
  let pressTimer = null;
  let startX = 0, startY = 0;

  card.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    card.classList.add('is-pressing');
    pressTimer = setTimeout(() => {
      card.classList.remove('is-pressing');
      card._suppressClickUntil = Date.now() + 500;
      try { navigator.vibrate?.(40); } catch (_) {}
      removeActiveDrawer();
      openBatchDrawer(card, item, mainCanvas, tabManager, true);
    }, 380);
  }, { passive: true });

  const cancelPress = () => {
    if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; }
    card.classList.remove('is-pressing');
  };

  card.addEventListener('touchmove', (e) => {
    if (!pressTimer || !e.touches[0]) return;
    const dx = Math.abs(e.touches[0].clientX - startX);
    const dy = Math.abs(e.touches[0].clientY - startY);
    if (dx > 8 || dy > 8) cancelPress();
  }, { passive: true });

  card.addEventListener('touchend', cancelPress);
  card.addEventListener('touchcancel', cancelPress);
}

function openBatchDrawer(card, item, mainCanvas, tabManager, isModal = false) {
  const drawer = buildBatchDrawerElement(item, mainCanvas, tabManager, removeActiveDrawer);
  activeDrawer = drawer;

  if (isModal) {
    const backdrop = document.createElement('div');
    backdrop.className = 'history-drawer-backdrop active';
    backdrop.addEventListener('click', (e) => { e.stopPropagation(); removeActiveDrawer(); });
    document.body.appendChild(backdrop);
    activeBackdrop = backdrop;
  }

  drawer.addEventListener('mouseenter', () => { if (hideTimer) clearTimeout(hideTimer); });
  drawer.addEventListener('mouseleave', (e) => {
    if (isModal) return;
    if (e.relatedTarget && card.contains(e.relatedTarget)) return;
    hideTimer = setTimeout(removeActiveDrawer, 220);
  });

  document.body.appendChild(drawer);
  positionFloatingDrawer(drawer, card);
}
