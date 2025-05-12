const express = require('express');
const axios = require('axios');

const router = express.Router();

// Judge0 API Endpoint & Key
const JUDGE0_URL = 'https://judge0-ce.p.rapidapi.com/submissions';
// Replace hardcoded key with:
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

// Submit Code for Compilation
router.post('/run', async (req, res) => {
    try {
        const { language_id, source_code, stdin } = req.body;

        // Step 1: Submit the Code
        const { data } = await axios.post(JUDGE0_URL, {
            language_id,
            source_code,
            stdin
        }, {
            headers: {
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'Content-Type': 'application/json'
            }
        });

        // Step 2: Get the Result using the token
        const token = data.token;
        setTimeout(async () => {
            const result = await axios.get(`${JUDGE0_URL}/${token}?base64_encoded=true&fields=*`, {
                headers: {
                    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
                    'X-RapidAPI-Key': RAPIDAPI_KEY
                },
                timeout: 10000  // Increase the timeout to 10 seconds
            });

            const responseData = result.data;

            // Check if there is a compile error
            if (responseData.status.id === 6) {
                // Decode the compile output from base64
                const decodedCompileOutput = Buffer.from(responseData.compile_output, 'base64').toString('utf-8');
                responseData.compile_output = decodedCompileOutput; // Add decoded output to response
            }

            // Send the result or error back to the client
            res.json(responseData);
        }, 3000); // Wait 3 seconds before fetching the result

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
