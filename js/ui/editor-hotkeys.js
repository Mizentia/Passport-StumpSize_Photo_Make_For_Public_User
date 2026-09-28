import { appState } from '../core/state.js';

export function matchesShortcut(e, shortcutStr) {
  if (!shortcutStr) return false;
  const parts = shortcutStr.split('+').map(p => p.trim().toLowerCase());
  const hasCtrl = parts.includes('ctrl');
  const hasShift = parts.includes('shift');
  const hasAlt = parts.includes('alt');
  const mainKey = parts.filter(p => !['ctrl', 'shift', 'alt', 'meta'].includes(p))[0];

  const eCtrl = e.ctrlKey || e.metaKey;
  if (hasCtrl !== eCtrl || hasShift !== e.shiftKey || hasAlt !== e.altKey) return false;

  const eKey = e.key.toLowerCase();
  if (mainKey === 'space' && (e.key === ' ' || e.code === 'Space')) return true;
  if (mainKey === '+' && (e.key === '+' || e.key === '=')) return true;
  if (mainKey === '-' && (e.key === '-' || e.key === '_')) return true;
  return mainKey === eKey;
}

export function setupGlobalHotkeys(actions) {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModals = document.querySelectorAll('.modal-backdrop.active');
      if (activeModals.length > 0) {
        e.preventDefault();
        activeModals.forEach(m => m.classList.remove('active'));
        if (document.activeElement && typeof document.activeElement.blur === 'function') {
          document.activeElement.blur();
        }
        return;
      }
    }

    const tag = document.activeElement?.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

    const activeModals = document.querySelectorAll('.modal-backdrop.active');
    if (activeModals.length > 0) return;

    const shortcuts = appState.get('shortcuts') || {};

    // App Navigation & Modal Shortcuts
    if (matchesShortcut(e, shortcuts.openSettings || 'Alt+S')) {
      e.preventDefault(); document.getElementById('btnOpenSettings')?.click();
    } else if (matchesShortcut(e, shortcuts.toggleTheme || 'Alt+T')) {
      e.preventDefault(); document.getElementById('btnToggleTheme')?.click();
    } else if (matchesShortcut(e, shortcuts.toggleLang || 'Alt+L')) {
      e.preventDefault(); document.getElementById('btnToggleLang')?.click();
    } else if (matchesShortcut(e, shortcuts.tabUpload || 'Alt+1')) {
      e.preventDefault(); document.querySelector('.step-btn[data-tab="upload"]')?.click();
    } else if (matchesShortcut(e, shortcuts.tabEditor || 'Alt+2')) {
      e.preventDefault(); document.querySelector('.step-btn[data-tab="editor"]')?.click();
    } else if (matchesShortcut(e, shortcuts.tabSheet || 'Alt+3')) {
      e.preventDefault(); document.querySelector('.step-btn[data-tab="sheet"]')?.click();
    } else if (matchesShortcut(e, shortcuts.tabHistory || 'Alt+4')) {
      e.preventDefault(); document.getElementById('btnNavHistory')?.click();
    } else if (matchesShortcut(e, shortcuts.openWebcam || 'Alt+W')) {
      e.preventDefault(); document.getElementById('btnOpenWebcam')?.click();
    } else if (matchesShortcut(e, shortcuts.chooseFile || 'Alt+O')) {
      e.preventDefault(); document.getElementById('fileUploadInput')?.click();
    } else if (matchesShortcut(e, shortcuts.downloadSingle || 'Ctrl+S')) {
      e.preventDefault(); document.getElementById('btnDownloadSingleJpg')?.click();
    } else if (matchesShortcut(e, shortcuts.downloadPng || 'Ctrl+Shift+S')) {
      e.preventDefault(); document.getElementById('btnDownloadSinglePng')?.click();
    } else if (matchesShortcut(e, shortcuts.downloadSheet || 'Ctrl+P')) {
      e.preventDefault(); document.getElementById('btnDownloadSheetJpg')?.click();
    } else if (matchesShortcut(e, shortcuts.downloadPdf || 'Ctrl+Shift+P')) {
      e.preventDefault(); document.getElementById('btnDownloadSheetPdf')?.click();
    } else if (matchesShortcut(e, shortcuts.printDirect || 'Ctrl+Shift+D')) {
      e.preventDefault(); document.getElementById('btnPrintDirect')?.click();
    }

    // Editor Tab Specific Shortcuts
    if (appState.get('activeTab') === 'editor') {
      if (matchesShortcut(e, shortcuts.undo || 'Ctrl+Z')) { e.preventDefault(); actions.onUndo(); }
      else if (matchesShortcut(e, shortcuts.redo || 'Ctrl+Y')) { e.preventDefault(); actions.onRedo(); }
      else if (matchesShortcut(e, shortcuts.resetAll || 'Alt+R')) { e.preventDefault(); document.getElementById('btnResetAll')?.click(); }
      else if (matchesShortcut(e, shortcuts.resetFilters || 'Alt+F')) { e.preventDefault(); document.getElementById('btnResetFilters')?.click(); }
      else if (matchesShortcut(e, shortcuts.autoFit || 'F')) { e.preventDefault(); document.getElementById('btnAutoFit')?.click(); }
      else if (matchesShortcut(e, shortcuts.autoEnhance || 'E')) { e.preventDefault(); document.getElementById('btnAutoEnhance')?.click(); }
      else if (matchesShortcut(e, shortcuts.removeBg || 'Alt+B')) { e.preventDefault(); document.getElementById('btnRemoveBg')?.click(); }
      else if (matchesShortcut(e, shortcuts.restoreBg || 'Alt+Shift+B')) { e.preventDefault(); document.getElementById('btnRestoreBg')?.click(); }
      else if (matchesShortcut(e, shortcuts.zoomIn || '+')) { e.preventDefault(); actions.onZoomIn(); }
      else if (matchesShortcut(e, shortcuts.zoomOut || '-')) { e.preventDefault(); actions.onZoomOut(); }
      else if (matchesShortcut(e, shortcuts.zoomFit || '0')) { e.preventDefault(); actions.onZoomFit(); }
      else if (matchesShortcut(e, shortcuts.rotate || 'R')) { e.preventDefault(); actions.onRotate(); }
      else if (matchesShortcut(e, shortcuts.flipH || 'H')) { e.preventDefault(); actions.onFlipH(); }
      else if (matchesShortcut(e, shortcuts.flipV || 'V')) { e.preventDefault(); actions.onFlipV(); }
      else if (matchesShortcut(e, shortcuts.guides || 'G')) { e.preventDefault(); actions.onToggleGuides(); }
    }
  });
}
