import { createDefaultState, extractStateSnapshot, getResetAdjustments } from './state-defaults.js';

class StateManager {
  constructor() {
    this.state = createDefaultState();
    this.listeners = new Map();
    this.historyStack = [];
    this.historyIndex = -1;
    this.maxHistory = 20;
  }

  get(key) { return this.state[key]; }
  getAll() { return { ...this.state }; }

  set(key, value, recordHistory = false) {
    if (recordHistory) this.recordHistorySnapshot();
    this.state[key] = value;
    this.emit(key, value);
    this.emit('change', { key, value, state: this.state });
  }

  update(partialState, recordHistory = false) {
    if (recordHistory) this.recordHistorySnapshot();
    Object.assign(this.state, partialState);
    for (const [key, value] of Object.entries(partialState)) {
      this.emit(key, value);
    }
    this.emit('change', { state: this.state });
  }

  recordHistorySnapshot() {
    const snapshot = extractStateSnapshot(this.state);
    if (this.historyIndex < this.historyStack.length - 1) {
      this.historyStack = this.historyStack.slice(0, this.historyIndex + 1);
    }
    this.historyStack.push(JSON.stringify(snapshot));
    if (this.historyStack.length > this.maxHistory) {
      this.historyStack.shift();
    } else {
      this.historyIndex++;
    }
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      const snapshot = JSON.parse(this.historyStack[this.historyIndex]);
      this.update(snapshot, false);
      return true;
    }
    return false;
  }

  redo() {
    if (this.historyIndex < this.historyStack.length - 1) {
      this.historyIndex++;
      const snapshot = JSON.parse(this.historyStack[this.historyIndex]);
      this.update(snapshot, false);
      return true;
    }
    return false;
  }

  canUndo() { return this.historyIndex > 0; }
  canRedo() { return this.historyIndex < this.historyStack.length - 1; }

  resetAllAdjustments() {
    this.recordHistorySnapshot();
    this.update(getResetAdjustments());
  }

  on(event, callback) {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event).push(callback);
    return () => {
      const arr = this.listeners.get(event);
      const index = arr.indexOf(callback);
      if (index > -1) arr.splice(index, 1);
    };
  }

  emit(event, data) {
    const callbacks = this.listeners.get(event);
    if (callbacks) callbacks.forEach(cb => cb(data));
  }
}

export const appState = new StateManager();
