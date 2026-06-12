// scripts/translate.js
// Simple script to replace English/Malagasy literals with French equivalents
const fs = require('fs');
const path = require('path');

// Load translation map (must exist at ../locales/fr.json)
const translations = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'locales', 'fr.json'), 'utf8'));

// File extensions to process
const EXTENSIONS = ['.js', '.ts', '.tsx', '.jsx'];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // skip node_modules and .next
      if (['node_modules', '.next', 'dist', 'build'].includes(entry.name)) continue;
      walk(fullPath);
    } else if (EXTENSIONS.includes(path.extname(entry.name))) {
      replaceInFile(fullPath);
    }
  }
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  for (const [en, fr] of Object.entries(translations)) {
    const regex = new RegExp(`([\"\']${escapeRegExp(en)}[\"\'])`, 'g');
    // replace only the string literal, keep quotes
    content = content.replace(regex, (match) => {
      const quote = match[0];
      return `${quote}${fr}${quote}`;
    });
  }
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Translated:', filePath);
  }
}

// Run on project root (backend and frontend)
const projectRoot = path.resolve(__dirname, '..', '..');
walk(projectRoot);
console.log('Translation complete.');
