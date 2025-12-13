#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');

function findPayloadDir() {
  const paths = ['payloads', 'payloades'];
  for (const p of paths) {
    const full = path.join(repoRoot, p);
    if (fs.existsSync(full) && fs.statSync(full).isDirectory()) return full;
  }
  // fallback to creating the canonical folder
  const fallback = path.join(repoRoot, 'payloads');
  if (!fs.existsSync(fallback)) fs.mkdirSync(fallback);
  return fallback;
}

function writeJson(list, dir) {
  const outPath = path.join(dir, 'payloads.json');
  const payloads = list.sort();
  fs.writeFileSync(outPath, JSON.stringify(payloads, null, 2), 'utf8');
  console.log('Wrote', outPath, 'with', payloads.length, 'entries');
}

function scan() {
  const dir = findPayloadDir();
  const files = fs.readdirSync(dir, { withFileTypes: true });
  const payloads = files
    .filter(f => f.isFile() && /\.bin$/i.test(f.name))
    .map(f => f.name);
  writeJson(payloads, dir);
}

function watch() {
  const dir = findPayloadDir();
  console.log('Watching', dir, 'for changes...');

  const debouncedScan = debounce(scan, 200);
  fs.watch(dir, { persistent: true }, (eventType, filename) => {
    if (!filename) return;
    // we only care about bin and new files
    if (/\.bin$/i.test(filename) || filename === 'payloads.json' || filename === 'list.txt') {
      debouncedScan();
    }
  });
}

function debounce(fn, ms) {
  let t;
  return () => { clearTimeout(t); t = setTimeout(fn, ms); };
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes('--watch') || args.includes('-w')) {
    scan();
    watch();
  } else {
    scan();
  }
}

main();
