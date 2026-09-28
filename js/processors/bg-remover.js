import { toastService } from '../ui/toast-service.js';
import { t } from '../config/i18n.js';
import { appState } from '../core/state.js';
import { invokeSelectedEngine } from './bg/engine-invoker.js';
import { removeBgFloodFill } from './bg-ai-engine.js';
import { tryServerSideBgRemoval } from './bg/server-cloud-invoker.js';
import { removeBgLocalAi } from './bg/local-ai.js';

export async function removeImageBackground(imageElement, options = {}) {
  const selectedEngine = options.engine || appState.get('selectedBgEngine') || 'local_ai';
  const enginesConfig = appState.get('bgEnginesConfig') || {};
  const featherRadius = options.featherRadius || appState.get('bgFeatherRadius') || 2;
  const tolerance = options.tolerance ?? appState.get('bgTolerance') ?? 45;
  const cfg = enginesConfig[selectedEngine] || {};

  toastService.show(t(`msg_bg_processing_${selectedEngine}`) || `Processing background removal with ${selectedEngine}...`, 'info');

  // If cloud engine requested but no client-side API key provided, try server-side proxy
  if (['banana', 'gemini', 'huggingface', 'photoroom', 'cutoutpro', 'removebg', 'clipdrop'].includes(selectedEngine) && !cfg.apiKey) {
    const serverResult = await tryServerSideBgRemoval(imageElement, selectedEngine);
    if (serverResult) {
      toastService.show(t('msg_bg_removed') || '✨ Background removed successfully (Studio Cloud)!', 'success');
      return serverResult;
    }
    // If no server key either, smoothly fallback to local AI
    toastService.show(t('msg_bg_local_ai') || 'Processing with Local AI...', 'info');
    return await removeBgLocalAi(imageElement, { featherRadius });
  }

  if (selectedEngine === 'custom_api' && !cfg.endpoint) {
    const serverResult = await tryServerSideBgRemoval(imageElement, 'custom_api');
    if (serverResult) return serverResult;
    return await removeBgLocalAi(imageElement, { featherRadius });
  }

  try {
    const processedImg = await invokeSelectedEngine(selectedEngine, imageElement, cfg, { featherRadius, tolerance });
    toastService.show(t('msg_bg_removed') || '✨ Background removed successfully!', 'success');
    return processedImg;
  } catch (err) {
    console.warn(`${selectedEngine} failed, trying server proxy or local AI:`, err);
    const serverResult = await tryServerSideBgRemoval(imageElement, selectedEngine);
    if (serverResult) return serverResult;
    try {
      return await removeBgLocalAi(imageElement, { featherRadius });
    } catch (_) {
      return await removeBgFloodFill(imageElement, { tolerance, featherRadius });
    }
  }
}
