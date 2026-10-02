// Copy the generated browser runtime; never a second hand-edited source of truth.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
fs.copyFileSync(path.join(root, '.build/portfolio.js'), path.join(root, 'script.js'));
