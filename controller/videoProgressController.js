const VideoProgress = require('../models/videoProgress');

// Create Video Progress
const createVideoProgress = async (req, res) => {
    try {
        const { user, video, watchedDuration, completedPercentage, completed } = req.body;

        // Check if the video progress already exists for the user and video
        const existingProgress = await VideoProgress.findOne({ user, video });
        if (existingProgress) {
            return res.status(400).json({ message: 'Video progress already exists for this user and video' });
        }

        // Create a new video progress with default values
        const newVideoProgress = new VideoProgress({
            user,
            video,
            watchedDuration: watchedDuration || 0, // Default to 0 if not provided
            completedPercentage: completedPercentage || 0, // Default to 0 if not provided
            completed: completed || false, // Default to false if not provided
        });

        // Save the video progress to the database
        await newVideoProgress.save();

        // Return the created video progress
        res.status(201).json(newVideoProgress);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating video progress' });
    }
};

// Get Video Progress by ID
// Get Video Progress by Video ID
const getVideoProgressById = async (req, res) => {
    try {
        const { id } = req.params; // Video ID

        // Find the video progress by Video ID
        const videoProgress = await VideoProgress.findOne({ video: id }).populate('user video');
        
        if (!videoProgress) {
            return res.status(404).json({ message: 'Video progress not found' });
        }

        // Return the video progress
        res.status(200).json(videoProgress);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving video progress' });
    }
};


const getVideoProgressByVideoId = async (req, res) => {
    try {
        const { videoId } = req.params;
        console.log("Received Video ID:", videoId);

        const videoProgress = await VideoProgress.findOne({ video: videoId }).populate('user video');
        if (!videoProgress) {
            return res.status(404).json({ message: 'No progress found for this video' });
        }

        res.status(200).json(videoProgress);
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ message: 'Error retrieving video progress' });
    }
};


// Get All Video Progresses
const getAllVideoProgresses = async (req, res) => {
    try {
        // Find all video progresses and populate user and video details
        const videoProgresses = await VideoProgress.find().populate('user video');
        res.status(200).json(videoProgresses);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving video progresses' });
    }
};

// Update Video Progress (with upsert functionality)
const updateVideoProgress = async (req, res) => {
    try {
        const { user, video, currentTime, duration } = req.body;

        // Calculate progress metrics
        const watchedDuration = currentTime;
        const completedPercentage = (currentTime / duration) * 100;
        const completed = completedPercentage >= 95; // Only mark complete if watched 95%+

        // Update or create progress entry
        const updatedVideoProgress = await VideoProgress.findOneAndUpdate(
            { user, video },
            { 
                watchedDuration,
                completedPercentage,
                completed, // Now depends on percentage
                lastWatched: Date.now() 
            },
            { 
                new: true, 
                runValidators: true,
                upsert: true 
            }
        );

        res.status(200).json(updatedVideoProgress);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating video progress' });
    }
};

// Delete Video Progress
const deleteVideoProgress = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the video progress
        const deletedVideoProgress = await VideoProgress.findByIdAndDelete(id);
        if (!deletedVideoProgress) {
            return res.status(404).json({ message: 'Video progress not found' });
        }

        // Return success message
        res.status(200).json({ message: 'Video progress deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting video progress' });
    }
};

// Get Video Progress by User and Video
const getVideoProgressByUserAndVideo = async (req, res) => {
    try {
        const { user, video } = req.query;
        const progress = await VideoProgress.findOne({ user, video });
        res.status(progress ? 200 : 404).json(progress || { message: 'Progress not found' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving progress' });
    }
};

module.exports = {
    createVideoProgress,
    getVideoProgressById,
    getAllVideoProgresses,
    updateVideoProgress,
    deleteVideoProgress,
    getVideoProgressByUserAndVideo,
    getVideoProgressByVideoId,
};