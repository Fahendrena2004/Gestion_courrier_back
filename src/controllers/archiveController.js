const ArchiveService = require('../services/archiveService');
const archiveService = new ArchiveService();

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
