const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('frontend')); // Servir les fichiers HTML/CSS

// Configuration de Nodemailer pour Proton Mail
const transporter = nodemailer.createTransport({
  host: 'mail.protonmail.ch',
  port: 587,
  secure: false, // true pour le port 465, false pour les autres ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});


// Route pour envoyer l'email
app.post('/api/send-email', async (req, res) => {
  const { forname, name, email, message } = req.body;

  // Validation basique
  if (!forname || !name || !email || !message) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }

  // Configuration de l'email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Vous recevez l'email
    replyTo: email, // Pour répondre directement au visiteur
    subject: `Nouveau message de ${forname} ${name}`,
    html: `
      <h2>Nouveau message depuis votre portfolio</h2>
      <p><strong>Prénom :</strong> ${forname}</p>
      <p><strong>Nom :</strong> ${name}</p>
      <p><strong>Email :</strong> ${email}</p>
      <hr>
      <p><strong>Message :</strong></p>
      <p>${message}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email envoyé avec succès !' });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'email' });
  }
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});