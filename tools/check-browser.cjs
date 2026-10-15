const { chromium } = require(process.env.PLAYWRIGHT_MODULE || '@playwright/test');
const fs = require('node:fs');
(async()=>{
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--no-proxy-server']});
const errors=[];let checks=0;
for(const width of [390,1440])for(const theme of ['light','dark']){
 const context=await browser.newContext({viewport:{width,height:900},colorScheme:theme});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 for(const file of ['index.html','shellify.html']){
 await page.goto(require('node:url').pathToFileURL(process.cwd() + '/').href+file);await page.evaluate(()=>document.fonts.ready);
 if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Overflow '+width+file);
 await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(i=>{i.loading='eager';return i.decode()}))); if(await page.locator('img').evaluateAll(imgs=>imgs.some(i=>!i.complete||!i.naturalWidth)))throw Error('Broken image');
 await page.screenshot({path:`docs/screenshots/review-${file.split('.')[0]}-${width}-${theme}.png`,fullPage:true});
 await page.keyboard.press('Tab');if(await page.locator(':focus').textContent()!=='Skip to content')throw Error('Skip link order');
 await page.keyboard.press('Enter');
 await page.locator('#theme-toggle').click();
 if(await page.locator('html').getAttribute('data-theme')===theme)throw Error('Theme did not toggle');
 await page.locator('#theme-toggle').click();checks++;
 }
 await context.close();
}
const context=await browser.newContext({reducedMotion:'reduce'});const page=await context.newPage();
await page.goto(require('node:url').pathToFileURL(process.cwd() + '/shellify.html').href);
if(!await page.locator('#motion-toggle').isDisabled())throw Error('Reduced motion');
await page.locator('summary').click();
await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async()=>{throw Error('denied')}}}));
await page.locator('#copy-sample').click();
if(!(await page.locator('#copy-status').textContent()).includes('manually'))throw Error('Copy fallback');
await page.evaluate(()=>Object.defineProperty(navigator.clipboard,'writeText',{value:async(text)=>{window.copied=text}}));
await page.locator('#copy-sample').click();
if(!await page.evaluate(()=>window.copied.includes('Search-ADAccount')))throw Error('Copy success');
const resume=fs.readFileSync('Resources/Matthew_Hawkins_Resume.pdf');
if(!resume.subarray(0,4).equals(Buffer.from('%PDF')))throw Error('Resume inaccessible');
await context.close();
const nojs=await browser.newContext({javaScriptEnabled:false});const fallback=await nojs.newPage();await fallback.goto(require('node:url').pathToFileURL(process.cwd() + '/shellify.html').href);await fallback.locator('summary').click();if(!await fallback.locator('#sample-code').isVisible())throw Error('No-JS sample');
await browser.close();if(errors.length)throw Error(errors.join('\n'));console.log(`PASS: ${checks} page/viewport/theme combinations; no overflow or page errors; images, keyboard skip links, theme toggles, reduced motion, copy success/failure, résumé PDF, no-JS sample.`);
})().catch(e=>{console.error(e);process.exit(1)});




