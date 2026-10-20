import { appState } from '../../core/state.js';
import { removeImageBackground } from '../../processors/bg-remover.js';
import { tryServerSideEnhance } from '../../processors/bg/server-cloud-invoker.js';
import { toastService } from '../toast-service.js';
import { t } from '../../config/i18n.js';
import { updateBgEngineSelectorUI } from './engine-meta.js';
import { getSavedBackdropColors, renderSavedBackdropSwatches } from './sidebar-palette-manager.js';

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
        const activeEngine = appState.get('selectedBgEngine') || 'nl_studio_ai';
        const segmented = await removeImageBackground(orig, { engine: activeEngine, tolerance });
        if (segmented) {
          appState.set('segmentedImage', segmented);
          appState.set('isBackgroundRemoved', true, true);
          const firstColor = getSavedBackdropColors()[0] || appState.get('backgroundColor') || '#38bdf8';
          appState.set('backgroundColor', firstColor, true);
          const customColor = document.getElementById('customBgColor');
          if (customColor) customColor.value = firstColor;
          renderSavedBackdropSwatches(triggerRedraw);
          triggerRedraw();
        }
      } catch (err) {
        toastService.show((t('msg_bg_error') || 'Background removal failed: ') + err.message, 'error');
      } finally {
        bgRemoveBtn.disabled = false;
        updateBgEngineSelectorUI();
      }
    });
  }

  const btnAiEnhance = document.getElementById('btnAiEnhance');
  if (btnAiEnhance) {
    btnAiEnhance.addEventListener('click', async () => {
      const orig = appState.get('originalImage');
      const isBn = appState.get('lang') === 'bn';
      if (!orig) {
        toastService.show(isBn ? 'দয়া করে প্রথমে একটি ছবি আপলোড করুন।' : 'Please upload a photo first.', 'warning');
        return;
      }
      btnAiEnhance.disabled = true;
      btnAiEnhance.innerHTML = `<span class="spinner-inline"></span> <span>${isBn ? 'এনহ্যান্স হচ্ছে...' : 'Enhancing...'}</span>`;
      toastService.show(isBn ? '✨ Cloudinary AI দিয়ে ছবির শার্পনেস ও কোয়ালিটি বাড়ানো হচ্ছে...' : '✨ Enhancing sharpness & quality with Cloudinary AI...', 'info');

      try {
        const result = await tryServerSideEnhance(orig);
        if (result?.success && result.image) {
          appState.set('originalImage', result.image);
          if (appState.get('isBackgroundRemoved') && appState.get('segmentedImage')) {
            try {
              const segRes = await tryServerSideEnhance(appState.get('segmentedImage'));
              if (segRes?.success && segRes.image) {
                appState.set('segmentedImage', segRes.image);
              }
            } catch (_) {}
          }
          appState.recordHistorySnapshot();
          triggerRedraw();
          toastService.show(isBn ? '✨ ছবি সফলভাবে AI এনহ্যান্স করা হয়েছে (HD Quality)!' : '✨ Image successfully enhanced via Cloudinary AI (HD Quality)!', 'success');
        } else {
          toastService.show(result?.error || (isBn ? 'AI Enhance ব্যর্থ হয়েছে।' : 'AI Enhance failed.'), 'warning');
        }
      } catch (err) {
        toastService.show((isBn ? 'AI Enhance ত্রুটি: ' : 'AI Enhance error: ') + err.message, 'error');
      } finally {
        btnAiEnhance.disabled = false;
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
