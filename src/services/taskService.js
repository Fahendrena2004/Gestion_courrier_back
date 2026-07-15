const BaseService = require('./baseService');

class TaskService extends BaseService {
  constructor() {
    super('tasks');
  }
}

module.exports = TaskService;
