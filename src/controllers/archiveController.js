const ArchiveService = require('../services/archiveService');
const archiveService = new ArchiveService();
const db = require('../db');

exports.getAll = async (req, res, next) => {
  try {
    const data = await archiveService.getAll(req.pagination);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await archiveService.getById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Non trouvé' });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { courrier_id } = req.body;

    if (courrier_id) {
      // Fetch courrier details from DB
      const [rows] = await db.query(
        `SELECT id, reference, subject, file_path, status FROM courriers WHERE id = ? AND deleted_at IS NULL`,
        [courrier_id]
      );
      if (!rows || rows.length === 0) {
        return res.status(404).json({ error: 'Courrier introuvable.' });
      }
      const courrier = rows[0];

      if (courrier.status === 'archived') {
        return res.status(400).json({ error: 'Ce courrier est déjà archivé.' });
      }

      // Build the archive name from courrier reference + subject
      const archiveName = `${courrier.reference} - ${courrier.subject}`;
      let archivePath = courrier.file_path || '';
      
      if (!archivePath) {
        const [docs] = await db.query(
          `SELECT file_path FROM courrier_documents WHERE courrier_id = ? AND deleted_at IS NULL ORDER BY created_at ASC LIMIT 1`,
          [courrier_id]
        );
        if (docs && docs.length > 0) {
          archivePath = docs[0].file_path;
        }
      }

      // Insert into archives table
      const [insertResult] = await db.query(
        `INSERT INTO archives (name, path) VALUES (?, ?)`,
        [archiveName, archivePath]
      );

      // Update courrier status to 'archived'
      await db.query(
        `UPDATE courriers SET status = 'archived' WHERE id = ?`,
        [courrier_id]
      );

      return res.status(201).json({ id: insertResult.insertId, message: 'Courrier archivé avec succès.' });
    }

    // Standard manual archive creation (from file upload)
    const result = await archiveService.create(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const result = await archiveService.update(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const result = await archiveService.delete(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
