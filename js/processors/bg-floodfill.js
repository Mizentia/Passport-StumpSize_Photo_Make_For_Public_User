export function sampleBorderColors(data, w, h) {
  const samples = [];
  const stepX = Math.max(1, Math.floor(w / 30));
  const stepY = Math.max(1, Math.floor(h / 30));
  for (let x = 0; x < w; x += stepX) {
    const idx = x * 4;
    samples.push([data[idx], data[idx + 1], data[idx + 2]]);
  }
  for (let y = 0; y < h * 0.75; y += stepY) {
    const lIdx = (y * w) * 4, rIdx = (y * w + (w - 1)) * 4;
    samples.push([data[lIdx], data[lIdx + 1], data[lIdx + 2]]);
    samples.push([data[rIdx], data[rIdx + 1], data[rIdx + 2]]);
  }
  let sumR = 0, sumG = 0, sumB = 0;
  samples.forEach(s => { sumR += s[0]; sumG += s[1]; sumB += s[2]; });
  const bgR = sumR / samples.length, bgG = sumG / samples.length, bgB = sumB / samples.length;

  const colorDist = (r, g, b, tR, tG, tB) => Math.sqrt((r - tR) ** 2 + (g - tG) ** 2 + (b - tB) ** 2);
  const getMinBorderDist = (r, g, b) => {
    let minD = colorDist(r, g, b, bgR, bgG, bgB);
    for (let s = 0; s < samples.length; s += 2) {
      const d = colorDist(r, g, b, samples[s][0], samples[s][1], samples[s][2]);
      if (d < minD) minD = d;
    }
    return minD;
  };
  return { getMinBorderDist, colorDist };
}

export function runFloodFillSegmentation(data, w, h, tolerance, { getMinBorderDist, colorDist }) {
  const thresh = Math.max(18, tolerance);
  const isBg = new Uint8Array(w * h);
  const queue = [];

  for (let x = 0; x < w; x++) {
    const idxTop = x * 4;
    if (getMinBorderDist(data[idxTop], data[idxTop + 1], data[idxTop + 2]) < thresh * 1.25) {
      isBg[x] = 2; queue.push(x);
    }
    if (x < w * 0.15 || x > w * 0.85) {
      const bIdx = ((h - 1) * w + x) * 4;
      if (getMinBorderDist(data[bIdx], data[bIdx + 1], data[bIdx + 2]) < thresh) {
        isBg[(h - 1) * w + x] = 2; queue.push((h - 1) * w + x);
      }
    }
  }

  for (let y = 0; y < h; y++) {
    const lIdx = (y * w) * 4, rPos = y * w + (w - 1), rIdx = rPos * 4;
    if (isBg[y * w] === 0 && getMinBorderDist(data[lIdx], data[lIdx + 1], data[lIdx + 2]) < thresh * 1.2) {
      isBg[y * w] = 2; queue.push(y * w);
    }
    if (isBg[rPos] === 0 && getMinBorderDist(data[rIdx], data[rIdx + 1], data[rIdx + 2]) < thresh * 1.2) {
      isBg[rPos] = 2; queue.push(rPos);
    }
  }

  let head = 0;
  while (head < queue.length) {
    const curr = queue[head++];
    isBg[curr] = 1;
    const cx = curr % w, cy = Math.floor(curr / w), cIdx = curr * 4;
    const cr = data[cIdx], cg = data[cIdx + 1], cb = data[cIdx + 2];
    const neighbors = [cy > 0 ? curr - w : -1, cy < h - 1 ? curr + w : -1, cx > 0 ? curr - 1 : -1, cx < w - 1 ? curr + 1 : -1];

    for (let n = 0; n < 4; n++) {
      const nPos = neighbors[n];
      if (nPos >= 0 && isBg[nPos] === 0) {
        const nIdx = nPos * 4;
        const nr = data[nIdx], ng = data[nIdx + 1], nb = data[nIdx + 2];
        const distToBg = getMinBorderDist(nr, ng, nb);
        const distToCurr = colorDist(nr, ng, nb, cr, cg, cb);
        if (distToBg < thresh || (distToBg < thresh * 1.4 && distToCurr < 18)) {
          isBg[nPos] = 2; queue.push(nPos);
        }
      }
    }
  }
  return { isBg, thresh };
}
