const request = require('supertest');
const app = require('../src/app');
const { getAuthCookie } = require('./authHelper');

describe('Services API', () => {
  let cookie;

  beforeAll(async () => {
    cookie = await getAuthCookie(app);
    const res = await request(app).get('/api/services').set('Cookie', cookie);
    if (Array.isArray(res.body)) {
      for (const s of res.body) {
        await request(app).delete(`/api/services/${s.id}`).set('Cookie', cookie);
      }
    }
  });

  it('should return empty array initially', async () => {
    const res = await request(app).get('/api/services').set('Cookie', cookie);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should create a new service', async () => {
    const payload = { name: 'IT Support', description: 'Help desk' };
    const res = await request(app).post('/api/services').set('Cookie', cookie).send(payload);
    expect(res.statusCode).toBe(201);
    expect(res.body).toMatchObject({ id: expect.any(Number) });
  });

  it('should retrieve the created service by id', async () => {
    const payload = { name: 'Cleaning', description: 'Office cleaning' };
    const createRes = await request(app).post('/api/services').set('Cookie', cookie).send(payload);
    const id = createRes.body.id;
    const getRes = await request(app).get(`/api/services/${id}`).set('Cookie', cookie);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body).toMatchObject({ id, ...payload });
  });
});
