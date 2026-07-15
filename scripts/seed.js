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
const UserService = require('../src/services/userService');

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
  const user = new UserService();

  // Users
  await user.create({ username: 'admin', email: 'admin@example.com', password: 'password', role: 'admin' });

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
  const c1 = await courrier.create({ type: 'arrive', subject: 'Welcome', sender_id: 1, recipient_id: 2 });
  const c2 = await courrier.create({ type: 'depart', subject: 'Reminder', sender_id: 2, recipient_id: 1 });

  // Archives
  await archive.create({ courrier_id: c1.id, box_number: 'B1', shelf_location: 'S1', notes: 'Project Docs' });
  await archive.create({ courrier_id: c2.id, box_number: 'B2', shelf_location: 'S2', notes: 'Specs' });

  console.log('✅ Seed completed.');
}

seed().catch(err => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
