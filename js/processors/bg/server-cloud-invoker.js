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

    const data = await response.json().catch(() => ({}));
    if (data.success && data.resultImageBase64) {
      const processedImg = new Image();
      await new Promise((resolve, reject) => {
        processedImg.onload = resolve;
        processedImg.onerror = reject;
        processedImg.src = data.resultImageBase64;
      });
      return { success: true, image: processedImg };
    }
    return {
      success: false,
      fallbackToLocal: data.fallbackToLocal ?? false,
      error: data.error || (response.ok ? 'সার্ভার প্রসেসিং ব্যর্থ হয়েছে।' : `সার্ভার এরর কোড: ${response.status}`)
    };
  } catch (e) {
    return { success: false, fallbackToLocal: false, error: e.message };
  }
}
