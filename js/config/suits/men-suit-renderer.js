import { drawSuitTie } from './suit-tie-renderer.js';

export function drawMenSuit(ctx, halfW, topY, baseH, suitType, collarFactor) {
  let jacketColor = '#111318', lapelColor = '#1e293b', tieColor = '#dc2626', tiePattern = '#991b1b';
  if (suitType === 'suit_navy_tie') {
    jacketColor = '#0f172a'; lapelColor = '#1e3a8a'; tieColor = '#2563eb'; tiePattern = '#1d4ed8';
  } else if (suitType === 'suit_charcoal') {
    jacketColor = '#1f2937'; lapelColor = '#374151'; tieColor = '#475569'; tiePattern = '#334155';
  }

  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = -2;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  const neckW = halfW * 0.33 * collarFactor;
  ctx.moveTo(-neckW, topY); ctx.lineTo(neckW, topY);
  ctx.lineTo(neckW * 0.6, topY + baseH * 0.7); ctx.lineTo(-neckW * 0.6, topY + baseH * 0.7);
  ctx.closePath(); ctx.fill();
  ctx.shadowColor = 'transparent';

  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-neckW * 0.95, topY); ctx.lineTo(-neckW * 0.1, topY + baseH * 0.18); ctx.lineTo(-neckW * 0.52, topY + baseH * 0.28);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(neckW * 0.95, topY); ctx.lineTo(neckW * 0.1, topY + baseH * 0.18); ctx.lineTo(neckW * 0.52, topY + baseH * 0.28);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  drawSuitTie(ctx, neckW, topY, baseH, tieColor, tiePattern);

  const grad = ctx.createLinearGradient(-halfW, topY, halfW, 0);
  grad.addColorStop(0, jacketColor); grad.addColorStop(0.5, lapelColor); grad.addColorStop(1, jacketColor);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(-halfW * 1.05, 0); ctx.lineTo(-halfW * 1.05, topY + baseH * 0.45);
  ctx.bezierCurveTo(-halfW * 0.7, topY + baseH * 0.05, -neckW * 1.1, topY + baseH * 0.05, -neckW * 0.85, topY);
  ctx.lineTo(-neckW * 0.2, topY + baseH * 0.55); ctx.lineTo(0, topY + baseH * 0.74); ctx.lineTo(neckW * 0.2, topY + baseH * 0.55);
  ctx.lineTo(neckW * 0.85, topY);
  ctx.bezierCurveTo(neckW * 1.1, topY + baseH * 0.05, halfW * 0.7, topY + baseH * 0.05, halfW * 1.05, topY + baseH * 0.45);
  ctx.lineTo(halfW * 1.05, 0);
  ctx.closePath(); ctx.fill();

  ctx.fillStyle = jacketColor; ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'; ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-neckW * 0.85, topY); ctx.lineTo(-neckW * 1.02, topY + baseH * 0.3); ctx.lineTo(-neckW * 0.72, topY + baseH * 0.35);
  ctx.lineTo(-neckW * 0.05, topY + baseH * 0.72); ctx.lineTo(-neckW * 0.4, topY + baseH * 0.45);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(neckW * 0.85, topY); ctx.lineTo(neckW * 1.02, topY + baseH * 0.3); ctx.lineTo(neckW * 0.72, topY + baseH * 0.35);
  ctx.lineTo(neckW * 0.05, topY + baseH * 0.72); ctx.lineTo(neckW * 0.4, topY + baseH * 0.45);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.arc(0, topY + baseH * 0.86, 4.5, 0, Math.PI * 2); ctx.fill();
}
