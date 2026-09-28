import { drawMenSuit, drawMenShirt } from './suits/men-suits.js';
import { drawFemaleBlazer, drawFemaleShirt, drawSchoolUniform, drawAcademicGown } from './suits/women-suits.js';

export const FORMAL_SUITS = [
  { id: 'none', name: 'Original (None)', icon: '🚫', category: 'all' },
  { id: 'suit_black_tie', name: 'Black Suit & Red Tie', icon: '👔', category: 'men' },
  { id: 'suit_navy_tie', name: 'Navy Suit & Blue Tie', icon: '🤵', category: 'men' },
  { id: 'suit_navy_gold', name: 'Executive Navy & Gold Tie', icon: '🎖️', category: 'men' },
  { id: 'suit_charcoal', name: 'Charcoal Business Suit', icon: '💼', category: 'men' },
  { id: 'suit_white_shirt', name: "Men's White Shirt", icon: '👕', category: 'men' },
  { id: 'suit_blue_shirt', name: "Men's Sky Blue Shirt", icon: '👔', category: 'men' },
  { id: 'suit_female_blazer', name: 'Executive Dark Blazer', icon: '👩‍💼', category: 'women' },
  { id: 'suit_female_formal', name: 'Female Formal Shirt', icon: '👚', category: 'women' },
  { id: 'suit_school_uniform', name: 'School / College Uniform', icon: '🎒', category: 'uniform' },
  { id: 'suit_academic_gown', name: 'Convocation Gown', icon: '🎓', category: 'all' }
];

export function renderRealisticSuit(ctx, width, height, suitId, options = {}) {
  if (!suitId || suitId === 'none') return;
  const { scale = 1.0, offsetX = 0, offsetY = 0, collarWidth = 1.0, rotation = 0, brightness = 100 } = options;

  ctx.save();
  ctx.translate(width / 2 + offsetX, height + offsetY);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.scale(scale, scale);

  if (brightness !== 100) {
    ctx.filter = `brightness(${brightness}%)`;
  }

  const baseW = width * 1.08;
  const baseH = height * 0.52;
  const halfW = baseW / 2;
  const topY = -baseH;

  switch (suitId) {
    case 'suit_black_tie':
    case 'suit_navy_tie':
    case 'suit_navy_gold':
    case 'suit_charcoal':
      drawMenSuit(ctx, halfW, topY, baseH, suitId, collarWidth);
      break;
    case 'suit_white_shirt':
      drawMenShirt(ctx, halfW, topY, baseH, collarWidth, '#ffffff');
      break;
    case 'suit_blue_shirt':
      drawMenShirt(ctx, halfW, topY, baseH, collarWidth, '#e0f2fe');
      break;
    case 'suit_female_blazer':
      drawFemaleBlazer(ctx, halfW, topY, baseH, collarWidth);
      break;
    case 'suit_female_formal':
      drawFemaleShirt(ctx, halfW, topY, baseH, collarWidth);
      break;
    case 'suit_school_uniform':
      drawSchoolUniform(ctx, halfW, topY, baseH, collarWidth);
      break;
    case 'suit_academic_gown':
      drawAcademicGown(ctx, halfW, topY, baseH, collarWidth);
      break;
    default:
      drawMenSuit(ctx, halfW, topY, baseH, 'suit_black_tie', collarWidth);
      break;
  }
  ctx.restore();
}
