import { toastService } from '../ui/toast-service.js';
import { SAMPLE_AVATARS } from '../config/sample-assets.js';
import { t } from '../config/i18n.js';

export function setupSampleAvatars(onImageLoaded) {
  document.querySelectorAll('.sample-chip').forEach((chip) => {
    chip.addEventListener('click', (e) => {
      e.stopPropagation();
      const index = parseInt(chip.getAttribute('data-sample-index') || '0', 10);
      const sample = SAMPLE_AVATARS[index] || SAMPLE_AVATARS[0];
      if (!sample) return;

      toastService.show(t('msg_loading_sample'), 'info');

      const loadFallback = () => {
        const fallbackImg = new Image();
        fallbackImg.onload = () => onImageLoaded(fallbackImg, false);
        fallbackImg.src = sample.fallbackDataUrl;
      };

      const img = new Image();
      img.crossOrigin = 'Anonymous';
      
      let timer = setTimeout(() => {
        img.onload = null;
        img.onerror = null;
        loadFallback();
      }, 3500);

      img.onload = () => {
        clearTimeout(timer);
        onImageLoaded(img, false);
      };

      img.onerror = () => {
        clearTimeout(timer);
        loadFallback();
      };

      img.src = sample.url;
    });
  });
}
