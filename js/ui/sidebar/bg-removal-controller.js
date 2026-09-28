import { appState } from '../../core/state.js';
import { removeImageBackground } from '../../processors/bg-remover.js';
import { toastService } from '../toast-service.js';
import { t } from '../../config/i18n.js';
import { updateBgEngineSelectorUI } from './engine-meta.js';

export function setupBgRemovalListeners(triggerRedraw) {
  const bgRemoveBtn = document.getElementById('btnRemoveBg');
  if (bgRemoveBtn) {
    bgRemoveBtn.addEventListener('click', async () => {
      const orig = appState.get('originalImage');
      if (!orig) return;
      bgRemoveBtn.disabled = true;
      const isBn = appState.get('lang') === 'bn';
      bgRemoveBtn.innerHTML = `<span class="spinner-inline"></span> <span>${isBn ? 'প্রসেসিং...' : 'Processing...'}</span>`;
      try {
        const tolerance = Number(document.getElementById('slider_tolerance')?.value) || 45;
        const activeEngine = appState.get('selectedBgEngine') || 'local_ai';
        const segmented = await removeImageBackground(orig, { engine: activeEngine, tolerance });
        appState.set('segmentedImage', segmented);
        appState.set('isBackgroundRemoved', true, true);
        triggerRedraw();
      } catch (err) {
        toastService.show((t('msg_bg_error') || 'Background removal failed: ') + err.message, 'error');
      } finally {
        bgRemoveBtn.disabled = false;
        updateBgEngineSelectorUI();
      }
    });
  }

  document.getElementById('btnRestoreBg')?.addEventListener('click', () => {
    appState.set('segmentedImage', null);
    appState.set('isBackgroundRemoved', false, true);
    triggerRedraw();
    toastService.show(t('msg_bg_restored'), 'info');
  });

  const sliderTolerance = document.getElementById('slider_tolerance');
  const valTolerance = document.getElementById('val_tolerance');
  if (sliderTolerance) {
    sliderTolerance.addEventListener('input', (e) => {
      if (valTolerance) valTolerance.textContent = e.target.value;
      appState.set('bgTolerance', Number(e.target.value));
    });
  }
}
