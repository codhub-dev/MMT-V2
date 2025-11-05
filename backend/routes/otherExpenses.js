const express = require('express');
const {
  addOtherExpense,
  getAllOtherExpensesByTruckId,
  getAllOtherExpensesByUserId,
  deleteOtherExpenseById,
  downloadOtherExpensesExcel,
  downloadAllOtherExpensesExcel,
  updateOtherExpenseByTruckId
} = require('../controllers/otherExpenses');

const router = express.Router();

/**
 * @openapi
 * /api/other/addOtherExpense:
 *   post:
 *     summary: Add a new miscellaneous expense
 *     tags:
 *       - Other Expenses
 *     description: Creates a new miscellaneous or other type of expense for a truck or user (e.g., tolls, maintenance, parking, etc.)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - truckId
 *               - userId
 *               - description
 *               - cost
 *               - date
 *             properties:
 *               truckId:
 *                 type: string
 *                 example: "T12345"
 *               userId:
 *                 type: string
 *                 example: "U45678"
 *               description:
 *                 type: string
 *                 example: "Highway toll charges"
 *               cost:
 *                 type: number
 *                 example: 450
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-11-05"
 *     responses:
 *       201:
 *         description: Other expense added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/other/getAllOtherExpensesByTruckId:
 *   get:
 *     summary: Get all other expenses for a specific truck
 *     tags:
 *       - Other Expenses
 *     parameters:
 *       - in: query
 *         name: truckId
 *         required: true
 *         schema:
 *           type: string
 *           example: "T12345"
 *         description: Truck ID to fetch all miscellaneous expenses for
 *     responses:
 *       200:
 *         description: List of other expenses for the given truck
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   expenseId:
 *                     type: string
 *                     example: "O001"
 *                   description:
 *                     type: string
 *                     example: "Truck washing"
 *                   cost:
 *                     type: number
 *                     example: 300
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: "2025-11-01"
 *       404:
 *         description: Truck not found or no expenses found
 */

/**
 * @openapi
 * /api/other/getAllOtherExpensesByUserId:
 *   get:
 *     summary: Get all other expenses for a specific user
 *     tags:
 *       - Other Expenses
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: "U45678"
 *         description: User ID to fetch all other expenses for
 *     responses:
 *       200:
 *         description: List of other expenses for the user
 *       404:
 *         description: User not found or no other expenses available
 */

/**
 * @openapi
 * /api/other/updateOtherExpenseByTruckId/{id}:
 *   put:
 *     summary: Update an existing other expense record
 *     tags:
 *       - Other Expenses
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "O001"
 *         description: The ID of the other expense record to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 example: "Truck maintenance and cleaning"
 *               cost:
 *                 type: number
 *                 example: 600
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-11-06"
 *     responses:
 *       200:
 *         description: Other expense updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Expense not found
 */

/**
 * @openapi
 * /api/other/deleteOtherExpenseById/{id}:
 *   delete:
 *     summary: Delete an other expense record
 *     tags:
 *       - Other Expenses
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "O001"
 *         description: The ID of the other expense to delete
 *     responses:
 *       200:
 *         description: Other expense deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Expense not found
 */

/**
 * @openapi
 * /api/other/downloadOtherExpensesExcel:
 *   get:
 *     summary: Download other expenses (truck-level) as an Excel file
 *     tags:
 *       - Other Expenses
 *     parameters:
 *       - in: query
 *         name: truckId
 *         required: true
 *         schema:
 *           type: string
 *           example: "T12345"
 *         description: Truck ID to generate the Excel for
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
 * /api/other/downloadAllOtherExpensesExcel:
 *   get:
 *     summary: Download all other expenses as an Excel file
 *     tags:
 *       - Other Expenses
 *     description: Downloads all other expenses across all users and trucks in Excel format.
 *     responses:
 *       200:
 *         description: Excel file generated successfully
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 */

router.post('/addOtherExpense', addOtherExpense);
router.get('/getAllOtherExpensesByTruckId', getAllOtherExpensesByTruckId);
router.get('/getAllOtherExpensesByUserId', getAllOtherExpensesByUserId);
router.put('/updateOtherExpenseByTruckId/:id', updateOtherExpenseByTruckId);
router.delete('/deleteOtherExpenseById/:id', deleteOtherExpenseById);
router.get('/downloadOtherExpensesExcel', downloadOtherExpensesExcel);
router.get('/downloadAllOtherExpensesExcel', downloadAllOtherExpensesExcel);

module.exports = router;
