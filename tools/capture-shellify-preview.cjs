// Run from the repo root to refresh the real product screenshot, then run
// build-assets.cjs to regenerate its WebP variants. Requires Microsoft Edge and
// Playwright, with PORTFOLIO_DEPS optionally pointing to their node_modules folder.
// This opens a fresh browser context, so no personal browser data is captured.
const path = require('node:path');
const {chromium} = require(path.join(process.env.PORTFOLIO_DEPS || '', 'playwright'));

(async () => {
  const browser = await chromium.launch({channel:'msedge', headless:true});
  try {
    // Keep the familiar 1440x900 composition but render at 2 device pixels per
    // CSS pixel. This captures sharper text rather than enlarging an old bitmap.
    const page = await browser.newPage({
      viewport:{width:1440,height:900}, deviceScaleFactor:2, reducedMotion:'reduce'
    });
    await page.goto('https://shellify.pages.dev/builder.html', {waitUntil:'networkidle'});
    await page.evaluate(() => document.fonts.ready);
    // The live app starts with the read-only disk-space example. Fail rather
    // than silently capture a loading screen or an unexpected product state.
    await page.locator('[data-add="disk"]').waitFor({state:'visible'});
    await page.getByRole('heading', {name:/Your workflow/}).waitFor({state:'visible'});
    await page.screenshot({path:'images/shellify-builder.png'});
    console.log('Captured live Shellify at 2880x1800. Run tools/build-assets.cjs next.');
  } finally {
    await browser.close();
  }
})().catch(error => {console.error(error);process.exit(1)});
