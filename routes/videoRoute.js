const express = require('express');
const multer = require('multer');
const {
    addVideo,
    getVideoById,
    getAllVideos,
    updateVideo,
    deleteVideo,
    getVideosBySubCourse
} = require('../controller/videoController');  // Import all controller functions

const router = express.Router();

// Multer setup for temporary file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); // Store temporarily in a folder called `uploads`
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Use the original file name
    }
});

// Create an upload instance that handles multiple fields
const upload = multer({ storage: storage });

// Route to upload video and thumbnail
router.post('/addVideo', upload.fields([
    { name: 'video', maxCount: 1 },        // Video field
    { name: 'thumbnail', maxCount: 1 }     // Thumbnail field
]), addVideo);

// Route to get a video by ID
router.get('/getVideo/:id', getVideoById);

// Route to get all videos
router.get('/getAllVideos', getAllVideos);

// Route to update a video by ID
router.put('/updateVideo/:id', updateVideo);

// Route to delete a video by ID
router.delete('/deleteVideo/:id', deleteVideo);

// Route to get videos by subCourse
router.get('/getVideosBySubCourse/:subCourseId', getVideosBySubCourse);


module.exports = router;  // Export the router