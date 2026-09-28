import { appState } from '../core/state.js';
import { computeAutoEnhanceSettings } from '../processors/image-filters.js';
import { toastService } from './toast-service.js';
import { t } from '../config/i18n.js';

export const FILTER_LOOKS = {
  natural: { brightness: 100, contrast: 100, saturation: 100, sharpness: 25, smoothing: 0, warmth: 0, exposure: 0 },
  vivid: { brightness: 105, contrast: 114, saturation: 122, sharpness: 45, smoothing: 10, warmth: 2, exposure: 2 },
  warm: { brightness: 102, contrast: 106, saturation: 110, sharpness: 25, smoothing: 15, warmth: 16, exposure: 0 },
  cool: { brightness: 102, contrast: 110, saturation: 95, sharpness: 30, smoothing: 10, warmth: -14, exposure: 0 },
  bw: { brightness: 105, contrast: 125, saturation: 0, sharpness: 35, smoothing: 5, warmth: 0, exposure: 0 }
};

export function setupEditorFilters(triggerRedraw) {
  // Auto Enhance
  document.getElementById('btnAutoEnhance')?.addEventListener('click', () => {
    const img = appState.get('originalImage');
    if (!img) return;
    const enhanced = computeAutoEnhanceSettings(img);
    appState.set('filters', enhanced, true);
    updateFilterSliderValues(enhanced);
    triggerRedraw();
    toastService.show(t('msg_auto_enhanced'), 'success');
  });

  // Filter Sliders with RAF Throttling for buttery smooth 60fps interaction
  let filterRafId = null;
  const scheduleFilterRedraw = () => {
    if (filterRafId) return;
    filterRafId = requestAnimationFrame(() => {
      triggerRedraw();
      filterRafId = null;
    });
  };

  ['brightness', 'contrast', 'saturation', 'sharpness', 'smoothing', 'warmth', 'exposure'].forEach(id => {
    const slider = document.getElementById(`slider_${id}`);
    const valDisplay = document.getElementById(`val_${id}`);
    if (slider) {
      slider.addEventListener('input', (e) => {
        const val = Number(e.target.value);
        if (valDisplay) valDisplay.textContent = val;
        appState.set('filters', { ...appState.get('filters'), [id]: val });
        scheduleFilterRedraw();
      });
      slider.addEventListener('change', () => {
        if (filterRafId) {
          cancelAnimationFrame(filterRafId);
          filterRafId = null;
        }
        triggerRedraw();
        appState.recordHistorySnapshot();
      });
    }
  });

  // Filter Looks
  document.querySelectorAll('.filter-preset-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.filter-preset-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const lookKey = chip.dataset.filter;
      if (FILTER_LOOKS[lookKey]) {
        const filters = { ...FILTER_LOOKS[lookKey] };
        appState.set('filters', filters, true);
        updateFilterSliderValues(filters);
        triggerRedraw();
        toastService.show(t('msg_preset_filter_applied') + (t(`preset_${lookKey}`) || lookKey), 'info');
      }
    });
  });

  document.getElementById('btnResetFilters')?.addEventListener('click', () => {
    const defaultFilters = { ...FILTER_LOOKS.natural };
    appState.set('filters', defaultFilters, true);
    updateFilterSliderValues(defaultFilters);
    document.querySelectorAll('.filter-preset-chip').forEach(c => c.classList.toggle('active', c.dataset.filter === 'natural'));
    triggerRedraw();
    toastService.show(t('msg_all_reset'), 'info');
  });
}

export function updateFilterSliderValues(filters) {
  for (const [key, val] of Object.entries(filters)) {
    const slider = document.getElementById(`slider_${key}`);
    const display = document.getElementById(`val_${key}`);
    if (slider) slider.value = val;
    if (display) display.textContent = val;
  }
}
