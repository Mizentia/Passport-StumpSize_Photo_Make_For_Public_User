export function positionFloatingDrawer(drawer, anchorEl) {
  if (!drawer || !anchorEl) return;
  const rect = anchorEl.getBoundingClientRect();
  const drawerRect = drawer.getBoundingClientRect();

  const anchorCenterX = rect.left + rect.width / 2;
  const halfWidth = (drawerRect.width || 240) / 2;
  const padding = 12;

  let left = anchorCenterX;
  if (left - halfWidth < padding) {
    left = halfWidth + padding;
  } else if (left + halfWidth > window.innerWidth - padding) {
    left = window.innerWidth - halfWidth - padding;
  }

  const drawerHeight = drawerRect.height || 120;
  const hasSpaceAbove = rect.top >= (drawerHeight + 20);

  if (hasSpaceAbove) {
    drawer.classList.remove('drawer-below');
    drawer.style.top = 'auto';
    drawer.style.bottom = `${Math.round(window.innerHeight - rect.top + 14)}px`;
  } else {
    drawer.classList.add('drawer-below');
    drawer.style.bottom = 'auto';
    let top = rect.bottom + 14;
    if (top + drawerHeight > window.innerHeight - padding) {
      top = Math.max(padding, window.innerHeight - drawerHeight - padding);
    }
    drawer.style.top = `${Math.round(top)}px`;
  }

  const arrowX = Math.round(anchorCenterX - (left - halfWidth));
  const clampedArrowX = Math.max(18, Math.min((drawerRect.width || 240) - 18, arrowX));
  drawer.style.setProperty('--arrow-x', `${clampedArrowX}px`);

  drawer.style.position = 'fixed';
  drawer.style.left = `${Math.round(left)}px`;
  drawer.style.transform = 'translateX(-50%)';
  drawer.style.zIndex = '99999';
}
