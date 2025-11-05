const express = require('express');
const {
  addDefExpense,
  getAllDefExpensesByTruckId,
  getAllDefExpensesByUserId,
  deleteDefExpenseById,
  downloadDefExpensesExcel,
  downloadAllDefExpensesExcel,
  updateDefExpenseByTruckId
} = require('../controllers/defExpenses');

const router = express.Router();

/**
 * @openapi
 * /api/def/addDefExpense:
 *   post:
 *     summary: Add a DEF expense record
 *     tags:
 *       - DEF Expenses
 *     description: Creates a new DEF (Diesel Exhaust Fluid) expense entry for a truck or user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - truckId
 *               - userId
 *               - cost
 *               - date
 *             properties:
 *               truckId:
 *                 type: string
 *                 example: "T12345"
 *               userId:
 *                 type: string
 *                 example: "U67890"
 *               cost:
 *                 type: number
 *                 example: 1500
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-11-05"
 *               notes:
 *                 type: string
 *                 example: "DEF top-up after 1000 km"
 *     responses:
 *       201:
 *         description: DEF expense added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/def/getAllDefExpensesByTruckId:
 *   get:
 *     summary: Get all DEF expenses for a specific truck
 *     tags:
 *       - DEF Expenses
 *     parameters:
 *       - in: query
 *         name: truckId
 *         required: true
 *         schema:
 *           type: string
 *           example: "T12345"
 *         description: The ID of the truck
 *     responses:
 *       200:
 *         description: List of DEF expenses for the truck
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   expenseId:
 *                     type: string
 *                     example: "D001"
 *                   cost:
 *                     type: number
 *                     example: 1200
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: "2025-11-01"
 *       404:
 *         description: Truck not found or no expenses available
 */

/**
 * @openapi
 * /api/def/getAllDefExpensesByUserId:
 *   get:
 *     summary: Get all DEF expenses for a specific user
 *     tags:
 *       - DEF Expenses
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: "U67890"
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: List of DEF expenses for the user
 *       404:
 *         description: No expenses found for this user
 */

/**
 * @openapi
 * /api/def/updateDefExpenseByTruckId/{id}:
 *   put:
 *     summary: Update a DEF expense by ID
 *     tags:
 *       - DEF Expenses
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "D001"
 *         description: DEF expense ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cost:
 *                 type: number
 *                 example: 1600
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-11-06"
 *               notes:
 *                 type: string
 *                 example: "DEF refill before long trip"
 *     responses:
 *       200:
 *         description: DEF expense updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: DEF expense not found
 */

/**
 * @openapi
 * /api/def/deleteDefExpenseById/{id}:
 *   delete:
 *     summary: Delete a DEF expense by ID
 *     tags:
 *       - DEF Expenses
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "D001"
 *         description: The DEF expense ID to delete
 *     responses:
 *       200:
 *         description: DEF expense deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: DEF expense not found
 */

/**
 * @openapi
 * /api/def/downloadDefExpensesExcel:
 *   get:
 *     summary: Download DEF expenses for a specific truck as an Excel file
 *     tags:
 *       - DEF Expenses
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
 * /api/def/downloadAllDefExpensesExcel:
 *   get:
 *     summary: Download all DEF expenses as an Excel file
 *     tags:
 *       - DEF Expenses
 *     responses:
 *       200:
 *         description: Excel file containing all DEF expenses generated successfully
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 */

router.post('/addDefExpense', addDefExpense);
router.get('/getAllDefExpensesByTruckId', getAllDefExpensesByTruckId);
router.get('/getAllDefExpensesByUserId', getAllDefExpensesByUserId);
router.put('/updateDefExpenseByTruckId/:id', updateDefExpenseByTruckId);
router.delete('/deleteDefExpenseById/:id', deleteDefExpenseById);
router.get('/downloadDefExpensesExcel', downloadDefExpensesExcel);
router.get('/downloadAllDefExpensesExcel', downloadAllDefExpensesExcel);

module.exports = router;
