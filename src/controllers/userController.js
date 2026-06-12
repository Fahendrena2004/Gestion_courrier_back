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

/* Additional methods for registration, password reset, etc. can be added
   here, delegating to the userService implementation. */
