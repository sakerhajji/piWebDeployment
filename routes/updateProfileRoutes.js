const express = require('express');
const router = express.Router();
const { updateProfile, updatePassword, updateProfilePicture,getProfilePicture ,deleteAccount,toggleProfessorRole} = require('../controller/updateProfile');
const verifyToken = require("../middleware/verifyToken");

router.put('/profile', verifyToken, updateProfile);
router.put('/password', verifyToken, updatePassword);
router.put('/profile-picture', verifyToken, updateProfilePicture);
// routes/userRoutes.js
router.get('/profile-picture', verifyToken, getProfilePicture);
router.delete('/delete-account', verifyToken, deleteAccount);
router.put('/toggle-role', verifyToken, toggleProfessorRole);
module.exports = router;