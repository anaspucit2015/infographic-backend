import express from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import infographicRoutes from './infographic.routes.js';

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/infographics', infographicRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

export default router;
