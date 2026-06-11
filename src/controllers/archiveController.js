const ArchiveService = require('../services/archiveService');
const archiveService = new ArchiveService();

// GET /api/archives
exports.getAll = async (req, res, next) => {
  try {
    const data = await archiveService.getAll(req.pagination);
    // Map description -> path for each archive
    const mapped = data.map(item => ({
      ...item,
      path: item.description,
      description: undefined
    }));
    res.json(mapped);
  } catch (err) {
    next(err);
  }
};

// GET /api/archives/:id
exports.getById = async (req, res, next) => {
  try {
    const data = await archiveService.getById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Not found' });
    // Map description -> path
    const mapped = { ...data, path: data.description };
    delete mapped.description;
    res.json(mapped);
  } catch (err) {
    next(err);
  }
};

// POST /api/archives
exports.create = async (req, res, next) => {
  try {
    // Map incoming payload { name, path } to DB fields { name, description }
    const { name, path } = req.body;
    const payload = { name, description: path };
    const result = await archiveService.create(payload);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

// PUT /api/archives/:id
exports.update = async (req, res, next) => {
  try {
    const result = await archiveService.update(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/archives/:id
exports.delete = async (req, res, next) => {
  try {
    const result = await archiveService.delete(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
