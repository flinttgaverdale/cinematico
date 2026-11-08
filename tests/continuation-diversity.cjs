const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const ctx={};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../engine.js'),'utf8'),ctx);
const E=ctx.CinematicoEngine;
const parse=s=>E.parseUserProgression(s).chords;
const moods=['misterio','melancolia','tension','esperanza','nostalgia','epica','tristeza','alegria','ternura','asombro','inquietud','suspense','oscuridad','calma','contraste'];
for(const source of ['C F G7','Cm Abmaj7 Fm7 G7','Am F C G']){
 for(const mood of moods){
  const original=parse(source),snapshot=JSON.stringify(original);
  const ideas=E.emotionalContinuations(original,mood);
  assert.ok(ideas.length>0,mood+' '+source);
  const first=ideas[0];
  assert.match(first.variantDescription,/ajuste armónico estructural/);
  for(let i=1;i<ideas.length;i++){
   const idea=ideas[i],differing=idea.chords.filter((c,j)=>c!==first.chords[j]).length;
   assert.ok(differing>=1,mood+' needs materially distinct chords');
   assert.ok(idea.variantDescription.includes(differing+' de '+idea.chords.length),mood);
  }
  const fingerprints=ideas.map(x=>x.chords.join('|'));
  assert.equal(new Set(fingerprints).size,ideas.length,mood);
  assert.equal(JSON.stringify(original),snapshot,'The composer source must never be rewritten');
 }
}
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
assert.ok(html.includes('q.variantDescription'),'Simplified writing mode exposes differences');
console.log('PASS continuation diversity: 45 creative contexts, structural distinction and non-destructive operation');
