const express = require('express');
const router = express.Router();
const { translateText } = require('../controller/translateController');

router.post('/translate', translateText);

module.exports = router;