/**
 * Cloud API Cutout Integrations (Remove.bg, ClipDrop, PhotoRoom, Cutout.pro, Custom)
 */

export async function removeBgWithCloudApi(imageElement, provider = 'removebg', apiKey = '', customEndpoint = '') {
  if (!apiKey && provider !== 'custom') throw new Error('API Key is missing for cloud provider: ' + provider);

  const canvas = document.createElement('canvas');
  canvas.width = imageElement.naturalWidth || imageElement.width;
  canvas.height = imageElement.naturalHeight || imageElement.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imageElement, 0, 0);

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  const formData = new FormData();
  let requestUrl = '';
  const headers = {};

  if (provider === 'removebg') {
    requestUrl = 'https://api.remove.bg/v1.0/removebg';
    headers['X-Api-Key'] = apiKey;
    formData.append('image_file', blob, 'portrait.png');
    formData.append('size', 'auto');
  } else if (provider === 'clipdrop') {
    requestUrl = 'https://clipdrop-api.co/remove-background/v1';
    headers['x-api-key'] = apiKey;
    formData.append('image_file', blob, 'portrait.png');
  } else if (provider === 'custom') {
    requestUrl = customEndpoint;
    if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;
    formData.append('image', blob, 'portrait.png');
  }

  const response = await fetch(requestUrl, { method: 'POST', headers, body: formData });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Cloud API error (${response.status}): ${errText.substring(0, 100)}`);
  }

  const resultBlob = await response.blob();
  const processedImg = new Image();
  const objectUrl = URL.createObjectURL(resultBlob);
  await new Promise((resolve, reject) => {
    processedImg.onload = () => { URL.revokeObjectURL(objectUrl); resolve(); };
    processedImg.onerror = reject;
    processedImg.src = objectUrl;
  });
  return processedImg;
}

export async function removeBgWithPhotoRoom(imageElement, apiKey) {
  if (!apiKey) throw new Error('PhotoRoom API Key is missing');
  return removeBgWithCloudService(imageElement, 'https://sdk.photoroom.com/v1/segment', { 'x-api-key': apiKey }, 'image_file');
}

export async function removeBgWithCutoutPro(imageElement, apiKey) {
  if (!apiKey) throw new Error('Cutout.pro API Key is missing');
  return removeBgWithCloudService(imageElement, 'https://www.cutout.pro/api/v1/matting?mattingType=1', { 'APIKEY': apiKey }, 'file');
}

async function removeBgWithCloudService(imageElement, url, headers, fileParam) {
  const canvas = document.createElement('canvas');
  canvas.width = imageElement.naturalWidth || imageElement.width;
  canvas.height = imageElement.naturalHeight || imageElement.height;
  canvas.getContext('2d').drawImage(imageElement, 0, 0);

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  const formData = new FormData();
  formData.append(fileParam, blob, 'photo.png');
  if (url.includes('cutout.pro')) formData.append('mattingType', '1');

  const res = await fetch(url, { method: 'POST', headers, body: formData });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API Error (${res.status}): ${err.substring(0, 100)}`);
  }
  const resultBlob = await res.blob();
  const processedImg = new Image();
  const objUrl = URL.createObjectURL(resultBlob);
  await new Promise((resolve, reject) => {
    processedImg.onload = () => { URL.revokeObjectURL(objUrl); resolve(); };
    processedImg.onerror = reject;
    processedImg.src = objUrl;
  });
  return processedImg;
}
