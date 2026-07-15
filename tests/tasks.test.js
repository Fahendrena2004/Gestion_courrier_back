const request = require('supertest');
const app = require('../src/app');
const { getAuthCookie } = require('./authHelper');

describe('Tasks API', () => {
  let cookie;
  const createdIds = [];

  beforeAll(async () => {
    cookie = await getAuthCookie(app);
  });

  afterAll(async () => {
    for (const id of createdIds) {
      await request(app).delete(`/api/tasks/${id}`).set('Cookie', cookie);
    }
  });

  it('should return tasks array', async () => {
    const res = await request(app).get('/api/tasks').set('Cookie', cookie);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should create a new task', async () => {
    const newTask = { title: 'Setup server', description: 'Install dependencies', status: 'pending' };
    const res = await request(app).post('/api/tasks').set('Cookie', cookie).send(newTask);
    expect(res.statusCode).toBe(201);
    expect(res.body).toMatchObject({ id: expect.any(Number) });
    createdIds.push(res.body.id);
  });

  it('should retrieve the created task by id', async () => {
    const newTask = { title: 'Write docs', description: 'Create Swagger spec', status: 'in-progress' };
    const createRes = await request(app).post('/api/tasks').set('Cookie', cookie).send(newTask);
    const id = createRes.body.id;
    createdIds.push(id);
    const getRes = await request(app).get(`/api/tasks/${id}`).set('Cookie', cookie);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body).toMatchObject({ id, ...newTask });
  });
});
