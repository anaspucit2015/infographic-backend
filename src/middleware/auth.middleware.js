import jwt from 'jsonwebtoken';
import ApiError from '../utils/apiError.js';
import User from '../models/user.model.js';
import logger from '../utils/logger.js';

/**
 * Middleware to protect routes that require authentication
 */
export const protect = async (req, res, next) => {
  try {
    let token;
    
    // Get token from header or cookie
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(new ApiError(401, 'You are not logged in. Please log in to get access.'));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new ApiError(401, 'The user belonging to this token no longer exists.'));
    }

    // Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(new ApiError(401, 'User recently changed password! Please log in again.'));
    }

    // Grant access to protected route
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } catch (error) {
    logger.error(`Authentication error: ${error.message}`);
    return next(new ApiError(401, 'Invalid or expired token. Please log in again.'));
  }
};

/**
 * Middleware to restrict routes to specific roles
 * @param {...String} roles - The allowed roles
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(403, 'You do not have permission to perform this action')
      );
    }
    next();
  };
};

/**
 * Middleware to check if user is logged in (for optional auth)
 */
export const isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies?.token) {
      const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      const currentUser = await User.findById(decoded.id);
      
      if (currentUser) {
        req.user = currentUser;
        res.locals.user = currentUser;
      }
    }
    next();
  } catch (error) {
    next();
  }
};
