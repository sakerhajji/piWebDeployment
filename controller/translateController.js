const { TranslationServiceClient } = require('@google-cloud/translate');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

// For Google Cloud Translation
const translationClient = new TranslationServiceClient();

const translateText = async (req, res) => {
    try {
        const { text, targetLang } = req.body;
        
        // Using Google Cloud Translation
        const projectId = process.env.GOOGLE_PROJECT_ID;
        const location = 'global';
        
        const request = {
            parent: `projects/${projectId}/locations/${location}`,
            contents: [text],
            mimeType: 'text/plain',
            targetLanguageCode: targetLang,
        };

        const [response] = await translationClient.translateText(request);
        const translation = response.translations[0].translatedText;

        res.status(200).json({
            translatedText: translation
        });
    } catch (error) {
        console.error('Translation error:', error);
        res.status(500).json({ message: 'Error translating text' });
    }
};

module.exports = { translateText };