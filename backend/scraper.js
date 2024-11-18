const puppeteer = require('puppeteer');

const scrapeInstagram = async (url) => {
    let browser;
    try {
        console.log('Launching browser...');
        browser = await puppeteer.launch({
            headless: false, // Set to true in production
            slowMo: 50,      // Adds a delay to actions for debugging
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        console.log('Navigating to URL:', url);
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Check for login page and handle it
        if (await page.$('input[name="username"]')) {
            console.log('Login detected. Attempting login...');
            await page.type('input[name="username"]', 'YOUR_USERNAME');
            await page.type('input[name="password"]', 'YOUR_PASSWORD');
            await page.click('button[type="submit"]');
            await page.waitForNavigation({ waitUntil: 'networkidle2' });
            console.log('Login successful.');
        }

        console.log('Waiting for content to load...');
        await page.waitForSelector('article', { timeout: 10000 });

        // Scroll to load more posts
        console.log('Scrolling to load posts...');
        let previousHeight;
        while (true) {
            previousHeight = await page.evaluate('document.body.scrollHeight');
            await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
            // await page.waitForTimeout(2000); // Wait for new content to load
            const currentHeight = await page.evaluate('document.body.scrollHeight');
            if (currentHeight === previousHeight) break;
        }

        console.log('Extracting post data...');
        const postsData = await page.evaluate(() => {
            const posts = document.querySelectorAll('article img'); // Update selector
            return Array.from(posts).map((post) => ({
                imageUrl: post.src,
                description: post.alt || 'No description available', // Use `alt` for description
            }));
        });

        console.log('Posts data extracted:', postsData);
        return postsData;
    } catch (error) {
        console.error('Error during scraping:', error.message);
        throw error;
    } finally {
        if (browser) {
            console.log('Closing browser...');
            await browser.close();
        }
    }
};

module.exports = { scrapeInstagram };
