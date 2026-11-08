const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),source=fs.readFileSync(path.join(root,'engine.js'),'utf8');
const ctx={};vm.runInNewContext(source,ctx);const E=ctx.CinematicoEngine;
const inputs=['Am F C G','C G Am F','Am F Dm','Dm G7 C','Cmaj7 Fmaj7 G7 C','Cm Ab Eb Bb','Em C G D','G7 Cmaj7','C/Bb F/A G7 C','Am','C','Am Am Am Am Am Am'];
const moods=['misterio','melancolia','tension','esperanza','nostalgia','epica','tristeza','alegria','ternura','asombro','inquietud','suspense','oscuridad','calma','contraste'];
let sampleCount=0,previewCount=0;
for(const text of inputs){
 const original=E.parseUserProgression(text);assert.equal(original.errors.length,0,text);
 const initial=JSON.stringify(original.chords);
 for(const mood of moods){
  const options=E.emotionalContinuations(original.chords,mood);
  assert.equal(options.length,3,mood+' '+text+': Three paths required for main UX.');
  assert.equal(new Set(options.map(p=>p.chords.join(' '))).size,3,'No duplicate pathways');
  for(const route of options){
   assert.ok(['resolver','mantener tensión','cambiar dirección'].includes(route.direction));
   assert.equal(route.chords.length,3);
   const parsed=E.parseUserProgression(route.chords.join(' '));
   assert.equal(parsed.errors.length,0,route.chords.join(' '));
   const final=parsed.chords[2];
   if(final.type==='sus4')assert.notEqual(route.direction,'resolver','Suspended third is not fully resolved');
   if(mood==='suspense')assert.notEqual(route.direction,'resolver','Suspense must not promise tonic closure');
   if(mood==='contraste'||mood==='asombro')assert.equal(route.direction,'cambiar dirección','Chromatic paths must explain their contrast');
   assert.equal(typeof route.explanation,'string');
   // Preview only the last two source chords plus the three suggestions,
   // always the same harmonic pulse; never the full 8+3 chords.
   const p=E.parseUserProgression([...original.chords.slice(-2).map(c=>c.label),...route.chords].join(' '));
   assert.equal(p.errors.length,0);
   const plan=E.composerListeningPlan(p.chords,{equalChordDuration:true});
   assert.equal(plan.status,'ready');
   assert.equal(plan.steps.length,Math.min(2,original.chords.length)+3);
   previewCount++;
  }
  assert.equal(JSON.stringify(original.chords),initial,'Generations never change the input');
  sampleCount++;
 }
}
const ambiguous=E.emotionalContinuations(E.parseUserProgression('C G Am F').chords,'esperanza');
assert.equal(ambiguous.length,3);
assert.ok(ambiguous.some(route=>route.suggestedCenter==='C mayor'),'Cadential evidence prevents automatically assuming F is tonic');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert.ok(!html.includes('id="save"')&&!html.includes('id="savedList"'),'Notebook no longer takes screen space');
assert.ok(html.includes('data-study-open="chords"')&&html.includes('data-study-open="inspire"')&&html.includes('data-study-open="tools"'));
assert.ok(html.includes('data-simple-preview'),'Listen actions provided in Create');
console.log('PASS musician journey: '+sampleCount+' decisions / '+previewCount+' neutral previews; suspensions, contrast, source integrity and no notebook.');
