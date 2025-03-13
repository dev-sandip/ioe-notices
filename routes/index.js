import express from 'express';
import { getAllNotices, getNoticesByPage } from '../controllers/notices.controller.js';
import { authenticateToken } from '../middlewares/auth.js';
const router = express.Router();

/**
 * @swagger
 * /notices/all:
 *   get:
 *     summary: Retrieve all notices
 *     description: Fetch all notices (cached for 10 minutes).  
 *       **Requires Authorization via Bearer Token.**
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of notices
 *       401:
 *         description: Unauthorized - Bearer Token required
 *       403:
 *         description: Forbidden - Invalid Token
 *       404:
 *         description: No notices found
 */
router.get('/all', authenticateToken, getAllNotices);

/**
 * @swagger
 * /notices:
 *   get:
 *     summary: Retrieve notices by page
 *     description: Fetch notices from a given page number.  
 *       **Requires Authorization via Bearer Token.**
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: true
 *         description: The page number to fetch notices from
 *     responses:
 *       200:
 *         description: A list of notices
 *       401:
 *         description: Unauthorized - Bearer Token required
 *       403:
 *         description: Forbidden - Invalid Token
 *       404:
 *         description: No notices found
 */
router.get('/', authenticateToken, getNoticesByPage);

export default router;
