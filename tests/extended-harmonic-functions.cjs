// Synthetic functional challenges, not transcriptions or perceptual validation.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const ctx={};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../engine.js'),'utf8'),ctx);
const E=ctx.CinematicoEngine,mod=n=>(n%12+12)%12;
const parse=s=>{const r=E.parseUserProgression(s);assert.equal(r.errors.length,0,s);return r.chords;};
const cases=[
 ['Dm9 G9 Cmaj9',0,'mayor','predominante–V–I/i',true],
 ['Dm7 G7 C6',0,'mayor','V–I/i',true],
 ['Cmaj7 G9 Cmaj7#11',0,'mayor','V–I/i',true],
 ['Cm9 Fm9 G9 Cm9',0,'menor natural','predominante–V–I/i',true],
 ['Cm6 G7 CmMaj7',0,'menor natural','V–I/i',true],
 ['C G9 Am9',0,'mayor','V–vi',true],
 ['Cm G9 Abmaj9',0,'menor natural','V–VI',true],
 ['C Fmaj9 G9',0,'mayor','tónica–predominante–V posible',true],
 ['C D9 G7 C',0,'mayor',7,true],
 ['C D7 G9 C',0,'mayor',7,true],
 ['C C9 Fmaj9 C',0,'mayor',5,true],
 ['C E9 Am9 G7 C',0,'mayor',9,true],
 ['C F#7 Bm7',0,'mayor','applied',false],
 ['C F#9 Bm9',0,'mayor','applied',false],
 ['C E7 A7',0,'mayor','applied',false],
 ['C F#7 Bm7b5',0,'mayor','applied',false],
 ['Cadd9 Fmaj9',0,'mayor','applied',false],
 ['C Gmaj9 C',0,'mayor','V–I/i',false],
 ['C Gsus4 C',0,'mayor','V–I/i',false],
 ['Cm Gm9 Cm9',0,'menor natural','V–I/i',false]
];
let count=0;
for(const [text,tonic,mode,expected,present] of cases){
 const original=parse(text),snapshot=JSON.stringify(original);
 for(let shift=0;shift<12;shift++){
  const chords=original.map(c=>({...c,root:mod(c.root+shift),bass:mod(c.bass+shift),notes:c.notes.map(n=>mod(n+shift))}));
  const before=JSON.stringify(chords),events=E.cadenceEvidence(chords,mod(tonic+shift),mode);
  const found=events.some(e=>typeof expected==='number'
   ?e.kind.startsWith('V7/')&&parse(e.kind.slice(3))[0].root===mod(expected+shift)&&e.index===2
   :expected==='applied'?e.kind.startsWith('V7/'):e.kind===expected);
  assert.equal(found,present,text+' +'+shift+' '+expected);
  assert.equal(JSON.stringify(chords),before);
  if(text==='Cm9 Fm9 G9 Cm9'||text==='Cm6 G7 CmMaj7'){
   assert.equal(E.minorDominantEvidence(chords,mod(tonic+shift)).raisedLeadingTone,true);
   const best=E.tonalHypotheses(chords).candidates[0];
   assert.equal(best.tonic,mod(tonic+shift));assert.equal(best.mode,mode);
  }
  count++;
 }
 assert.equal(JSON.stringify(original),snapshot);
}
console.log('PASS extended functions: '+cases.length+' scenarios × 12 keys = '+count+' checks; exact applied targets, minor context, negative controls, source preserved.');
