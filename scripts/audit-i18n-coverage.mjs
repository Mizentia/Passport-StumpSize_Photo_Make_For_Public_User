import fs from 'fs';
import path from 'path';
import { EN_LOCALE } from '../js/config/locales/en.js';
import { BN_LOCALE } from '../js/config/locales/bn.js';

const enKeys = new Set(Object.keys(EN_LOCALE));
const bnKeys = new Set(Object.keys(BN_LOCALE));
const templatesDir = './js/ui/templates';
const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.js'));

const missingInDict = [];
let totalFound = 0;

for (const file of files) {
  const content = fs.readFileSync(path.join(templatesDir, file), 'utf8');
  const regex = /data-i18n(?:-title|-placeholder)?="([^"]+)"/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    totalFound++;
    const key = match[1];
    if (!enKeys.has(key)) {
      missingInDict.push({ file, key });
    }
  }
}

console.log(`Audited ${files.length} templates.`);
console.log(`Total data-i18n tags found: ${totalFound}`);
console.log(`Missing keys in dictionary: ${missingInDict.length}`);
if (missingInDict.length > 0) {
  console.log(missingInDict);
}

// Check for cross-language leaks in EN_LOCALE (any Bengali characters in EN)
const bnCharRegex = /[\u0980-\u09FF]/;
const enLeaks = [];
for (const [key, val] of Object.entries(EN_LOCALE)) {
  if (typeof val === 'string' && bnCharRegex.test(val)) {
    // Check if it's country name flag like 🇧🇩 বাংলাদেশ
    enLeaks.push({ key, val });
  }
}
console.log(`Bengali characters in EN_LOCALE: ${enLeaks.length}`);
if (enLeaks.length > 0) console.log(enLeaks);

// Check for parenthetical English in BN_LOCALE (e.g. "পুরুত্ব (Thickness)")
const parentheticalEnglish = [];
for (const [key, val] of Object.entries(BN_LOCALE)) {
  if (typeof val === 'string' && /\([A-Za-z\s\/]+\)/.test(val)) {
    parentheticalEnglish.push({ key, val });
  }
}
console.log(`Parenthetical English in BN_LOCALE: ${parentheticalEnglish.length}`);
if (parentheticalEnglish.length > 0) console.log(parentheticalEnglish);

