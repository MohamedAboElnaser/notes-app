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

  describe('Test /verify-email', () => {
    const URL = '/api/v1/auth/verify-email';
    it('Should return 400 status code if the otp formate is invalid', async () => {
      const res = await req(server).post(URL).send({
        otp: '12334',
      });
      expect(res.status).toBe(400);
      expect(res.body.message).toContain('at least 6');
    });

    it('Should return 404 status code if the otp is not attached to any email', async () => {
      const res = await req(server).post(URL).send({
        otp: '123345',
      });
      expect(res.status).toBe(404);
      expect(res.body.message).toContain('Invalid OTP');
    });
    //happy-scenario
    it('Should return 200 status code', async () => {
      //register new user
      const signUpResponse = await req(server)
        .post('/api/v1/auth/signup')
        .send({
          name: 'user',
          email: 'user@gmail.com',
          password: '12112121212',
        });
      //fetch otp from response body
      const { otp } = signUpResponse.body;
      const res = await req(server)
        .post(URL)
        .send({
          otp: `${otp}`,
        });
      expect(res.status).toBe(200);
      expect(res.body.message).toContain('verified successfully');
    });
  });

  describe('Test /login', () => {
    const URL = '/api/v1/auth/login';
    it('Should response with 400 status code if the data format is invalid', async () => {
      const res = await req(server).post(URL).send({
        email: 'email@domain',
        password: '1111',
      });
      expect(res.status).toBe(400);
      expect(res.body.message).toContain('password length');
    });

    it('Should response with 404 status code if the the email is not registered', async () => {
      //register new user
      const signUpResponse = await req(server)
        .post('/api/v1/auth/signup')
        .send({
          name: 'user',
          email: 'user@gmail.com',
          password: 'password',
        });
      //fetch otp from response body
      const { otp } = signUpResponse.body;
      const verifyResponse = await req(server)
        .post('/api/v1/auth/verify-email')
        .send({
          otp: `${otp}`,
        });
      const res=await req(server).post(URL).send({
        email:'user111@gmail.com',
        password:'1234tyu2345',
      });
      expect(res.status).toBe(404);
      expect(res.body.message).toContain('not attached')
    });

    it('Should response with 401 status if the password is invalid',async()=>{
       //register new user
       const signUpResponse = await req(server)
       .post('/api/v1/auth/signup')
       .send({
         name: 'user',
         email: 'user@gmail.com',
         password: 'password',
       });
     //fetch otp from response body
     const { otp } = signUpResponse.body;
     const verifyResponse = await req(server)
       .post('/api/v1/auth/verify-email')
       .send({
         otp: `${otp}`,
       });
     const res=await req(server).post(URL).send({
       email:'user@gmail.com',
       password:'NotValidPassword',
     });
     expect(res.status).toBe(401);
     expect(res.body.message).toContain('Invalid Password')
    });

    //happy-scenario
    it('Should response with 200 status code',async()=>{
       //register new user
       const signUpResponse = await req(server)
       .post('/api/v1/auth/signup')
       .send({
         name: 'user',
         email: 'user@gmail.com',
         password: 'password',
       });
     //fetch otp from response body
     const { otp } = signUpResponse.body;
     const verifyResponse = await req(server)
       .post('/api/v1/auth/verify-email')
       .send({
         otp: `${otp}`,
       });
     const res=await req(server).post(URL).send({
       email:'user@gmail.com',
       password:'password',
     });
     expect(res.status).toBe(200);
     expect(Object.keys(res.body)).toContain('token');
    })
  });
});
