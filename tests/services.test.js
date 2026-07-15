const request = require('supertest');
const app = require('../src/app');
const { getAuthCookie } = require('./authHelper');

describe('Services API', () => {
  let cookie;
  const createdIds = [];

  beforeAll(async () => {
    cookie = await getAuthCookie(app);
  });

  afterAll(async () => {
    for (const id of createdIds) {
      await request(app).delete(`/api/services/${id}`).set('Cookie', cookie);
    }
  });

  it('should return services array', async () => {
    const res = await request(app).get('/api/services').set('Cookie', cookie);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should create a new service', async () => {
    const payload = { name: 'IT Support', description: 'Help desk' };
    const res = await request(app).post('/api/services').set('Cookie', cookie).send(payload);
    expect(res.statusCode).toBe(201);
    expect(res.body).toMatchObject({ id: expect.any(Number) });
    createdIds.push(res.body.id);
  });

  it('should retrieve the created service by id', async () => {
    const payload = { name: 'Cleaning', description: 'Office cleaning' };
    const createRes = await request(app).post('/api/services').set('Cookie', cookie).send(payload);
    const id = createRes.body.id;
    createdIds.push(id);
    const getRes = await request(app).get(`/api/services/${id}`).set('Cookie', cookie);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body).toMatchObject({ id, ...payload });
  });
});
