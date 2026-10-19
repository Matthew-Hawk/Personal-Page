const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const deps=process.env.PORTFOLIO_DEPS || '';
const sharp=require(path.join(deps,'sharp'));
const {chromium}=require(path.join(deps,'playwright'));
(async()=>{
 for(const name of ['Matthew_pfp.png','shellify-builder.png','promptly-dining.png','promptly.jpg','z-raid.jpg']){
  const stem=name.replace(/\.(png|jpg)$/,'');
  await sharp('images/'+name).resize({width:name==='Matthew_pfp.png'?500:1440,withoutEnlargement:true}).webp({quality:85}).toFile('images/'+stem+'.webp');
  await sharp('images/'+name).resize({width:name==='Matthew_pfp.png'?160:720,withoutEnlargement:true}).webp({quality:82}).toFile('images/'+stem+'-small.webp');
 }
 await require('./build-favicons.cjs')();
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
 for(const [name,eyebrow,title,sub] of [['portfolio','MATTHEW HAWKINS / DFW','IT Systems<br>&amp; Automation','Endpoint deployment. Infrastructure troubleshooting. Useful tools.'],['shellify','MATTHEW HAWKINS / CASE STUDY','Shellify','A visual PowerShell builder.<br>From an IT task to a script you can inspect.']]){
  const html=`<!doctype html><html lang="en"><meta charset="utf-8"><link rel="stylesheet" href="../style.css"><style>body{width:1200px;height:630px;padding:58px 68px;display:flex;flex-direction:column;border-top:12px solid #ba2c20}header{display:flex;justify-content:space-between;font:18px var(--mono)}.mark{color:#ba2c20;font-size:64px;line-height:1}h1{font-size:90px;letter-spacing:-.06em;margin:52px 0 24px}p{font-size:25px;max-width:950px}footer{margin-top:auto;padding:20px 0 0;font:16px var(--mono)}</style><header>${eyebrow}<span class="mark">✳</span></header><h1>${title}</h1><p>${sub}</p><footer>Matthew Hawkins · IT Systems Technician</footer></html>`;
  const fonts=fs.readFileSync('index.html','utf8').match(/<link rel="stylesheet" href="https:\/\/fonts.googleapis.com[^>]+>/)[0];
  fs.writeFileSync('tmp/share.html',html.replace('<style>',fonts+'<style>'));await page.goto(pathToFileURL(process.cwd()+'/tmp/share.html').href);await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:`images/${name}-share.png`});
 } await browser.close(); console.log('Share images, MH favicons, and WebP alternatives generated.');
})().catch(e=>{console.error(e);process.exit(1)});
