const express = require('express');
const router = express.Router();

/**
 * @openapi
 * /api/health/checkHealth:
 *   get:
 *     summary: Check API health status
 *     tags:
 *       - Health
 *     description: Returns the current health status of the Warranty Wallet backend service.
 *     responses:
 *       200:
 *         description: API is running and reachable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 message:
 *                   type: string
 *                   example: Service is running
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-11-05T14:20:00.000Z"
 */
router.get('/checkHealth', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Service is running',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
