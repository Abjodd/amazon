// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { scrapeInstagram } = require('./scraper'); // Import scraper.js
const app = express();
const port = 5000;

app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies

app.post('/api/social-media/extract', async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ message: 'URL is required' });
        }

        console.log('Scraping URL:', url); // Log the incoming URL
        const postsData = await scrapeInstagram(url);
        console.log('Posts data extracted:', postsData); // Log the extracted data

        res.status(200).json(postsData);
    } catch (error) {
        console.error('Error during extraction:', error); // Log the error on the server side
        res.status(500).json({ message: 'Server error during extraction', error: error.message });
    }
});

app.get('/api/proxy', async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({ message: 'URL is required' });
        }

        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const contentType = response.headers['content-type'];
        res.set('Content-Type', contentType);
        res.send(response.data);
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).json({ message: 'Error fetching image', error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});