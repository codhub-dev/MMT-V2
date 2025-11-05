const express = require('express');
const {
  addFuelExpense,
  getAllFuelExpensesByTruckId,
  getAllFuelExpensesByUserId,
  updateFuelExpenseByTruckId,
  deleteFuelExpenseById,
  downloadFuelExpensesExcel,
  downloadAllFuelExpensesExcel
} = require('../controllers/fuelExpenses');

const router = express.Router();

/**
 * @openapi
 * /api/fuel/addFuelExpense:
 *   post:
 *     summary: Add a fuel expense record
 *     tags:
 *       - Fuel Expenses
 *     description: Creates a new fuel expense entry for a truck or user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - truckId
 *               - userId
 *               - liters
 *               - cost
 *               - date
 *             properties:
 *               truckId:
 *                 type: string
 *                 example: "T12345"
 *               userId:
 *                 type: string
 *                 example: "U56789"
 *               liters:
 *                 type: number
 *                 example: 120
 *               cost:
 *                 type: number
 *                 example: 9500
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-11-05"
 *               notes:
 *                 type: string
 *                 example: "Full tank refill at Shell"
 *     responses:
 *       201:
 *         description: Fuel expense added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid data format or missing fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/fuel/getAllFuelExpensesByTruckId:
 *   get:
 *     summary: Get all fuel expenses for a specific truck
 *     tags:
 *       - Fuel Expenses
 *     parameters:
 *       - in: query
 *         name: truckId
 *         required: true
 *         schema:
 *           type: string
 *           example: "T12345"
 *         description: Truck ID to fetch fuel expenses for
 *     responses:
 *       200:
 *         description: Returns a list of fuel expenses for the truck
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   expenseId:
 *                     type: string
 *                     example: "F001"
 *                   liters:
 *                     type: number
 *                     example: 100
 *                   cost:
 *                     type: number
 *                     example: 7500
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: "2025-11-01"
 *       404:
 *         description: Truck not found or no fuel expenses recorded
 */

/**
 * @openapi
 * /api/fuel/getAllFuelExpensesByUserId:
 *   get:
 *     summary: Get all fuel expenses for a specific user
 *     tags:
 *       - Fuel Expenses
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: "U56789"
 *         description: User ID to fetch fuel expenses for
 *     responses:
 *       200:
 *         description: Returns a list of fuel expenses for the user
 *       404:
 *         description: User not found or no fuel records available
 */

/**
 * @openapi
 * /api/fuel/updateFuelExpenseByTruckId/{id}:
 *   put:
 *     summary: Update a fuel expense record by ID
 *     tags:
 *       - Fuel Expenses
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "F001"
 *         description: The ID of the fuel expense to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               liters:
 *                 type: number
 *                 example: 130
 *               cost:
 *                 type: number
 *                 example: 9800
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-11-06"
 *               notes:
 *                 type: string
 *                 example: "Refuel after long-distance trip"
 *     responses:
 *       200:
 *         description: Fuel expense updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Fuel expense not found
 */

/**
 * @openapi
 * /api/fuel/deleteFuelExpenseById/{id}:
 *   delete:
 *     summary: Delete a fuel expense by ID
 *     tags:
 *       - Fuel Expenses
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "F001"
 *         description: The ID of the fuel expense to delete
 *     responses:
 *       200:
 *         description: Fuel expense deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Fuel expense not found
 */

/**
 * @openapi
 * /api/fuel/downloadFuelExpensesExcel:
 *   get:
 *     summary: Download fuel expenses for a specific truck as an Excel file
 *     tags:
 *       - Fuel Expenses
 *     parameters:
 *       - in: query
 *         name: truckId
 *         required: true
 *         schema:
 *           type: string
 *           example: "T12345"
 *     responses:
 *       200:
 *         description: Excel file generated successfully
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 */

/**
 * @openapi
 * /api/fuel/downloadAllFuelExpensesExcel:
 *   get:
 *     summary: Download all fuel expenses as an Excel file
 *     tags:
 *       - Fuel Expenses
 *     description: Exports all fuel expense records in Excel format.
 *     responses:
 *       200:
 *         description: Excel file generated successfully
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 */

router.post('/addFuelExpense', addFuelExpense);
router.get('/getAllFuelExpensesByTruckId', getAllFuelExpensesByTruckId);
router.get('/getAllFuelExpensesByUserId', getAllFuelExpensesByUserId);
router.put('/updateFuelExpenseByTruckId/:id', updateFuelExpenseByTruckId);
router.delete('/deleteFuelExpenseById/:id', deleteFuelExpenseById);
router.get('/downloadFuelExpensesExcel', downloadFuelExpensesExcel);
router.get('/downloadAllFuelExpensesExcel', downloadAllFuelExpensesExcel);

module.exports = router;
