const express = require('express');
const {
  getAllTotalExpensesByUserId,
  downloadAllTotalExpensesExcel
} = require('../controllers/totalExpenses');

const router = express.Router();

/**
 * @openapi
 * /api/total/getAllTotalExpensesByUserId:
 *   get:
 *     summary: Get total expenses summary for a specific user
 *     tags:
 *       - Total Expenses
 *     description: Retrieves the total aggregated expenses (fuel, DEF, other, etc.) for a specific user across all trucks.
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: "U67890"
 *         description: The ID of the user for whom total expenses are to be fetched
 *     responses:
 *       200:
 *         description: Total expenses fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   example: "U67890"
 *                 totalFuelCost:
 *                   type: number
 *                   example: 245000
 *                 totalDefCost:
 *                   type: number
 *                   example: 35000
 *                 totalOtherExpenses:
 *                   type: number
 *                   example: 12000
 *                 totalLoanPayment:
 *                   type: number
 *                   example: 560000
 *                 grandTotal:
 *                   type: number
 *                   example: 852000
 *       404:
 *         description: User not found or no expense data available
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/total/downloadAllTotalExpensesExcel:
 *   get:
 *     summary: Download total expense summary as an Excel file
 *     tags:
 *       - Total Expenses
 *     description: Downloads the total expenses summary for all users and trucks in Excel format.
 *     responses:
 *       200:
 *         description: Excel file containing total expense summary generated successfully
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 */

router.get('/getAllTotalExpensesByUserId', getAllTotalExpensesByUserId);
router.get('/downloadAllTotalExpensesExcel', downloadAllTotalExpensesExcel);

module.exports = router;
