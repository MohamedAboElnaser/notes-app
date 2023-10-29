const AuthService = require('../../src/services/auth.service');
const bcrypt = require('bcrypt');
const { AppError, OTPService, JWTService } = require('../../src/util');
let { db } = require('../../config');

//mock bcrypt module
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockImplementation((pass) => pass),
  compare: jest.fn().mockImplementation((a, b) => a === b),
}));

//mock JWTService
jest.mock('../../src/util/jwt-service', () => ({
  generate: jest.fn().mockReturnValue('jwt'),
}));

//mock OTPService
jest.mock('../../src/util/otp-service', () => ({
  generate: jest.fn().mockReturnValue('otp'),
  hash: jest.fn().mockReturnValue('password'),
}));



describe('Test auth.service module  unit-test', () => {
    //mock db
beforeEach(() => {
  db = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    verification: {
      create: jest.fn(),
    },
  };
});

afterEach(() => {
  jest.clearAllMocks();
});
  describe('Test signUp ', () => {
    it('should throw an error if any field is missing', async () => {
      await expect(AuthService.signUp()).rejects.toThrow(
        'Missing required fields.',
      );
    });

    it('should throw an error if the email is already registered', async () => {
      db.user.findUnique.mockResolvedValue({ name: 'user' });
      await expect(
        AuthService.signUp('user', 'user@gmail.com', 'password'),
      ).rejects.toThrow(
        'This email is already used by another user. Try another one.',
      );
    });
    it('should throw an error if an error happen while creating user record ', async () => {
      db.user.findUnique.mockResolvedValue(false);
      db.user.create.mockResolvedValue(null);
      await expect(
        AuthService.signUp('user', 'user@exmple.com', 'pass'),
      ).rejects.toThrow(
        'Error happen while creating the user account,please try again',
      );
    });
    it('Should register a user', async () => {
      await expect(
        AuthService.signUp('ali', 'ali@gmail.com', 'password'),
      ).resolves.not.toThrow();
    });
  });
});
