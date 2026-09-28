import {
  removeBgWithCloudApi, removeBgWithPhotoRoom, removeBgWithCutoutPro
} from './cloud-api.js';
import { removeBgLocalAi } from './local-ai.js';
import { removeBgChromaKey, removeBgFloodFill } from './chroma-key.js';
import { removeBgWithGemini, removeBgWithHuggingFace, removeBgWithBananaAi } from './vision-ai.js';

export async function invokeSelectedEngine(engine, img, cfg, opts) {
  const { featherRadius, tolerance } = opts;
  if (engine === 'local_ai') return await removeBgLocalAi(img, { featherRadius });
  if (engine === 'banana') return await removeBgWithBananaAi(img, cfg.apiKey, cfg.modelKey);
  if (engine === 'gemini') return await removeBgWithGemini(img, cfg.apiKey, cfg.model || 'gemini-2.0-flash');
  if (engine === 'huggingface') return await removeBgWithHuggingFace(img, cfg.apiKey, cfg.model || 'ZhengPeng7/BiRefNet');
  if (engine === 'photoroom') return await removeBgWithPhotoRoom(img, cfg.apiKey);
  if (engine === 'cutoutpro') return await removeBgWithCutoutPro(img, cfg.apiKey);
  if (engine === 'removebg') return await removeBgWithCloudApi(img, 'removebg', cfg.apiKey);
  if (engine === 'clipdrop') return await removeBgWithCloudApi(img, 'clipdrop', cfg.apiKey);
  if (engine === 'custom_api') return await removeBgWithCloudApi(img, 'custom', cfg.apiKey, cfg.endpoint);
  if (engine === 'chromakey') return await removeBgChromaKey(img, { keyColor: cfg.keyColor || '#00ff00', tolerance: cfg.tolerance || tolerance });
  return await removeBgFloodFill(img, { tolerance, featherRadius });
}
