const Post = require("../models/Post");
const Candidat = require("../models/Candidat");
const User = require("../models/user");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = 'uploads/candidats/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });
module.exports = upload;

// Ajouter un post
async function addPost(req, res) {
    try {
        const { title, description, requirements, location, company, salary, idUser } = req.body;
        const foundUser = await User.findById(idUser);
        if (!foundUser) {
            return res.status(404).send('User not found');
        }

        const newPost = new Post({
            title,
            description,
            requirements,
            location,
            company,
            salary,
            idUser,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await newPost.save();
        res.status(200).json(newPost);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating post');
    }
}

// Afficher tous les posts
async function showAllPosts(req, res) {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching posts');
    }
}

// Afficher un post par ID
async function showPostById(req, res) {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).send('Post not found');
        }
        res.status(200).json(post);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching post');
    }
}

// Afficher les posts d'un utilisateur spécifique
async function showPostsByUser(req, res) {
    try {
        const posts = await Post.find({ idUser: req.params.id });
        if (posts.length === 0) {
            return res.status(404).send('No posts found for this user');
        }
        res.status(200).json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching posts');
    }
}

// Mettre à jour un post
async function updatePost(req, res) {
    try {
        const { title, description, requirements, location, company, salary } = req.body;
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { title, description, requirements, location, company, salary, updatedAt: new Date() },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).send('Post not found');
        }
        res.status(200).json(updatedPost);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating post');
    }
}

// Supprimer un post
async function deletePost(req, res) {
    try {
        await Candidat.deleteMany({ posteId: req.params.id });
        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        if (!deletedPost) {
            return res.status(404).send('Post not found');
        }
        res.status(200).send('Post and related applications deleted');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting post');
    }
}

// Ajouter une candidature
async function addCandidat(req, res) {
    try {
        const { name, email, phone, posteId, idUser } = req.body;
        const cv = req.files['cv']?.[0]?.filename || null;
        const diplome = req.files['diplome']?.[0]?.filename || null;

        const foundUser = await User.findById(idUser);
        if (!foundUser) {
            return res.status(404).send('User not found');
        }

        const newCandidat = new Candidat({
            name,
            email,
            phone,
            cv,
            diplome,
            posteId,
            idUser,
            status: 'pending',
            createdAt: new Date()
        });

        await newCandidat.save();
        res.status(200).json(newCandidat);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating application');
    }
}

// Afficher toutes les candidatures
async function showAllCandidats(req, res) {
    try {
        const candidats = await Candidat.find();
        res.status(200).json(candidats);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching applications');
    }
}

// Supprimer une candidature
async function deleteCandidat(req, res) {
    try {
        const deletedCandidat = await Candidat.findByIdAndDelete(req.params.id);
        if (!deletedCandidat) {
            return res.status(404).send('Application not found');
        }
        res.status(200).send('Application deleted');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting application');
    }
}

// Accepter un candidat
async function acceptCandidat(req, res) {
    try {
        const candidat = await Candidat.findByIdAndUpdate(req.params.id, { status: 'accepted' }, { new: true });
        if (!candidat) {
            return res.status(404).send('Candidat non trouvé');
        }
        res.status(200).json({ message: 'Candidat accepté', candidat });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de l\'acceptation du candidat');
    }
}

// Rejeter un candidat
async function rejectCandidat(req, res) {
    try {
        const candidat = await Candidat.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });
        if (!candidat) {
            return res.status(404).send('Candidat non trouvé');
        }
        res.status(200).json({ message: 'Candidat rejeté', candidat });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors du rejet du candidat');
    }
}
async function updateCandidat(req, res) {
    try {
        const { name, email, phone, resumeLink, status } = req.body;
        const files = req.files ? req.files.map(file => `/uploads/candidats/${file.filename}`) : [];
        
        // Recherche du candidat par ID
        const candidat = await Candidat.findById(req.params.id);
        if (!candidat) {
            return res.status(404).send('Candidat non trouvé');
        }
        
        // Mettre à jour les informations du candidat
        candidat.name = name || candidat.name;
        candidat.email = email || candidat.email;
        candidat.phone = phone || candidat.phone;
        candidat.resumeLink = resumeLink || candidat.resumeLink;
        candidat.status = status || candidat.status;
        candidat.files = files.length > 0 ? files : candidat.files; // Ajouter les nouveaux fichiers

        const updatedCandidat = await candidat.save();
        res.status(200).json(updatedCandidat);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la mise à jour du candidat');
    }
}
async function showCandidatsByPost(req, res) {
    try {
        const postId = req.params.postId;

        // Recherche des candidats associés à l'offre d'emploi
        const candidats = await Candidat.find({ posteId: postId });
        if (candidats.length === 0) {
            return res.status(404).send('Aucun candidat trouvé pour cette offre');
        }

        res.status(200).json(candidats);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la récupération des candidats');
    }
}
async function showCandidatById(req, res) {
    try {
        const candidat = await Candidat.findById(req.params.id);
        if (!candidat) {
            return res.status(404).send('Candidat non trouvé');
        }
        res.status(200).json(candidat);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la récupération des détails du candidat');
    }
}


module.exports = { 
    addPost, showAllPosts, showPostById, updatePost, deletePost, showPostsByUser, 
    addCandidat, showAllCandidats, deleteCandidat,
    acceptCandidat, rejectCandidat, showCandidatsByPost, showCandidatById, updateCandidat,
    upload 
};

