const express = require('express');
const {
  addLoanCalculation,
  getAllLoanCalculationsByTruckId,
  getAllLoanCalculationsByUserId,
  deleteLoanCalculationById,
  downloadLoanCalculationsExcel,
  downloadAllLoanCalculationsExcel
} = require('../controllers/calculateLoan');

const router = express.Router();

/**
 * @openapi
 * /api/loan/addLoanCalculation:
 *   post:
 *     summary: Add a new loan calculation
 *     tags:
 *       - Loan
 *     description: Adds a new loan calculation for a truck or user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - truckId
 *               - userId
 *               - loanAmount
 *               - interestRate
 *               - tenure
 *             properties:
 *               truckId:
 *                 type: string
 *                 example: "T12345"
 *               userId:
 *                 type: string
 *                 example: "U98765"
 *               loanAmount:
 *                 type: number
 *                 example: 500000
 *               interestRate:
 *                 type: number
 *                 example: 8.5
 *               tenure:
 *                 type: integer
 *                 example: 36
 *     responses:
 *       201:
 *         description: Loan calculation added successfully
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
 * /api/loan/getAllLoanCalculationsByTruckId:
 *   get:
 *     summary: Get all loan calculations by truck ID
 *     tags:
 *       - Loan
 *     parameters:
 *       - in: query
 *         name: truckId
 *         required: true
 *         schema:
 *           type: string
 *           example: "T12345"
 *     responses:
 *       200:
 *         description: Successfully fetched all loan calculations for the given truck
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   loanId:
 *                     type: string
 *                     example: "L001"
 *                   loanAmount:
 *                     type: number
 *                     example: 500000
 *                   interestRate:
 *                     type: number
 *                     example: 8.5
 *                   tenure:
 *                     type: integer
 *                     example: 36
 *                   emiAmount:
 *                     type: number
 *                     example: 15753
 *       404:
 *         description: Truck not found or no loan records
 */

/**
 * @openapi
 * /api/loan/getAllLoanCalculationsByUserId:
 *   get:
 *     summary: Get all loan calculations by user ID
 *     tags:
 *       - Loan
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: "U98765"
 *     responses:
 *       200:
 *         description: Successfully fetched all loan calculations for the given user
 *       404:
 *         description: User not found or no loan records
 */

/**
 * @openapi
 * /api/loan/deleteLoanCalculationById/{id}:
 *   delete:
 *     summary: Delete a loan calculation by ID
 *     tags:
 *       - Loan
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "L001"
 *         description: The ID of the loan record to delete
 *     responses:
 *       200:
 *         description: Loan calculation deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Loan record not found
 */

/**
 * @openapi
 * /api/loan/downloadLoanCalculationExcel:
 *   get:
 *     summary: Download loan calculations (by truck) as an Excel file
 *     tags:
 *       - Loan
 *     description: Downloads all loan calculation data for a truck in Excel format.
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
 * /api/loan/downloadAllLoanCalculationExcel:
 *   get:
 *     summary: Download all loan calculations (for all users/trucks) as an Excel file
 *     tags:
 *       - Loan
 *     description: Exports all loan calculation records in Excel format.
 *     responses:
 *       200:
 *         description: Excel file generated successfully
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 */

router.post('/addLoanCalculation', addLoanCalculation);
router.get('/getAllLoanCalculationsByTruckId', getAllLoanCalculationsByTruckId);
router.get('/getAllLoanCalculationsByUserId', getAllLoanCalculationsByUserId);
router.delete('/deleteLoanCalculationById/:id', deleteLoanCalculationById);
router.get('/downloadLoanCalculationExcel', downloadLoanCalculationsExcel);
router.get('/downloadAllLoanCalculationExcel', downloadAllLoanCalculationsExcel);

module.exports = router;
