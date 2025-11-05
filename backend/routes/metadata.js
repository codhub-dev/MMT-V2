const express = require("express");
const {
  getMetadataByTruckId,
  getMetadataByUserId,
  getProfileMetadataByUserId,
} = require("../controllers/metadata");

const router = express.Router();

router.get("/getMetadataByTruckId", getMetadataByTruckId);
router.get("/getMetadataByUserId", getMetadataByUserId);
router.get("/getProfileMetadataByUserId", getProfileMetadataByUserId);

module.exports = router;
