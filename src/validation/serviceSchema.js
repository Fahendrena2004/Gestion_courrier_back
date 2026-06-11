const Joi = require('joi');

// Service schema – used for POST / PUT validation
const serviceSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  description: Joi.string().allow('', null)
});

module.exports = serviceSchema;
