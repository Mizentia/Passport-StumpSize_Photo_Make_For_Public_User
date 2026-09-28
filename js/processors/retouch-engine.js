/**
 * Retouching Engine: Spot Healing, Skin Smoothing, and Red-Eye Correction
 */

export function applySpotHealing(canvas, cx, cy, radius = 15) {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const w = canvas.width;
  const h = canvas.height;

  const minX = Math.max(0, Math.floor(cx - radius - 6));
  const maxX = Math.min(w - 1, Math.ceil(cx + radius + 6));
  const minY = Math.max(0, Math.floor(cy - radius - 6));
  const maxY = Math.min(h - 1, Math.ceil(cy + radius + 6));
  const boxW = maxX - minX + 1;
  const boxH = maxY - minY + 1;

  if (boxW <= 0 || boxH <= 0) return;

  const imgData = ctx.getImageData(minX, minY, boxW, boxH);
  const data = imgData.data;

  // Sample perimeter pixels (annular ring outside radius)
  let sumR = 0, sumG = 0, sumB = 0, count = 0;
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const dist = Math.hypot(x - cx, y - cy);
      if (dist >= radius && dist <= radius + 5) {
        const idx = ((y - minY) * boxW + (x - minX)) * 4;
        sumR += data[idx];
        sumG += data[idx + 1];
        sumB += data[idx + 2];
        count++;
      }
    }
  }

  if (count === 0) return;
  const avgR = sumR / count;
  const avgG = sumG / count;
  const avgB = sumB / count;

  // Smoothly blend interior pixels towards surrounding skin average
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const dist = Math.hypot(x - cx, y - cy);
      if (dist <= radius) {
        const factor = Math.cos((dist / radius) * (Math.PI / 2)); // 1 at center, 0 at edge
        const idx = ((y - minY) * boxW + (x - minX)) * 4;
        data[idx] = Math.round(data[idx] * (1 - factor) + avgR * factor);
        data[idx + 1] = Math.round(data[idx + 1] * (1 - factor) + avgG * factor);
        data[idx + 2] = Math.round(data[idx + 2] * (1 - factor) + avgB * factor);
      }
    }
  }

  ctx.putImageData(imgData, minX, minY);
}

export function applyRedEyeFix(canvas, cx, cy, radius = 12) {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const w = canvas.width;
  const h = canvas.height;

  const minX = Math.max(0, Math.floor(cx - radius));
  const maxX = Math.min(w - 1, Math.ceil(cx + radius));
  const minY = Math.max(0, Math.floor(cy - radius));
  const maxY = Math.min(h - 1, Math.ceil(cy + radius));
  const boxW = maxX - minX + 1;
  const boxH = maxY - minY + 1;

  if (boxW <= 0 || boxH <= 0) return;

  const imgData = ctx.getImageData(minX, minY, boxW, boxH);
  const data = imgData.data;

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const dist = Math.hypot(x - cx, y - cy);
      if (dist <= radius) {
        const idx = ((y - minY) * boxW + (x - minX)) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        // If pixel exhibits typical flash red-eye signature (Red heavily dominating Green and Blue)
        if (r > 60 && r > (g + b) * 0.8) {
          const intensity = (g + b) / 2;
          data[idx] = Math.round(intensity * 0.8);
          data[idx + 1] = Math.round(intensity * 0.85);
          data[idx + 2] = Math.round(intensity * 0.9);
        }
      }
    }
  }

  ctx.putImageData(imgData, minX, minY);
}
