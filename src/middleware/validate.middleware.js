import { validationResult } from 'express-validator';
import ApiError from '../utils/apiError.js';
import httpStatus from 'http-status';

/**
 * Middleware that validates the request against the given validation rules.
 * If validation fails, it sends a 400 response with the validation errors.
 * If validation passes, it calls the next middleware.
 * 
 * @param {Array} validations - Array of validation rules from express-validator
 * @returns {Function} Express middleware function
 */
const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    // Check for validation errors
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Extract error messages
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }));

    // Send error response
    return next(
      new ApiError(
        httpStatus.BAD_REQUEST,
        'Validation failed',
        extractedErrors
      )
    );
  };
};

export default validate;
