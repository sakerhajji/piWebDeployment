const mongo = require('mongoose');
const Schema = mongo.Schema;

// subCourse Schema
const subCourse = new Schema(
    {
        title: { type: String, required: true },
        order: { type: Number, required: true },
        course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },  // Reference to Course model
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to Category model
    },
    { timestamps: true }  // Adds createdAt and updatedAt automatically
);

module.exports = mongo.model('SubCourse', subCourse);
