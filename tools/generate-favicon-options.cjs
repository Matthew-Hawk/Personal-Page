// Review assets only: this never changes the active site's favicon links.
const fs = require('node:fs');
const path = require('node:path');
const sharp = require(path.join(process.env.PORTFOLIO_DEPS || '', 'sharp'));
const directory = 'Favicon/options';
const options = [
 {id:'01-signal-star',name:'Signal star',note:'A bold evolution of the current mark.',bg:'#ba2c20',art:'<path d="M64 17 77 51 111 64 77 77 64 111 51 77 17 64 51 51Z" fill="#eeeae2"/>'},
 {id:'02-mh-monogram',name:'MH monogram',note:'Personal identity, clear and direct.',bg:'#171715',art:'<path d="M21 92V36L40 62 59 36V92M77 36V92M107 36V92M77 64H107" fill="none" stroke="#eeeae2" stroke-width="10" stroke-linejoin="miter"/><path d="M96 17H112" stroke="#ba2c20" stroke-width="7"/>'},
 {id:'03-terminal',name:'Terminal',note:'A simple nod to systems and scripting.',bg:'#eeeae2',art:'<path d="M29 34 57 60 29 86" fill="none" stroke="#ba2c20" stroke-width="13" stroke-linecap="square" stroke-linejoin="miter"/><path d="M65 91H103" stroke="#171715" stroke-width="12"/>'},
 {id:'04-hawk',name:'Hawk',note:'An abstract signature tied to your name.',bg:'#171715',art:'<path d="M23 100 34 51 66 25 98 33 113 57 88 53 78 101 56 84 40 104 47 71Z" fill="#eeeae2"/><path d="M76 40 91 44 77 49Z" fill="#ba2c20"/>'},
 {id:'05-red-m',name:'Red M',note:'One initial, strong at small sizes.',bg:'#eeeae2',art:'<path d="M26 96V33L64 67 102 33V96" fill="none" stroke="#ba2c20" stroke-width="16" stroke-linejoin="miter"/>'}
];
const svg = option => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" rx="24" fill="${option.bg}"/>${option.art}</svg>`;
const encode = value => `data:image/svg+xml;base64,${Buffer.from(value).toString('base64')}`;
const ico = png => {const h=Buffer.alloc(22);h.writeUInt16LE(1,2);h.writeUInt16LE(1,4);h[6]=32;h[7]=32;h.writeUInt16LE(1,10);h.writeUInt16LE(32,12);h.writeUInt32LE(png.length,14);h.writeUInt32LE(22,18);return Buffer.concat([h,png]);};
(async()=>{
 fs.mkdirSync(directory,{recursive:true});
 for(const option of options){
  const source=svg(option);fs.writeFileSync(`${directory}/${option.id}.svg`,source);
  await sharp(Buffer.from(source)).resize(512,512).png().toFile(`${directory}/${option.id}.png`);
  fs.writeFileSync(`${directory}/${option.id}.ico`,ico(await sharp(Buffer.from(source)).resize(32,32).png().toBuffer()));
 }
 let cards='';
 for(let i=0;i<options.length;i++){
  const option=options[i],url=encode(svg(option)),x=36+i*296;
  cards+=`<g transform="translate(${x},175)">
   <path d="M0 0H272" stroke="#171715"/>
   <text x="0" y="32" font-size="12" font-family="monospace" fill="#ba2c20">0${i+1} / ${option.name.toUpperCase()}</text>
   <image href="${url}" x="60" y="68" width="144" height="144"/>
   <text x="0" y="255" font-size="12" font-family="monospace">ACTUAL SIZES</text>
   <image href="${url}" x="0" y="277" width="16" height="16"/><text x="26" y="290" font-size="12">16px</text>
   <image href="${url}" x="100" y="270" width="32" height="32"/><text x="144" y="290" font-size="12">32px</text>
   <rect x="0" y="332" width="272" height="46" rx="9" fill="#fff"/>
   <image href="${url}" x="15" y="347" width="16" height="16"/><text x="42" y="360" font-size="12" fill="#171715">Matthew Hawkins</text><text x="247" y="361" font-size="18" fill="#727272">×</text>
   <rect x="0" y="390" width="272" height="46" rx="9" fill="#222624"/>
   <image href="${url}" x="15" y="405" width="16" height="16"/><text x="42" y="418" font-size="12" fill="#eeeae2">Matthew Hawkins</text><text x="247" y="419" font-size="18" fill="#b6bbb8">×</text>
  </g>`;
 }
 const board=`<svg xmlns="http://www.w3.org/2000/svg" width="1536" height="720" viewBox="0 0 1536 720"><rect width="1536" height="720" fill="#eeeae2"/><g font-family="Arial,sans-serif" fill="#171715"><text x="36" y="44" font-family="monospace" font-size="12" fill="#ba2c20">MATTHEW HAWKINS / FAVICON STUDIES</text><text x="36" y="103" font-size="44" font-weight="700" letter-spacing="-2">A small mark. A clear identity.</text><text x="36" y="137" font-size="16">Five options in the existing site palette. Small icons below are shown at 16px and 32px at 100% zoom.</text>${cards}<path d="M36 655H1492" stroke="#171715"/><text x="36" y="688" font-size="14">My pick: 02 / MH monogram — personal and easy to distinguish from your project brands.</text></g></svg>`;
 fs.writeFileSync(`${directory}/comparison.svg`,board);
 await sharp(Buffer.from(board)).png().toFile(`${directory}/comparison.png`);
 fs.writeFileSync(`${directory}/README.md`,'# Favicon options\n\nReview only; the current site favicon remains active.\n\n'+options.map(o=>`- **${o.id}: ${o.name}** — ${o.note}`).join('\n')+'\n\nEach option has a vector SVG, a 512×512 PNG, and a 32×32 ICO. The comparison PNG shows enlarged marks and native-size light/dark tab mockups. Inspect at 100% zoom to judge 16px legibility.\n\nAfter choosing, generate the complete active favicon set (96px, 180px, 192px, 512px, ICO and SVG) from that option, then update the asset generator so it preserves the choice.\n\nRegenerate review assets with `PORTFOLIO_DEPS` pointing at the existing runtime node_modules and `node tools/generate-favicon-options.cjs`.\n');
 console.log('Generated five SVG/PNG/ICO options and comparison previews. Active favicon unchanged.');
})().catch(error=>{console.error(error);process.exit(1)});
