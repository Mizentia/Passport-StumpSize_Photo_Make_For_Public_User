import { appState } from '../../core/state.js';
import { toastService } from '../toast-service.js';
import { photoPresetStore } from '../../core/photo-preset-store.js';
import { openCustomSizeModal } from '../editor-dimension-ui.js';

let isToolbarBound = false;

export function bindPresetToolbarControls(onRedraw) {
  const sortMode = photoPresetStore.getSortMode();
  const isBn = appState.get('lang') === 'bn';
  const chkManualSort = document.getElementById('chkManualPresetSort');
  const badgeSortState = document.getElementById('badgeSortState');

  if (chkManualSort) chkManualSort.checked = (sortMode === 'manual');
  if (badgeSortState) {
    badgeSortState.textContent = sortMode === 'manual' ? (isBn ? '📌 ম্যানুয়াল ক্রম' : '📌 Manual Order') : (isBn ? '⚡ সাম্প্রতিক উপরে' : '⚡ Recent on Top');
    badgeSortState.style.color = sortMode === 'manual' ? '#a855f7' : '#10b981';
  }

  if (!isToolbarBound) {
    isToolbarBound = true;
    document.getElementById('btnTogglePresetSettings')?.addEventListener('click', () => {
      const drawer = document.getElementById('presetManageDrawer');
      const btn = document.getElementById('btnTogglePresetSettings');
      const grid = document.getElementById('photoPresetGrid');
      if (drawer) {
        const isHidden = drawer.style.display === 'none' || !drawer.style.display;
        drawer.style.display = isHidden ? 'flex' : 'none';
        btn?.classList.toggle('active', isHidden);
        grid?.classList.toggle('manage-mode-active', isHidden);
      }
    });
    document.getElementById('btnAddPhotoPresetHeader')?.addEventListener('click', () => openCustomSizeModal(null));
    chkManualSort?.addEventListener('change', (e) => {
      const mode = e.target.checked ? 'manual' : 'recent';
      const isBnMode = appState.get('lang') === 'bn';
      photoPresetStore.setSortMode(mode);
      const msg = mode === 'manual' ? (isBnMode ? '📌 ম্যানুয়াল ক্রম সক্রিয়' : '📌 Manual order activated') : (isBnMode ? '⚡ সাম্প্রতিক মোড সক্রিয়' : '⚡ Recent mode activated');
      toastService.show(msg, 'info');
    });
    document.getElementById('btnResetAllPresets')?.addEventListener('click', () => {
      const isBnConfirm = appState.get('lang') === 'bn';
      const promptText = isBnConfirm ? 'সব ছবির প্রিসেট কি ডিফল্ট অবস্থায় ফিরিয়ে নিতে চান?' : 'Reset all presets to factory defaults?';
      if (confirm(promptText)) {
        photoPresetStore.resetToDefaults();
        appState.set('selectedPreset', 'bd_passport', true);
        if (onRedraw) onRedraw();
        toastService.show(isBnConfirm ? 'প্রিসেট রিসেট হয়েছে ↺' : 'Presets reset ↺', 'success');
      }
    });
  }
}
