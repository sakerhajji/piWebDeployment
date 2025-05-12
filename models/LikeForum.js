const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LikeSchema = new Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        forum: { type: mongoose.Schema.Types.ObjectId, ref: 'Forum', required: false },
        comment: { type: mongoose.Schema.Types.ObjectId, ref: 'CommentForum', required: false },
        createdAt: { type: Date, default: Date.now },
    }
);

module.exports = mongoose.model('LikeForum', LikeSchema);
