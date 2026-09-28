import { appState } from '../../core/state.js';
import { drawCornerCrossMarks, drawCornerAngleMarks } from './cut-marks-corner.js';

export { drawCornerCrossMarks, drawCornerAngleMarks };

export function drawBorder(ctx, x, y, w, h) {
  const color = appState.get('borderColor') || '#cbd5e1';
  const width = Number(appState.get('borderWidth')) || 1;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.strokeRect(x, y, w, h);
  ctx.restore();
}

export function drawCutMarks(ctx, x, y, w, h) {
  const style = appState.get('cutMarksStyle') || 'inter_boundary';
  const color = appState.get('cutMarksColor') || '#94a3b8';
  const width = Number(appState.get('cutMarksWidth')) || 1;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;

  if (style === 'dash_box') {
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(x - 1, y - 1, w + 2, h + 2);
  } else if (style === 'dot_box') {
    ctx.setLineDash([2, 4]);
    ctx.strokeRect(x - 1, y - 1, w + 2, h + 2);
  } else if (style === 'corner_angle') {
    drawCornerAngleMarks(ctx, x, y, w, h, 8, 3);
  } else {
    drawCornerCrossMarks(ctx, x, y, w, h, 8, 3);
  }

  ctx.restore();
}

export function drawSmartCutMarksForPlacedPhotos(ctx, placedPhotos, gap) {
  const style = appState.get('cutMarksStyle') || 'inter_boundary';
  const color = appState.get('cutMarksColor') || '#94a3b8';
  const width = Number(appState.get('cutMarksWidth')) || 1;

  if (style !== 'inter_boundary') {
    placedPhotos.forEach(p => drawCutMarks(ctx, p.x, p.y, p.w, p.h));
    return;
  }

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  const halfGap = gap / 2;

  placedPhotos.forEach((p) => {
    const r = placedPhotos.find(o => Math.abs(o.y - p.y) < 6 && o.x > p.x && o.x - (p.x + p.w) <= gap + 4);
    if (r) {
      const midX = Math.round(p.x + p.w + halfGap);
      ctx.moveTo(midX, Math.min(p.y, r.y));
      ctx.lineTo(midX, Math.max(p.y + p.h, r.y + r.h));
    }
    const b = placedPhotos.find(o => Math.abs(o.x - p.x) < 6 && o.y > p.y && o.y - (p.y + p.h) <= gap + 4);
    if (b) {
      const midY = Math.round(p.y + p.h + halfGap);
      ctx.moveTo(Math.min(p.x, b.x), midY);
      ctx.lineTo(Math.max(p.x + p.w, b.x + b.w), midY);
    }
  });

  ctx.stroke();
  ctx.restore();
}
