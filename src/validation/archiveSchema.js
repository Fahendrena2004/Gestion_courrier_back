const Joi = require('joi');

const archiveSchema = Joi.alternatives().try(
  // Option A: Archive from a courrier (provide courrier_id)
  Joi.object({
    courrier_id: Joi.number().integer().positive().required(),
  }),
  // Option B: Manual archive (provide name and path via file upload)
  Joi.object({
    name: Joi.string().min(3).max(255).required(),
    path: Joi.string().min(1).required(),
  })
);

module.exports = archiveSchema;
