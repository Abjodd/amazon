const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.instagram.com/someusername/');
    await page.waitForSelector('article');
    console.log(await page.content());  // Check if content loads
    await browser.close();
})();
