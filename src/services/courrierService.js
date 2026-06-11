const BaseService = require('./baseService');

class CourrierService extends BaseService {
  constructor() {
    super('courriers');
  }
}

module.exports = CourrierService;
