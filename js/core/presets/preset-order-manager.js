export function sortPresetList(list, sortMode) {
  if (sortMode === 'recent') {
    return [...list].sort((a, b) => (b.lastUsed || 0) - (a.lastUsed || 0));
  }
  return [...list].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
}

export function reorderPreset(presets, currentList, id, direction) {
  const curIdx = currentList.findIndex(p => p.id === id);
  if (curIdx === -1) return;
  const targetIdx = direction === 'up' ? curIdx - 1 : curIdx + 1;
  if (targetIdx < 0 || targetIdx >= currentList.length) return;

  const temp = currentList[curIdx];
  currentList[curIdx] = currentList[targetIdx];
  currentList[targetIdx] = temp;

  currentList.forEach((p, idx) => {
    const match = presets.find(orig => orig.id === p.id);
    if (match) match.orderIndex = idx;
  });
}

export function normalizeIndexes(presets) {
  const sorted = [...presets].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
  sorted.forEach((p, idx) => { p.orderIndex = idx; });
}
