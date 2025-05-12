const mongo = require('mongoose');
const Schema = mongo.Schema;


// subCourse Schema
const video = new Schema(
    {
        title: { type: String, required: true },
        url: { type: String, required: true },
        duration: { type: Number, required: true },
        order: { type: Number, required: true },
        thumbnail: { type: String, required: true },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to Course model*/
        subCourse: { type: Schema.Types.ObjectId, ref: 'SubCourse', required: true },  // Reference to Course model*/
    },
    { timestamps: true }  // Adds createdAt and updatedAt automatically
);

module.exports = mongo.model('Video', video);
