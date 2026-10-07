const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fPath = path.join(dir, file);
    if (fs.statSync(fPath).isDirectory()) results = results.concat(walk(fPath));
    else if (file.endsWith('.js')) results.push(fPath);
  });
  return results;
}

const files = walk(path.join(__dirname, '..', 'js'));
let broken = 0;
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const importRegex = /import\s+[^;]*?from\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const relPath = match[1];
    if (relPath.startsWith('.')) {
      const resolved = path.resolve(path.dirname(f), relPath);
      if (!fs.existsSync(resolved)) {
        console.error('Broken import in ' + f + ' -> ' + relPath);
        broken++;
      }
    }
  }
});

if (broken === 0) {
  console.log(`✅ All imports in ${files.length} JS files resolve cleanly!`);
} else {
  console.error(`❌ Found ${broken} broken imports!`);
  process.exit(1);
}
