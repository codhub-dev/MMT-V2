const express = require('express');
const {
  addTruck,
  getTruckById,
  getAllTrucks,
  getAllTruckByUser,
  updateTruckById,
  deleteTruckById
} = require('../controllers/truck');

const router = express.Router();

/**
 * @openapi
 * /api/truck/addTruck:
 *   post:
 *     summary: Add a new truck
 *     tags:
 *       - Truck Management
 *     description: Adds a new truck record with details such as registration number, model, and owner info.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - registrationNumber
 *               - model
 *               - addedBy
 *             properties:
 *               registrationNumber:
 *                 type: string
 *                 example: "KL07BX4592"
 *               model:
 *                 type: string
 *                 example: "Tata LPT 2818"
 *               manufacturer:
 *                 type: string
 *                 example: "Tata Motors"
 *               year:
 *                 type: integer
 *                 example: 2022
 *               addedBy:
 *                 type: string
 *                 example: "U67890"
 *     responses:
 *       201:
 *         description: Truck added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Missing or invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/truck/getAllTrucks:
 *   get:
 *     summary: Get all trucks
 *     tags:
 *       - Truck Management
 *     description: Retrieves all trucks available in the system (admin-level access).
 *     responses:
 *       200:
 *         description: List of all trucks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   truckId:
 *                     type: string
 *                     example: "T12345"
 *                   registrationNumber:
 *                     type: string
 *                     example: "KL07BX4592"
 *                   model:
 *                     type: string
 *                     example: "Tata LPT 2818"
 *                   year:
 *                     type: integer
 *                     example: 2022
 */

/**
 * @openapi
 * /api/truck/getTruckById/{id}:
 *   get:
 *     summary: Get details of a specific truck
 *     tags:
 *       - Truck Management
 *     description: Fetches detailed information for a truck by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "T12345"
 *         description: Truck ID to fetch
 *     responses:
 *       200:
 *         description: Truck details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 truckId:
 *                   type: string
 *                   example: "T12345"
 *                 registrationNumber:
 *                   type: string
 *                   example: "KL07BX4592"
 *                 model:
 *                   type: string
 *                   example: "Tata LPT 2818"
 *                 addedBy:
 *                   type: string
 *                   example: "U67890"
 *       404:
 *         description: Truck not found
 */

/**
 * @openapi
 * /api/truck/getAllTrucksByUser/{addedBy}:
 *   get:
 *     summary: Get all trucks added by a specific user
 *     tags:
 *       - Truck Management
 *     description: Returns all trucks owned or added by a specific user.
 *     parameters:
 *       - in: path
 *         name: addedBy
 *         required: true
 *         schema:
 *           type: string
 *           example: "U67890"
 *         description: User ID of the person who added the trucks
 *     responses:
 *       200:
 *         description: Trucks retrieved successfully for the given user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   truckId:
 *                     type: string
 *                     example: "T12345"
 *                   registrationNumber:
 *                     type: string
 *                     example: "KL07BX4592"
 *                   model:
 *                     type: string
 *                     example: "Tata LPT 2818"
 *       404:
 *         description: No trucks found for this user
 */

/**
 * @openapi
 * /api/truck/updateTruckById/{id}:
 *   put:
 *     summary: Update a truck’s details
 *     tags:
 *       - Truck Management
 *     description: Updates the truck information by truck ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "T12345"
 *         description: Truck ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               registrationNumber:
 *                 type: string
 *                 example: "KL07BX4592"
 *               model:
 *                 type: string
 *                 example: "Ashok Leyland 3120"
 *               year:
 *                 type: integer
 *                 example: 2023
 *     responses:
 *       200:
 *         description: Truck updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Truck not found
 */

/**
 * @openapi
 * /api/truck/deleteTruckById/{id}:
 *   delete:
 *     summary: Delete a truck
 *     tags:
 *       - Truck Management
 *     description: Deletes a truck from the system using its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "T12345"
 *         description: Truck ID to delete
 *     responses:
 *       200:
 *         description: Truck deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Truck not found
 */

router.post('/addTruck', addTruck);
router.get('/getAllTrucks', getAllTrucks);
router.get('/getTruckById/:id', getTruckById);
router.get('/getAllTrucksByUser/:addedBy', getAllTruckByUser);
router.put('/updateTruckById/:id', updateTruckById);
router.delete('/deleteTruckById/:id', deleteTruckById);

module.exports = router;
