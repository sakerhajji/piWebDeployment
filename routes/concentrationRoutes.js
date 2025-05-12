const express = require('express');
const { saveOrUpdateConcentration } = require('../controller/concentrationController');
const router = express.Router();

router.post('/concentration', saveOrUpdateConcentration);

module.exports = router;
