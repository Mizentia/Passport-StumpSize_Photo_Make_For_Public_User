import { toastService } from '../ui/toast-service.js';
import { t } from '../config/i18n.js';
import { appState } from '../core/state.js';
import { invokeSelectedEngine } from './bg/engine-invoker.js';
import { removeBgFloodFill } from './bg-ai-engine.js';
import { tryServerSideBgRemoval } from './bg/server-cloud-invoker.js';
import { removeBgLocalAi } from './bg/local-ai.js';

export async function removeImageBackground(imageElement, options = {}) {
  const selectedEngine = options.engine || appState.get('selectedBgEngine') || 'nl_studio_ai';
  const enginesConfig = appState.get('bgEnginesConfig') || {};
  const featherRadius = options.featherRadius || appState.get('bgFeatherRadius') || 2;
  const tolerance = options.tolerance ?? appState.get('bgTolerance') ?? 45;
  const cfg = enginesConfig[selectedEngine] || {};

  toastService.show(t(`msg_bg_processing_${selectedEngine}`) || `Processing background removal with ${selectedEngine}...`, 'info');

  if (selectedEngine === 'nl_studio_ai') {
    const serverResult = await tryServerSideBgRemoval(imageElement, 'nl_studio_ai');
    if (serverResult?.success && serverResult.image) {
      toastService.show(t('msg_bg_removed') || '✨ ব্যাকগ্রাউন্ড সফলভাবে রিমুভ হয়েছে (NL Studio AI)!', 'success');
      return serverResult.image;
    }
    const warnMsg = serverResult?.error
      ? `⚠️ ${serverResult.error}`
      : '⚠️ NL Studio AI সার্ভিসে কোনো সক্রিয় ক্রেডিট নেই অথবা সার্ভার রেসপন্স করছে না। ম্যানুয়ালি অন্য অপশন বেছে নিন।';
    toastService.show(warnMsg, 'warning');
    return null;
  }

  if (['banana', 'gemini', 'huggingface', 'photoroom', 'cutoutpro', 'removebg', 'clipdrop'].includes(selectedEngine) && !cfg.apiKey) {
    const serverResult = await tryServerSideBgRemoval(imageElement, selectedEngine);
    if (serverResult?.success && serverResult.image) {
      toastService.show(t('msg_bg_removed') || '✨ Background removed successfully (Studio Cloud)!', 'success');
      return serverResult.image;
    }
    if (serverResult?.fallbackToLocal) {
      toastService.show(t('msg_bg_local_ai') || 'Processing with Local AI...', 'info');
      return await removeBgLocalAi(imageElement, { featherRadius });
    }
    toastService.show(serverResult?.error || 'ক্লাউড ব্যাকগ্রাউন্ড রিমুভাল ব্যর্থ হয়েছে', 'warning');
    return null;
  }

  if (selectedEngine === 'custom_api' && !cfg.endpoint) {
    const serverResult = await tryServerSideBgRemoval(imageElement, 'custom_api');
    if (serverResult?.success && serverResult.image) return serverResult.image;
    return await removeBgLocalAi(imageElement, { featherRadius });
  }

  try {
    const processedImg = await invokeSelectedEngine(selectedEngine, imageElement, cfg, { featherRadius, tolerance });
    toastService.show(t('msg_bg_removed') || '✨ Background removed successfully!', 'success');
    return processedImg;
  } catch (err) {
    console.warn(`${selectedEngine} failed, trying server proxy or local AI:`, err);
    const serverResult = await tryServerSideBgRemoval(imageElement, selectedEngine);
    if (serverResult?.success && serverResult.image) return serverResult.image;
    try {
      return await removeBgLocalAi(imageElement, { featherRadius });
    } catch (_) {
      return await removeBgFloodFill(imageElement, { tolerance, featherRadius });
    }
  }
}
