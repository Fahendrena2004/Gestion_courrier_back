/*
 * Seed script – clears tables and inserts sample data.
 * Run with: node scripts/seed.js
 */
const db = require('../src/db');
const ContactService = require('../src/services/contactService');
const ServiceService = require('../src/services/serviceService');
const TaskService = require('../src/services/taskService');
const CourrierService = require('../src/services/courrierService');
const ArchiveService = require('../src/services/archiveService');
// UserService not needed for seed

const TRUNCATE = true; // set false if you do not want to wipe tables

async function truncateTables() {
  const tables = ['contacts', 'services', 'tasks', 'courriers', 'archives', 'users'];
  await db.query('SET FOREIGN_KEY_CHECKS = 0');
  for (const t of tables) {
    await db.query(`TRUNCATE TABLE ${t}`);
  }
  await db.query('SET FOREIGN_KEY_CHECKS = 1');
}

async function seed() {
  if (TRUNCATE) await truncateTables();

  const contact = new ContactService();
  const service = new ServiceService();
  const task = new TaskService();
  const courrier = new CourrierService();
  const archive = new ArchiveService();

  // Contacts
  await contact.create({ name: 'Alice', email: 'alice@example.com', phone: '111111111' });
  await contact.create({ name: 'Bob', email: 'bob@example.com', phone: '222222222' });

  // Services
  await service.create({ name: 'IT Support', description: 'Help desk' });
  await service.create({ name: 'Cleaning', description: 'Office cleaning' });

  // Tasks
  await task.create({ title: 'Setup server', description: 'Install dependencies', status: 'todo' });
  await task.create({ title: 'Write docs', description: 'Create Swagger spec', status: 'in_progress' });

  // Courriers – use column names defined in schema (sender, recipient)
  await courrier.create({ subject: 'Welcome', sender: 'Alice', recipient: 'Bob' });
  await courrier.create({ subject: 'Reminder', sender: 'Bob', recipient: 'Alice' });

  // Archives
  await archive.create({ name: 'Project Docs', description: 'PDF of project documentation' });
  await archive.create({ name: 'Specs', description: 'Technical specifications' });

  console.log('✅ Seed completed.');
}

seed().catch(err => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
