const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.google.com');
  // 其他操作...
  await browser.close();
})();

// const path = require('path')
// console.log(path.resolve(__dirname, '/src'))