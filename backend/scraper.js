const puppeteer = require('puppeteer');

const scrapeInstagram = async (url, username, password) => {
    let browser;
    try {
        console.log('Launching browser...');
        browser = await puppeteer.launch({
            headless: false, // Set to true in production
            slowMo: 50,      // Adds a delay to actions for debugging
            executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', // Path to Edge executable on Windows
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.97 Safari/537.36 Edg/116.0.1938.76'
            ]
        });

        const page = await browser.newPage();
        console.log('Navigating to Instagram...');
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Login handling (if login page is detected)
        if (await page.$('input[name="username"]')) {
            console.log('Login detected. Attempting login...');
            await page.type('input[name="username"]', username);
            await page.type('input[name="password"]', password);
            await page.click('button[type="submit"]');
            await page.waitForNavigation({ waitUntil: 'networkidle2' });
            console.log('Login successful.');
        }

        // Capture cookies after login
        const cookies = await page.cookies();
        await page.setCookie(...cookies); // Set cookies for subsequent requests

        // Wait for the content to load
        console.log('Waiting for content to load...');
        try {
            await page.waitForSelector('article', { timeout: 30000 });
        } catch (error) {
            console.error('Error: Selector `article` not found:', error);
            await browser.close();
            throw new Error('Content loading timeout');
        }

        // Scroll to load more posts
        console.log('Scrolling to load posts...');
        let previousHeight;
        while (true) {
            previousHeight = await page.evaluate('document.body.scrollHeight');
            await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
            // await page.waitForTimeout(Math.floor(Math.random() * 3000) + 2000); // Randomized delay between 2 and 5 seconds
            const currentHeight = await page.evaluate('document.body.scrollHeight');
            if (currentHeight === previousHeight) break; // Stop if no more content is loaded
        }

        // Extract post data
        console.log('Extracting post data...');
        const postsData = await page.evaluate(() => {
            const posts = document.querySelectorAll('article img'); // Update selector to grab images
            return Array.from(posts).map(post => ({
                imageUrl: post.src,
                description: post.alt || 'No description available',
            }));
        });

        console.log('Posts data extracted:', postsData);
        await browser.close();
        return postsData;

    } catch (error) {
        console.error('Error during scraping:', error);
        if (browser) {
            await browser.close();
        }
        throw error;
    }
};

module.exports = { scrapeInstagram };
