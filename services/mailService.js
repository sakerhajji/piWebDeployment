const nodemailer = require("nodemailer");
require("dotenv").config();

// 🔹 Configuration du transporteur SMTP
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // false pour TLS, true pour SSL (465)
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// 🔹 Fonction pour envoyer un email
const sendEmail = async (to, subject, text= null, html = null) => {
    try {
        const mailOptions = {
            from: `"Mon App" <${process.env.SMTP_USER}>`,
            to,
            subject,
            text,
            html: html || text // Par défaut, utilise text si html est null
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("📧 Email envoyé : ", info.messageId);
        return info;
    } catch (error) {
        console.error("❌ Erreur d'envoi d'email : ", error);
        throw error;
    }
};

module.exports = sendEmail;
