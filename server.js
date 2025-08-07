import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';
import logger from './src/utils/logger.js';

// Load environment variables
dotenv.config();

const port = process.env.PORT || 3001;

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    logger.warn('⚠️  MongoDB is not available. Some features may not work properly.');
    logger.info('💡 To use full features, please install and start MongoDB or update MONGODB_URI in .env');
    return false;
  }
};

// Start server
const startServer = async () => {
  try {
    // Try to connect to database (optional for development)
    const dbConnected = await connectDB();
    
    // Start server
    const server = app.listen(port, () => {
      logger.info(`🚀 Server is running on port ${port}`);
      if (process.env.NODE_ENV === 'development') {
        logger.info(`📚 API Documentation: http://localhost:${port}/api-docs`);
        logger.info(`🔗 Health check: http://localhost:${port}/api/v1/health`);
      }
      if (!dbConnected) {
        logger.warn('⚠️  Running without database connection');
      }
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
      logger.error(err);
      server.close(() => {
        process.exit(1);
      });
    });
  } catch (err) {
    logger.error('❌ Server startup error:', err);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(err);
  process.exit(1);
});

// Start the application
startServer();
