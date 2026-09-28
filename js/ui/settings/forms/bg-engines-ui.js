import { appState } from '../../../core/state.js';
import { t } from '../../../config/i18n.js';
import { toastService } from '../../toast-service.js';

export function populateBgEngines(engines) {
  const g = id => document.getElementById(id);
  const setV = (id, val) => { const el = g(id); if (el) el.value = val || ''; };
  const setC = (id, val) => { const el = g(id); if (el) el.checked = !!val; };

  setC('chkEngineLocalAi', engines.local_ai?.enabled !== false);
  setC('chkBanana', engines.banana?.enabled); setV('inputBananaApiKey', engines.banana?.apiKey); setV('inputBananaModelKey', engines.banana?.modelKey);
  setC('chkGemini', engines.gemini?.enabled); setV('selectGeminiModel', engines.gemini?.model || 'gemini-2.0-flash'); setV('inputGeminiApiKey', engines.gemini?.apiKey);
  setC('chkHuggingFace', engines.huggingface?.enabled); setV('selectHfModel', engines.huggingface?.model || 'ZhengPeng7/BiRefNet'); setV('inputHfApiKey', engines.huggingface?.apiKey);
  setC('chkPhotoRoom', engines.photoroom?.enabled); setV('inputPhotoRoomKey', engines.photoroom?.apiKey);
  setC('chkCutoutPro', engines.cutoutpro?.enabled); setV('inputCutoutProKey', engines.cutoutpro?.apiKey);
  setC('chkRemoveBg', engines.removebg?.enabled); setV('inputRemoveBgKey', engines.removebg?.apiKey || appState.get('bgApiKey'));
  setC('chkClipDrop', engines.clipdrop?.enabled); setV('inputClipDropKey', engines.clipdrop?.apiKey);
  setC('chkCustomApi', engines.custom_api?.enabled); setV('inputCustomApiEndpoint', engines.custom_api?.endpoint || appState.get('bgCustomEndpoint')); setV('inputCustomApiKey', engines.custom_api?.apiKey);
  setC('chkFloodFill', engines.floodfill?.enabled !== false); setC('chkChromaKey', engines.chromakey?.enabled);

  const sync = (chkId, cardId) => { const c = g(chkId), el = g(cardId); if (el && c) el.classList.toggle('enabled', c.checked); };
  ['LocalAi', 'Banana', 'Gemini', 'HuggingFace', 'PhotoRoom', 'CutoutPro', 'RemoveBg', 'ClipDrop', 'CustomApi', 'FloodFill', 'ChromaKey'].forEach(name => sync(`chkEngine${name}`, `cardEngine${name}`));

  const setupToggle = (chkId, cardId, inpId, msg) => {
    const chk = g(chkId), inp = g(inpId);
    if (chk && !chk._hasListener) {
      chk._hasListener = true;
      chk.addEventListener('change', () => {
        if (chk.checked && inp && !inp.value?.trim()) { chk.checked = false; inp.focus(); toastService.show(msg, 'warning'); }
        sync(chkId, cardId);
      });
    }
  };
  setupToggle('chkEngineLocalAi', 'cardEngineLocalAi', null, '');
  setupToggle('chkEngineBanana', 'cardEngineBanana', 'inputBananaApiKey', t('err_enter_banana_key') || 'Enter Banana Key');
  setupToggle('chkEngineGemini', 'cardEngineGemini', 'inputGeminiApiKey', t('err_enter_gemini_key') || 'Enter Gemini Key');
  setupToggle('chkEngineHuggingFace', 'cardEngineHuggingFace', 'inputHfApiKey', t('err_enter_hf_key') || 'Enter HF Token');
  setupToggle('chkEnginePhotoRoom', 'cardEnginePhotoRoom', 'inputPhotoRoomKey', t('err_enter_photoroom_key') || 'Enter PhotoRoom Key');
  setupToggle('chkEngineCutoutPro', 'cardEngineCutoutPro', 'inputCutoutProKey', t('err_enter_cutoutpro_key') || 'Enter Cutout.pro Key');
  setupToggle('chkEngineRemoveBg', 'cardEngineRemoveBg', 'inputRemoveBgKey', t('err_enter_removebg_key') || 'Enter Remove.bg Key');
  setupToggle('chkEngineClipDrop', 'cardEngineClipDrop', 'inputClipDropKey', t('err_enter_clipdrop_key') || 'Enter ClipDrop Key');
  setupToggle('chkEngineCustomApi', 'cardEngineCustomApi', 'inputCustomApiEndpoint', t('err_enter_endpoint') || 'Enter Endpoint');
  setupToggle('chkEngineFloodFill', 'cardEngineFloodFill', null, '');
  setupToggle('chkEngineChromaKey', 'cardEngineChromaKey', null, '');
}

export function readBgEngines() {
  const g = id => document.getElementById(id);
  const val = id => g(id)?.value?.trim() || '';
  const chk = id => !!g(id)?.checked;
  return {
    local_ai: { enabled: g('chkEngineLocalAi') ? g('chkEngineLocalAi').checked : true },
    banana: { enabled: chk('chkEngineBanana') && !!val('inputBananaApiKey'), apiKey: val('inputBananaApiKey'), modelKey: val('inputBananaModelKey') },
    gemini: { enabled: chk('chkEngineGemini') && !!val('inputGeminiApiKey'), model: val('selectGeminiModel') || 'gemini-2.0-flash', apiKey: val('inputGeminiApiKey') },
    huggingface: { enabled: chk('chkEngineHuggingFace') && !!val('inputHfApiKey'), model: val('selectHfModel') || 'ZhengPeng7/BiRefNet', apiKey: val('inputHfApiKey') },
    photoroom: { enabled: chk('chkEnginePhotoRoom') && !!val('inputPhotoRoomKey'), apiKey: val('inputPhotoRoomKey') },
    cutoutpro: { enabled: chk('chkEngineCutoutPro') && !!val('inputCutoutProKey'), apiKey: val('inputCutoutProKey') },
    removebg: { enabled: chk('chkEngineRemoveBg') && !!val('inputRemoveBgKey'), apiKey: val('inputRemoveBgKey') },
    clipdrop: { enabled: chk('chkEngineClipDrop') && !!val('inputClipDropKey'), apiKey: val('inputClipDropKey') },
    custom_api: { enabled: chk('chkEngineCustomApi') && !!val('inputCustomApiEndpoint'), endpoint: val('inputCustomApiEndpoint'), apiKey: val('inputCustomApiKey') },
    floodfill: { enabled: g('chkEngineFloodFill') ? g('chkEngineFloodFill').checked : true },
    chromakey: { enabled: chk('chkEngineChromaKey') }
  };
}
