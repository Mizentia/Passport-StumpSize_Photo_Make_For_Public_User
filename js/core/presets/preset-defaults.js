import { PHOTO_PRESETS_DATA } from '../../config/presets-data.js';

export const STORAGE_KEY_PRESETS = 'passport_studio_all_photo_presets_v2';
export const STORAGE_KEY_SORT_MODE = 'passport_studio_preset_sort_mode';

export function getDefaultPresetsArray() {
  return Object.values(PHOTO_PRESETS_DATA).map((p, idx) => ({
    id: p.id,
    name: p.name,
    widthMm: p.widthMm,
    heightMm: p.heightMm,
    aspectRatio: p.aspectRatio || (p.widthMm / p.heightMm),
    category: p.category || 'passport',
    headRatio: p.headRatio || '70-80%',
    exactPixels: p.exactPixels ? { ...p.exactPixels } : null,
    dpi: 300,
    unit: p.exactPixels ? 'px' : 'mm',
    isBuiltin: true,
    lastUsed: Date.now() - (idx * 1000),
    orderIndex: idx
  }));
}
