import { appState } from './state.js';
import { createBatchItem, createHistoryItem } from './batch/batch-item-factory.js';

class BatchManager {
  constructor() {
    this.items = [];
    this.activeId = null;
    this.listeners = [];
  }

  onChange(fn) { this.listeners.push(fn); }
  notify() { this.listeners.forEach((fn) => fn(this.items, this.activeId)); }

  addPhoto(img, name = 'Photo') {
    const existing = this.items.find((i) => i.originalImage === img || (i.name === name && i.originalImage?.src === img?.src));
    if (existing) {
      this.activeId = existing.id;
      this.notify();
      return existing;
    }
    const item = createBatchItem(img, name, this.items.length);
    this.items.push(item);
    this.activeId = item.id;
    this.notify();
    return item;
  }

  addCurrentAsHistoryItem(customName = null) {
    const item = createHistoryItem(customName);
    if (!item) return null;
    this.items.push(item);
    this.notify();
    return item;
  }

  saveActiveSnapshot() {
    if (!this.activeId) return;
    const cur = this.items.find((i) => i.id === this.activeId);
    if (!cur) return;
    cur.originalImage = appState.get('originalImage');
    cur.segmentedImage = appState.get('segmentedImage');
    cur.isBackgroundRemoved = appState.get('isBackgroundRemoved');
    cur.backgroundColor = appState.get('backgroundColor');
    cur.cropOffset = { ...appState.get('cropOffset') };
    cur.zoom = appState.get('zoom');
    cur.rotation = appState.get('rotation') || 0;
    cur.flipH = !!appState.get('flipH');
    cur.flipV = !!appState.get('flipV');
    cur.filters = { ...appState.get('filters') };
    cur.selectedSuit = appState.get('selectedSuit');
    cur.suitScale = appState.get('suitScale');
    cur.suitOffsetX = appState.get('suitOffsetX');
    cur.suitOffsetY = appState.get('suitOffsetY');
    cur.suitCollarWidth = appState.get('suitCollarWidth');
    cur.suitRotation = appState.get('suitRotation');
    cur.selectedPreset = appState.get('selectedPreset');
    cur.customSize = { ...(appState.get('customSize') || {}) };
  }

  setActive(id) {
    this.saveActiveSnapshot();
    const t = this.items.find((i) => i.id === id);
    if (!t) return;
    this.activeId = id;
    appState.update({
      originalImage: t.originalImage, segmentedImage: t.segmentedImage, isBackgroundRemoved: t.isBackgroundRemoved,
      backgroundColor: t.backgroundColor, cropOffset: t.cropOffset, zoom: t.zoom,
      rotation: t.rotation || 0, flipH: !!t.flipH, flipV: !!t.flipV, filters: t.filters,
      selectedSuit: t.selectedSuit, suitScale: t.suitScale, suitOffsetX: t.suitOffsetX, suitOffsetY: t.suitOffsetY,
      suitCollarWidth: t.suitCollarWidth, suitRotation: t.suitRotation,
      selectedPreset: t.selectedPreset || appState.get('selectedPreset'), customSize: t.customSize || appState.get('customSize')
    });
    this.notify();
  }

  updateQuantity(id, qty) {
    const item = this.items.find((i) => i.id === id);
    if (item) { item.quantityOnSheet = Math.max(1, Math.min(100, Number(qty) || 1)); this.notify(); }
  }

  togglePrintEnabled(id, enabled) {
    const item = this.items.find((i) => i.id === id);
    if (item) { item.enabledForPrint = !!enabled; this.notify(); }
  }

  removeItem(id) {
    this.items = this.items.filter((i) => i.id !== id);
    if (this.activeId === id) this.activeId = this.items.length > 0 ? this.items[0].id : null;
    this.notify();
  }

  clear() { this.items = []; this.activeId = null; this.notify(); }
  getAll() { return this.items; }
  getEnabled() { return this.items.filter((i) => i.enabledForPrint); }
  getActive() { return this.items.find((i) => i.id === this.activeId) || null; }
}

export const batchManager = new BatchManager();
