const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const MAX_LINES = 100;

const ignoreDirs = new Set(['.git', 'node_modules', '.gemini', '.system_generated', 'dist', 'build', '.agents']);
const allowedExtensions = new Set(['.js', '.css', '.html', '.json', '.md']);

const violations = [];
let totalFilesChecked = 0;

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (ignoreDirs.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (!allowedExtensions.has(ext)) continue;

      // Read file and count lines
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split(/\r?\n/).length;
      totalFilesChecked++;

      const relPath = path.relative(rootDir, fullPath).replace(/\\/g, '/');
      if (lines > MAX_LINES) {
        violations.push({ file: relPath, lines });
      }
    }
  }
}

walk(rootDir);

console.log(`========================================`);
console.log(`Audited ${totalFilesChecked} files for <= ${MAX_LINES} lines requirement`);
console.log(`========================================`);

if (violations.length === 0) {
  console.log(`✅ 100% PASS: All ${totalFilesChecked} files are within ${MAX_LINES} lines! 🎉`);
  process.exit(0);
} else {
  console.error(`❌ Found ${violations.length} files exceeding ${MAX_LINES} lines:`);
  violations.sort((a, b) => b.lines - a.lines).forEach(v => {
    console.error(`  - ${v.file}: ${v.lines} lines (exceeds by ${v.lines - MAX_LINES})`);
  });
  process.exit(1);
}
