const request = require('supertest');
const app = require('../src/app');
const { getAuthCookie } = require('./authHelper');

describe('Contacts API', () => {
  let cookie;
  const createdIds = [];

  beforeAll(async () => {
    cookie = await getAuthCookie(app);
  });

  afterAll(async () => {
    for (const id of createdIds) {
      await request(app).delete(`/api/contacts/${id}`).set('Cookie', cookie);
    }
  });

  it('should return contacts array', async () => {
    const res = await request(app).get('/api/contacts').set('Cookie', cookie);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should create a new contact', async () => {
    const newContact = { name: 'John Doe', email: 'john@example.com', phone: '123456789' };
    const res = await request(app).post('/api/contacts').set('Cookie', cookie).send(newContact);
    expect(res.statusCode).toBe(201);
    expect(res.body).toMatchObject({ id: expect.any(Number) });
    createdIds.push(res.body.id);
  });

  it('should retrieve the created contact by id', async () => {
    const newContact = { name: 'Jane Doe', email: 'jane@example.com', phone: '987654321' };
    const createRes = await request(app).post('/api/contacts').set('Cookie', cookie).send(newContact);
    const id = createRes.body.id;
    createdIds.push(id);
    const getRes = await request(app).get(`/api/contacts/${id}`).set('Cookie', cookie);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body).toMatchObject({ id, ...newContact });
  });
});
