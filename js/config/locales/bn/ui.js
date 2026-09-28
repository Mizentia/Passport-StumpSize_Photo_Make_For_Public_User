import { BN_UI_BASE } from './ui-base.js';
import { BN_UI_SHEET } from './ui-sheet.js';
import { BN_UI_HISTORY } from './ui-history.js';

export const BN_UI = {
  ...BN_UI_BASE,
  ...BN_UI_SHEET,
  ...BN_UI_HISTORY
};
