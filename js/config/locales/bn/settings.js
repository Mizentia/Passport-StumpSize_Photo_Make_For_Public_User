import { BN_SETTINGS_QUALITY } from './settings-quality.js';
import { BN_SETTINGS_ADVANCED } from './settings-advanced.js';
import { BN_SETTINGS_UI } from './settings-ui.js';

export const BN_SETTINGS = {
  ...BN_SETTINGS_QUALITY,
  ...BN_SETTINGS_ADVANCED,
  ...BN_SETTINGS_UI
};
