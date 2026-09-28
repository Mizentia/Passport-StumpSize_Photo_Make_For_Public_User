export async function tryServerSideBgRemoval(imageElement, provider = 'auto') {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = imageElement.naturalWidth || imageElement.width || 400;
    canvas.height = imageElement.naturalHeight || imageElement.height || 400;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imageElement, 0, 0);

    const imageBase64 = canvas.toDataURL('image/png');
    const response = await fetch('/api/bg-remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, provider })
    });

    if (!response.ok) return null;
    const data = await response.json();
    if (data.success && data.resultImageBase64) {
      const processedImg = new Image();
      await new Promise((resolve, reject) => {
        processedImg.onload = resolve;
        processedImg.onerror = reject;
        processedImg.src = data.resultImageBase64;
      });
      return processedImg;
    }
    return null;
  } catch (e) {
    return null;
  }
}
