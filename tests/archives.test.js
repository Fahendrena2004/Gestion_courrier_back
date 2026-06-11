const request = require('supertest');
const app = require('../src/app');
const { getAuthCookie } = require('./authHelper');

describe('Archives API', () => {
  let cookie;

  beforeAll(async () => {
    cookie = await getAuthCookie(app);
    const res = await request(app).get('/api/archives').set('Cookie', cookie);
    if (Array.isArray(res.body)) {
      for (const a of res.body) {
        await request(app).delete(`/api/archives/${a.id}`).set('Cookie', cookie);
      }
    }
  });

  it('should return empty array initially', async () => {
    const res = await request(app).get('/api/archives').set('Cookie', cookie);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should create a new archive', async () => {
    const payload = { name: 'Project Docs', path: '/files/project.pdf' };
    const res = await request(app).post('/api/archives').set('Cookie', cookie).send(payload);
    expect(res.statusCode).toBe(201);
    expect(res.body).toMatchObject({ id: expect.any(Number) });
  });

  it('should retrieve the created archive by id', async () => {
    const payload = { name: 'Specs', path: '/files/specs.pdf' };
    const createRes = await request(app).post('/api/archives').set('Cookie', cookie).send(payload);
    const id = createRes.body.id;
    const getRes = await request(app).get(`/api/archives/${id}`).set('Cookie', cookie);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body).toMatchObject({ id, ...payload });
  });
});
