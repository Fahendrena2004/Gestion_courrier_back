const path = require('path');

const MAX_SCAN_FILE_SIZE = 20 * 1024 * 1024;
const ALLOWED_SCAN_MIME_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
]);
const ALLOWED_SCAN_EXTENSIONS = new Set(['.pdf', '.jpg', '.jpeg', '.png']);

function sanitizeFilename(filename) {
  const extension = path.extname(filename).toLowerCase();
  const base = path
    .basename(filename, extension)
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);

  return `${base || 'document'}${extension}`;
}

function isAllowedScanFile(file) {
  const extension = path.extname(file.originalname || '').toLowerCase();
  return ALLOWED_SCAN_MIME_TYPES.has(file.mimetype) && ALLOWED_SCAN_EXTENSIONS.has(extension);
}

module.exports = {
  ALLOWED_SCAN_MIME_TYPES,
  ALLOWED_SCAN_EXTENSIONS,
  MAX_SCAN_FILE_SIZE,
  sanitizeFilename,
  isAllowedScanFile,
};
