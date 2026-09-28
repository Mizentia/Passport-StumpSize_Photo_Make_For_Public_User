import { DEFAULT_PAPER_PRESETS_LIST } from '../../config/paper-presets.js';
import { appState } from '../../core/state.js';

const STORAGE_KEY = 'passport_studio_all_paper_presets_v2';
const LEGACY_STORAGE_KEY = 'passport_studio_saved_paper_presets';

export function getAllPaperPresets() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyRaw) {
      const legacyList = JSON.parse(legacyRaw);
      if (Array.isArray(legacyList) && legacyList.length > 0) {
        const merged = [...DEFAULT_PAPER_PRESETS_LIST, ...legacyList];
        saveAllPaperPresets(merged);
        return merged;
      }
    }
    return [...DEFAULT_PAPER_PRESETS_LIST];
  } catch (e) {
    return [...DEFAULT_PAPER_PRESETS_LIST];
  }
}

export function saveAllPaperPresets(presets) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  } catch (e) {
    console.error('Error saving paper presets:', e);
  }
  appState.set('customPaperPresets', presets, true);
}

export function addOrUpdatePaperPreset(paperObj) {
  const list = getAllPaperPresets();
  const existingIdx = list.findIndex(p => p.id === paperObj.id);
  if (existingIdx >= 0) {
    list[existingIdx] = { ...list[existingIdx], ...paperObj };
  } else {
    list.unshift(paperObj);
  }
  saveAllPaperPresets(list);
  return list;
}

export function removePaperPreset(paperId) {
  let list = getAllPaperPresets();
  if (list.length <= 1) return list;
  list = list.filter(p => p.id !== paperId);
  saveAllPaperPresets(list);
  return list;
}

export function reorderPaperPreset(paperId, direction = 'up') {
  const list = getAllPaperPresets();
  const idx = list.findIndex(p => p.id === paperId);
  if (idx < 0) return list;
  const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (targetIdx < 0 || targetIdx >= list.length) return list;

  const temp = list[idx];
  list[idx] = list[targetIdx];
  list[targetIdx] = temp;

  saveAllPaperPresets(list);
  return list;
}

export function resetDefaultPaperPresets() {
  saveAllPaperPresets([...DEFAULT_PAPER_PRESETS_LIST]);
  return [...DEFAULT_PAPER_PRESETS_LIST];
}
