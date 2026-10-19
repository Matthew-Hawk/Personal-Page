const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs=require('node:fs');const path=require('node:path');
const AxeBuilder=require(process.env.AXE_MODULE || '@axe-core/playwright').default;
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});const report=[];
 for(const theme of ['light','dark']){
  const context=await browser.newContext({viewport:{width:320,height:844},colorScheme:theme});const page=await context.newPage();
  for(const file of ['index.html','shellify.html']){
   assert.equal((await page.goto('http://127.0.0.1:4174/'+file)).status(),200);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'320px overflow');
   const bad=await page.locator('.site-header a,.site-header button,.actions a').evaluateAll(xs=>xs.filter(x=>{const r=x.getBoundingClientRect();return r.width<44||r.height<44}).map(x=>x.outerHTML));assert.deepEqual(bad,[],'Tap targets');
   const links=await page.locator('a[href],img[src],source[srcset],link[href]').evaluateAll(xs=>xs.map(x=>x.getAttribute('href')||x.getAttribute('src')||x.getAttribute('srcset')));
   for(const link of links.flatMap(x=>x.includes('.webp ')?x.split(',').map(v=>v.trim().split(' ')[0]):[x])){
    if(/^(https:|mailto:)/.test(link))continue;
    const [target,hash]=link.split('#');const targetPath=path.resolve(target.split('?')[0]||file);assert.ok(fs.existsSync(targetPath),'Missing '+link);
    if(hash){const html=fs.readFileSync(targetPath,'utf8');assert.ok(html.includes(`id="${hash}"`),'Missing anchor '+link)}
   }
   assert.equal(await page.locator('img:not([alt]),img:not([width]),img:not([height])').count(),0);
   assert.equal(await page.locator('meta[property="og:image"]').count(),1);
   assert.equal(await page.locator('link[rel="canonical"]').count(),1);
   const a=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
   const labels=await new AxeBuilder({page}).withRules(['label-content-name-mismatch']).analyze();
   assert.equal(labels.violations.length,0,'Visible labels must match accessible names: '+JSON.stringify(labels.violations.map(v=>v.nodes.map(n=>n.target))));
   report.push({file,theme,width:320,violations:a.violations});
   await page.screenshot({path:`tmp/final-${file}-${theme}-320.png`,fullPage:true});
   assert.equal(a.violations.length,0,JSON.stringify(a.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))));
   await page.locator('#motion-toggle').click();await page.reload();assert.equal(await page.locator('html').getAttribute('data-motion'),'paused');
   await page.locator('#motion-toggle').click();
   await page.locator('#theme-toggle').click();await page.reload();assert.notEqual(await page.locator('html').getAttribute('data-theme'),theme);await page.locator('#theme-toggle').click();
  }await context.close();
 }
 const reduced=await browser.newContext({reducedMotion:'reduce'});const p=await reduced.newPage();await p.goto('http://127.0.0.1:4174/');assert.equal(await p.locator('html').getAttribute('data-motion'),'paused');
 assert.ok(await p.locator('#motion-toggle').isDisabled());assert.equal(await p.locator('.portrait').evaluate(x=>getComputedStyle(x,'::before').animationName),'none');
 await browser.close();fs.writeFileSync('tmp/accessibility-results.json',JSON.stringify(report,null,2));console.log('PASS: HTTP pages, 320px reflow and tap targets, links and anchors, image semantics, metadata, axe AA in both themes, saved theme/motion, and reduced-motion pseudo-elements.');
})().catch(e=>{console.error(e);process.exit(1)});
