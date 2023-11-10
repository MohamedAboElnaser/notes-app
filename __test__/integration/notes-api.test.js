const req = require('supertest');
process.env.NODE_ENV = 'testing';
const { db } = require('../../config');
const server = require('../../server');

beforeAll(async () => {
  await db.$connect();
  await db.user.deleteMany({});
});
afterEach(async () => {
  await db.user.deleteMany({});
});
afterAll(async () => {
  await server.close();
}, 10000);
let token;
beforeEach(async () => {
  //register new user
  const registerResponse = await req(server)
    .post('/api/v1/auth/signup')
    .send({ name: 'user', email: 'user@gmail.com', password: 'password' });
  const { otp } = registerResponse.body;
  //verify the  user email
  await req(server)
    .post('/api/v1/auth/verify-email')
    .send({ otp: `${otp}` });
  //login
  const res = await req(server)
    .post('/api/v1/auth/login')
    .send({ email: 'user@gmail.com', password: 'password' });
  token = res.body.token;
}, 10000);
describe('Test notes-apis', () => {
  describe('Test POST /notes', () => {
    const URL = '/api/v1/notes';
    it('Should response with 401 for unauthorized user', async () => {
      const res = await req(server).post(URL);
      expect(res.status).toBe(401);
    });
    it('Should response with 400 if the body of req is missing', async () => {
      const res = await req(server)
        .post(URL)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(400);
      expect(res.body.message).toContain('is required');
    });

    it('Should response with 400 status code if the titled is missing', async () => {
      const res = await req(server)
        .post(URL)
        .set('Authorization', `Bearer ${token}`)
        .send({
          body: 'note body',
        });
      expect(res.status).toBe(400);
      expect(res.body.message).toContain('title is required');
    });

    it('Should create note and response with 201', async () => {
      await req(server)
        .post(URL)
        .set('Authorization', `Bearer ${token}`)
        .send({ body: 'note-body', title: 'note-title' })
        .expect(201);
    });
  });
});
