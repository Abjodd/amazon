// backend/routes/socialMedia.js
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const Post = require('../models/Post');
const router = express.Router();

// Extract posts from social media URL
router.post('/extract', async (req, res) => {
    const { url } = req.body;
    
    // Validate URL (basic validation)
    if (!url) {
        return res.status(400).json({ message: 'No URL provided' });
    }

    try {
        // You can switch between scraping method or API method based on the platform
        const extractedData = await scrapeSocialMediaPost(url);

        // Save or return the data (for simplicity, returning it)
        const post = new Post(extractedData);
        await post.save();

        res.json([post]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error extracting data from the URL' });
    }
});

// Function to scrape social media post (use either scraping or API)
const scrapeSocialMediaPost = async (url) => {
    // For simplicity, let's assume scraping a public Instagram post using Puppeteer (you can use other scraping methods too)
    if (url.includes('instagram.com')) {
        return await scrapeInstagram(url);
    } else {
        throw new Error('Unsupported platform');
    }
};

// Scrape an Instagram post using Puppeteer
const scrapeInstagram = async (url) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Navigate to the URL
    await page.goto(url);
    
    // Wait for the necessary content to load
    await page.waitForSelector('h1');  // Example selector for Instagram
    
    // Extract post data
    const postData = await page.evaluate(() => {
        const title = document.querySelector('h1') ? document.querySelector('h1').innerText : 'No Title';
        const description = document.querySelector('span') ? document.querySelector('span').innerText : 'No Description';
        const image = document.querySelector('img') ? document.querySelector('img').src : '';

        return { title, description, image };
    });
    
    await browser.close();

    return postData;
};

module.exports = router;
