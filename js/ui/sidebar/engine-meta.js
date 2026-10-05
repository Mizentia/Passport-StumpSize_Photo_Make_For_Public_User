import { appState } from '../../core/state.js';

export function getEngineMeta(engineKey) {
  const isBn = appState.get('lang') === 'bn';
  const meta = {
    nl_studio_ai: { name: isBn ? '⚡ NL Studio AI (স্বয়ংক্রিয়)' : '⚡ NL Studio AI (Auto Studio)', shortName: 'NL Studio AI', icon: '⚡', hasChroma: false },
    local_ai: { name: isBn ? '💻 অফলাইন লোকাল AI' : '💻 Offline Local AI', shortName: isBn ? 'লোকাল AI' : 'Local AI', icon: '💻', hasChroma: false },
    banana: { name: '🍌 Banana AI / Nano Vision', shortName: 'Banana AI', icon: '🍌', hasChroma: false },
    gemini: { name: '✨ Google Gemini AI', shortName: 'Gemini AI', icon: '✨', hasChroma: false },
    huggingface: { name: '🤗 Hugging Face BiRefNet', shortName: 'BiRefNet', icon: '🤗', hasChroma: false },
    photoroom: { name: '📸 PhotoRoom Studio AI', shortName: 'PhotoRoom', icon: '📸', hasChroma: false },
    cutoutpro: { name: '✂️ Cutout.pro Passport AI', shortName: 'Cutout.pro', icon: '✂️', hasChroma: false },
    removebg: { name: '☁️ Remove.bg AI (Cloud)', shortName: 'Remove.bg', icon: '☁️', hasChroma: false },
    clipdrop: { name: '☁️ ClipDrop AI (Cloud)', shortName: 'ClipDrop', icon: '☁️', hasChroma: false },
    custom_api: { name: isBn ? '🛠️ কাস্টম AI সার্ভার' : '🛠️ Custom AI Server', shortName: isBn ? 'কাস্টম সার্ভার' : 'Custom Server', icon: '🛠️', hasChroma: false },
    floodfill: { name: isBn ? '🎯 কালার ফ্লাড-ফিল' : '🎯 Color Flood-Fill', shortName: isBn ? 'ফ্লাড-ফিল' : 'Flood-Fill', icon: '🎯', hasChroma: false },
    chromakey: { name: isBn ? '🟩 ক্রোমা কি (গ্রিন/ব্লু)' : '🟩 Chroma Key Screen', shortName: isBn ? 'ক্রোমা কি' : 'Chroma Key', icon: '🟩', hasChroma: true }
  };
  return meta[engineKey] || { name: engineKey, shortName: engineKey, icon: '🪄', hasChroma: false };
}

export function updateBgEngineSelectorUI() {
  const selectEngine = document.getElementById('selectActiveBgEngine');
  const btnRemoveBg = document.getElementById('btnRemoveBg');
  const rowChroma = document.getElementById('rowChromaKeyColor');
  const inputChromaColor = document.getElementById('inputChromaKeyColor');

  const enginesConfig = appState.get('bgEnginesConfig') || { nl_studio_ai: { enabled: true }, local_ai: { enabled: true }, floodfill: { enabled: true } };
  if (!enginesConfig.nl_studio_ai) enginesConfig.nl_studio_ai = { enabled: true };
  let selected = appState.get('selectedBgEngine') || 'nl_studio_ai';

  if (!enginesConfig[selected]?.enabled) {
    selected = 'nl_studio_ai';
    appState.set('selectedBgEngine', selected, false);
  }

  if (selectEngine) {
    selectEngine.innerHTML = '';
    const enabledKeys = Object.keys(enginesConfig).filter(k => enginesConfig[k]?.enabled);
    if (!enabledKeys.includes('nl_studio_ai')) enabledKeys.unshift('nl_studio_ai');

    enabledKeys.forEach(k => {
      const meta = getEngineMeta(k);
      const opt = document.createElement('option');
      opt.value = k; opt.textContent = meta.name; opt.selected = (k === selected);
      selectEngine.appendChild(opt);
    });
    selectEngine.value = selected;
  }

  const currentMeta = getEngineMeta(selected);
  if (btnRemoveBg && !btnRemoveBg.disabled) {
    const isBn = appState.get('lang') === 'bn';
    btnRemoveBg.innerHTML = `<span>${currentMeta.icon || '🪄'}</span> <span>${isBn ? 'ব্যাকগ্রাউন্ড মুছুন' : 'Remove Background'}</span>`;
  }

  if (rowChroma) rowChroma.style.display = (selected === 'chromakey') ? 'block' : 'none';
  if (inputChromaColor) inputChromaColor.value = enginesConfig.chromakey?.keyColor || '#00ff00';
}
