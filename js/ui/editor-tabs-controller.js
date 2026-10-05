export function setupEditorTabsController() {
  const btnLeftPresets = document.getElementById('btnLeftTabPresets');
  const btnLeftBackdrop = document.getElementById('btnLeftTabBackdrop');
  const panelPresets = document.getElementById('panelPresets');
  const panelBackdrop = document.getElementById('panelBackdrop');

  function setLeftTab(tab) {
    btnLeftPresets?.classList.toggle('active', tab === 'presets');
    btnLeftBackdrop?.classList.toggle('active', tab === 'backdrop');
    if (panelPresets) panelPresets.style.display = tab === 'presets' ? 'flex' : 'none';
    if (panelBackdrop) panelBackdrop.style.display = tab === 'backdrop' ? 'flex' : 'none';
  }

  btnLeftPresets?.addEventListener('click', () => setLeftTab('presets'));
  btnLeftBackdrop?.addEventListener('click', () => setLeftTab('backdrop'));

  const btnRightRetouch = document.getElementById('btnRightTabRetouch');
  const btnRightAttire = document.getElementById('btnRightTabAttire');
  const panelRetouch = document.getElementById('panelRetouch');
  const panelAttire = document.getElementById('panelAttire');

  function setRightTab(tab) {
    btnRightRetouch?.classList.toggle('active', tab === 'retouch');
    btnRightAttire?.classList.toggle('active', tab === 'attire');
    if (panelRetouch) panelRetouch.style.display = tab === 'retouch' ? 'flex' : 'none';
    if (panelAttire) panelAttire.style.display = tab === 'attire' ? 'flex' : 'none';
  }

  btnRightRetouch?.addEventListener('click', () => setRightTab('retouch'));
  btnRightAttire?.addEventListener('click', () => setRightTab('attire'));

  const mobileDeckButtons = document.querySelectorAll('.mobile-deck-btn');
  mobileDeckButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      mobileDeckButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const deck = btn.dataset.deck;
      const isMobile = window.innerWidth <= 860;
      if (isMobile) {
        if (panelPresets) panelPresets.style.display = deck === 'presets' ? 'flex' : 'none';
        if (panelBackdrop) panelBackdrop.style.display = deck === 'backdrop' ? 'flex' : 'none';
        if (panelRetouch) panelRetouch.style.display = deck === 'retouch' ? 'flex' : 'none';
        if (panelAttire) panelAttire.style.display = deck === 'attire' ? 'flex' : 'none';
      }
    });
  });

  const syncLayout = () => {
    if (window.innerWidth <= 860) {
      const activeBtn = document.querySelector('.mobile-deck-btn.active') || mobileDeckButtons[0];
      const deck = activeBtn?.dataset?.deck || 'presets';
      if (panelPresets) panelPresets.style.display = deck === 'presets' ? 'flex' : 'none';
      if (panelBackdrop) panelBackdrop.style.display = deck === 'backdrop' ? 'flex' : 'none';
      if (panelRetouch) panelRetouch.style.display = deck === 'retouch' ? 'flex' : 'none';
      if (panelAttire) panelAttire.style.display = deck === 'attire' ? 'flex' : 'none';
    } else {
      const activeLeft = btnLeftPresets?.classList.contains('active') ? 'presets' : 'backdrop';
      const activeRight = btnRightRetouch?.classList.contains('active') ? 'retouch' : 'attire';
      setLeftTab(activeLeft);
      setRightTab(activeRight);
    }
  };

  syncLayout();
  window.addEventListener('resize', syncLayout);
}
