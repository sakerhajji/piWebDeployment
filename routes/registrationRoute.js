const express = require("express");
const router = express.Router();
const { signUp,verifyEmail,resendVerificationEmail} = require("../controller/registraionController");

const validateUser = require("../middleware/UserValidate");




router.post("/register",signUp); 

router.post("/verify-email",verifyEmail);
router.post("/resend-email",resendVerificationEmail);










module.exports = router;