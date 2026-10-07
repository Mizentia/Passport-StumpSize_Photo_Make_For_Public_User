import { appState } from '../core/state.js';
import { updateDimensionDisplay, openCustomSizeModal } from './editor-dimension-ui.js';
import { photoPresetStore } from '../core/photo-preset-store.js';
import { createPresetCard } from './sidebar/preset-card-renderer.js';
import { bindPresetToolbarControls } from './sidebar/preset-toolbar-binder.js';
import { toBengaliNumeral } from '../config/i18n.js';

export function getSavedPhotoPresets() { return photoPresetStore.getAllPresets(); }
export function saveSavedPhotoPresets(presets) { photoPresetStore.presets = presets; photoPresetStore.notify(); }
export function addCustomPhotoPreset(presetObj) { return photoPresetStore.addPreset(presetObj); }
export function removeCustomPhotoPreset(presetId) { photoPresetStore.deletePreset(presetId); return photoPresetStore.getAllPresets(); }

let isSubscribed = false;

export function renderSavedPhotoPresetsInSidebar(onRedraw) {
  const presetGrid = document.getElementById('photoPresetGrid') || document.querySelector('.preset-grid');
  if (!presetGrid) return;

  const currentSelected = appState.get('selectedPreset') || 'bd_passport';
  const sortMode = photoPresetStore.getSortMode();
  bindPresetToolbarControls(onRedraw);

  if (!isSubscribed) {
    isSubscribed = true;
    photoPresetStore.onChange(() => {
      renderSavedPhotoPresetsInSidebar(onRedraw);
      if (onRedraw) onRedraw();
      updateDimensionDisplay();
    });
  }

  presetGrid.innerHTML = '';
  const presetsList = photoPresetStore.getAllPresets();
  presetsList.forEach((preset, idx) => {
    const card = createPresetCard(preset, idx, presetsList.length, sortMode, currentSelected, onRedraw, () => renderSavedPhotoPresetsInSidebar(onRedraw));
    presetGrid.appendChild(card);
  });

  const isBn = appState.get('lang') === 'bn';
  const customData = appState.get('customSize') || { widthMm: 40, heightMm: 50, unit: 'mm' };
  const customW = Math.round(Number(customData.widthMm) || 40);
  const customH = Math.round(Number(customData.heightMm) || 50);
  const customCard = document.createElement('button');
  customCard.className = `preset-btn preset-custom ${currentSelected === 'custom' ? 'active' : ''}`;
  customCard.dataset.preset = 'custom';

  if (currentSelected === 'custom') {
    const dimText = isBn ? `${toBengaliNumeral(customW)}x${toBengaliNumeral(customH)} মিমি` : `${customW}x${customH} mm`;
    customCard.innerHTML = `
      <div class="preset-card-header-row" style="width: 100%; display: flex; justify-content: space-between; align-items: center;">
        <span class="preset-name-text">✏️ ${isBn ? 'কাস্টম সাইজ' : 'Custom Size'}</span>
        <span style="font-size: 0.68rem; color: var(--accent-primary); font-weight: 700;">⚙️ ${isBn ? 'এডিট' : 'Edit'}</span>
      </div>
      <div class="preset-card-sub-row" style="width: 100%; display: flex; justify-content: space-between; align-items: center;">
        <small class="preset-dim-subtext">${dimText}</small>
        <span class="preset-dpi-badge">${isBn ? toBengaliNumeral(appState.get('dpi') || 300) : (appState.get('dpi') || 300)} DPI</span>
      </div>`;
  } else {
    customCard.innerHTML = `
      <div class="preset-card-header-row" style="width: 100%; display: flex; justify-content: space-between; align-items: center;">
        <span class="preset-name-text">✏️ ${isBn ? 'কাস্টম সাইজ তৈরি...' : 'Custom Size...'}</span>
        <span style="font-size: 0.68rem; color: #8b5cf6; font-weight: 700;">+ ${isBn ? 'নতুন' : 'New'}</span>
      </div>
      <div class="preset-card-sub-row" style="width: 100%; display: flex; justify-content: space-between; align-items: center;">
        <small class="preset-dim-subtext">${isBn ? 'যেকোনো মিমি / ইঞ্চি / px / cm' : 'Any mm / inch / px / cm'}</small>
        <span class="preset-dpi-badge" style="background: rgba(139, 92, 246, 0.15); color: #8b5cf6;">📐 ${isBn ? 'মুক্ত মাপ' : 'Custom'}</span>
      </div>`;
  }

  customCard.addEventListener('click', () => {
    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
    customCard.classList.add('active');
    appState.set('selectedPreset', 'custom', true);
    if (onRedraw) onRedraw();
    updateDimensionDisplay();
    renderSavedPhotoPresetsInSidebar(onRedraw);
    openCustomSizeModal(null);
  });

  const dock = document.getElementById('presetCustomDock');
  if (dock) { dock.innerHTML = ''; dock.appendChild(customCard); }
  else { presetGrid.appendChild(customCard); }
}
