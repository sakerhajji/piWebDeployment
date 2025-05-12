const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ForumSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        image: { type: String }, // URL de l'image du forum
        categorie:{type: String},
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        commentCount: { type: Number, default: 0 }, 
        likeCount: { type: Number, default: 0 }, 
        reported: { type: Boolean, default: false }, // Indique si le forum a été signalé
        comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CommentForum' }],
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "LikeForum" }], // Référence aux likes
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    }
);

module.exports = mongoose.model('Forum', ForumSchema);
