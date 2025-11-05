const express = require("express");
const {
  getMetadataByTruckId,
  getMetadataByUserId,
  getProfileMetadataByUserId,
} = require("../controllers/metadata");

const router = express.Router();

/**
 * @openapi
 * /api/metadata/getMetadataByTruckId:
 *   get:
 *     summary: Get metadata for a specific truck
 *     tags:
 *       - Metadata
 *     description: Retrieves detailed metadata for a truck, such as usage, ownership, and maintenance information.
 *     parameters:
 *       - in: query
 *         name: truckId
 *         required: true
 *         schema:
 *           type: string
 *           example: "T12345"
 *         description: The unique ID of the truck
 *     responses:
 *       200:
 *         description: Metadata fetched successfully for the given truck
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 truckId:
 *                   type: string
 *                   example: "T12345"
 *                 lastServiceDate:
 *                   type: string
 *                   format: date
 *                   example: "2025-10-15"
 *                 mileage:
 *                   type: number
 *                   example: 45200
 *                 owner:
 *                   type: string
 *                   example: "John Doe"
 *       404:
 *         description: Truck not found or metadata unavailable
 */

/**
 * @openapi
 * /api/metadata/getMetadataByUserId:
 *   get:
 *     summary: Get metadata for all trucks owned by a specific user
 *     tags:
 *       - Metadata
 *     description: Retrieves truck-related metadata (fuel usage, maintenance history, etc.) for all trucks linked to a specific user.
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: "U67890"
 *         description: The user ID to retrieve metadata for
 *     responses:
 *       200:
 *         description: Metadata fetched successfully for the user's trucks
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
 *                   fuelUsage:
 *                     type: number
 *                     example: 120
 *                   defUsage:
 *                     type: number
 *                     example: 5
 *                   totalTrips:
 *                     type: integer
 *                     example: 18
 *       404:
 *         description: No metadata found for the provided user ID
 */

/**
 * @openapi
 * /api/metadata/getProfileMetadataByUserId:
 *   get:
 *     summary: Get profile-level metadata for a specific user
 *     tags:
 *       - Metadata
 *     description: Returns aggregated or profile-specific metadata for the user such as number of trucks, total expenses, and other key metrics.
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: "U67890"
 *         description: The ID of the user to fetch profile metadata for
 *     responses:
 *       200:
 *         description: Profile metadata retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   example: "U67890"
 *                 totalTrucks:
 *                   type: integer
 *                   example: 4
 *                 totalFuelCost:
 *                   type: number
 *                   example: 235000
 *                 totalDefCost:
 *                   type: number
 *                   example: 34000
 *                 totalLoanAmount:
 *                   type: number
 *                   example: 560000
 *       404:
 *         description: User not found or no profile metadata available
 */

router.get("/getMetadataByTruckId", getMetadataByTruckId);
router.get("/getMetadataByUserId", getMetadataByUserId);
router.get("/getProfileMetadataByUserId", getProfileMetadataByUserId);

module.exports = router;
