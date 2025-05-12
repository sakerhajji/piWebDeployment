const express = require('express');
const router = express.Router();
const subCourseController = require('../controller/subCourseController');

// Route to create new course details
router.post('/addSubCourse', subCourseController.createSubCourse);

// Route to get all course details
router.get('/SubCourses', subCourseController.getSubCourses);

// Define the route
router.get('/subcourses/course/:id', subCourseController.getSubCoursesByCourse);

// Route to get a specific course details by ID
router.get('/SubCourse/:id', subCourseController.getSubCourse);

// Route to update course details by ID
router.put('/updateSubCourse/:id', subCourseController.updateSubCourse);

// Route to delete course details by ID
router.delete('/deleteSubCourse/:id', subCourseController.deleteSubCourse);

// In your routes file
router.get('/subcourses/course/:courseId/user/:userId', subCourseController.getSubCoursesByCourseAndUser);

module.exports = router;
