const Joi = require('joi');

const archiveSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  path: Joi.string().min(1).required()
});

module.exports = archiveSchema;
