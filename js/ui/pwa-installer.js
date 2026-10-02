import { toastService } from './toast-service.js';
import { appState } from '../core/state.js';
import { t } from '../config/i18n.js';

export function setupPwaInstaller() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(err => console.warn('SW error:', err));
  }

  let deferredPrompt = null;
  const btnInstall = document.getElementById('btnInstallApp');
  const installText = document.getElementById('installBtnText');

  function updateInstallButtonText() {
    if (!installText) return;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      (typeof window !== 'undefined' && window.innerWidth <= 768 && ('ontouchstart' in window));
    const isBn = appState.get('lang') === 'bn';
    if (isMobile) {
      installText.textContent = isBn ? 'মোবাইল অ্যাপ' : 'Mobile App';
    } else {
      installText.textContent = isBn ? 'অ্যাপ ইনস্টল' : 'Install App';
    }
  }

  updateInstallButtonText();
  appState.on('lang', updateInstallButtonText);
  window.addEventListener('resize', updateInstallButtonText);

  if (btnInstall) btnInstall.style.display = 'inline-flex';

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (btnInstall) btnInstall.style.display = 'inline-flex';
  });

  btnInstall?.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') toastService.show('Passport Photo App installed! 🚀', 'success');
      deferredPrompt = null;
    } else {
      const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
      toastService.show(isMobile ? 'To install, tap Share / Menu and select "Add to Home Screen"' : 'To install, click the install icon in your browser address bar', 'info');
    }
  });
}
