// Requires a site server already running at http://127.0.0.1:4174 and tmp/.
// Run from the repo root with Microsoft Edge, Playwright, and Lighthouse present.
// PLAYWRIGHT_MODULE selects Playwright; LIGHTHOUSE_MODULE must be the path to
// the Lighthouse entry file. Reports overwrite tmp/lighthouse-{page}.json.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const {pathToFileURL}=require('node:url'); const fs=require('node:fs');
(async()=>{
 // Lighthouse is an ES module; import it dynamically from this CommonJS script.
 const {default:lighthouse}=await import(pathToFileURL(process.env.LIGHTHOUSE_MODULE).href);
 // Lighthouse attaches to this Edge instance over the remote-debugging port.
 const browser=await chromium.launch({channel:'msedge',headless:true,args:['--remote-debugging-port=9224']});
 try {
  for(const [name,url] of [['index','http://127.0.0.1:4174/'],['shellify','http://127.0.0.1:4174/shellify.html']]){
   const result=await lighthouse(url,{port:9224,output:'json',logLevel:'error',onlyCategories:['performance','accessibility','best-practices','seo']});
   fs.writeFileSync(`tmp/lighthouse-${name}.json`,result.report);
   console.log(name,JSON.stringify(Object.fromEntries(Object.entries(result.lhr.categories).map(([k,v])=>[k,Math.round(v.score*100)]))));
   // Report audits below 90%; this script reports scores rather than enforcing
   // a pass threshold. Review the JSON for details before treating it as a gate.
   console.log('Failures',JSON.stringify(Object.values(result.lhr.audits).filter(x=>x.score!==null&&x.score<0.9).map(x=>({id:x.id,title:x.title,score:x.score,displayValue:x.displayValue}))));
  }
 // Always close Edge, including when an audit throws.
 } finally {await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
