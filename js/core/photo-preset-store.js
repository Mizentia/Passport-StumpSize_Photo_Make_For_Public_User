import { STORAGE_KEY_PRESETS, STORAGE_KEY_SORT_MODE, getDefaultPresetsArray } from './presets/preset-defaults.js';
import { sortPresetList, reorderPreset, normalizeIndexes } from './presets/preset-order-manager.js';

class PhotoPresetStore {
  constructor() {
    this.presets = [];
    this.sortMode = 'recent';
    this.listeners = [];
    this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const mode = localStorage.getItem(STORAGE_KEY_SORT_MODE);
      this.sortMode = (mode === 'manual' || mode === 'recent') ? mode : 'recent';
      const raw = localStorage.getItem(STORAGE_KEY_PRESETS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) { this.presets = parsed; return; }
      }
    } catch (e) { console.warn('Presets fallback to default', e); }
    this.presets = getDefaultPresetsArray();
    this.saveToStorage();
  }

  saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY_PRESETS, JSON.stringify(this.presets));
      localStorage.setItem(STORAGE_KEY_SORT_MODE, this.sortMode);
    } catch (e) { console.error('Error saving presets', e); }
  }

  onChange(fn) {
    this.listeners.push(fn);
    return () => { this.listeners = this.listeners.filter(l => l !== fn); };
  }

  notify() {
    this.saveToStorage();
    this.listeners.forEach(fn => fn(this.getAllPresets(), this.sortMode));
  }

  getSortMode() { return this.sortMode; }
  setSortMode(mode) { if (mode === 'recent' || mode === 'manual') { this.sortMode = mode; this.notify(); } }
  getAllPresets() { return sortPresetList(this.presets, this.sortMode); }
  getPreset(id) { return this.presets.find(p => p.id === id) || null; }
  recordUsage(id) { const p = this.presets.find(x => x.id === id); if (p) { p.lastUsed = Date.now(); this.notify(); } }

  addPreset(data) {
    const maxOrder = this.presets.reduce((max, p) => Math.max(max, p.orderIndex ?? 0), -1);
    const newPreset = {
      id: data.id || `custom_${Date.now()}`, name: data.name || 'Custom Preset',
      widthMm: Number(data.widthMm) || 40, heightMm: Number(data.heightMm) || 50,
      aspectRatio: (Number(data.widthMm) || 40) / (Number(data.heightMm) || 50),
      category: data.category || 'custom', headRatio: data.headRatio || '70-80%',
      exactPixels: data.exactPixels ? { ...data.exactPixels } : null,
      dpi: Number(data.dpi) || 300, unit: data.unit || 'mm',
      isBuiltin: false, lastUsed: Date.now() + 1000, orderIndex: maxOrder + 1
    };
    this.presets.unshift(newPreset);
    this.notify();
    return newPreset;
  }

  updatePreset(id, fields) {
    const idx = this.presets.findIndex(p => p.id === id);
    if (idx === -1) return null;
    const w = Number(fields.widthMm ?? this.presets[idx].widthMm);
    const h = Number(fields.heightMm ?? this.presets[idx].heightMm);
    this.presets[idx] = { ...this.presets[idx], ...fields, widthMm: w, heightMm: h, aspectRatio: w / h, lastUsed: Date.now(), isCustomized: true };
    this.notify();
    return this.presets[idx];
  }

  deletePreset(id) {
    const idx = this.presets.findIndex(p => p.id === id);
    if (idx === -1) return false;
    this.presets.splice(idx, 1);
    normalizeIndexes(this.presets);
    this.notify();
    return true;
  }

  movePreset(id, dir) { reorderPreset(this.presets, this.getAllPresets(), id, dir); this.notify(); }
  resetToDefaults() { this.presets = getDefaultPresetsArray(); this.sortMode = 'recent'; this.notify(); }
}

export const photoPresetStore = new PhotoPresetStore();
