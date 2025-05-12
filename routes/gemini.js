const express = require('express');
const router = express.Router();
const axios = require('axios');

require('dotenv').config();

router.post('/ask', async (req, res) => {
  const userQuestion = req.body.question;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: userQuestion }]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const generatedText = response.data.candidates[0].content.parts[0].text;
    res.json({ answer: generatedText });
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Erreur lors de la génération de contenu' });
  }
});

module.exports = router;
