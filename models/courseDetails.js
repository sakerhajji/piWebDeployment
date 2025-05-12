const mongo = require('mongoose');
const Schema = mongo.Schema;

// Import the Category model (ensure it's registered first)
//const Category = require('./category');

// Course Schema
const courseDetails = new Schema(
    {
        prerequisites: { type: String, required: true },
        objectives: { type: String, required: true },
        targetAudience: { type: String, required: true },
        language: { type: String, required: true },
        courseDuration: { type: Number, required: true },
        rating: { type: Number, required: true },
        subtitles: { type: String, required: true },
        course: { type: Schema.Types.ObjectId, ref: 'Course', required: true } // Reference to Course model
    },
    { timestamps: true }  // Adds createdAt and updatedAt automatically
);

module.exports = mongo.model('CourseDetails', courseDetails);
