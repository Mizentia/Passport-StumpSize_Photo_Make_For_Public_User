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
    document.getElementById('btnAddPhotoPresetHeader')?.addEventListener('click', () => openCustomSizeModal(null));
    chkManualSort?.addEventListener('change', (e) => {
      const mode = e.target.checked ? 'manual' : 'recent';
      photoPresetStore.setSortMode(mode);
      toastService.show(mode === 'manual' ? '📌 Manual order activated' : '⚡ Recent mode activated', 'info');
    });
    document.getElementById('btnResetAllPresets')?.addEventListener('click', () => {
      if (confirm('Reset all presets to factory defaults?')) {
        photoPresetStore.resetToDefaults();
        appState.set('selectedPreset', 'bd_passport', true);
        if (onRedraw) onRedraw();
        toastService.show('Presets reset ↺', 'success');
      }
    });
  }
}
