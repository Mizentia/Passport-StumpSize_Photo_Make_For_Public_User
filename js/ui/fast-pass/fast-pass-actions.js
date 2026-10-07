import { appState } from '../../core/state.js';

export function executeFastPassStep(currentStep) {
  let nextStep = currentStep;

  switch (currentStep) {
    case 'center':
      document.getElementById('btnLeftTabPresets')?.click();
      nextStep = 'presets';
      break;

    case 'presets':
      const firstPresetBtn = document.querySelector('#photoPresetGrid .preset-btn');
      if (firstPresetBtn) {
        firstPresetBtn.click();
      } else {
        appState.set('selectedPreset', 'bd_passport', true);
      }
      document.getElementById('btnLeftTabBackdrop')?.click();
      nextStep = 'backdrop';
      break;

    case 'backdrop':
      document.getElementById('btnRemoveBg')?.click();
      document.getElementById('btnRightTabRetouch')?.click();
      nextStep = 'retouch';
      break;

    case 'retouch':
      document.getElementById('btnRightTabAttire')?.click();
      nextStep = 'attire';
      break;

    case 'attire':
      document.querySelector('.step-btn[data-tab="sheet"]')?.click();
      nextStep = 'sheet';
      break;

    case 'sheet':
      document.getElementById('btnPrintDirect')?.click();
      nextStep = 'sheet';
      break;

    default:
      nextStep = 'center';
  }

  return nextStep;
}
