import { BN_UI_BASE } from './ui-base.js';
import { BN_UI_SHEET } from './ui-sheet.js';
import { BN_UI_HISTORY } from './ui-history.js';
import { BN_UI_ABOUT } from './ui-about.js';

export const BN_UI = {
  ...BN_UI_BASE,
  ...BN_UI_SHEET,
  ...BN_UI_HISTORY,
  ...BN_UI_ABOUT
};
