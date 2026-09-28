import { appState } from '../core/state.js';
import { EN_LOCALE } from './locales/en.js';
import { BN_LOCALE } from './locales/bn.js';

export const TRANSLATIONS = {
  en: EN_LOCALE,
  bn: BN_LOCALE
};

export function t(key) {
  const lang = appState.get('lang') || 'en';
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  return dict[key] || TRANSLATIONS.en[key] || key;
}

export function toBengaliNumeral(str) {
  const banglaDigits = { '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯' };
  return String(str).replace(/[0-9]/g, match => banglaDigits[match] || match);
}
