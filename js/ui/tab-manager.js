import { appState } from '../core/state.js';

export function setupTabManager() {
  const stepButtons = document.querySelectorAll('.step-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const btnNavHistory = document.getElementById('btnNavHistory');

  function switchTab(tabId) {
    appState.set('activeTab', tabId);

    stepButtons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    if (btnNavHistory) {
      btnNavHistory.classList.toggle('active', tabId === 'history');
    }

    tabContents.forEach((content) => {
      content.classList.toggle('active', content.id === `${tabId}Tab`);
    });
  }

  stepButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      if (tab !== 'upload' && !appState.get('originalImage')) {
        return;
      }
      switchTab(tab);
    });
  });

  if (btnNavHistory) {
    btnNavHistory.addEventListener('click', () => {
      switchTab('history');
    });
  }

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
