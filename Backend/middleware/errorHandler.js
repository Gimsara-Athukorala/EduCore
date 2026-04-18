const { nodeEnv } = require('../config/env');

/**
 * Centralized error handling middleware.
 * Handles Joi, Mongoose, JWT, and Multer errors specifically with precise status codes.
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for development
  if (nodeEnv !== 'test') {
    console.error(`[Error] ${err.name}: ${err.message}`);
    if (nodeEnv === 'development') console.error(err.stack);
  }

  // 1. Joi Validation Error (Already handled by validate middleware, but here as fallback)
  if (err.isJoi) {
    const messages = err.details.map((d) => ({
      field: d.path.join('.'),
      message: d.message.replace(/['"]/g, '')
    }));
    error = { message: 'Validation failed', errors: messages, statusCode: 400 };
  }

  // 2. Mongoose Validation Error (Schema constraints)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => ({
      field: val.path,
      message: val.message
    }));
    error = { message: 'Validation failed', errors: messages, statusCode: 400 };
  }

  // 3. Mongoose CastError (Invalid ObjectId)
  if (err.name === 'CastError') {
    error = { message: 'Invalid ID format', statusCode: 400 };
  }

  // 4. Mongoose Duplicate Key (Unique constraint)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = { message: `Already exists: ${field}`, statusCode: 409 };
  }

  // 5. JWT Errors
  if (err.name === 'JsonWebTokenError') {
    error = { message: 'Invalid token', statusCode: 401 };
  }
  if (err.name === 'TokenExpiredError') {
    error = { message: 'Token expired', statusCode: 401 };
  }

  // 6. Multer Errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      error = { message: 'File too large. Max size: 50MB', statusCode: 413 };
    } else {
      error = { message: err.message, statusCode: 400 };
    }
  }

  // Final Response Construction
  const statusCode = error.statusCode || err.statusCode || 500;
  const message = error.message || 'Something went wrong';

  res.status(statusCode).json({
    success: false,
    message,
    errors: error.errors || [],
    ...(nodeEnv === 'development' && { stack: err.stack })
  });
};

/**
 * Async handler to wrap async functions and catch errors automatically.
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = { errorHandler, asyncHandler };
