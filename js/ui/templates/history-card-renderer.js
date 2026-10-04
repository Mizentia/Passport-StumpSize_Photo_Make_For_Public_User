import { t, toBengaliNumeral } from '../../config/i18n.js';
import { appState } from '../../core/state.js';
import { attachHistoryCardHoverDrawer } from '../history/history-card-drawer.js';

export function createHistoryCardElement(record, serialNum, onOpen, onAddToSheet, onDelete, tabManager) {
  const card = document.createElement('div');
  const isCompleted = record.type === 'completed';
  card.className = `history-item-card ${isCompleted ? 'card-saved' : 'card-draft'}`;
  card.dataset.id = record.id;

  const isBn = appState.get('lang') === 'bn';
  const padSerial = String(serialNum).padStart(2, '0');
  const serialLabel = '#' + (isBn ? toBengaliNumeral(padSerial) : padSerial);

  const dateObj = new Date(record.timestamp || Date.now());
  const dateStr = dateObj.toLocaleTimeString(isBn ? 'bn-BD' : 'en-US', { hour: '2-digit', minute: '2-digit' });

  const snap = record.snapshot || {};
  const cSize = snap.customSize ? `${Math.round(snap.customSize.widthMm)}x${Math.round(snap.customSize.heightMm)}` : '';
  const presetLabel = cSize || (record.selectedPreset || record.preset || 'BD').replace(/_/g, ' ').toUpperCase();
  const badgeTitle = isCompleted ? (isBn ? 'সংরক্ষিত প্রজেক্ট' : 'Saved Project') : (isBn ? 'অটো-ড্রাফট' : 'Auto-Draft');

  card.innerHTML = `
    <div class="history-item-topbar">
      <span class="history-serial-badge">${serialLabel}</span>
      <span class="history-status-dot ${isCompleted ? 'dot-saved' : 'dot-draft'}" title="${badgeTitle}"></span>
      <button class="history-item-del" title="${t('btn_delete_history') || 'Delete'}" type="button">&times;</button>
    </div>
    <div class="history-item-thumb-wrap">
      <img src="${record.thumbDataUrl}" alt="${record.name}" class="history-item-thumb" loading="lazy">
      <span class="history-item-badge">${presetLabel}</span>
    </div>
    <div class="history-item-info">
      <div class="history-item-title" title="${record.name}">${record.name || 'Passport Photo'}</div>
      <div class="history-item-time">🕒 ${isBn ? toBengaliNumeral(dateStr) : dateStr}</div>
    </div>
    <div class="history-item-actions">
      <button class="history-act-btn history-act-editor" type="button" title="${t('btn_open_in_editor') || 'Open in Editor'}">🎨</button>
      <button class="history-act-btn history-act-sheet" type="button" title="${t('btn_add_to_sheet') || 'Add to Sheet'}">🖨️</button>
    </div>
  `;

  card.querySelector('.history-act-editor')?.addEventListener('click', (e) => {
    e.stopPropagation();
    onOpen(record);
  });
  card.querySelector('.history-act-sheet')?.addEventListener('click', (e) => {
    e.stopPropagation();
    onAddToSheet(record);
  });
  card.querySelector('.history-item-del')?.addEventListener('click', (e) => {
    e.stopPropagation();
    onDelete(record);
  });
  card.addEventListener('click', () => {
    if (card._suppressClickUntil && Date.now() < card._suppressClickUntil) return;
    onOpen(record);
  });

  attachHistoryCardHoverDrawer(card, record, tabManager);
  return card;
}
