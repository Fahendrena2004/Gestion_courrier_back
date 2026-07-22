const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  MAX_SCAN_FILE_SIZE,
  isAllowedScanFile,
  sanitizeFilename,
} = require('../utils/fileSecurity');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniquePrefix}-${sanitizeFilename(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: MAX_SCAN_FILE_SIZE,
    files: 50,
  },
  fileFilter: (req, file, cb) => {
    if (!isAllowedScanFile(file)) {
      return cb(new Error('Format non autorisé. Formats acceptés : PDF, JPG, JPEG, PNG.'));
    }
    return cb(null, true);
  },
});

module.exports = upload;
