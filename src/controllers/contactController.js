// src/controllers/contactController.js
const ContactService = require('../services/contactService');
const contactService = new ContactService();

exports.getAll = async (req, res, next) => {
  try {
    const rows = await contactService.getAll();
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const row = await contactService.getById(req.params.id);
    if (!row) return res.status(404).json({ error: 'Non trouvé' });
    res.json(row);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const result = await contactService.create(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const result = await contactService.update(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const result = await contactService.delete(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
