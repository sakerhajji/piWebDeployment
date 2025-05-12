const SubCourse = require('../models/subCourse');

// Create SubCourse
async function createSubCourse(req, res) {
    try {
        const { title, order, course, user } = req.body;

        if (!title || !order || !course || !user) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newSubCourse = new SubCourse({
            title,
            order,
            course,
            user
        });

        await newSubCourse.save();
        res.status(201).json({ status: 201, message: 'SubCourse created successfully', newSubCourse });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating subCourse');
    }
}

// Get all SubCourses
async function getSubCourses(req, res) {
    try {
        const subCourses = await SubCourse.find()
            .populate({
                path: 'course',
                populate: {
                    path: 'category',
                    model: 'Category'
                }
            })
            .populate('user');
        
        res.status(200).json(subCourses);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching subCourses');
    }
}

// Get all SubCourses for a specific course and user
async function getSubCoursesByCourseAndUser(req, res) {
    try {
        const { courseId, userId } = req.params;

        if (!courseId || !userId) {
            return res.status(400).json({ message: 'Both courseId and userId are required' });
        }

        const subCourses = await SubCourse.find({
            course: courseId,
            user: userId
        })
        .populate({
            path: 'course',
            populate: {
                path: 'category',
                model: 'Category'
            }
        })
        .populate('user');

        if (subCourses.length === 0) {
            return res.status(404).json({ 
                message: 'No subcourses found for this course and user combination' 
            });
        }

        res.status(200).json(subCourses);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching subCourses', error: err.message });
    }
}

async function getSubCourse(req, res) {
    try {
        const subCourse = await SubCourse.findById(req.params.id)
            .populate({
                path: 'course',
                populate: {
                    path: 'category',
                    model: 'Category'
                }
            })
            .populate('user');
        
        if (!subCourse) {
            return res.status(404).json({ message: 'SubCourse not found' });
        }
        res.status(200).json(subCourse);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching subCourse');
    }
}

// Get all SubCourses that belong to a specific Course
async function getSubCoursesByCourse(req, res) {
    try {
        const { id } = req.params;
        const subCourses = await SubCourse.find({ course: id })
            .populate({
                path: 'course',
                populate: {
                    path: 'category',
                    model: 'Category'
                }
            })
            .populate('user');

        if (subCourses.length === 0) {
            return res.status(404).json({ message: 'No SubCourses found for this Course' });
        }

        res.status(200).json(subCourses);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching subCourses');
    }
}

// Update SubCourse by ID
async function updateSubCourse(req, res) {
    try {
        const { title, order, course, user } = req.body;
        const updateData = { title, order, course, user };

        const updatedSubCourse = await SubCourse.findByIdAndUpdate(
            req.params.id, 
            updateData, 
            { new: true }
        );

        if (!updatedSubCourse) {
            return res.status(404).json({ message: 'SubCourse not found' });
        }

        res.status(200).json({ 
            status: 200, 
            message: 'SubCourse updated successfully', 
            updatedSubCourse 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating subCourse');
    }
}

// Delete SubCourse by ID
async function deleteSubCourse(req, res) {
    try {
        const deletedSubCourse = await SubCourse.findByIdAndDelete(req.params.id);
        if (!deletedSubCourse) {
            return res.status(404).json({ message: 'SubCourse not found' });
        }
        res.status(200).json({ message: 'SubCourse deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting subCourse');
    }
}

module.exports = {
    createSubCourse,
    getSubCourses,
    getSubCourse,
    getSubCoursesByCourse,
    updateSubCourse,
    getSubCoursesByCourseAndUser,
    deleteSubCourse
};