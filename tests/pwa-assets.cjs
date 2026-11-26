// Verify installable PWA icon assets are real, complete PNGs, not stale links.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const zlib=require('node:zlib');
const root=path.join(__dirname,'..');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.json'),'utf8'));
const sw=fs.readFileSync(path.join(root,'service-worker.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const u32=n=>n.readUInt32BE(0);
function crc32(bytes){
 let c=0xffffffff;
 for(const v of bytes){c^=v;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0);}
 return (c^0xffffffff)>>>0;
}
for(const size of [192,512]){
 const src='icon-'+size+'.png',full=path.join(root,src);
 assert.ok(fs.existsSync(full),src+' missing');
 const data=fs.readFileSync(full);
 assert.equal(data.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
 let i=8,meta=null,rawIDAT=[],palette=false;
 while(i<data.length){
  const len=data.readUInt32BE(i),tag=data.subarray(i+4,i+8).toString('ascii');
  const bytes=data.subarray(i+8,i+8+len);
  assert.ok(i+12+len<=data.length,'PNG chunk length');
  const expected=data.readUInt32BE(i+8+len);
  assert.equal(crc32(data.subarray(i+4,i+8+len)),expected,tag+' CRC');
  if(tag==='IHDR')meta={width:bytes.readUInt32BE(0),height:bytes.readUInt32BE(4),bitDepth:bytes[8],colorType:bytes[9]};
  if(tag==='PLTE')palette=true;
  if(tag==='IDAT')rawIDAT.push(bytes);
  i+=12+len;
  if(tag==='IEND')break;
 }
 assert.deepEqual(meta,{width:size,height:size,bitDepth:2,colorType:3});
 assert.ok(palette&&rawIDAT.length);
 const decoded=zlib.inflateSync(Buffer.concat(rawIDAT));
 const stride=1+Math.ceil(size/4);
 assert.equal(decoded.length,size*stride);
 let nonZero=0;
 for(let y=0;y<size;y++){
  assert.equal(decoded[y*stride],0,'Scanline uses filter 0');
  for(let x=0;x<size;x++){
   const c=(decoded[y*stride+1+(x>>2)]>>(6-(x&3)*2))&3;
   nonZero+=c>0?1:0;
  }
 }
 assert.ok(nonZero>size*size*0.005&&nonZero<size*size*0.3,'Gold mark should be visible but not cover the background');
 assert.ok(manifest.icons.some(icon=>icon.src===src&&icon.sizes===size+'x'+size&&icon.type==='image/png'));
 assert.ok(sw.includes('./'+src),'PWA should cache installed icon '+src);
}
assert.ok(html.includes('href="icon-192.png"'));
assert.ok(html.includes('href="studio.css"'));
assert.ok(sw.includes('"./studio.css"'),'PWA must cache the stylesheet');
const css=fs.readFileSync(path.join(root,'studio.css'),'utf8');
for(const family of ['manrope','inter','ibm-plex-mono']){
 const weight=family==='ibm-plex-mono'?'400':'wght';
 for(const subset of ['latin','latin-ext']){
  const src='assets/fonts/'+family+'-'+subset+'-'+weight+'-normal.woff2';
  assert.ok(css.includes('url(./'+src+')'),'Stylesheet must use '+src);
  assert.equal(fs.readFileSync(path.join(root,src)).subarray(0,4).toString(),'wOF2',src);
  assert.ok(sw.includes('"./'+src+'"'),'PWA must cache '+src);
 }
 const license='assets/fonts/'+family+'-OFL.txt';
 assert.match(fs.readFileSync(path.join(root,license),'utf8'),/SIL OPEN FONT LICENSE/i);
 assert.ok(sw.includes('"./'+license+'"'),'PWA must cache '+license);
}
const workerVersion=sw.match(/cinematico-studio-v(\d+)/)?.[1];
const registrationVersion=html.match(/service-worker\.js\?v=(\d+)/)?.[1];
assert.ok(workerVersion,'Cache must declare a version');
assert.equal(registrationVersion,workerVersion,'Registration and shell cache versions must match');
console.log('PASS PWA assets: PNGs, manifest, local styles, WOFF2 fonts, OFL licenses and offline caching');
