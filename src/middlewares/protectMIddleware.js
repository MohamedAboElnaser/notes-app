const { catchAsync, AppError, JWTService } = require('../util');
const { db } = require('../../config');

/**
 * Middleware to protect routes by checking for a valid authentication token.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {function} next - The next middleware function to call.
 * @returns {void}
 * @throws {AppError} When authentication fails (user not logged in or invalid token).
 */
const protect = catchAsync(async (req, res, next) => {
  // get the token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  )
    token = req.headers.authorization.split(' ')[1];
  else if (req.cookies.jwt) token = req.cookies.jwt;
  if (!token)
    return next(
      new AppError('You are not logged in! Please log in to get access', 401),
    );

  // verify token
  const decodedToken = await JWTService.decode(token);

  // check the existence of the user
  const currentUser = await db.user.findUnique({
    where: {
      id: decodedToken.id,
    },
  });

  if (!currentUser)
    next(new AppError("This token's user is no longer existing.", 401));

  // TODO in the future verify that user didn't change his password
  // after he issued the token

  req.user = currentUser;
  next();
});

module.exports = protect;
