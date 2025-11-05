const express = require('express');
const router = express.Router();
const { signUp, logIn, logOut, whoami, signUpWithGoogle } = require("../controllers/auth");

/**
 * @openapi
 * /api/auth/signUp:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     description: Creates a new user account with username, password, and name.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - name
 *             properties:
 *               username:
 *                 type: string
 *                 example: john_doe
 *               password:
 *                 type: string
 *                 example: myStrongPass123
 *               name:
 *                 type: string
 *                 example: John Doe
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       409:
 *         description: Username already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/auth/logIn:
 *   post:
 *     summary: Log in to an existing account
 *     tags:
 *       - Auth
 *     description: Authenticates a user with username and password and returns a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: john_doe
 *               password:
 *                 type: string
 *                 example: myStrongPass123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/auth/logOut:
 *   post:
 *     summary: Log out user
 *     tags:
 *       - Auth
 *     description: Logs out the user (client-side token invalidation).
 *     responses:
 *       200:
 *         description: Logout successful
 *       400:
 *         description: Logout failed
 */

/**
 * @openapi
 * /api/auth/whoami:
 *   post:
 *     summary: Verify and return user info from JWT
 *     tags:
 *       - Auth
 *     description: Validates the user's JWT token and returns decoded user information.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User verified
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       example: john_doe
 *                     email:
 *                       type: string
 *                       example: john@example.com
 *       401:
 *         description: Token expired or invalid
 */

/**
 * @openapi
 * /api/auth/signUpWithGoogle:
 *   post:
 *     summary: Register or log in with Google
 *     tags:
 *       - Auth
 *     description: Uses Google OAuth token to create or log in a user, returning a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: Google ID token returned from Google Sign-In
 *                 example: ya29.a0AfH6SMB6...
 *     responses:
 *       200:
 *         description: Google user authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: johndoe@gmail.com
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     picture:
 *                       type: string
 *                       example: https://lh3.googleusercontent.com/abcd/photo.jpg
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Unauthorized or invalid Google token
 */

router.post("/signUp", signUp);
router.post("/logIn", logIn);
router.post("/logOut", logOut);
router.post("/whoami", whoami);
router.post("/signUpWithGoogle", signUpWithGoogle);

module.exports = router;
