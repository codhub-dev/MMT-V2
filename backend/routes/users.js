const express = require('express');
const router = express.Router();
const { getMyProfile } = require("../controllers/users");

/**
 * @openapi
 * /api/users/getMyProfile:
 *   get:
 *     summary: Get the current user's profile details
 *     tags:
 *       - User Profile
 *     description: Returns the logged-in user's profile details such as name, email, user role, and other metadata.  
 *                  Requires a valid JWT token in the Authorization header.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   example: "U67890"
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   example: "john.doe@example.com"
 *                 isAdmin:
 *                   type: boolean
 *                   example: false
 *                 isSubscribed:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Unauthorized — missing or invalid JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 */

router.get('/getMyProfile', getMyProfile);

module.exports = router;
