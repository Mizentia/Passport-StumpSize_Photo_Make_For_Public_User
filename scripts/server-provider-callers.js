const https = require('https');

function callCloudCutout(provider, apiKey, imageBase64, config) {
  return new Promise((resolve, reject) => {
    const rawBuffer = Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const boundary = '----PassportStudioBoundary' + Date.now().toString(16);

    let hostname = '', path = '', headers = {}, payload = null;

    if (provider === 'removebg') {
      hostname = 'api.remove.bg';
      path = '/v1.0/removebg';
      const bodyParts = [
        `--${boundary}\r\nContent-Disposition: form-data; name="size"\r\n\r\nauto\r\n`,
        `--${boundary}\r\nContent-Disposition: form-data; name="image_file"; filename="photo.png"\r\nContent-Type: image/png\r\n\r\n`
      ];
      const postHeader = Buffer.from(bodyParts[0] + bodyParts[1], 'utf8');
      const postFooter = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf8');
      payload = Buffer.concat([postHeader, rawBuffer, postFooter]);
      headers = {
        'X-Api-Key': apiKey,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': payload.length
      };
    } else if (provider === 'clipdrop') {
      hostname = 'clipdrop-api.co';
      path = '/remove-background/v1';
      const postHeader = Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="image_file"; filename="photo.png"\r\nContent-Type: image/png\r\n\r\n`, 'utf8');
      const postFooter = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf8');
      payload = Buffer.concat([postHeader, rawBuffer, postFooter]);
      headers = {
        'x-api-key': apiKey,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': payload.length
      };
    } else if (provider === 'photoroom') {
      hostname = 'sdk.photoroom.com';
      path = '/v1/segment';
      const postHeader = Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="image_file"; filename="photo.png"\r\nContent-Type: image/png\r\n\r\n`, 'utf8');
      const postFooter = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf8');
      payload = Buffer.concat([postHeader, rawBuffer, postFooter]);
      headers = {
        'x-api-key': apiKey,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': payload.length
      };
    } else if (provider === 'cutoutpro') {
      hostname = 'www.cutout.pro';
      path = '/api/v1/matting?mattingType=1';
      const postHeader = Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="photo.png"\r\nContent-Type: image/png\r\n\r\n`, 'utf8');
      const postFooter = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf8');
      payload = Buffer.concat([postHeader, rawBuffer, postFooter]);
      headers = {
        'APIKEY': apiKey,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': payload.length
      };
    } else if (provider === 'huggingface') {
      const model = config.model || 'ZhengPeng7/BiRefNet';
      hostname = 'api-inference.huggingface.co';
      path = `/models/${model}`;
      payload = rawBuffer;
      headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/octet-stream',
        'Content-Length': payload.length
      };
    } else {
      return reject(new Error('Unsupported cloud provider: ' + provider));
    }

    const req = https.request({ hostname, path, method: 'POST', headers }, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const respBuf = Buffer.concat(chunks);
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(`data:image/png;base64,${respBuf.toString('base64')}`);
        } else {
          reject(new Error(`API Error ${res.statusCode}: ${respBuf.toString('utf8').substring(0, 150)}`));
        }
      });
    });

    req.on('error', err => reject(err));
    req.write(payload);
    req.end();
  });
}

module.exports = { callCloudCutout };
