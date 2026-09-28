const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory() && !filePath.includes('node_modules') && !filePath.includes('.git')) {
      results = results.concat(walk(filePath));
    } else if (file.endsWith('.js')) {
      results.push(filePath);
    }
  });
  return results;
}

const jsFiles = walk(path.join(__dirname, '..', 'js'));
jsFiles.push(path.join(__dirname, '..', 'server.js'));
jsFiles.push(path.join(__dirname, '..', 'sw.js'));

let errors = 0;
jsFiles.forEach((file) => {
  try {
    execSync(`node --check "${file}"`);
  } catch (err) {
    console.error(`❌ Syntax error in ${file}:`, err.message);
    errors++;
  }
});

if (errors === 0) {
  console.log(`✅ All ${jsFiles.length} JavaScript files passed syntax verification with ZERO errors!`);
} else {
  console.error(`❌ Found ${errors} syntax errors.`);
  process.exit(1);
}
