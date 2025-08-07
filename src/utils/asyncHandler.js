/**
 * Async handler to wrap route handlers and automatically catch errors
 * @param {Function} fn - The async route handler function
 * @returns {Function} - A new function that handles errors
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((error) => {
    // If headers have already been sent, delegate to the default Express error handler
    if (res.headersSent) {
      return next(error);
    }
    
    // Log the error for debugging
    console.error('Async Handler Error:', error);
    
    // If the error is an instance of ApiError, use its status code and message
    if (error.name === 'ValidationError') {
      // Handle Mongoose validation errors
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: error.errors,
      });
    }
    
    if (error.name === 'MongoError' && error.code === 11000) {
      // Handle duplicate key errors
      return res.status(400).json({
        success: false,
        message: 'Duplicate key error',
        field: Object.keys(error.keyPattern)[0],
      });
    }
    
    // For other types of errors, send a generic 500 error
    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal Server Error' 
        : error.message,
      ...(process.env.NODE_ENV !== 'production' && { stack: error.stack }),
    });
  });
};

module.exports = asyncHandler;
