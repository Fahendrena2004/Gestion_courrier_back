// src/controllers/courrierController.js
const CourrierService = require('../services/courrierService');
const courrierService = new CourrierService();

exports.getAll = async (req, res, next) => {
    try {
        const rows = await courrierService.getAll();
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const row = await courrierService.getById(req.params.id);
        if (!row) return res.status(404).json({ error: 'Not found' });
        res.json(row);
    } catch (err) {
        next(err);
    }
};

exports.create = async (req, res, next) => {
    try {
        const result = await courrierService.create(req.body);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const result = await courrierService.update(req.params.id, req.body);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

exports.delete = async (req, res, next) => {
    try {
        const result = await courrierService.delete(req.params.id);
        res.json(result);
    } catch (err) {
        next(err);
    }
};
