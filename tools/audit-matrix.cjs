// Visual evidence collector: run from the repo root with Microsoft Edge and
// Playwright (or PLAYWRIGHT_MODULE). Optional first argument names the capture
// folder: node tools/audit-matrix.cjs after -> tmp/after/. Reusing it overwrites
// those captures. This records overflow/errors for review; it does not assert them.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs=require('node:fs');
const {pathToFileURL}=require('node:url');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const phase=process.argv[2]||'before'; const out=`tmp/${phase}`; fs.mkdirSync(out,{recursive:true});
 const results=[];
 // Sweep viewport x theme x motion combinations, visiting both pages in each.
 for(const width of [375,768,1440]) for(const theme of ['light','dark']) for(const motion of ['on','paused']){
  const context=await browser.newContext({viewport:{width,height:900},colorScheme:theme});
  // Seed storage before the page bootstrap reads it, as if the user had saved
  // this motion preference on a previous visit.
  await context.addInitScript(m=>localStorage.setItem('portfolio-motion',m),motion);
  const page=await context.newPage(); const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  for(const file of ['index.html','shellify.html']){
   await page.goto(pathToFileURL(`${process.cwd()}/${file}`).href); await page.evaluate(()=>document.fonts.ready);
   // Decode lazy images before capturing the full page, then record diagnostics.
   await page.locator('img').evaluateAll(xs=>Promise.all(xs.map(x=>{x.loading='eager';return x.decode()})));
   await page.screenshot({path:`${out}/${file}-${width}-${theme}-${motion}.png`,fullPage:true});
   results.push({file,width,theme,motion,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),errors:[...errors]});
  } await context.close();
 } await browser.close(); fs.writeFileSync(`${out}/results.json`,JSON.stringify(results,null,2)); console.log(JSON.stringify(results));
})().catch(e=>{console.error(e);process.exit(1)});
