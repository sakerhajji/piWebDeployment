const CourseDetails = require('../models/courseDetails');

// Create CourseDetails
async function createCourseDetails(req, res) {
    try {
        const { prerequisites, objectives, targetAudience, language, courseDuration, rating, subtitles ,course} = req.body;

        if (!prerequisites || !objectives || !targetAudience || !language || !courseDuration || !rating || !subtitles || !course) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newCourseDetails = new CourseDetails({
            prerequisites,
            objectives,
            targetAudience,
            language,
            courseDuration,
            rating,
            subtitles,
            course
        });

        await newCourseDetails.save();
        res.status(201).json(newCourseDetails);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating course details');
    }
}

// Update CourseDetails
async function updateCourseDetails(req, res) {
    try {
        const courseDetails = await CourseDetails.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!courseDetails) {
            return res.status(404).json({ message: 'Course details not found' });
        }
        res.status(200).json(courseDetails);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating course details');
    }
}

// Get all CourseDetails
async function getCourseDetails(req, res) {
    try {
        const courseDetails = await CourseDetails.find().populate('course');
        res.status(200).json(courseDetails);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching course details');
    }
}

// Get a single CourseDetails by ID
async function getCourseDetailsById(req, res) {
    try {
        const courseDetails = await CourseDetails.findById(req.params.id).populate('course');
        if (!courseDetails) {
            return res.status(404).json({ message: 'Course details not found' });
        }
        res.status(200).json(courseDetails);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching course details');
    }
}

// Delete CourseDetails
async function deleteCourseDetails(req, res) {
    try {
        const courseDetails = await CourseDetails.findByIdAndDelete(req.params.id);
        if (!courseDetails) {
            return res.status(404).json({ message: 'Course details not found' });
        }
        res.status(200).json({ message: 'Course details deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting course details');
    }
}

module.exports = {
    createCourseDetails,
    updateCourseDetails,
    getCourseDetails,
    getCourseDetailsById,
    deleteCourseDetails
};
