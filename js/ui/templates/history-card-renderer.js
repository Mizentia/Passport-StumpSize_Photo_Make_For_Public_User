import { t, toBengaliNumeral } from '../../config/i18n.js';
import { appState } from '../../core/state.js';

export function createHistoryCardElement(record, onOpen, onAddToSheet, onDelete) {
  const card = document.createElement('div');
  card.className = `history-card history-card-${record.type || 'draft'}`;
  card.dataset.id = record.id;

  const isBn = appState.get('lang') === 'bn';
  const dateObj = new Date(record.timestamp || Date.now());
  const dateStr = dateObj.toLocaleDateString(isBn ? 'bn-BD' : 'en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const badgeText = record.type === 'completed' ? (isBn ? 'সংরক্ষিত' : 'Saved') : (isBn ? 'ড্রাফট' : 'Draft');
  const badgeClass = record.type === 'completed' ? 'badge-completed' : 'badge-draft';
  const presetLabel = (record.selectedPreset || record.preset || 'Passport').replace(/_/g, ' ').toUpperCase();

  card.innerHTML = `
    <div class="history-card-thumb-wrap">
      <img src="${record.thumbDataUrl}" alt="${record.name}" class="history-card-thumb" loading="lazy">
      <span class="history-badge ${badgeClass}">${badgeText}</span>
      <span class="history-preset-badge">${presetLabel}</span>
      <button class="history-btn-del" title="${t('btn_delete_history') || 'Delete'}" type="button">&times;</button>
    </div>
    <div class="history-card-body">
      <div class="history-card-name" title="${record.name}">${record.name || 'Passport Photo'}</div>
      <div class="history-card-date">🕒 ${isBn ? toBengaliNumeral(dateStr) : dateStr}</div>
      <div class="history-card-actions">
        <button class="btn-primary btn-sm history-btn-open" type="button">
          <span>✏️</span>
          <span>${t('btn_open_in_editor') || 'Open in Editor'}</span>
        </button>
        <button class="btn-secondary btn-icon history-btn-sheet" type="button" title="${t('btn_add_to_sheet') || 'Add to Print Sheet'}">🖨️</button>
      </div>
    </div>
  `;

  card.querySelector('.history-btn-open')?.addEventListener('click', (e) => {
    e.stopPropagation();
    onOpen(record);
  });

  card.querySelector('.history-btn-sheet')?.addEventListener('click', (e) => {
    e.stopPropagation();
    onAddToSheet(record);
  });

  card.querySelector('.history-btn-del')?.addEventListener('click', (e) => {
    e.stopPropagation();
    onDelete(record);
  });

  card.addEventListener('click', () => onOpen(record));

  return card;
}
