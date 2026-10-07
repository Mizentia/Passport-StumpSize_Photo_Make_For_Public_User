import { appState } from '../../core/state.js';

const STEP_SELECTORS = {
  center: '.canvas-viewport-card',
  presets: '#panelPresets',
  backdrop: '#panelBackdrop',
  retouch: '#panelRetouch',
  attire: '#panelAttire',
  sheet: '#sheetTab .sheet-preview-card, #sheetTab'
};

const STEP_LABELS = {
  center: { bn: 'এন্টার ↵: সাইজ প্যানেল', en: 'Enter ↵: Sizes & Presets' },
  presets: { bn: 'এন্টার ↵: ১.৫x২" সাইজ ও ব্যাকড্রপ', en: 'Enter ↵: 1.5x2" & Backdrop' },
  backdrop: { bn: 'এন্টার ↵: ব্যাকগ্রাউন্ড রিমুভ', en: 'Enter ↵: Remove Background' },
  retouch: { bn: 'এন্টার ↵: ফরমাল স্যুট', en: 'Enter ↵: Formal Attire' },
  attire: { bn: 'এন্টার ↵: প্রিন্ট শীট', en: 'Enter ↵: Print Sheet' },
  sheet: { bn: 'এন্টার ↵: সরাসরি প্রিন্ট', en: 'Enter ↵: Direct Print' }
};

export function clearFastPassFocus() {
  document.querySelectorAll('.fastpass-focused-section').forEach(el => el.classList.remove('fastpass-focused-section'));
  document.querySelectorAll('.fastpass-step-badge').forEach(b => b.remove());
}

export function applyFastPassFocus(stepKey) {
  clearFastPassFocus();
  const selector = STEP_SELECTORS[stepKey];
  if (!selector) return null;

  const target = document.querySelector(selector);
  if (!target) return null;

  target.classList.add('fastpass-focused-section');

  const isBn = appState.get('lang') === 'bn';
  const labelObj = STEP_LABELS[stepKey] || { bn: 'এন্টার ↵', en: 'Enter ↵' };
  const text = isBn ? labelObj.bn : labelObj.en;

  const badge = document.createElement('div');
  badge.className = 'fastpass-step-badge';
  badge.innerHTML = `<span>${text}</span>`;
  target.appendChild(badge);

  return target;
}
