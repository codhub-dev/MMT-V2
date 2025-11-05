const express = require('express');
const router = express.Router();
const { getOneUserByUsername, getAlluser, deleteOneUserByUsername } = require("../controllers/admin");

/**
 * @openapi
 * /api/admin/getOneUserByUsername:
 *   get:
 *     summary: Get a user by username
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: query
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *           example: "john_doe"
 *         description: The username of the user to fetch
 *     responses:
 *       200:
 *         description: User details fetched successfully
 *       404:
 *         description: User not found
 */

/**
 * @openapi
 * /api/admin/deleteOneUserByUsername:
 *   get:
 *     summary: Delete a user by username
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: query
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *           example: "john_doe"
 *         description: The username of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */

/**
 * @openapi
 * /api/admin/getAlluser:
 *   get:
 *     summary: Get all registered users
 *     tags:
 *       - Admin
 *     responses:
 *       200:
 *         description: Successfully fetched all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                     example: "adminuser"
 *                   email:
 *                     type: string
 *                     example: "admin@example.com"
 *       401:
 *         description: Unauthorized or missing token
 */
router.get('/getAlluser', getAlluser);

router.get('/getOneUserByUsername', getOneUserByUsername);
router.get('/deleteOneUserByUsername', deleteOneUserByUsername);

module.exports = router;
