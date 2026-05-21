const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

  await page.goto('http://localhost:8080/login');
  await page.fill('input[id="username"]', 'admin_user');
  await page.fill('input[id="password"]', 'admin123');
  await page.click('button[type="submit"]');
  
  await page.waitForTimeout(2000);
  
  const content = await page.content();
  console.log("PAGE CONTAINS TOAST:", content.includes("toast") || content.includes("Welcome back") || content.includes("Invalid") || content.includes("Could not connect"));
  console.log("PAGE URL:", page.url());
  
  await browser.close();
})();
