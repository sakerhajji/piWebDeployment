const mongo = require('mongoose');
const Schema = mongo.Schema;

const videoProgress = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Student or teacher watching the video
    video: { type: Schema.Types.ObjectId, ref: 'Video', required: true },
    watchedDuration: { type: Number, default: 0 },
    completedPercentage: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    lastWatched: { type: Date, default: Date.now },
}, { timestamps: true });
module.exports = mongo.model('VideoProgress', videoProgress);