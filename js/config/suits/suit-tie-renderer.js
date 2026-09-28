export function drawSuitTie(ctx, neckW, topY, baseH, tieColor, tiePattern) {
  const tieGrad = ctx.createLinearGradient(-neckW * 0.2, topY + baseH * 0.16, neckW * 0.2, topY + baseH * 0.9);
  tieGrad.addColorStop(0, tieColor);
  tieGrad.addColorStop(0.5, tiePattern);
  tieGrad.addColorStop(1, tieColor);

  ctx.fillStyle = tieGrad;
  ctx.beginPath();
  ctx.moveTo(-neckW * 0.22, topY + baseH * 0.16);
  ctx.lineTo(neckW * 0.22, topY + baseH * 0.16);
  ctx.lineTo(neckW * 0.16, topY + baseH * 0.27);
  ctx.lineTo(-neckW * 0.16, topY + baseH * 0.27);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-neckW * 0.16, topY + baseH * 0.27);
  ctx.lineTo(neckW * 0.16, topY + baseH * 0.27);
  ctx.lineTo(neckW * 0.28, topY + baseH * 0.86);
  ctx.lineTo(0, topY + baseH * 0.99);
  ctx.lineTo(-neckW * 0.28, topY + baseH * 0.86);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-neckW * 0.1, topY + baseH * 0.38); ctx.lineTo(neckW * 0.18, topY + baseH * 0.5);
  ctx.moveTo(-neckW * 0.14, topY + baseH * 0.58); ctx.lineTo(neckW * 0.22, topY + baseH * 0.7);
  ctx.moveTo(-neckW * 0.18, topY + baseH * 0.78); ctx.lineTo(neckW * 0.25, topY + baseH * 0.88);
  ctx.stroke();
}
