const multer = require("multer");
const path = require("path");

//  Définition du stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/users/"); // Dossier de stockage des images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nom unique
  },
});

// Vérification du type de fichier
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Format d'image non valide (jpeg, jpg, png seulement)"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
