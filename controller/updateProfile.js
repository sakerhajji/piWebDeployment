
const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const multer = require("multer");
const path = require("path");
const fs = require('fs');
// Configuration de multer pour le téléchargement de fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/user");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
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
      cb(new Error("Seules les images sont autorisées (jpeg, jpg, png)"));
    }
  }
}).single("picture");

// Mettre à jour le profil (sans mot de passe ni photo)
const updateProfile = async (req, res) => {
  const { firstname, lastname, age, birthdayDate, phoneNumber, gender } = req.body;
  
  try {
    // Validation des données
    if (!firstname || !lastname || !age || !birthdayDate || !phoneNumber || !gender) {
      return res.status(400).json({ success: false, message: "Tous les champs sont requis" });
    }

    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge <= 0 || !Number.isInteger(parsedAge)) {
      return res.status(400).json({ success: false, message: "L'âge doit être un entier positif" });
    }

    if (!/^\+?[0-9]{7,15}$/.test(phoneNumber)) {
      return res.status(400).json({ success: false, message: "Format de numéro de téléphone invalide" });
    }

    if (!["male", "female"].includes(gender)) {
      return res.status(400).json({ success: false, message: "Le genre doit être 'male' ou 'female'" });
    }

    const date = new Date(birthdayDate);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ success: false, message: "Format de date invalide" });
    }

    // Mise à jour du profil
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        firstname,
        lastname,
        age: parsedAge,
        birthdayDate: date,
        phoneNumber,
        gender
      },
      { new: true, select: '-password -verificationToken -resetPasswordToken' }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    }

    res.status(200).json({
      success: true,
      message: "Profil mis à jour avec succès",
      user: updatedUser
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Mettre à jour le mot de passe
const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Les deux mots de passe sont requis" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "Le nouveau mot de passe doit contenir au moins 6 caractères" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    }

    // Vérifier l'ancien mot de passe
    const isPasswordValid = await bcryptjs.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Mot de passe actuel incorrect" });
    }

    // Mettre à jour le mot de passe
    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: "Mot de passe mis à jour avec succès" 
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Mettre à jour la photo de profil
const updateProfilePicture = async (req, res) => {
  upload(req, res, async (err) => {
    try {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ success: false, message: "Aucune image téléchargée" });
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.userId,
        { picture: req.file.filename },
        { new: true, select: '-password -verificationToken -resetPasswordToken' }
      );

      if (!updatedUser) {
        return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
      }

      res.status(200).json({
        success: true,
        message: "Photo de profil mise à jour avec succès",
        user: updatedUser
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  });
};
const getProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('picture');
    
    if (!user || !user.picture) {
      return res.status(404).send('Photo non trouvée');
    }

    const imagePath = path.join(__dirname, '..', 'uploads', 'user', user.picture);
    
    // Vérifier que le fichier existe
    if (!fs.existsSync(imagePath)) {
      return res.status(404).send('Fichier image non trouvé');
    }

    // Déterminer le type MIME
    const mimeType = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png'
    }[path.extname(imagePath).toLowerCase()];

    if (!mimeType) {
      return res.status(400).send('Format d\'image non supporté');
    }

    // Lire et renvoyer le fichier image
    res.set('Content-Type', mimeType);
    fs.createReadStream(imagePath).pipe(res);

  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).send('Erreur serveur');
  }
};
deleteAccount = async () => {
  try {
    const response = await axios.delete(
      '/api/users/delete-account',
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete account' };
  }
};
toggleProfessorRole = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Nouvelle logique plus intuitive
    const newRole = user.role === "user" ? "professor" : "user";
    user.role = newRole;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User role changed to ${newRole} successfully`,
      newRole // Renvoyer le nouveau rôle séparément
    });

  } catch (error) {
    console.error("Error toggling professor role:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error",
      error: error.message 
    });
  }
};
// Exporter les fonctions
module.exports = {
  updateProfile,
  updatePassword,
  updateProfilePicture,
  getProfilePicture,
  deleteAccount,
  toggleProfessorRole
};
