export function drawSchoolUniform(ctx, halfW, topY, baseH, collarFactor) {
  const neckW = halfW * 0.34 * collarFactor;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(-halfW * 1.05, 0); ctx.lineTo(-halfW * 1.05, topY + baseH * 0.45);
  ctx.bezierCurveTo(-halfW * 0.7, topY + baseH * 0.08, -neckW * 1.1, topY + baseH * 0.05, -neckW * 0.9, topY);
  ctx.lineTo(0, topY + baseH * 0.22); ctx.lineTo(neckW * 0.9, topY);
  ctx.bezierCurveTo(neckW * 1.1, topY + baseH * 0.05, halfW * 0.7, topY + baseH * 0.08, halfW * 1.05, topY + baseH * 0.45);
  ctx.lineTo(halfW * 1.05, 0); ctx.closePath(); ctx.fill();

  ctx.fillStyle = '#1e3a8a';
  ctx.beginPath();
  ctx.moveTo(-neckW * 0.18, topY + baseH * 0.18); ctx.lineTo(neckW * 0.18, topY + baseH * 0.18);
  ctx.lineTo(neckW * 0.14, topY + baseH * 0.26); ctx.lineTo(-neckW * 0.14, topY + baseH * 0.26);
  ctx.closePath(); ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-neckW * 0.14, topY + baseH * 0.26); ctx.lineTo(neckW * 0.14, topY + baseH * 0.26);
  ctx.lineTo(neckW * 0.22, topY + baseH * 0.85); ctx.lineTo(0, topY + baseH * 0.95);
  ctx.lineTo(-neckW * 0.22, topY + baseH * 0.85); ctx.closePath(); ctx.fill();

  ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-neckW * 0.1, topY + baseH * 0.38); ctx.lineTo(neckW * 0.14, topY + baseH * 0.48);
  ctx.moveTo(-neckW * 0.12, topY + baseH * 0.58); ctx.lineTo(neckW * 0.16, topY + baseH * 0.68);
  ctx.stroke();

  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-neckW * 0.9, topY); ctx.lineTo(-neckW * 0.1, topY + baseH * 0.22); ctx.lineTo(-neckW * 0.55, topY + baseH * 0.32);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(neckW * 0.9, topY); ctx.lineTo(neckW * 0.1, topY + baseH * 0.22); ctx.lineTo(neckW * 0.55, topY + baseH * 0.32);
  ctx.closePath(); ctx.fill(); ctx.stroke();
}

export function drawAcademicGown(ctx, halfW, topY, baseH, collarFactor) {
  const neckW = halfW * 0.4 * collarFactor;
  ctx.fillStyle = '#18181b';
  ctx.beginPath();
  ctx.moveTo(-halfW * 1.08, 0); ctx.lineTo(-halfW * 1.08, topY + baseH * 0.5);
  ctx.bezierCurveTo(-halfW * 0.7, topY + baseH * 0.05, -neckW * 1.1, topY + baseH * 0.03, -neckW * 0.9, topY);
  ctx.lineTo(0, topY + baseH * 0.35); ctx.lineTo(neckW * 0.9, topY);
  ctx.bezierCurveTo(neckW * 1.1, topY + baseH * 0.03, halfW * 0.7, topY + baseH * 0.05, halfW * 1.08, topY + baseH * 0.5);
  ctx.lineTo(halfW * 1.08, 0); ctx.closePath(); ctx.fill();

  ctx.fillStyle = '#eab308';
  ctx.beginPath();
  ctx.moveTo(-neckW * 0.9, topY); ctx.lineTo(-neckW * 0.35, topY + baseH * 0.72);
  ctx.lineTo(0, topY + baseH * 0.56); ctx.lineTo(neckW * 0.35, topY + baseH * 0.72);
  ctx.lineTo(neckW * 0.9, topY); ctx.lineTo(neckW * 0.5, topY + baseH * 0.2);
  ctx.lineTo(0, topY + baseH * 0.35); ctx.lineTo(-neckW * 0.5, topY + baseH * 0.2);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#2563eb'; ctx.lineWidth = 4; ctx.stroke();
}
