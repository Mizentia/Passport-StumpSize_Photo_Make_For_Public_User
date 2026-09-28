import { appState } from './state.js';
import { putHistoryRecord } from './history-store.js';
import { captureStateSnapshot, generateThumbDataUrl } from './history-snapshot-builder.js';

class HistoryManager {
  constructor() {
    this.listeners = [];
    this.currentDraftId = null;
    this.autoDraftTimer = null;
  }

  onChange(fn) { this.listeners.push(fn); }
  notify() { this.listeners.forEach((fn) => { try { fn(); } catch (_) {} }); }

  async recordDraft(customName = null) {
    const orig = appState.get('originalImage');
    if (!orig) return null;

    if (!this.currentDraftId) {
      this.currentDraftId = 'draft_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    }

    const snapshot = captureStateSnapshot(appState);
    if (!snapshot) return null;

    const preset = appState.get('selectedPreset') || 'bd_passport';
    const cSize = appState.get('customSize') || { widthMm: 40, heightMm: 50 };
    const name = customName || `${preset.toUpperCase()} (${Math.round(cSize.widthMm)}x${Math.round(cSize.heightMm)}mm) - Draft`;

    const record = {
      id: this.currentDraftId,
      name,
      type: 'draft',
      preset,
      timestamp: Date.now(),
      thumbDataUrl: generateThumbDataUrl(),
      snapshot
    };

    await putHistoryRecord(record);
    this.notify();
    return record;
  }

  scheduleAutoDraft(delay = 1200) {
    if (this.autoDraftTimer) clearTimeout(this.autoDraftTimer);
    this.autoDraftTimer = setTimeout(() => {
      this.recordDraft();
    }, delay);
  }

  async saveCompleted(customName = null) {
    const orig = appState.get('originalImage');
    if (!orig) return null;

    const id = 'saved_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    const snapshot = captureStateSnapshot(appState);
    if (!snapshot) return null;

    const preset = appState.get('selectedPreset') || 'bd_passport';
    const cSize = appState.get('customSize') || { widthMm: 40, heightMm: 50 };
    const name = customName || `${preset.toUpperCase()} (${Math.round(cSize.widthMm)}x${Math.round(cSize.heightMm)}mm)`;

    const record = {
      id,
      name,
      type: 'completed',
      preset,
      timestamp: Date.now(),
      thumbDataUrl: generateThumbDataUrl(),
      snapshot
    };

    await putHistoryRecord(record);
    this.notify();
    return record;
  }

  getCurrentDraftId() { return this.currentDraftId; }
  setCurrentDraftId(id) { this.currentDraftId = id || null; }
  resetCurrentDraftId() { this.currentDraftId = null; }
}

export const historyManager = new HistoryManager();
