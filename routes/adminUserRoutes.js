const express = require('express');
const router = express.Router();
const { 
  createUser, 
  getAllUsers, 
  getUserById, 
  updateUserData, 
  updateUserPicture, 
  deleteUser 
} = require('../controller/adminUsersController');
const verifyToken = require("../middleware/verifyToken");

// Routes protégées pour admin seulement
router.post('/adminUser', verifyToken, createUser);
router.get('/adminUser', verifyToken, getAllUsers);
router.get('/adminUser/:id', verifyToken, getUserById);
router.put('/adminUser/data/:id', verifyToken, updateUserData);
router.put('/adminUser/picture/:id', verifyToken, updateUserPicture);
router.delete('/adminUser/:id', verifyToken, deleteUser);

module.exports = router;