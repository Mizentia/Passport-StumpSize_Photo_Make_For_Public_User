export function drawCornerCrossMarks(ctx, x, y, w, h, len = 8, offset = 3) {
  ctx.beginPath();
  // Top-left
  ctx.moveTo(x - offset, y); ctx.lineTo(x - offset - len, y);
  ctx.moveTo(x, y - offset); ctx.lineTo(x, y - offset - len);
  // Top-right
  ctx.moveTo(x + w + offset, y); ctx.lineTo(x + w + offset + len, y);
  ctx.moveTo(x + w, y - offset); ctx.lineTo(x + w, y - offset - len);
  // Bottom-left
  ctx.moveTo(x - offset, y + h); ctx.lineTo(x - offset - len, y + h);
  ctx.moveTo(x, y + h + offset); ctx.lineTo(x, y + h + offset + len);
  // Bottom-right
  ctx.moveTo(x + w + offset, y + h); ctx.lineTo(x + w + offset + len, y + h);
  ctx.moveTo(x + w, y + h + offset); ctx.lineTo(x + w, y + h + offset + len);
  ctx.stroke();
}

export function drawCornerAngleMarks(ctx, x, y, w, h, len = 8, offset = 3) {
  ctx.beginPath();
  // Top-left L
  ctx.moveTo(x - offset - len, y - offset); ctx.lineTo(x - offset, y - offset); ctx.lineTo(x - offset, y - offset - len);
  // Top-right L
  ctx.moveTo(x + w + offset + len, y - offset); ctx.lineTo(x + w + offset, y - offset); ctx.lineTo(x + w + offset, y - offset - len);
  // Bottom-left L
  ctx.moveTo(x - offset - len, y + h + offset); ctx.lineTo(x - offset, y + h + offset); ctx.lineTo(x - offset, y + h + offset + len);
  // Bottom-right L
  ctx.moveTo(x + w + offset + len, y + h + offset); ctx.lineTo(x + w + offset, y + h + offset); ctx.lineTo(x + w + offset, y + h + offset + len);
  ctx.stroke();
}
