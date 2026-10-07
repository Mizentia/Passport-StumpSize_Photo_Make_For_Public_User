import { appState } from '../../core/state.js';
import { applyFastPassFocus, clearFastPassFocus } from './fast-pass-badges.js';
import { executeFastPassStep } from './fast-pass-actions.js';

let currentStep = 'center';

export function setFastPassStep(stepKey) {
  currentStep = stepKey;
  applyFastPassFocus(stepKey);
}

function shouldIgnoreEnterKey(e) {
  if (e.key !== 'Enter') return true;
  const tag = document.activeElement?.tagName?.toLowerCase();
  if (tag === 'input' || tag === 'textarea') return true;
  if (document.querySelectorAll('.modal-backdrop.active').length > 0) return true;
  const activeTab = appState.get('activeTab');
  return activeTab !== 'editor' && activeTab !== 'sheet';
}

function bindSectionMouseHover(selector, stepKey) {
  const el = document.querySelector(selector);
  if (!el) return;
  const handleInteraction = () => {
    const tab = appState.get('activeTab');
    if ((tab === 'editor' && stepKey !== 'sheet') || (tab === 'sheet' && stepKey === 'sheet')) {
      if (currentStep !== stepKey) setFastPassStep(stepKey);
    }
  };
  el.addEventListener('pointerenter', handleInteraction);
  el.addEventListener('click', handleInteraction);
}

export function initFastPassWorkflow() {
  window.addEventListener('keydown', (e) => {
    if (shouldIgnoreEnterKey(e)) return;
    e.preventDefault();
    const nextStep = executeFastPassStep(currentStep);
    setFastPassStep(nextStep);
  });

  const bindAllMouse = () => {
    bindSectionMouseHover('.canvas-viewport-card', 'center');
    bindSectionMouseHover('#panelPresets', 'presets');
    bindSectionMouseHover('#panelBackdrop', 'backdrop');
    bindSectionMouseHover('#panelRetouch', 'retouch');
    bindSectionMouseHover('#panelAttire', 'attire');
    bindSectionMouseHover('#sheetTab', 'sheet');
  };

  setTimeout(bindAllMouse, 300);

  appState.on('activeTab', (tab) => {
    if (tab === 'editor' && appState.get('originalImage')) {
      setFastPassStep('center');
    } else if (tab === 'sheet') {
      setFastPassStep('sheet');
    } else {
      clearFastPassFocus();
    }
  });

  appState.on('lang', () => {
    const tab = appState.get('activeTab');
    if (tab === 'editor' || tab === 'sheet') applyFastPassFocus(currentStep);
  });
}
