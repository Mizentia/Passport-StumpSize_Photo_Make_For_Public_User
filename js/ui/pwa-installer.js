import { toastService } from './toast-service.js';

export function setupPwaInstaller() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(err => console.warn('SW error:', err));
  }

  let deferredPrompt = null;
  const btnInstall = document.getElementById('btnInstallApp');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (btnInstall) btnInstall.style.display = 'inline-flex';
  });

  btnInstall?.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') toastService.show('Studio App installed! 🚀', 'success');
      deferredPrompt = null;
      btnInstall.style.display = 'none';
    } else {
      toastService.show('To install, use browser address bar icon', 'info');
    }
  });
}
