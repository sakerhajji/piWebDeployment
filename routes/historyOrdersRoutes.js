const express = require('express');
const router = express.Router();
const historyOrderController = require('../controller/historyOrderController');

// ✅ GET history orders by user ID
router.get('/user-id/:userid', historyOrderController.getHistoryByUserId);

module.exports = router;
