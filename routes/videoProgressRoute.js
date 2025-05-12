const express = require('express');
const router = express.Router();
const VideoProgressController = require('../controller/VideoProgressController');

// Correct route order
router.get('/videoProgress', VideoProgressController.getVideoProgressByUserAndVideo); // This should come first
router.get('/videoProgress/:id', VideoProgressController.getVideoProgressById); // Then this
router.get('/getVideoProgressByVideoId/:id', VideoProgressController.getVideoProgressByVideoId); // Then this

// The rest of your routes
router.post('/AddVideoProgress', VideoProgressController.createVideoProgress);
router.get('/videoProgresses', VideoProgressController.getAllVideoProgresses);
router.put('/UpdateVideoProgress/:id', VideoProgressController.updateVideoProgress);
router.delete('/videoProgress/:id', VideoProgressController.deleteVideoProgress);

module.exports = router;