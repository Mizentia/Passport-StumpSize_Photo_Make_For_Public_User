import { toastService } from '../ui/toast-service.js';
import { t } from '../config/i18n.js';

export function processImageFile(file, isPasted = false, onImageLoaded) {
  if (!file) return;
  if (!file.type.startsWith('image/') && !file.name?.match(/\.(jpe?g|png|webp|avif|bmp|tiff|svg)$/i)) {
    toastService.show(t('msg_invalid_image'), 'warning');
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => onImageLoaded(img, isPasted);
    img.onerror = () => toastService.show(t('msg_invalid_image'), 'error');
    img.src = e.target.result;
  };
  reader.onerror = () => toastService.show(t('msg_invalid_image'), 'error');
  reader.readAsDataURL(file);
}
