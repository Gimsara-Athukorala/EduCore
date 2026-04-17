/**
 * Middleware to eliminate try/catch blocks in async route handlers.
 * Wraps the function and catches any errors, passing them to the next middleware.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
