const BaseService = require('./baseService');

class ContactService extends BaseService {
  constructor() {
    super('contacts');
  }
}

module.exports = ContactService;
