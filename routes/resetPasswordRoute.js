const express = require("express");
const router = express.Router();
const {forgetPassword,resetPassword,resendForgetPasswordEmail} = require("../controller/resetPasswordController");







router.post("/forget-password",forgetPassword)




router.post("/reset-password/:token",resetPassword)
router.post('/resend-forget-password-email', resendForgetPasswordEmail);


module.exports = router;