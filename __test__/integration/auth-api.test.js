const req = require('supertest');
const { db } = require('../../config');
const server = require('../../server');

beforeAll(async () => {
  await db.$connect();
  await db.user.deleteMany({});
  await db.note.deleteMany({});
});
afterEach(async () => {
  await db.user.deleteMany({});
  await db.note.deleteMany({});
});
afterAll(async () => {
  await server.close();
}, 10000);
describe('Test auth-apis', () => {
  describe('Test /signUp', () => {
    const URL = `/api/v1/auth/signup`;
    it('Should response with 400 status code if the body of request is missing', async () => {
      await req(server).post(URL).expect(400);
    });
    it('Should response with 400 status code if the email format is invalid', async () => {
      const res = await req(server).post(URL).send({
        email: 'user.com',
        name: 'user',
        password: 'pass1234',
      });
      expect(res.status).toBe(400);
      expect(res.body.message).toContain('valid email');
    });
    it('Should response with 400 status code if the email is already used', async () => {
      await req(server)
        .post(URL)
        .send({ name: 'user', email: 'user@gmail.com', password: 'password' });
      const res = await req(server).post(URL).send({
        email: 'user@gmail.com',
        name: 'user',
        password: 'pass1234',
      });
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(
        'This email is already used by another user. Try another one.',
      );
    });

    it("Should response with 400 status code if the name's format is invalid", async () => {
      const res = await req(server).post(URL).send({
        email: 'user@gmail.com',
        name: 'us',
        password: 'pass1234',
      });
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(
        'name length must be at least 3 characters long',
      );
    });

    it('Should response with 400 status code if the password format is invalid', async () => {
      const res = await req(server).post(URL).send({
        email: 'user@gmail.com',
        name: 'user',
        password: 'pass',
      });
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(
        'password length must be at least 8 characters long',
      );
    });

    it('Should response with 201 status code', async () => {
      const res = await req(server).post(URL).send({
        email: 'user@gmail.com',
        name: 'user',
        password: 'password',
      });
      expect(res.status).toBe(201);
      expect(res.body.message).toMatch(
        'Check the confirmation otp code at user@gmail.com',
      );
    });
  });

  
});
