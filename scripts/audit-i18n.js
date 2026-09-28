const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory() && !filePath.includes('node_modules') && !filePath.includes('.git')) {
      results = results.concat(walk(filePath));
    } else if (file.endsWith('.js') || file.endsWith('.html')) {
      results.push(filePath);
    }
  });
  return results;
}

const jsFiles = walk(path.join(__dirname, '..', 'js'));
const htmlPath = path.join(__dirname, '..', 'index.html');
const enDir = path.join(__dirname, '..', 'js', 'config', 'locales', 'en');
const bnDir = path.join(__dirname, '..', 'js', 'config', 'locales', 'bn');

let enKeys = {};
walk(enDir).forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  [...content.matchAll(/([a-zA-Z0-9_]+)\s*:/g)].forEach(m => enKeys[m[1]] = true);
});

let bnKeys = {};
walk(bnDir).forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  [...content.matchAll(/([a-zA-Z0-9_]+)\s*:/g)].forEach(m => bnKeys[m[1]] = true);
});

const tCalls = [];
jsFiles.forEach(file => {
  if (file.includes('locales')) return;
  const content = fs.readFileSync(file, 'utf8');
  // Match only standalone t('key') or t("key")
  const matches = [...content.matchAll(/(?:^|[^a-zA-Z0-9_$.])t\(\s*['"]([^'"]+)['"]\s*\)/g)].map(m => m[1]);
  matches.forEach(m => tCalls.push({ key: m, file: path.relative(path.join(__dirname, '..'), file) }));
});

// Match all data-i18n attributes in index.html
const htmlContent = fs.readFileSync(htmlPath, 'utf8');
const htmlAttrMatches = [...htmlContent.matchAll(/data-i18n(?:-[a-z]+)?=["']([^"']+)["']/g)].map(m => m[1]);
htmlAttrMatches.forEach(m => tCalls.push({ key: m, file: 'index.html' }));

console.log('Total verified i18n key references (JS t() + HTML attributes):', tCalls.length);

const missing = [];
tCalls.forEach(item => {
  if (!enKeys[item.key] || !bnKeys[item.key]) {
    missing.push({ key: item.key, file: item.file, inEn: !!enKeys[item.key], inBn: !!bnKeys[item.key] });
    console.log(`Missing key: ${item.key} (in ${item.file}) -> EN: ${!enKeys[item.key]}, BN: ${!bnKeys[item.key]}`);
  }
});

if (missing.length === 0) {
  console.log(`✅ All ${tCalls.length} i18n references in JS codebase & HTML are 100% matched with EN and BN dictionaries!`);
} else {
  process.exit(1);
}
