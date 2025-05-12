const express = require('express');
const router = express.Router();
const { login,logout,checkAuth} = require("../controller/authController");

const verifyToken = require("../middleware/verifyToken");

router.post("/login",login);
router.post("/logout",logout)

router.get("/check-auth",verifyToken,checkAuth)








module.exports = router;