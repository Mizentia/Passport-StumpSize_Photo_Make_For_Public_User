/**
 * Formal Men's Shirt Canvas Renderer
 */

export function drawMenShirt(ctx, halfW, topY, baseH, collarFactor, shirtColor = '#ffffff') {
  const neckW = halfW * 0.35 * collarFactor;
  ctx.fillStyle = shirtColor;
  ctx.beginPath();
  ctx.moveTo(-halfW * 1.05, 0);
  ctx.lineTo(-halfW * 1.05, topY + baseH * 0.45);
  ctx.bezierCurveTo(-halfW * 0.7, topY + baseH * 0.08, -neckW * 1.1, topY + baseH * 0.05, -neckW * 0.9, topY);
  ctx.lineTo(0, topY + baseH * 0.2);
  ctx.lineTo(neckW * 0.9, topY);
  ctx.bezierCurveTo(neckW * 1.1, topY + baseH * 0.05, halfW * 0.7, topY + baseH * 0.08, halfW * 1.05, topY + baseH * 0.45);
  ctx.lineTo(halfW * 1.05, 0);
  ctx.closePath();
  ctx.fill();

  // Placket & Buttons
  ctx.fillStyle = shirtColor === '#ffffff' ? '#f8fafc' : '#e0f2fe';
  ctx.fillRect(-9, topY + baseH * 0.2, 18, baseH * 0.8);
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  ctx.strokeRect(-9, topY + baseH * 0.2, 18, baseH * 0.8);
  
  ctx.fillStyle = '#94a3b8';
  for (let i = 1; i <= 4; i++) {
    ctx.beginPath();
    ctx.arc(0, topY + baseH * (0.2 + i * 0.17), 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Collar Points
  ctx.fillStyle = shirtColor;
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-neckW * 0.9, topY);
  ctx.lineTo(-neckW * 0.1, topY + baseH * 0.22);
  ctx.lineTo(-neckW * 0.55, topY + baseH * 0.35);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(neckW * 0.9, topY);
  ctx.lineTo(neckW * 0.1, topY + baseH * 0.22);
  ctx.lineTo(neckW * 0.55, topY + baseH * 0.35);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}
