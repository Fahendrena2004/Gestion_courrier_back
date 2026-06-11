const BaseService = require('./baseService');

class ArchiveService extends BaseService {
  constructor() {
    super('archives');
  }
}

module.exports = ArchiveService;
