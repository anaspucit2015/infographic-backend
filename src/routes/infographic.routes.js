const express = require('express');
const router = express.Router();
const infographicController = require('../controllers/infographic.controller');
const authController = require('../controllers/auth/auth.controller');
const { upload } = require('../../config/cloudinary');

/**
 * @swagger
 * tags:
 *   name: Infographics
 *   description: Infographic management endpoints
 */

// Public routes
router
  .route('/')
  /**
   * @swagger
   * /api/v1/infographics:
   *   get:
   *     summary: Get all infographics
   *     tags: [Infographics]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *         description: Page number
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *         description: Number of items per page
   *       - in: query
   *         name: sort
   *         schema:
   *           type: string
   *         description: Sort by field (e.g., -createdAt for newest first)
   *     responses:
   *       200:
   *         description: List of infographics
   */
  .get(infographicController.getAllInfographics)
  /**
   * @swagger
   * /api/v1/infographics:
   *   post:
   *     summary: Create a new infographic
   *     tags: [Infographics]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - title
   *               - content
   *             properties:
   *               title:
   *                 type: string
   *               description:
   *                 type: string
   *               content:
   *                 type: object
   *               isPublic:
   *                 type: boolean
   *                 default: true
   *               tags:
   *                 type: array
   *                 items:
   *                   type: string
   *     responses:
   *       201:
   *         description: Infographic created successfully
   *       401:
   *         description: Not authorized
   */
  .post(
    authController.protect,
    authController.restrictTo('user', 'admin'),
    infographicController.createInfographic
  );

router
  .route('/:id')
  /**
   * @swagger
   * /api/v1/infographics/{id}:
   *   get:
   *     summary: Get infographic by ID
   *     tags: [Infographics]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Infographic data
   *       404:
   *         description: Infographic not found
   */
  .get(infographicController.getInfographic)
  /**
   * @swagger
   * /api/v1/infographics/{id}:
   *   patch:
   *     summary: Update infographic
   *     tags: [Infographics]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *               description:
   *                 type: string
   *               content:
   *                 type: object
   *               isPublic:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: Infographic updated successfully
   *       403:
   *         description: Not authorized to update this infographic
   */
  .patch(
    authController.protect,
    authController.restrictTo('user', 'admin'),
    infographicController.updateInfographic
  )
  /**
   * @swagger
   * /api/v1/infographics/{id}:
   *   delete:
   *     summary: Delete infographic
   *     tags: [Infographics]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       204:
   *         description: Infographic deleted successfully
   *       403:
   *         description: Not authorized to delete this infographic
   */
  .delete(
    authController.protect,
    authController.restrictTo('user', 'admin'),
    infographicController.deleteInfographic
  );

/**
 * @swagger
 * /api/v1/infographics/user/{userId}:
 *   get:
 *     summary: Get all infographics by user ID
 *     tags: [Infographics]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of user's infographics
 */
router.get('/user/:userId', infographicController.getUserInfographics);

module.exports = router;
