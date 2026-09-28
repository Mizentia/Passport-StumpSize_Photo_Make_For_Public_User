import { appState } from '../../../core/state.js';
import { t } from '../../../config/i18n.js';
import { calculateDimensions } from '../../editor-dimension-ui.js';

export const ALL_TOKENS = [
  { id: 'agency', labelKey: 'token_agency', defaultLabel: '🏢 Agency / Studio' },
  { id: 'preset', labelKey: 'token_preset', defaultLabel: '📏 Preset Name' },
  { id: 'dimensions', labelKey: 'token_dimensions', defaultLabel: '📐 Dimensions' },
  { id: 'dpi', labelKey: 'token_dpi', defaultLabel: '⚡ DPI' },
  { id: 'date', labelKey: 'token_date', defaultLabel: '📅 Date' },
  { id: 'time', labelKey: 'token_time', defaultLabel: '⏰ Time' }
];

export let activeTokensOrder = ['agency', 'preset', 'dimensions', 'dpi', 'date'];

export function setActiveTokensOrder(tokens) {
  if (Array.isArray(tokens)) activeTokensOrder = [...tokens];
}

export function updateNamingPreview() {
  const previewText = document.getElementById('settingNamingPreviewText');
  const inputStudio = document.getElementById('settingStudioNameInput') || document.getElementById('settingNamingStudioNameInput');
  const selectDpi = document.getElementById('settingDpiSelect');
  const inputCustomDpi = document.getElementById('settingCustomDpiInput');
  const selectFormat = document.getElementById('settingFormatSelect');
  const selectSeparator = document.getElementById('settingNamingSeparatorSelect');
  if (!previewText) return;

  const studioVal = inputStudio?.value?.trim() || appState.get('studioName') || 'Passport & Stamp Studio Pro';
  const studioClean = studioVal.replace(/[^a-zA-Z0-9_\u0980-\u09FF-]/g, '-');
  const dpi = selectDpi?.value === 'custom' ? (Number(inputCustomDpi?.value) || 300) : (Number(selectDpi?.value) || 300);
  const format = selectFormat?.value || 'image/jpeg';
  const ext = format === 'image/png' ? 'png' : format === 'image/webp' ? 'webp' : format === 'application/pdf' ? 'pdf' : 'jpg';
  const dateStr = new Date().toISOString().slice(0, 10);
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
  const separator = selectSeparator?.value || '_';

  const presetKey = appState.get('selectedPreset') || 'bd_passport';
  const customSize = appState.get('customSize') || { widthMm: 40, heightMm: 50, unit: 'mm' };
  const { wMm, hMm } = calculateDimensions(presetKey, customSize, dpi);
  const presetNameClean = (presetKey === 'custom' ? 'Custom-Size' : (t(`preset_${presetKey}`) || presetKey)).replace(/[^a-zA-Z0-9_\u0980-\u09FF-]/g, '-');
  const dimStr = `${Math.round(wMm)}x${Math.round(hMm)}mm`;

  const tokenValues = { agency: studioClean, preset: presetNameClean, dimensions: dimStr, dpi: `${dpi}DPI`, date: dateStr, time: timeStr };
  const parts = activeTokensOrder.map((tok) => tokenValues[tok]).filter(Boolean);
  previewText.textContent = parts.length > 0 ? parts.join(separator) + `.${ext}` : `${presetNameClean}_${dimStr}_${dpi}DPI.${ext}`;
}

export function renderNamingTokensUI() {
  const container = document.getElementById('namingTokensContainer');
  if (!container) return;
  container.innerHTML = '';

  activeTokensOrder.forEach((tokenId, idx) => {
    const meta = ALL_TOKENS.find((t) => t.id === tokenId);
    if (!meta) return;
    const chip = document.createElement('div');
    chip.style.cssText = 'display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; background: var(--bg-card); border: 1px solid var(--accent-primary); border-radius: var(--radius-sm); font-size: 0.76rem; font-weight: 600; color: var(--text-main);';
    chip.innerHTML = `<span>${t(meta.labelKey) || meta.defaultLabel}</span>`;

    const btnRemove = document.createElement('button');
    btnRemove.type = 'button'; btnRemove.textContent = '✕';
    btnRemove.style.cssText = 'background: none; border: none; cursor: pointer; padding: 0 2px; font-size: 0.7rem; color: #ef4444;';
    btnRemove.addEventListener('click', (e) => {
      e.stopPropagation();
      activeTokensOrder = activeTokensOrder.filter((id) => id !== tokenId);
      renderNamingTokensUI();
      updateNamingPreview();
    });
    chip.appendChild(btnRemove);
    container.appendChild(chip);
  });

  const inactive = ALL_TOKENS.filter((t) => !activeTokensOrder.includes(t.id));
  inactive.forEach((meta) => {
    const addBtn = document.createElement('button');
    addBtn.type = 'button'; addBtn.textContent = `+ ${t(meta.labelKey) || meta.defaultLabel}`;
    addBtn.style.cssText = 'padding: 4px 8px; background: rgba(59, 130, 246, 0.1); border: 1px dashed var(--accent-primary); border-radius: var(--radius-sm); font-size: 0.74rem; color: var(--accent-primary); cursor: pointer;';
    addBtn.addEventListener('click', () => {
      activeTokensOrder.push(meta.id);
      renderNamingTokensUI();
      updateNamingPreview();
    });
    container.appendChild(addBtn);
  });
}
