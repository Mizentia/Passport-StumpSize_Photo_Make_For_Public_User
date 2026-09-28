import { getDefaultShortcuts } from '../../core/state-defaults.js';
import { t } from '../../config/i18n.js';
import { toastService } from '../toast-service.js';

export function setupShortcutsRebinding(initialShortcuts) {
  let currentShortcuts = { ...initialShortcuts };
  let activeAction = null;

  function renderButtons() {
    document.querySelectorAll('.btn-hotkey-record').forEach(btn => {
      const action = btn.dataset.action;
      if (currentShortcuts[action]) btn.textContent = currentShortcuts[action];
      btn.classList.remove('recording');
    });
  }

  document.querySelectorAll('.btn-hotkey-record').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const action = btn.dataset.action;
      if (activeAction === action) {
        activeAction = null;
        btn.classList.remove('recording');
        btn.textContent = currentShortcuts[action] || '';
        return;
      }
      document.querySelectorAll('.btn-hotkey-record').forEach(b => {
        b.classList.remove('recording');
        const a = b.dataset.action;
        if (currentShortcuts[a]) b.textContent = currentShortcuts[a];
      });
      activeAction = action;
      btn.classList.add('recording');
      btn.textContent = t('shortcut_recording') || 'Press Key...';
    });
  });

  window.addEventListener('keydown', (e) => {
    if (!activeAction) return;

    if (e.key === 'Escape') {
      const recordedBtn = document.querySelector(`.btn-hotkey-record[data-action="${activeAction}"]`);
      if (recordedBtn) {
        recordedBtn.textContent = currentShortcuts[activeAction] || '';
        recordedBtn.classList.remove('recording');
      }
      activeAction = null;
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    if (['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) return;
    e.preventDefault();
    e.stopPropagation();

    const parts = [];
    if (e.ctrlKey || e.metaKey) parts.push('Ctrl');
    if (e.shiftKey) parts.push('Shift');
    if (e.altKey) parts.push('Alt');

    let keyName = e.key.toUpperCase();
    if (e.key === ' ') keyName = 'Space';
    else if (e.key === '+') keyName = '+';
    else if (e.key === '-') keyName = '-';

    if (!parts.includes(keyName)) parts.push(keyName);
    const shortcutStr = parts.join('+');
    currentShortcuts[activeAction] = shortcutStr;

    const recordedBtn = document.querySelector(`.btn-hotkey-record[data-action="${activeAction}"]`);
    if (recordedBtn) {
      recordedBtn.textContent = shortcutStr;
      recordedBtn.classList.remove('recording');
    }
    toastService.show(`${t('shortcut_updated') || 'Shortcut bound to'} ${shortcutStr}`, 'info');
    activeAction = null;
  }, true);

  document.getElementById('btnResetShortcuts')?.addEventListener('click', () => {
    currentShortcuts = getDefaultShortcuts();
    renderButtons();
    toastService.show(t('msg_shortcuts_reset') || 'All hotkeys restored to default.', 'info');
  });

  return {
    getCurrentShortcuts: () => ({ ...currentShortcuts }),
    setShortcuts: (s) => { currentShortcuts = { ...s }; renderButtons(); },
    renderButtons
  };
}
