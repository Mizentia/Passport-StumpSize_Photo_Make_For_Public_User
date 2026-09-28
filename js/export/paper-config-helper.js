import { getAllPaperPresets } from '../ui/paper/paper-storage.js';
import { appState } from '../core/state.js';

export function getActivePaperConfig() {
  const paperKey = appState.get('paperPreset') || 'photo_4r';
  const list = getAllPaperPresets();
  const paper = list.find((p) => p.id === paperKey) || list[0] || {
    id: 'photo_4r',
    name: '4R Photo Paper (4 x 6" / 102 x 152 mm)',
    widthMm: 101.6,
    heightMm: 152.4,
    marginMm: 4,
    gapMm: 3
  };

  const marginMm = appState.get('sheetMarginMm') != null ? Number(appState.get('sheetMarginMm')) : (paper.marginMm || 4);
  const gapMm = appState.get('sheetGapMm') != null ? Number(appState.get('sheetGapMm')) : (paper.gapMm || 3);

  return { paperKey: paper.id, paper, marginMm, gapMm, isCustom: true };
}
