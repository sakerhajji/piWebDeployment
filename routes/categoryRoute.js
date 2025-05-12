const express = require('express');
const router = express.Router();
const categoryController = require('../controller/categoryController');

// Add course (with image upload)
router.post('/addCategory', categoryController.upload.single('image'), categoryController.addCategory);

// Get all categories
router.get('/categories', categoryController.getCategories);

// Get a single category by ID
router.get('/category/:id', categoryController.getCategory);

// Update course by ID (with optional image upload)
router.put('/updateCategory/:id', categoryController.upload.single('image'), categoryController.updateCategory);

// Delete a category by ID
router.delete('/deleteCategory/:id', categoryController.deleteCategory);

module.exports = router;
