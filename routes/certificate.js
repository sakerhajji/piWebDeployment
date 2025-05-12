const express = require('express');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp'); // Ajouter sharp pour la conversion
const router = express.Router();
const QRCode = require('qrcode');


const User = require('../models/User'); 
const Course = require('../models/Course');
const os = require('os');
const Order = require('../models/Orders');

function getLocalIPv4() {
  const interfaces = os.networkInterfaces();

  for (const name in interfaces) {
    const ifaceList = interfaces[name];

    for (const iface of ifaceList) {
      if (
        iface.family === 'IPv4' &&
        !iface.internal &&
        name.toLowerCase().includes('wi-fi') // s'assurer que c’est bien l’interface Wi-Fi
      ) {
        return iface.address;
      }
    }
  }

  // Si Wi-Fi non trouvé, prendre la première IPv4 non interne
  for (const ifaceList of Object.values(interfaces)) {
    for (const iface of ifaceList) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }

  return 'localhost'; // fallback
}



router.get('/:userId/:courseId', async (req, res) => {
    const { userId, courseId } = req.params;

    try {
        const user = await User.findById(userId);
        const course = await Course.findById(courseId);
        const ip = getLocalIPv4(); 
        console.log(ip);
        const certUrl = `http://${ip}:3000/api/certificate/${userId}/${courseId}`;


        // Générer un QR code depuis l'URL
        const qrImageData = await QRCode.toDataURL(certUrl);

        // Convertir le QR base64 en buffer
        const qrImageBuffer = Buffer.from(qrImageData.split(',')[1], 'base64');
        if (!user || !course) {
            return res.status(404).json({ message: 'Utilisateur ou cours introuvable.' });
        }

        const fullName = `${user.firstname} ${user.lastname}`;
        const courseTitle = course.title;

        const doc = new PDFDocument({ size: 'A4' });

        // Définir les headers pour le téléchargement du PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="certificate-${userId}-${courseId}.pdf"`);

        // Envoyer le PDF directement dans la réponse (stream)
        doc.pipe(res);

        // Chemin vers le logo SVG
        const logoPath = path.join(__dirname, '..', 'uploads', 'logo', 'logo.svg');
        const signaturePath = path.join(__dirname, '..', 'uploads', 'signature', 'signature.svg');
        
        // Convertir le logo SVG en PNG et ajouter au PDF
        const pngLogoPath = path.join(__dirname, '..', 'uploads', 'logo', 'logo.png');  // Nouveau fichier PNG
        const pngSignaturePath = path.join(__dirname, '..', 'uploads', 'signature', 'signature.png');
        // Vérifier si le fichier PNG existe déjà, sinon le créer
        if (!fs.existsSync(pngLogoPath)) {
            await sharp(logoPath)
                .png()
                .toFile(pngLogoPath);
        }
        if (!fs.existsSync(pngSignaturePath)) {
            await sharp(signaturePath)
                .png()
                .toFile(pngSignaturePath);
        }



        // Ajouter le logo PNG au PDF
        doc.image(pngLogoPath, { width: 100, align: 'center' }).moveDown(1);
        doc.image(pngSignaturePath, 400, 410, { width: 100 });

        // Afficher le QR code en bas à gauche du PDF
        doc.image(qrImageBuffer, 400,20, { width: 70 });
        


        
        // Titre du certificat
        doc.fontSize(30).font('Helvetica-Bold').text('Certificat de Réussite', { align: 'center' }).moveDown(2);

        // Nom de l'étudiant
        doc.fontSize(18).font('Helvetica').text('Ce certificat est décerné à :', { align: 'center' }).moveDown();
        doc.fontSize(22).font('Helvetica-Bold').text(fullName, { align: 'center', underline: true }).moveDown();

        // Titre du cours
        doc.fontSize(18).font('Helvetica').text('Pour avoir complété avec succès le cours :', { align: 'center' }).moveDown();
        doc.fontSize(20).font('Helvetica-Oblique').text(`"${courseTitle}"`, { align: 'center' }).moveDown(2);

        // Date et signature fictive
        doc.fontSize(14).font('Helvetica').text(`Fait le : ${new Date().toLocaleDateString()}`, { align: 'right' }).moveDown();
        doc.fontSize(14).font('Helvetica').text(`Signature: _____________________`, { align: 'right' }).moveDown(2);

        // Ligne décorative
        doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#000').lineWidth(1).stroke().moveDown(1);

        // Footer
        doc.fontSize(12).font('Helvetica').text('Bootcamp StudyHub - www.studyhub.com', { align: 'center' });

        // Finaliser le document PDF
        doc.end();

        // Après avoir terminé l'écriture du PDF, supprimer le fichier PNG temporaire
        doc.on('finish', () => {
            fs.unlinkSync(pngLogoPath);  // Supprimer le fichier PNG après utilisation
        });
        
        // Mise à jour du champ certificate
            await Order.findOneAndUpdate(
              {
                userid: userId,
                "items.courseId": courseId
              },
              {
                $set: {
                  "items.$.certificate": true
                }
              },
              { new: true }
            );




    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la génération du certificat.' });
    }
});
router.get("/check-certificate/:userId/:courseId", async (req, res) => {
  const { userId, courseId } = req.params;

  try {
    // Trouver les commandes où certificate = true pour le user et le course donné
    const order = await Order.findOne({
      userid: userId,
      "items.courseId": courseId,
      "items.certificate": true
    });

    if (order) {
      return res.json({ certificate: true });
    } else {
      return res.json({ certificate: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur lors de la vérification du certificat." });
  }
});


module.exports = router;
