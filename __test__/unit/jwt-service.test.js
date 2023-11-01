const jwt = require('jsonwebtoken');
const { JWTService } = require('../../src/util');

// Mock jsonwebtoken module
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('token'),
  verify: jest.fn().mockReturnValue('Decoded'),
}));
afterEach(() => {
  jest.clearAllMocks();
});

describe('Test JWTService Class', () => {
  it('Should generate token', async () => {
    await expect(JWTService.generate('id')).toBeDefined();
    expect(jwt.sign).toHaveBeenCalled();
  });

  it('Should decode the token', async () => {
    const decoded = await JWTService.decode('token');
    expect(decoded).toMatch('Decoded');
    expect(jwt.verify).toHaveBeenCalled();
  });
});
