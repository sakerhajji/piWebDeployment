const express = require('express');
const router = express.Router();
const {toggle2FA,verifyOTP} = require("../controller/2faAuthController");

const verifyToken = require("../middleware/verifyToken");
router.post("/active2fa",verifyToken,toggle2FA);
router.post("/login2fa",verifyOTP);




module.exports = router;