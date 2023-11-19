const { catchAsync } = require('../util');
const authService = require('../services/auth.service');
// /api/v1/auth/signup
/**
 * Handles user sign-up.
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} A promise that resolves once the response is sent.
 * @throws {Error} If there is an issue during the sign-up process.
 */
const signup = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  const otp = await authService.signUp(name, email, password);
  // TODO Remove the console.log statement after implement sending emails feature
  console.log(`OTP is ==>${otp}`);
  return res.status(201).json({
    status: 'success',
    message: `Check the confirmation otp code at ${email}`,
    otp: process.env.NODE_ENV !== 'production' ? otp : undefined,
  });
});
// /api/v1/auth/signup/verify-email
/**
 * Verifies user email using the provided OTP.
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} A promise that resolves once the response is sent.
 * @throws {Error} If there is an issue during the email verification process.
 */
const verifyEmail = catchAsync(async (req, res) => {
  const { otp } = req.body;
  await authService.verifyEmail(otp);

  return res.status(200).json({
    status: 'success',
    message: 'Your email verified successfully, you can login now.',
  });
});
// /api/v1/auth/login
/**
 * Handles user login.
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} A promise that resolves once the response is sent.
 * @throws {Error} If there is an issue during the login process.
 */
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const token = await authService.login(email, password);
  const cookieOptions = {
    expires: Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
  return res.status(200).json({
    status: 'success',
    message: 'user log in successfully',
    token,
  });
});
// /api/v1/auth/reverify-email
/**
 * Resend verification OTP to the user's email.
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} A promise that resolves once the response is sent.
 * @throws {Error} If there is an issue during the OTP resend process.
 */
const reverifyEmail = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const otp = await authService.reverifyEmail(email);

  return res.status(200).json({
    status: 'success',
    message: `Verification OTP sent to ${email}`,
    otp: process.env.NODE_ENV !== 'production' ? otp : null,
  });
});
module.exports = {
  signup,
  verifyEmail,
  login,
  reverifyEmail,
};
