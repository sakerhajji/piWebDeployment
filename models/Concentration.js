const mongoose = require('mongoose');

const concentrationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
  concentration: { type: Number, required: true },
}, { timestamps: true });

concentrationSchema.index({ userId: 1, videoId: 1 }, { unique: true });

module.exports = mongoose.model('Concentration', concentrationSchema);