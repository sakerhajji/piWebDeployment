const mongoose = require('mongoose');
const CandidatSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    cv: String,
    diplome: String,
    posteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    idUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Candidat', CandidatSchema);