export function positionFloatingDrawer(drawer, anchorEl) {
  if (!drawer || !anchorEl) return;
  const rect = anchorEl.getBoundingClientRect();
  const drawerRect = drawer.getBoundingClientRect();

  let left = rect.left + rect.width / 2;
  const halfWidth = drawerRect.width / 2;
  const padding = 12;

  if (left - halfWidth < padding) {
    left = halfWidth + padding;
  } else if (left + halfWidth > window.innerWidth - padding) {
    left = window.innerWidth - halfWidth - padding;
  }

  let top = rect.top - drawerRect.height - 10;
  if (top < padding) {
    top = rect.bottom + 10;
    drawer.classList.add('drawer-below');
  } else {
    drawer.classList.remove('drawer-below');
  }

  if (top + drawerRect.height > window.innerHeight - padding) {
    top = Math.max(padding, window.innerHeight - drawerRect.height - padding);
  }

  drawer.style.position = 'fixed';
  drawer.style.left = `${left}px`;
  drawer.style.top = `${top}px`;
  drawer.style.transform = 'translateX(-50%)';
  drawer.style.zIndex = '99999';
}
