const express = require('express');
const router = express.Router();
const { getOneUserByUsername, getAlluser, deleteOneUserByUsername, manageSubscription } = require("../controllers/admin");

router.get('/getAlluser', getAlluser);

router.get('/getOneUserByUsername', getOneUserByUsername);
router.get('/deleteOneUserByUsername', deleteOneUserByUsername);
router.put('/manageSubscription', manageSubscription);

module.exports = router;
