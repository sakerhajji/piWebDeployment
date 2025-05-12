const cloudinary = require('cloudinary').v2;
const Video = require('../models/video');
const dotenv = require('dotenv');

dotenv.config();

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Add Video
const addVideo = async (req, res) => {
    try {
        const videoFile = req.files?.video?.[0];
        const thumbnailFile = req.files?.thumbnail?.[0];

        if (!videoFile || !thumbnailFile) {
            return res.status(400).json({ message: 'Video and thumbnail files are required' });
        }

        const title = videoFile.originalname.split('.').slice(0, -1).join('.');

        // Upload video to Cloudinary and extract metadata
        const uploadVideoResult = await cloudinary.uploader.upload(videoFile.path, {
            resource_type: 'video',
            public_id: `videos/${title}`,
            folder: 'course_videos',
            eager: [{ format: 'mp4' }], // Optional: Ensure the video is in a specific format
            eager_async: true, // Optional: Process the video asynchronously
        });

        // Extract duration from Cloudinary response
        const duration = uploadVideoResult.duration; // Duration in seconds

        // Upload thumbnail to Cloudinary
        const uploadThumbnailResult = await cloudinary.uploader.upload(thumbnailFile.path, {
            resource_type: 'image',
            public_id: `thumbnails/${title}`,
            folder: 'course_thumbnails',
        });

        // Create a new video record in the database
        const newVideo = new Video({
            title: title,
            url: uploadVideoResult.secure_url,
            thumbnail: uploadThumbnailResult.secure_url,
            duration: duration, // Automatically extracted duration
            order: req.body.order || 0,
            user: req.body.user,
            subCourse: req.body.subCourse
        });

        // Save the video to the database
        await newVideo.save();

        // Return the created video
        res.status(201).json(newVideo);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error uploading video and thumbnail' });
    }
};

// Get Video by ID
const getVideoById = async (req, res) => {
    try {
        const { id } = req.params;
        const video = await Video.findById(id).populate('user subCourse');
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }
        res.status(200).json(video);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving video' });
    }
};

// Get All Videos
const getAllVideos = async (req, res) => {
    try {
        const videos = await Video.find().populate('user subCourse');
        res.status(200).json(videos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving videos' });
    }
};

// Update Video
const updateVideo = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Request Body:', req.body); // Log the request body
        console.log('Video ID:', id); // Log the video ID

        // Check if the request body is empty
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        // Update the video
        const updatedVideo = await Video.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

        // Check if the video was found and updated
        if (!updatedVideo) {
            return res.status(404).json({ message: 'Video not found' });
        }

        // Return the updated video
        //res.status(200).json(updatedVideo);
        res.status(200).json({ status: (200), message: 'video updated successfully', updatedVideo });
    } catch (err) {
        console.error(err);

        // Handle validation errors
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }

        // Handle other errors
        res.status(500).json({ message: 'Error updating video' });
    }
};

// Delete Video
const deleteVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedVideo = await Video.findByIdAndDelete(id);
        if (!deletedVideo) {
            return res.status(404).json({ message: 'Video not found' });
        }
        res.status(200).json({ message: 'Video deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting video' });
    }
};

// Get Videos by SubCourse
const getVideosBySubCourse = async (req, res) => {
    try {
        const { subCourseId } = req.params;
        
        // Find videos associated with the given subCourseId
        const videos = await Video.find({ subCourse: subCourseId }).populate('user subCourse');

        if (!videos || videos.length === 0) {
            return res.status(404).json({ message: 'No videos found for this subCourse' });
        }

        res.status(200).json(videos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving videos' });
    }
};

module.exports = { addVideo, getVideoById, getAllVideos, updateVideo, deleteVideo , getVideosBySubCourse};