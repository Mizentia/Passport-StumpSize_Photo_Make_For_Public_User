import { EN_SETTINGS_QUALITY } from './settings-quality.js';
import { EN_SETTINGS_ADVANCED } from './settings-advanced.js';
import { EN_SETTINGS_UI } from './settings-ui.js';

export const EN_SETTINGS = {
  ...EN_SETTINGS_QUALITY,
  ...EN_SETTINGS_ADVANCED,
  ...EN_SETTINGS_UI
};
