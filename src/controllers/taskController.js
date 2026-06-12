// src/controllers/taskController.js
const TaskService = require('../services/taskService');
const taskService = new TaskService();

exports.getAll = async (req, res, next) => {
  try {
    const rows = await taskService.getAll();
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const row = await taskService.getById(req.params.id);
    if (!row) return res.status(404).json({ error: 'Non trouvé' });
    res.json(row);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const result = await taskService.create(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const result = await taskService.update(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const result = await taskService.delete(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
