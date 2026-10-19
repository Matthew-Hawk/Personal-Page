// Run from the repository root with sharp installed (or PORTFOLIO_DEPS set).
// Converts the chosen SVG into the active favicon files used by HTML/manifest.
// To change the chosen design, update the SVG source path inside buildFavicons.
const fs = require('node:fs');
const path = require('node:path');
const sharp = require(path.join(process.env.PORTFOLIO_DEPS || '', 'sharp'));

async function buildFavicons() {
 const icon = fs.readFileSync('Favicon/options/02-mh-monogram.svg');
 fs.writeFileSync('Favicon/favicon.svg', icon);
 for (const [name, size] of [['favicon-96x96.png',96], ['apple-touch-icon.png',180]]) {
  await sharp(icon).resize(size,size).png().toFile('Favicon/'+name);
 }
 // Keep the monogram within the safe area of maskable app icons.
 for (const size of [192,512]) {
  const mark = await sharp(icon).resize(Math.round(size*.76)).png().toBuffer();
  await sharp({create:{width:size,height:size,channels:4,background:'#171715'}})
   .composite([{input:mark,gravity:'centre'}]).png().toFile(`Favicon/web-app-manifest-${size}x${size}.png`);
 }
 // ICO can contain a PNG payload. Build its 6-byte file header and 16-byte
 // directory entry: one 32x32 image, payload length, and a 22-byte data offset.
 // These binary fields use little-endian byte order (the LE Buffer methods).
 const png = await sharp(icon).resize(32,32).png().toBuffer();
 const header = Buffer.alloc(22);
 header.writeUInt16LE(1,2); header.writeUInt16LE(1,4);
 header[6]=32; header[7]=32;
 header.writeUInt16LE(1,10); header.writeUInt16LE(32,12);
 header.writeUInt32LE(png.length,14); header.writeUInt32LE(22,18);
 fs.writeFileSync('Favicon/favicon.ico',Buffer.concat([header,png]));
}

// Export for build-assets.cjs; also allow running this file directly.
module.exports = buildFavicons;
if (require.main === module) buildFavicons().then(()=>console.log('MH monogram favicon set generated.')).catch(error=>{console.error(error);process.exit(1)});
