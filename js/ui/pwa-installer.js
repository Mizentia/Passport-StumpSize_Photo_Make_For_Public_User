import { appState } from '../core/state.js';

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
    installText.textContent = isMobile ? (isBn ? 'মোবাইল অ্যাপ' : 'Mobile App') : (isBn ? 'অ্যাপ ইনস্টল' : 'Install App');
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

  function showInstallGuide() {
    const isBn = appState.get('lang') === 'bn';
    const logo = localStorage.getItem('public_project_logo') || 'icons/icon-192.png';
    const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
    let modal = document.getElementById('pwaInstallGuideModal');
    if (modal) modal.remove();

    modal = document.createElement('div');
    modal.id = 'pwaInstallGuideModal';
    modal.className = 'modal-backdrop active';
    modal.style.zIndex = '999999';
    modal.innerHTML = `
      <div class="modal-card" style="max-width: 360px; text-align: center; padding: 24px;">
        <div style="display: flex; justify-content: center; margin-bottom: 14px;">
          <img src="${logo}" alt="App Logo" style="width: 72px; height: 72px; border-radius: 18px; box-shadow: 0 4px 16px rgba(59,130,246,0.35); object-fit: contain; background: #0f172a; padding: 4px; border: 1px solid var(--accent-primary);" />
        </div>
        <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--text-main); margin-bottom: 6px;">Passport Photo Maker</h3>
        <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 16px;">
          ${isMobile 
            ? (isBn ? 'মোবাইলে ইনস্টল করতে ব্রাউজার মেন্যু (⋮ বা শেয়ার) থেকে "Add to Home Screen" বা "Install App" চাপুন।' : 'To install on mobile, tap browser menu (⋮ or Share) and select "Add to Home Screen".')
            : (isBn ? 'কম্পিউটারে ইনস্টল করতে ব্রাউজারের অ্যাড্রেস বারের ডানপাশে থাকা ইনস্টল বাটনে (⊕) ক্লিক করুন।' : 'To install on desktop, click the Install icon (⊕) in the browser address bar.')}
        </p>
        <button class="btn-primary" style="width: 100%; justify-content: center;" id="btnCloseInstallGuide">
          ${isBn ? 'ঠিক আছে' : 'Got it'}
        </button>
      </div>`;
    document.body.appendChild(modal);
    modal.querySelector('#btnCloseInstallGuide')?.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  }

  btnInstall?.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
    } else {
      showInstallGuide();
    }
  });
}
