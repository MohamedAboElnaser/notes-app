/**
 * Wraps an async function to catch any errors and pass them to the Express.js error handling middleware.
 *
 * @param {Function} fn - The async function to be wrapped.
 * @returns {Function} A middleware function that handles errors and passes them to the next middleware.
 */
function catchAsync(fn) {
    return function (req, res, next) {
      fn(req, res, next).catch(next);
    };
  }
module.exports={
    catchAsync
}