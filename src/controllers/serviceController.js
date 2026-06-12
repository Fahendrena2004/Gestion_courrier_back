// src/controllers/serviceController.js
const ServiceService = require('../services/serviceService');
const serviceService = new ServiceService();

exports.getAll = async (req, res, next) => {
    try {
        const rows = await serviceService.getAll();
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const row = await serviceService.getById(req.params.id);
        if (!row) return res.status(404).json({ error: 'Non trouvé' });
        res.json(row);
    } catch (err) {
        next(err);
    }
};

exports.create = async (req, res, next) => {
    try {
        const result = await serviceService.create(req.body);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const result = await serviceService.update(req.params.id, req.body);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

exports.delete = async (req, res, next) => {
    try {
        const result = await serviceService.delete(req.params.id);
        res.json(result);
    } catch (err) {
        next(err);
    }
};
