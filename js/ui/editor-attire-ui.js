import { appState } from '../core/state.js';

export function setupEditorAttire(triggerRedraw) {
  document.querySelectorAll('.suit-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.suit-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const suitId = item.dataset.suit;
      appState.set('selectedSuit', suitId, true);
      const panel = document.getElementById('suitControlsPanel');
      if (panel) panel.style.display = suitId && suitId !== 'none' ? 'block' : 'none';
      triggerRedraw();
    });
  });

  const bindSlider = (id, prop) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', (e) => {
        appState.set(prop, Number(e.target.value));
        triggerRedraw();
      });
      el.addEventListener('change', () => {
        appState.recordHistorySnapshot();
      });
    }
  };

  bindSlider('slider_suit_scale', 'suitScale');
  bindSlider('slider_suit_pos_x', 'suitOffsetX');
  bindSlider('slider_suit_pos_y', 'suitOffsetY');
  bindSlider('slider_suit_collar', 'suitCollarWidth');
}

export function updateAttireUIFromState() {
  const suitId = appState.get('selectedSuit') || 'none';
  document.querySelectorAll('.suit-item').forEach(i => {
    i.classList.toggle('active', i.dataset.suit === suitId);
  });
  const panel = document.getElementById('suitControlsPanel');
  if (panel) panel.style.display = suitId && suitId !== 'none' ? 'block' : 'none';

  const scaleEl = document.getElementById('slider_suit_scale');
  const posXEl = document.getElementById('slider_suit_pos_x');
  const posYEl = document.getElementById('slider_suit_pos_y');
  const collarEl = document.getElementById('slider_suit_collar');

  if (scaleEl) scaleEl.value = appState.get('suitScale') ?? 1.0;
  if (posXEl) posXEl.value = appState.get('suitOffsetX') ?? 0;
  if (posYEl) posYEl.value = appState.get('suitOffsetY') ?? 0;
  if (collarEl) collarEl.value = appState.get('suitCollarWidth') ?? 1.0;
}
