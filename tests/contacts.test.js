const request = require('supertest');
const app = require('../src/app');
const { getAuthCookie } = require('./authHelper');

describe('Contacts API', () => {
  let cookie;

  beforeAll(async () => {
    cookie = await getAuthCookie(app);
    // Clean up any existing contacts
    const getRes = await request(app).get('/api/contacts').set('Cookie', cookie);
    const contacts = getRes.body;
    if (Array.isArray(contacts)) {
      for (const c of contacts) {
        await request(app).delete(`/api/contacts/${c.id}`).set('Cookie', cookie);
      }
    }
  });

  it('should return empty array initially', async () => {
    const res = await request(app).get('/api/contacts').set('Cookie', cookie);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should create a new contact', async () => {
    const newContact = { name: 'John Doe', email: 'john@example.com', phone: '123456789' };
    const res = await request(app).post('/api/contacts').set('Cookie', cookie).send(newContact);
    expect(res.statusCode).toBe(201);
    expect(res.body).toMatchObject({ id: expect.any(Number) });
  });

  it('should retrieve the created contact by id', async () => {
    const newContact = { name: 'Jane Doe', email: 'jane@example.com', phone: '987654321' };
    const createRes = await request(app).post('/api/contacts').set('Cookie', cookie).send(newContact);
    const id = createRes.body.id;
    const getRes = await request(app).get(`/api/contacts/${id}`).set('Cookie', cookie);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body).toMatchObject({ id, ...newContact });
  });
});
