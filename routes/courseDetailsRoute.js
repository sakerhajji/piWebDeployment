const express = require('express');
const router = express.Router();
const courseDetailsController = require('../controller/courseDetailsController');

// Route to create new course details
router.post('/addCourseDetails', courseDetailsController.createCourseDetails);

// Route to get all course details
router.get('/courseDetails', courseDetailsController.getCourseDetails);

// Route to get a specific course details by ID
router.get('/courseDetails/:id', courseDetailsController.getCourseDetailsById);

// Route to update course details by ID
router.put('/updateCourseDetails/:id', courseDetailsController.updateCourseDetails);

// Route to delete course details by ID
router.delete('/deleteCourseDetails/:id', courseDetailsController.deleteCourseDetails);

module.exports = router;
