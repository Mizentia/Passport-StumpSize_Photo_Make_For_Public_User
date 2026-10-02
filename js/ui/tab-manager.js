import { appState } from '../core/state.js';

export function setupTabManager() {
  const stepButtons = document.querySelectorAll('.step-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const btnNavHistory = document.getElementById('btnNavHistory');
  const btnOpenAbout = document.getElementById('btnOpenAbout');
  const btnOpenSettings = document.getElementById('btnOpenSettings');

  function switchTab(tabId) {
    appState.set('activeTab', tabId);

    // Update step buttons (1. Upload, 2. Editor, 3. Sheet)
    stepButtons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    // Update page action buttons in header nav
    if (btnNavHistory) btnNavHistory.classList.toggle('active', tabId === 'history');
    if (btnOpenAbout) btnOpenAbout.classList.toggle('active', tabId === 'about');
    if (btnOpenSettings) btnOpenSettings.classList.toggle('active', tabId === 'settings');

    // Show only the active page tab, hide all others
    tabContents.forEach((content) => {
      content.classList.toggle('active', content.id === `${tabId}Tab`);
    });

    // Scroll smoothly to top of workspace
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Custom tab switch event for subscribers (e.g. settings form, history refresh)
    window.dispatchEvent(new CustomEvent('app:tabchange', { detail: { tabId } }));
  }

  // Step buttons click
  stepButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      if (tab !== 'upload' && !appState.get('originalImage')) {
        return;
      }
      switchTab(tab);
    });
  });

  // Header Nav Page buttons click
  btnNavHistory?.addEventListener('click', () => switchTab('history'));
  btnOpenAbout?.addEventListener('click', () => switchTab('about'));
  btnOpenSettings?.addEventListener('click', () => switchTab('settings'));

  // Quick Action Buttons inside About Page
  document.getElementById('btnAboutStartPhoto')?.addEventListener('click', () => {
    if (appState.get('originalImage')) {
      switchTab('editor');
    } else {
      switchTab('upload');
    }
  });

  document.getElementById('btnAboutGoSettings')?.addEventListener('click', () => {
    switchTab('settings');
  });

  // Back to Studio from Settings Page
  document.getElementById('btnSettingsBackToStudio')?.addEventListener('click', () => {
    if (appState.get('originalImage')) {
      switchTab('editor');
    } else {
      switchTab('upload');
    }
  });

  // Enable editor and sheet buttons once an image is uploaded
  appState.on('originalImage', (img) => {
    if (img) {
      stepButtons.forEach((btn) => {
        if (btn.dataset.tab === 'editor' || btn.dataset.tab === 'sheet') {
          btn.removeAttribute('disabled');
        }
      });
    }
  });

  return { switchTab };
}
