/**
 * Ultra-realistic rendering of Women's blazer and formal shirt
 */

export function drawFemaleBlazer(ctx, halfW, topY, baseH, collarFactor, blazerColor = '#1e293b') {
  const neckW = halfW * 0.38 * collarFactor;
  
  // Inner Top
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, topY + baseH * 0.12, neckW * 0.7, 0, Math.PI);
  ctx.fill();

  // Blazer Body
  const grad = ctx.createLinearGradient(-halfW, topY, halfW, 0);
  grad.addColorStop(0, blazerColor);
  grad.addColorStop(0.5, '#0f172a');
  grad.addColorStop(1, blazerColor);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(-halfW * 1.05, 0);
  ctx.lineTo(-halfW * 1.05, topY + baseH * 0.42);
  ctx.bezierCurveTo(-halfW * 0.7, topY + baseH * 0.05, -neckW * 1.1, topY + baseH * 0.04, -neckW * 0.9, topY);
  ctx.lineTo(0, topY + baseH * 0.64);
  ctx.lineTo(neckW * 0.9, topY);
  ctx.bezierCurveTo(neckW * 1.1, topY + baseH * 0.05, halfW * 0.7, topY + baseH * 0.05, halfW * 1.05, topY + baseH * 0.42);
  ctx.lineTo(halfW * 1.05, 0);
  ctx.closePath();
  ctx.fill();

  // Curved Shawl Lapels
  ctx.fillStyle = blazerColor;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-neckW * 0.9, topY);
  ctx.quadraticCurveTo(-neckW * 0.95, topY + baseH * 0.35, 0, topY + baseH * 0.64);
  ctx.lineTo(-neckW * 0.3, topY + baseH * 0.45);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(neckW * 0.9, topY);
  ctx.quadraticCurveTo(neckW * 0.95, topY + baseH * 0.35, 0, topY + baseH * 0.64);
  ctx.lineTo(neckW * 0.3, topY + baseH * 0.45);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

export function drawFemaleShirt(ctx, halfW, topY, baseH, collarFactor, shirtColor = '#f8fafc') {
  const neckW = halfW * 0.36 * collarFactor;
  ctx.fillStyle = shirtColor;
  ctx.beginPath();
  ctx.moveTo(-halfW * 1.05, 0);
  ctx.lineTo(-halfW * 1.05, topY + baseH * 0.4);
  ctx.bezierCurveTo(-halfW * 0.7, topY + baseH * 0.06, -neckW * 1.1, topY + baseH * 0.04, -neckW * 0.85, topY);
  ctx.lineTo(0, topY + baseH * 0.28);
  ctx.lineTo(neckW * 0.85, topY);
  ctx.bezierCurveTo(neckW * 1.1, topY + baseH * 0.04, halfW * 0.7, topY + baseH * 0.06, halfW * 1.05, topY + baseH * 0.4);
  ctx.lineTo(halfW * 1.05, 0);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-neckW * 0.85, topY);
  ctx.lineTo(-neckW * 0.1, topY + baseH * 0.28);
  ctx.lineTo(-neckW * 0.6, topY + baseH * 0.32);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(neckW * 0.85, topY);
  ctx.lineTo(neckW * 0.1, topY + baseH * 0.28);
  ctx.lineTo(neckW * 0.6, topY + baseH * 0.32);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}
