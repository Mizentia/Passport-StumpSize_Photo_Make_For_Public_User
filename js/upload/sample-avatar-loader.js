import { toastService } from '../ui/toast-service.js';
import { SAMPLE_AVATARS } from '../config/sample-assets.js';
import { t } from '../config/i18n.js';

export function setupSampleAvatars(onImageLoaded) {
  // Preload real sample photos in background for instant click responsiveness
  SAMPLE_AVATARS.forEach((sample) => {
    if (sample.url) {
      const p = new Image();
      p.src = sample.url;
    }
  });

  document.querySelectorAll('.sample-chip').forEach((chip) => {
    chip.addEventListener('click', (e) => {
      e.stopPropagation();
      if (chip.classList.contains('is-loading')) return;

      const index = parseInt(chip.getAttribute('data-sample-index') || '0', 10);
      const sample = SAMPLE_AVATARS[index] || SAMPLE_AVATARS[0];
      if (!sample || !sample.url) return;

      chip.classList.add('is-loading');
      toastService.show(t('msg_loading_sample'), 'info');

      const img = new Image();
      if (sample.url.startsWith('http://') || sample.url.startsWith('https://')) {
        img.crossOrigin = 'Anonymous';
      }

      const finishLoad = () => {
        chip.classList.remove('is-loading');
        onImageLoaded(img, false);
      };

      img.onload = finishLoad;
      img.onerror = () => {
        chip.classList.remove('is-loading');
        toastService.show(t('msg_invalid_image') || 'Failed to load sample image', 'error');
      };

      img.src = sample.url;
      if (img.complete && img.naturalWidth > 0) {
        finishLoad();
      }
    });
  });
}
