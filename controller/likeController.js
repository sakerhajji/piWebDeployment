const { now } = require("mongoose");
const Like = require("../models/LikeForum");
const Forum = require("../models/forum");
const User = require("../models/user");

// Ajouter un like
async function addLike(req, res) {
    try {
        const { forumId, userId } = req.body;
        const forum = await Forum.findById(forumId);
        if (!forum) {
            return res.status(404).send('Forum not found');
        }

        // Vérifier si l'utilisateur existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        const existingLike = await Like.findOne({ forum: forumId, user: userId });
        if (existingLike) {
            return res.status(400).send('You already liked this forum');
        }

        // Créer un nouveau like
        const newLike = new Like({
            forum: forumId,
            user: userId,
            createdAt: new Date(),
        });

        await newLike.save();

        // Ajouter le like au forum
        forum.likes.push(newLike._id);
        forum.likeCount++;
        await forum.save();

        res.status(200).json(newLike);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding like');
    }
}

// Supprimer un like
async function removeLike(req, res) {
    try {
        const { forumId, userId } = req.body;

        // Vérifier si le like existe
        const existingLike = await Like.findOneAndDelete({ forum: forumId, user: userId });
        if (!existingLike) {
            return res.status(404).send('Like not found');
        }

        // Retirer le like du forum
        const forum = await Forum.findById(forumId);
        forum.likes = forum.likes.filter(likeId => likeId.toString() !== existingLike._id.toString());
        forum.likeCount--;
        await forum.save();

        res.status(200).send('Like removed');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error removing like');
    }
}

// Afficher les likes d'un forum
async function showLikesByForum(req, res) {
    try {
      

        // Vérifier si le forum existe
        const forum = await Forum.findById(req.params.forumId).populate('likes');
        if (!forum) {
            return res.status(404).send('Forum not found');
        }

        res.status(200).json(forum.likes);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching likes');
    }
}

// Compter le nombre de likes d'un forum
async function countLikesByForum(req, res) {
    try {

        // Vérifier si le forum existe
        const forum = await Forum.findById(req.params.forumId);
        if (!forum) {
            return res.status(404).send('Forum not found');
        }

        // Compter le nombre de likes
        const likeCount = forum.likes.length;

        res.status(200).json({ likeCount });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error counting likes');
    }
}

module.exports = { addLike, removeLike, showLikesByForum, countLikesByForum };
