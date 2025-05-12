const Comment = require("../models/commentForum");
const Forum = require("../models/forum");
const User = require("../models/user");

// Ajouter un commentaire
async function addComment(req, res) {
    try {
        const { forumId, content, userId } = req.body;
        const forum = await Forum.findById(forumId);
        if (!forum) {
            return res.status(404).send('Forum not found');
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Créer un nouveau commentaire
        const newComment = new Comment({
            content,
            user: userId,
            forum: forumId,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await newComment.save();

        // Ajouter le commentaire au forum
        forum.comments.push(newComment._id);
        forum.commentCount++;
        await forum.save();

        res.status(200).json(newComment);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding comment');
    }
}

// Afficher tous les commentaires d'un forum
async function showCommentsByForum(req, res) {
    try {
      // Vérifier si le forum existe
      const forum = await Forum.findById(req.params.forumId).populate('comments');
      if (!forum) {
        return res.status(404).send('Forum not found');
      }
      res.status(200).json(forum.comments);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching comments');
    }
  }
  

// Afficher un commentaire par ID
async function showCommentById(req, res) {
    try {
        const commentId = req.params.commentId;

        // Vérifier si le commentaire existe
        const comment = await Comment.findById(commentId).populate("users", "username email");
        if (!comment) {
            return res.status(404).send('Comment not found');
        }

        res.status(200).json(comment);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching comment');
    }
}

// Mettre à jour un commentaire
async function updateComment(req, res) {
    try {
        const commentId = req.params.id;
        const { content } = req.body;
        

        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            { content, updatedAt: new Date() },
            { new: true }
        );

        if (!updatedComment) {
            return res.status(404).send('Comment not found');
        }

        res.status(200).json(updatedComment);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating comment');
    }
}

// Supprimer un commentaire
async function deleteComment(req, res) {
    try {
        const commentId = req.params.id;

        const deletedComment = await Comment.findByIdAndDelete(commentId);

        if (!deletedComment) {
            return res.status(404).send('Comment not found');
        }

        // Retirer le commentaire du forum
        const forum = await Forum.findOneAndUpdate(
            { comments: commentId },
            { $pull: { comments: commentId } },
            { new: true }
        );

        res.status(200).send('Comment deleted');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting comment');
    }
}

module.exports = { addComment, showCommentsByForum, showCommentById, updateComment, deleteComment };
