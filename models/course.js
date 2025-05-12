const mongo = require('mongoose');
const Schema = mongo.Schema;
//const Course = require("../models/course");


// Course Schema
const course = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        courseImage: { type: String, required: true },
        prerequisites: { type: String, required: true },
        objectives: { type: String, required: true },
        targetAudience: { type: String, required: true },
        language: { type: String, required: true },
        courseDuration: { type: Number, required: true },
        rating: { type: Number, required: true },
        subtitles: { type: String, required: true },
        category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },  // Reference to Category model
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to Category model
    },
    { timestamps: true }  // Adds createdAt and updatedAt automatically
);

module.exports = mongo.models.Course || mongo.model('Course', course);
//module.exports = mongo.model('Course', course);
