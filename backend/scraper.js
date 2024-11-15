const puppeteer = require('puppeteer');

const scrapeInstagram = async (url) => {
    let browser;
    try {
        console.log('Launching browser...');
        browser = await puppeteer.launch({ headless: false, slowMo: 50 });
        const page = await browser.newPage();
        console.log('Navigating to URL:', url);
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        // Wait for the first post to appear
        console.log('Waiting for article selector...');
        await page.waitForSelector('article');

        // Scroll the page to load more posts
        console.log('Scrolling to load posts...');
        await page.evaluate(async () => {
            let scrollHeight = document.documentElement.scrollHeight;
            window.scrollTo(0, scrollHeight);
            await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for new posts to load
        });

        console.log('Extracting post data...');
        const postsData = await page.evaluate(() => {
            const posts = document.querySelectorAll('article div img');
            if (!posts.length) throw new Error('No posts found');
            
            return Array.from(posts).map(post => {
                const imageUrl = post.src;
                const description = post.alt || 'No description';
                return { imageUrl, description };
            });
        });

        console.log('Posts data extracted:', postsData);
        return postsData;
    } catch (error) {
        console.error('Error during scraping:', error);
        throw error;
    } finally {
        if (browser) {
            console.log('Closing browser...');
            await browser.close();
        }
    }
};

module.exports = { scrapeInstagram };
