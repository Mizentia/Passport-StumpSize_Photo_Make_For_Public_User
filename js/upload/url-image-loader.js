import { toastService } from '../ui/toast-service.js';
import { t } from '../config/i18n.js';

export async function processImageUrl(rawUrl, isPasted, onImageLoaded, urlContainer, inputImageUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return;
  const cleanUrl = rawUrl.trim();
  if (!cleanUrl) return;

  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://') && !cleanUrl.startsWith('data:image/')) {
    toastService.show(t('msg_url_invalid'), 'warning');
    return;
  }

  toastService.show(t('msg_url_loading'), 'info');

  const tryLoadDirect = () => new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = cleanUrl;
  });

  const tryFetchBlob = async () => {
    const res = await fetch(cleanUrl, { mode: 'cors' });
    if (!res.ok) throw new Error('Fetch failed');
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objUrl = URL.createObjectURL(blob);
      img.onload = () => { URL.revokeObjectURL(objUrl); resolve(img); };
      img.onerror = reject;
      img.src = objUrl;
    });
  };

  const tryFetchProxy = async () => {
    if (cleanUrl.startsWith('data:image/')) throw new Error('Cannot proxy data URI');
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(cleanUrl)}`;
    const res = await fetch(proxyUrl);
    if (!res.ok) throw new Error('Proxy fetch failed');
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objUrl = URL.createObjectURL(blob);
      img.onload = () => { URL.revokeObjectURL(objUrl); resolve(img); };
      img.onerror = reject;
      img.src = objUrl;
    });
  };

  const onSuccess = (img) => {
    onImageLoaded(img, isPasted);
    if (urlContainer) urlContainer.style.display = 'none';
    if (inputImageUrl) inputImageUrl.value = '';
  };

  try {
    const img = await tryLoadDirect();
    onSuccess(img);
  } catch (e1) {
    try {
      const img = await tryFetchBlob();
      onSuccess(img);
    } catch (e2) {
      try {
        const img = await tryFetchProxy();
        onSuccess(img);
      } catch (e3) {
        toastService.show(t('msg_url_error'), 'error');
      }
    }
  }
}
