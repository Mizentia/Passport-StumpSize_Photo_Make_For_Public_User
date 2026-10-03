import { appState } from '../core/state.js';

export function setupPwaInstaller() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(err => console.warn('SW error:', err));
  }
  let deferredPrompt = null;
  const btnInstall = document.getElementById('btnInstallApp');
  const installText = document.getElementById('installBtnText');

  function updateInstallButtonText() {
    if (!installText || btnInstall?.classList.contains('is-loading')) return;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      (typeof window !== 'undefined' && window.innerWidth <= 768 && ('ontouchstart' in window));
    const isBn = appState.get('lang') === 'bn';
    installText.textContent = isMobile ? (isBn ? 'মোবাইল অ্যাপ' : 'Mobile App') : (isBn ? 'অ্যাপ ইনস্টল' : 'Install App');
  }

  function setButtonLoading(isLoading) {
    if (!btnInstall) return;
    const icon = btnInstall.querySelector('.install-icon');
    const isBn = appState.get('lang') === 'bn';
    if (isLoading) {
      btnInstall.classList.add('is-loading'); btnInstall.setAttribute('disabled', 'true');
      if (icon) icon.innerHTML = '<span class="install-spinner"></span>';
      if (installText) installText.textContent = isBn ? 'প্রস্তুত হচ্ছে...' : 'Preparing...';
    } else {
      btnInstall.classList.remove('is-loading'); btnInstall.removeAttribute('disabled');
      if (icon) icon.textContent = '📲';
      updateInstallButtonText();
    }
  }

  updateInstallButtonText();
  appState.on('lang', updateInstallButtonText);
  window.addEventListener('resize', updateInstallButtonText);
  if (btnInstall) btnInstall.style.display = 'inline-flex';

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); deferredPrompt = e;
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
      <div class="modal-box" style="max-width: 380px; text-align: center; padding: 24px; align-items: center;">
        <div style="display: flex; justify-content: center; margin-bottom: 12px;">
          <img src="${logo}" alt="App Logo" style="width: 68px; height: 68px; border-radius: 16px; box-shadow: 0 4px 16px rgba(59,130,246,0.35); object-fit: contain; background: #0f172a; padding: 4px; border: 1px solid var(--accent-primary);" />
        </div>
        <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--text-main); margin-bottom: 6px;">Passport Photo Maker</h3>
        <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 16px;">
          ${isMobile 
            ? (isBn ? 'মোবাইলে ইনস্টল করতে ব্রাউজার মেন্যু (⋮ বা শেয়ার) থেকে "Add to Home Screen" বা "Install App" চাপুন।' : 'To install on mobile, tap browser menu (⋮ or Share) and select "Add to Home Screen".')
            : (isBn ? 'কম্পিউটারে ইনস্টল করতে ব্রাউজারের অ্যাড্রেস বারের ডানপাশে থাকা ইনস্টল বাটনে (⊕) ক্লিক করুন।' : 'To install on desktop, click the Install icon (⊕) in the browser address bar.')}
        </p>
        <button class="btn-primary" style="width: 100%; justify-content: center;" id="btnCloseInstallGuide">${isBn ? 'ঠিক আছে' : 'Got it'}</button>
      </div>`;
    document.body.appendChild(modal);
    modal.querySelector('#btnCloseInstallGuide')?.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  }

  btnInstall?.addEventListener('click', async () => {
    if (btnInstall.classList.contains('is-loading')) return;
    setButtonLoading(true);
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice && choice.outcome === 'accepted') {
          const isBn = appState.get('lang') === 'bn';
          if (installText) installText.textContent = isBn ? 'ইনস্টল হয়েছে' : 'Installed!';
          const icon = btnInstall.querySelector('.install-icon');
          if (icon) icon.textContent = '✅';
          setTimeout(() => { if (btnInstall) btnInstall.style.display = 'none'; }, 2000);
          deferredPrompt = null;
          return;
        }
        deferredPrompt = null;
      } catch (err) { console.warn('Install error:', err); } finally { setButtonLoading(false); }
    } else {
      setTimeout(() => { setButtonLoading(false); showInstallGuide(); }, 320);
    }
  });
}
