const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const {pathToFileURL}=require('node:url'); const fs=require('node:fs');
(async()=>{
 const {default:lighthouse}=await import(pathToFileURL(process.env.LIGHTHOUSE_MODULE).href);
 const browser=await chromium.launch({channel:'msedge',headless:true,args:['--remote-debugging-port=9224']});
 try {
  for(const [name,url] of [['index','http://127.0.0.1:4174/'],['shellify','http://127.0.0.1:4174/shellify.html']]){
   const result=await lighthouse(url,{port:9224,output:'json',logLevel:'error',onlyCategories:['performance','accessibility','best-practices','seo']});
   fs.writeFileSync(`tmp/lighthouse-${name}.json`,result.report);
   console.log(name,JSON.stringify(Object.fromEntries(Object.entries(result.lhr.categories).map(([k,v])=>[k,Math.round(v.score*100)]))));
   console.log('Failures',JSON.stringify(Object.values(result.lhr.audits).filter(x=>x.score!==null&&x.score<0.9).map(x=>({id:x.id,title:x.title,score:x.score,displayValue:x.displayValue}))));
  }
 } finally {await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
