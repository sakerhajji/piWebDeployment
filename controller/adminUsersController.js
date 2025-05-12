
const bcryptjs = require('bcryptjs');
const User = require('../models/user');
const multer = require('multer');
const path = require('path');

// Configuration de Multer pour le téléchargement des photos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/user');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées (jpeg, jpg, png)'));
    }
  }
}).single('picture');

// Créer un utilisateur (Admin)
const createUser = async (req, res) => {
  upload(req, res, async (err) => {
    try {
      const { firstname, lastname, age, birthdayDate, email, password, phoneNumber, role, gender } = req.body;

      // Validation des données
      if (!firstname || !lastname || !age || !birthdayDate || !email || !password || !phoneNumber || !role || !gender) {
        return res.status(400).json({ success: false, message: 'Tous les champs sont requis' });
      }

      // Vérification de l'email existant
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Cet email est déjà utilisé' });
      }

      // Hash du mot de passe
      const hashedPassword = await bcryptjs.hash(password, 10);

      // Création de l'utilisateur
      const user = new User({
        firstname,
        lastname,
        age,
        birthdayDate,
        email,
        password: hashedPassword,
        phoneNumber,
        role,
        gender,
        picture: req.file ? req.file.filename : 'default.jpg',
        isVerified: true // L'admin crée des comptes vérifiés
      });

      await user.save();

      // Retourner les données sans le mot de passe
      const userData = user.toObject();
      delete userData.password;

      res.status(201).json({
        success: true,
        message: 'Utilisateur créé avec succès',
        user: userData
      });

    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message || 'Erreur lors de la création de l\'utilisateur' 
      });
    }
  });
};

// Lister tous les utilisateurs (Admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password -verificationToken -resetPasswordToken');
    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Erreur lors de la récupération des utilisateurs' 
    });
  }
};

// Obtenir un utilisateur (Admin)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -verificationToken -resetPasswordToken');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Utilisateur non trouvé' 
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Erreur lors de la récupération de l\'utilisateur' 
    });
  }
};

// Mettre à jour les données utilisateur (Admin)
const updateUserData = async (req, res) => {
  try {
    const { firstname, lastname, age, birthdayDate, email, phoneNumber, role, gender } = req.body;

    // Validation des données
    if (!firstname || !lastname || !age || !birthdayDate || !email || !phoneNumber || !role || !gender) {
      return res.status(400).json({ success: false, message: 'Tous les champs sont requis' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        firstname,
        lastname,
        age,
        birthdayDate,
        email,
        phoneNumber,
        role,
        gender
      },
      { new: true, select: '-password -verificationToken -resetPasswordToken' }
    );

    if (!updatedUser) {
      return res.status(404).json({ 
        success: false, 
        message: 'Utilisateur non trouvé' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Données utilisateur mises à jour avec succès',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Erreur lors de la mise à jour de l\'utilisateur' 
    });
  }
};

// Mettre à jour la photo de profil (Admin)
const updateUserPicture = async (req, res) => {
  upload(req, res, async (err) => {
    try {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ success: false, message: 'Aucune image téléchargée' });
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { picture: req.file.filename },
        { new: true, select: '-password -verificationToken -resetPasswordToken' }
      );

      if (!updatedUser) {
        return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
      }

      res.status(200).json({
        success: true,
        message: 'Photo de profil mise à jour avec succès',
        user: updatedUser
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message || 'Erreur lors de la mise à jour de la photo de profil' 
      });
    }
  });
};

// Supprimer un utilisateur (Admin)
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ 
        success: false, 
        message: 'Utilisateur non trouvé' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Utilisateur supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Erreur lors de la suppression de l\'utilisateur' 
    });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserData,
  updateUserPicture,
  deleteUser
};










