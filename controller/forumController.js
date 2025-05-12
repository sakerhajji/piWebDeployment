const Forum = require("../models/forum")

const User = require("../models/user"); 
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const commentForum = require("../models/commentForum");
const LikeForum = require("../models/LikeForum");

const uploadDir = 'uploads/forum/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Save images in `uploads/categories/`
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

// Multer middleware for image uploads
const upload = multer({ storage });

module.exports = upload;

// Ajouter un forum
async function addForum(req, res) {
    try {
        const { title, description, user,categorie } = req.body;
        const image = req.file ? `/uploads/forum/${req.file.filename}` : null;

        const foundUser = await User.findById(user);
        if (!foundUser) {
            return res.status(404).send('User not found');
        }

        // Créer un nouveau forum
        const newForum = new Forum({
            title,
            description,
            image,
            user,
            categorie,
            commentCount: 0,
            likeCount:0,
            reported: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await newForum.save();
        res.status(200).json(newForum);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating forum');
    }
};

// Afficher tous les forums
async function showAllForums(req, res) {
    try {
        const forums = await Forum.find();
        res.status(200).json(forums);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching forums');
    }
}

// Afficher un forum par ID
async function showForumById(req, res) {
    try {
        const forum = await Forum.findById(req.params.id);

        if (!forum) {
            return res.status(404).send('Forum not found');
        }
        res.status(200).json(forum);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching forum');
    }
}
// Afficher les forums d'un utilisateur spécifique
async function showForumsByUser(req, res) {
    try {
        const forums = await Forum.find({ user: req.params.id });

        if (forums.length === 0) {
            return res.status(404).send('No forums found for this user');
        }

        res.status(200).json(forums);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching forums');
    }
}


// Mettre à jour un forum
async function updateForum(req, res) {
    try {
      const { title, description, categorie, image } = req.body;
      
      // Si une nouvelle image est envoyée via req.file, utilisez-la
      const imageUrl = req.file ? `/uploads/forum/${req.file.filename}` : image;
  
      const updatedForum = await Forum.findByIdAndUpdate(
        req.params.id,
        { title, description, image: imageUrl, categorie, updatedAt: new Date() },
        { new: true }
      );
  
      if (!updatedForum) {
        return res.status(404).send('Forum not found');
      }
  
      res.status(200).json(updatedForum);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error updating forum');
    }
  }
  

// Supprimer un forum
async function deleteForum(req, res) {
    try {
        
        await commentForum.deleteMany({ forumId: req.params.id });

       
        await LikeForum.deleteMany({ forumId: req.params.id });

        
        const deletedForum = await Forum.findByIdAndDelete(req.params.id);

        if (!deletedForum) {    
            return res.status(404).send('Forum not found');
        }

        res.status(200).send('Forum and related comments and likes deleted');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting forum');
    }
}


module.exports = { addForum, showAllForums, showForumById, updateForum, deleteForum, showForumsByUser ,upload};
