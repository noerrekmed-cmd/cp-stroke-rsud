// Screenshot the Google Form HTML for visual check
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const fileUrl = 'file://' + path.resolve('/home/z/my-project/download/CP_Stroke_GForm.html');
  await page.goto(fileUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Section 1 (default view)
  await page.screenshot({ path: '/tmp/render/sec1.png', fullPage: true });

  // Section 2 - activate directly via JS
  await page.evaluate(() => {
    const s = document.querySelector('.form-section[data-section="2"]');
    if (s) {
      document.querySelectorAll('.form-section').forEach(x => x.classList.remove('active'));
      s.classList.add('active');
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: '/tmp/render/sec2.png', fullPage: true });

  // Section 3 - top view
  await page.evaluate(() => {
    const s = document.querySelector('.form-section[data-section="3"]');
    document.querySelectorAll('.form-section').forEach(x => x.classList.remove('active'));
    s.classList.add('active');
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: '/tmp/render/sec3_top.png', fullPage: false });

  // Section 3 - middle (scroll down)
  await page.evaluate(() => window.scrollTo(0, 900));
  await page.waitForTimeout(300);
  await page.screenshot({ path: '/tmp/render/sec3_mid.png', fullPage: false });

  // Section 3 - bottom
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight - 900));
  await page.waitForTimeout(300);
  await page.screenshot({ path: '/tmp/render/sec3_bot.png', fullPage: false });

  // Section 4
  await page.evaluate(() => {
    const s = document.querySelector('.form-section[data-section="4"]');
    document.querySelectorAll('.form-section').forEach(x => x.classList.remove('active'));
    s.classList.add('active');
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: '/tmp/render/sec4.png', fullPage: true });

  // Mobile view (narrow)
  await page.setViewportSize({ width: 400, height: 800 });
  await page.evaluate(() => {
    const s = document.querySelector('.form-section[data-section="3"]');
    document.querySelectorAll('.form-section').forEach(x => x.classList.remove('active'));
    s.classList.add('active');
    window.scrollTo(0, 400);
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: '/tmp/render/sec3_mobile.png', fullPage: false });

  await browser.close();
  console.log('OK screenshots');
})();
