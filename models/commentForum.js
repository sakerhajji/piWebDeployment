const mongoose = require('mongoose');
const user = require('./user');
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
    {
        content: { type: String, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        forum: { type: mongoose.Schema.Types.ObjectId, ref: 'Forum', required: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    }
);

module.exports = mongoose.model('CommentForum', CommentSchema);
