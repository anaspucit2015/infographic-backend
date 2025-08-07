import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import xss from 'xss-clean';
import hpp from 'hpp';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import httpStatus from 'http-status';
import passport from 'passport';

import logger from './src/utils/logger.js';
import swaggerDocs from './src/config/swagger.js';
import { errorHandler } from './src/middleware/error.middleware.js';
import ApiError from './src/utils/apiError.js';

// Import routes
import routes from './src/routes/index.js';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========================
// 1) GLOBAL MIDDLEWARES
// ========================

// Trust proxy - only in production
if (process.env.NODE_ENV === 'production') {
  app.enable('trust proxy');
}

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev', { stream: { write: message => logger.info(message.trim()) } }));
}

// Limit requests from same IP
const limiter = rateLimit({
  max: process.env.RATE_LIMIT_MAX || 100,
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour!',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection and XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Enable CORS - Allow all origins for development
app.use(cors({
  origin: true, // Allow all origins
  credentials: false, // No credentials needed
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// Compression
app.use(compression());

// ========================
// 2) PASSPORT CONFIGURATION
// ========================
// Import passport configuration after environment variables are loaded
import('./src/config/passport.js').then(() => {
  app.use(passport.initialize());
});

// ========================
// 3) ROUTES
// ========================

// CORS test endpoint
app.get('/api/cors-test', (req, res) => {
  res.json({ 
    message: 'CORS is working!', 
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

app.use('/api/v1', routes);

// ========================
// 4) SWAGGER DOCS
// ========================
if (process.env.NODE_ENV !== 'production') {
  swaggerDocs(app);
}

// ========================
// 5) ERROR HANDLING
// ========================
// 404 handler
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// Handle error
app.use(errorHandler);

export default app;

// ========================
// 6) PRODUCTION SETUP
// ========================
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  const publicPath = path.join(__dirname, 'public');
  app.use(express.static(publicPath));
  
  // Handle SPA (Single Page Application)
  app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });
}
