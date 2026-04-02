/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Analytics and summary endpoints
 */

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Get financial summary (total income, expenses, net balance)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering
 *       - in: query
 *         name: viewAll
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Admin only - view all users' data
 *     responses:
 *       200:
 *         description: Dashboard summary
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardSummary'
 *
 * /api/dashboard/categories:
 *   get:
 *     summary: Get category-wise totals
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: viewAll
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Category breakdown
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 income:
 *                   type: object
 *                   additionalProperties:
 *                     type: number
 *                 expense:
 *                   type: object
 *                   additionalProperties:
 *                     type: number
 *
 * /api/dashboard/trends:
 *   get:
 *     summary: Get monthly trends
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: months
 *         schema:
 *           type: integer
 *           default: 6
 *         description: Number of months to analyze
 *       - in: query
 *         name: viewAll
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Monthly trend data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   month:
 *                     type: string
 *                   income:
 *                     type: number
 *                   expense:
 *                     type: number
 *
 * /api/dashboard/recent:
 *   get:
 *     summary: Get recent activity
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of recent transactions
 *       - in: query
 *         name: viewAll
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Recent transactions
 *
 * /api/dashboard/full:
 *   get:
 *     summary: Get complete dashboard data (all metrics in one call)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: months
 *         schema:
 *           type: integer
 *           default: 6
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: viewAll
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Complete dashboard with summary, categories, trends, and recent activity
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   $ref: '#/components/schemas/DashboardSummary'
 *                 categories:
 *                   type: object
 *                 trends:
 *                   type: array
 *                 recent_activity:
 *                   type: array
 */

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticate, authorize, checkUserStatus } = require('../middleware/auth');

router.use(authenticate);
router.use(checkUserStatus);
router.use(authorize('canViewDashboard'));

router.get('/summary', dashboardController.getSummary);
router.get('/categories', dashboardController.getCategoryTotals);
router.get('/trends', dashboardController.getMonthlyTrends);
router.get('/recent', dashboardController.getRecentActivity);
router.get('/full', dashboardController.getFullDashboard);

module.exports = router;