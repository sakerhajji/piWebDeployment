const mongo = require('mongoose');
const Schema = mongo.Schema;

const videoSegment = new Schema({
    video: { type: Schema.Types.ObjectId, ref: 'Video', required: true },
    startTime: { type: Number, default: 0 },
    endTime: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    lastWatched: { type: Date, default: Date.now },
}, { timestamps: true });
module.exports = mongo.model('VideoSegment', videoSegment);   