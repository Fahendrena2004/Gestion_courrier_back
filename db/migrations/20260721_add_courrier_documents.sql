CREATE TABLE IF NOT EXISTS courrier_documents (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  courrier_id INT UNSIGNED NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  original_name VARCHAR(500),
  mime_type VARCHAR(100) NOT NULL,
  size_bytes INT UNSIGNED NOT NULL,
  ocr_text LONGTEXT,
  ocr_metadata JSON,
  created_by INT UNSIGNED,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  FULLTEXT KEY idx_courrier_documents_ocr_text (ocr_text),
  FOREIGN KEY (courrier_id) REFERENCES courriers(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);
