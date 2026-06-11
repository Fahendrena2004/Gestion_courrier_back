const request = require('supertest');
const app = require('../src/app');
const { getAuthCookie } = require('./authHelper');

describe('Tasks API', () => {
  let cookie;

  beforeAll(async () => {
    cookie = await getAuthCookie(app);
    // Clean up any existing tasks
    const res = await request(app).get('/api/tasks').set('Cookie', cookie);
    if (Array.isArray(res.body)) {
      for (const t of res.body) {
        await request(app).delete(`/api/tasks/${t.id}`).set('Cookie', cookie);
      }
    }
  });

  it('should return empty array initially', async () => {
    const res = await request(app).get('/api/tasks').set('Cookie', cookie);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should create a new task', async () => {
    const newTask = { title: 'Setup server', description: 'Install dependencies', status: 'pending' };
    const res = await request(app).post('/api/tasks').set('Cookie', cookie).send(newTask);
    expect(res.statusCode).toBe(201);
    expect(res.body).toMatchObject({ id: expect.any(Number) });
  });

  it('should retrieve the created task by id', async () => {
    const newTask = { title: 'Write docs', description: 'Create Swagger spec', status: 'in-progress' };
    const createRes = await request(app).post('/api/tasks').set('Cookie', cookie).send(newTask);
    const id = createRes.body.id;
    const getRes = await request(app).get(`/api/tasks/${id}`).set('Cookie', cookie);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body).toMatchObject({ id, ...newTask });
  });
});
