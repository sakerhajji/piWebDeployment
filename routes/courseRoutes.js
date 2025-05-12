const express = require('express');
const router = express.Router();
const courseController = require('../controller/courseController');
const Course = require('../models/course'); // Add this line

const CourseScraper = require('../utils/scraper');

// Add new route
// Update the route handler
router.post('/scrape-courses', async (req, res) => {
    try {
      const scraper = new CourseScraper();
      const scrapedCourses = await scraper.scrapeUdemy();
      
      // Get existing titles (case-insensitive)
      const existingTitles = (await Course.find().select('title -_id'))
        .map(c => c.title.toLowerCase().trim());
  
      const newCourses = [];
      for (const course of scrapedCourses) {
        const normalizedTitle = course.title.toLowerCase().trim();
        if (!existingTitles.includes(normalizedTitle)) {
          newCourses.push(course);
        }
      }
  
      if (newCourses.length === 0) {
        return res.status(200).json({ message: 'No new courses found' });
      }
  
      // Insert with error handling per document
      const results = { success: [], errors: [] };
      for (const course of newCourses) {
        try {
          const saved = await course.save();
          results.success.push(saved);
        } catch (err) {
          results.errors.push({
            title: course.title,
            error: err.message
          });
        }
      }
  
      res.status(201).json({
        message: `Added ${results.success.length} courses`,
        ...results
      });
  
    } catch (err) {
      console.error('Scraping error:', err);
      res.status(500).json({ 
        error: 'Scraping failed',
        details: process.env.NODE_ENV === 'development' ? err.stack : 'Internal server error'
      });
    }
  });

// Add course (with image upload)
router.post('/addCourse', courseController.upload.single('courseImage'), courseController.addCourse);

// Get all courses
router.get('/courses', courseController.getCourses);

// In your routes file
router.get('/courses/user/:userId', courseController.getCoursesByUser);

// Get a single course by ID
router.get('/course/:id', courseController.getCourse);
// Get courses by category ID
router.get('/courseCategory/:title', courseController.getCoursesByCategory);

// Update course by ID (with optional image upload)
router.put('/updateCourse/:id', courseController.upload.single('courseImage'), courseController.updateCourse);

// Delete course by ID
router.delete('/deleteCourse/:id', courseController.deleteCourse);
// Get certificate for a user and course
router.post('/getCertificate', courseController.getCertificate);


module.exports = router;
