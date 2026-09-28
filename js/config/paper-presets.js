export const DEFAULT_PAPER_PRESETS_LIST = [
  {
    id: 'photo_4r',
    name: '4R Photo Paper (4 x 6" / 102 x 152 mm)',
    widthMm: 101.6,
    heightMm: 152.4,
    marginMm: 4,
    gapMm: 3
  },
  {
    id: 'photo_5r',
    name: '5R Photo Paper (5 x 7" / 127 x 178 mm)',
    widthMm: 127,
    heightMm: 177.8,
    marginMm: 5,
    gapMm: 3
  },
  {
    id: 'photo_6r',
    name: '6R Photo Paper (6 x 8" / 152 x 203 mm)',
    widthMm: 152.4,
    heightMm: 203.2,
    marginMm: 6,
    gapMm: 4
  },
  {
    id: 'a4',
    name: 'A4 Standard Sheet (8.27 x 11.69" / 210 x 297 mm)',
    widthMm: 210,
    heightMm: 297,
    marginMm: 8,
    gapMm: 4
  },
  {
    id: 'letter',
    name: 'US Letter (8.5 x 11" / 216 x 279 mm)',
    widthMm: 215.9,
    heightMm: 279.4,
    marginMm: 8,
    gapMm: 4
  }
];

export const PAPER_PRESETS = DEFAULT_PAPER_PRESETS_LIST.reduce((acc, cur) => {
  acc[cur.id] = cur;
  return acc;
}, {});
