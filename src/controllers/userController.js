// src/controllers/userController.js
const UserService = require('../services/userService');
const userService = new UserService();

exports.getAll = async (req, res, next) => {
  try {
    const rows = await userService.getAll();
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const row = await userService.getById(req.params.id);
    if (!row) return res.status(404).json({ error: 'Non trouvé' });
    res.json(row);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const result = await userService.create(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const result = await userService.update(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const result = await userService.delete(req.params.id);
    res.json(result);
  } catch (err) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({ error: "Impossible de supprimer cet utilisateur car il est lié à des courriers ou des tâches existantes." });
    }
    next(err);
  }
};
