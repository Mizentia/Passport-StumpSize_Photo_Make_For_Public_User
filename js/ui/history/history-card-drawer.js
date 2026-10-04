import { positionFloatingDrawer } from '../drawer-position-helper.js';
import { buildHistoryDrawerElement } from './history-drawer-builder.js';

let activeDrawer = null;
let activeBackdrop = null;
let hideTimer = null;

export function removeActiveHistoryDrawer() {
  if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
  if (activeDrawer) { activeDrawer.remove(); activeDrawer = null; }
  if (activeBackdrop) { activeBackdrop.remove(); activeBackdrop = null; }
}

export function attachHistoryCardHoverDrawer(card, record, tabManager) {
  // Desktop Hover
  card.addEventListener('mouseenter', () => {
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
    removeActiveHistoryDrawer();
    openHistoryDrawer(card, record, tabManager, false);
  });
  card.addEventListener('mouseleave', (e) => {
    if (activeDrawer && e.relatedTarget && activeDrawer.contains(e.relatedTarget)) return;
    hideTimer = setTimeout(removeActiveHistoryDrawer, 220);
  });

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
      removeActiveHistoryDrawer();
      openHistoryDrawer(card, record, tabManager, true);
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

function openHistoryDrawer(card, record, tabManager, isModal = false) {
  const drawer = buildHistoryDrawerElement(record, tabManager, removeActiveHistoryDrawer);
  activeDrawer = drawer;

  if (isModal) {
    const backdrop = document.createElement('div');
    backdrop.className = 'history-drawer-backdrop active';
    backdrop.addEventListener('click', (e) => { e.stopPropagation(); removeActiveHistoryDrawer(); });
    document.body.appendChild(backdrop);
    activeBackdrop = backdrop;
  }

  drawer.addEventListener('mouseenter', () => { if (hideTimer) clearTimeout(hideTimer); });
  drawer.addEventListener('mouseleave', (e) => {
    if (isModal) return;
    if (e.relatedTarget && card.contains(e.relatedTarget)) return;
    hideTimer = setTimeout(removeActiveHistoryDrawer, 220);
  });

  document.body.appendChild(drawer);
  positionFloatingDrawer(drawer, card);
}
