import { appState } from '../../core/state.js';

const RECENT_COLORS_STORAGE_KEY = 'passport_studio_recent_bg_colors';
const DEFAULT_COLORS = ['#ffffff', '#38bdf8', '#93c5fd', '#1e40af', '#e2e8f0', '#f8fafc', '#dc2626'];

export function getSavedBackdropColors() {
  try {
    const raw = localStorage.getItem(RECENT_COLORS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (_) {}
  return [...DEFAULT_COLORS];
}

export function saveBackdropColor(colorHex) {
  if (!colorHex || typeof colorHex !== 'string') return;
  const col = colorHex.toLowerCase();
  const list = getSavedBackdropColors().filter(c => c.toLowerCase() !== col);
  list.unshift(col);
  if (list.length > 9) list.pop();
  try {
    localStorage.setItem(RECENT_COLORS_STORAGE_KEY, JSON.stringify(list));
  } catch (_) {}
}

export function renderSavedBackdropSwatches(triggerRedraw) {
  const container = document.getElementById('savedBackdropSwatchesContainer');
  if (!container) return;

  const list = getSavedBackdropColors();
  const activeColor = (appState.get('backgroundColor') || '#ffffff').toLowerCase();

  container.innerHTML = '';
  list.forEach(color => {
    const btn = document.createElement('div');
    btn.className = 'swatch-btn';
    if (color.toLowerCase() === activeColor) btn.classList.add('active');
    btn.style.cssText = `background: ${color}; width: 24px; height: 24px; border-radius: 4px; cursor: pointer; border: 1px solid var(--border-subtle); flex-shrink: 0; transition: transform 0.15s ease, border-color 0.15s ease;`;
    btn.dataset.color = color;
    btn.title = color;

    btn.addEventListener('click', () => {
      saveBackdropColor(color);
      appState.set('backgroundColor', color, true);
      const customColor = document.getElementById('customBgColor');
      if (customColor) customColor.value = color;
      const sliderShade = document.getElementById('sliderBackdropShade');
      if (sliderShade) {
        sliderShade.value = 50;
        document.getElementById('valBackdropShade').textContent = '50%';
      }
      renderSavedBackdropSwatches(triggerRedraw);
      triggerRedraw();
    });

    container.appendChild(btn);
  });
}
