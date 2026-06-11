const BaseService = require('./baseService');

class TaskService extends BaseService {
  constructor() {
    super('tasks');
  }

  async getById(id) {
    const task = await super.getById(id);
    if (task && task.status) {
      task.status = task.status.replace('_', '-');
    }
    return task;
  }

  // Override create to normalize status values (e.g., "in-progress" -> "in_progress")
  async create(data) {
    if (data.status && typeof data.status === 'string') {
      data.status = data.status.replace('-', '_');
    }
    return super.create(data);
  }

  // Override update to normalize status values
  async update(id, data) {
    if (data.status && typeof data.status === 'string') {
      data.status = data.status.replace('-', '_');
    }
    return super.update(id, data);
  }
}

module.exports = TaskService;
