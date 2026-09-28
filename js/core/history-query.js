import { getAllHistoryRecordsRaw } from './history-store.js';

export async function getHistoryRecordsPaged({ type = 'all', query = '', offset = 0, limit = 12 }) {
  const all = await getAllHistoryRecordsRaw();
  all.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

  const filtered = all.filter((item) => {
    if (type !== 'all' && item.type !== type) return false;
    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      const name = (item.name || '').toLowerCase();
      const preset = (item.preset || '').toLowerCase();
      if (!name.includes(q) && !preset.includes(q)) return false;
    }
    return true;
  });

  const total = filtered.length;
  const items = filtered.slice(offset, offset + limit);
  const hasMore = offset + limit < total;

  return { items, total, hasMore, offset, limit };
}
