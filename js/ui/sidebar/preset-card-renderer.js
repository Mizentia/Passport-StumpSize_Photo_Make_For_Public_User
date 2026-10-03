import { appState } from '../../core/state.js';
import { t, toBengaliNumeral } from '../../config/i18n.js';
import { toastService } from '../toast-service.js';
import { photoPresetStore } from '../../core/photo-preset-store.js';
import { openCustomSizeModal, updateDimensionDisplay } from '../editor-dimension-ui.js';

export function createPresetCard(preset, index, total, sortMode, currentSelected, onRedraw, renderAll) {
  const isBn = appState.get('lang') === 'bn';
  const btn = document.createElement('div');
  btn.className = `preset-btn ${currentSelected === preset.id ? 'active' : ''} ${preset.isBuiltin ? '' : 'preset-btn-custom-saved'}`;
  btn.dataset.preset = preset.id;

  const displayName = (preset.isBuiltin && !preset.isCustomized) ? (t(`preset_${preset.id}`) || preset.name) : preset.name;
  const wMmStr = isBn ? toBengaliNumeral(Math.round(preset.widthMm * 10) / 10) : (Math.round(preset.widthMm * 10) / 10);
  const hMmStr = isBn ? toBengaliNumeral(Math.round(preset.heightMm * 10) / 10) : (Math.round(preset.heightMm * 10) / 10);
  const wInStr = isBn ? toBengaliNumeral(Math.round((preset.widthMm / 25.4) * 100) / 100) : (Math.round((preset.widthMm / 25.4) * 100) / 100);
  const hInStr = isBn ? toBengaliNumeral(Math.round((preset.heightMm / 25.4) * 100) / 100) : (Math.round((preset.heightMm / 25.4) * 100) / 100);
  const dpiStr = isBn ? toBengaliNumeral(preset.dpi || 300) : (preset.dpi || 300);
  const mmUnit = isBn ? 'মিমি' : 'mm';

  const reorderHtml = (sortMode === 'manual') ? `
    <div class="preset-card-reorder-group" style="display: flex; gap: 2px;">
      <button class="btn-preset-mini-action btn-move-up" ${index === 0 ? 'disabled style="opacity:0.3;"' : ''} data-action="move-up">▲</button>
      <button class="btn-preset-mini-action btn-move-down" ${index === total - 1 ? 'disabled style="opacity:0.3;"' : ''} data-action="move-down">▼</button>
    </div>` : '';

  const badgeStar = (!preset.isBuiltin || preset.isCustomized) ? '⭐ ' : '';
  btn.innerHTML = `
    <div class="preset-card-header-row">
      <span class="preset-name-text">${badgeStar}${displayName}</span>
      <div class="preset-card-actions">
        ${reorderHtml}
        <button class="btn-preset-mini-action btn-edit-preset" data-action="edit">✏️</button>
        <button class="btn-preset-mini-action btn-del-preset" data-action="delete">✕</button>
      </div>
    </div>
    <div class="preset-card-sub-row">
      <small class="preset-dim-subtext">${wMmStr}x${hMmStr} ${mmUnit} (${wInStr}x${hInStr}")</small>
      <span class="preset-dpi-badge">${dpiStr} DPI</span>
    </div>`;

  btn.addEventListener('click', (e) => {
    const act = e.target.closest('[data-action]')?.dataset?.action;
    if (act === 'edit') { e.stopPropagation(); openCustomSizeModal(preset); return; }
    if (act === 'delete') {
      e.stopPropagation();
      const isBnDel = appState.get('lang') === 'bn';
      const confirmMsg = isBnDel ? `'${displayName}' প্রিসেটটি কি মুছে ফেলতে চান?` : `Delete preset '${displayName}'?`;
      if (confirm(confirmMsg)) {
        photoPresetStore.deletePreset(preset.id);
        if (appState.get('selectedPreset') === preset.id) appState.set('selectedPreset', 'bd_passport', true);
        renderAll(); if (onRedraw) onRedraw();
      }
      return;
    }
    if (act === 'move-up') { e.stopPropagation(); photoPresetStore.movePreset(preset.id, 'up'); return; }
    if (act === 'move-down') { e.stopPropagation(); photoPresetStore.movePreset(preset.id, 'down'); return; }

    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (preset.dpi) appState.set('dpi', preset.dpi, false);
    appState.set('customSize', { widthMm: preset.widthMm, heightMm: preset.heightMm, exactPixels: preset.exactPixels ? { ...preset.exactPixels } : null, unit: preset.unit || 'mm' }, false);
    appState.set('selectedPreset', preset.id, true);
    if (sortMode === 'recent') photoPresetStore.recordUsage(preset.id);
    if (onRedraw) onRedraw();
    updateDimensionDisplay();
  });

  return btn;
}
