import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { promisify } from 'util';
import User from '../../models/user.model.js';
import ApiError from '../../utils/apiError.js';
import Email from '../../utils/email.js';

// Sign JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Create and send token in cookie and response
const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  
  // Cookie options
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  };

  // Remove password from output
  user.password = undefined;

  // Send JWT in cookie
  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

// Filter allowed fields for user update
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export {
  signToken,
  createSendToken,
  filterObj,
};
