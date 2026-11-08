'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const ctx={};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../engine.js'),'utf8'),ctx);
const E=ctx.CinematicoEngine;
const inputs=[
 "Am F C G",
 "Dm G7 C",
 "Am F Dm",
 "C G Am F",
 "Cm Ab Eb Bb",
 "Em C G D",
 "Cmaj7 Fmaj7 G7 C",
 "C/Bb F/A G7 C",
 "Am",
 "C",
 "G7 Cmaj7",
 "Am Am Am",
 "C F G C",
 "C G7",
 "Fm Db Ab Eb",
 "Bm G D A",
 "D G A D",
 "Eb Ab Bb Eb",
 "Ab Fm Db Eb",
 "F#m D A E",
 "G Em C D",
 "F Bb C F",
 "Am Dm E7 Am",
 "Dm Gm A7 Dm",
 "C Cmaj7 F Fm",
 "E B C#m A",
 "Gm Eb F Bb",
 "C D E F",
 "C F# C F#",
 "Abmaj7 Dbmaj7 Eb7 Ab",
 "A E F#m D",
 "Cm Fm G7 Cm"
];
const moods=["misterio","melancolia","tension","esperanza","nostalgia","epica","tristeza","alegria","ternura","asombro","inquietud","suspense","oscuridad","calma","contraste"];
const fixed=[
 [
  "Am F C G",
  "melancolia",
  "Ddim G7 Cm"
 ],
 [
  "Am F C G",
  "alegria",
  "Dm G7 C"
 ],
 [
  "Am F C G",
  "calma",
  "Am7 Fmaj7 Cadd9"
 ],
 [
  "Am F C G",
  "epica",
  "Dm Bb C"
 ],
 [
  "C G Am F",
  "suspense",
  "Dm G7 Csus4"
 ],
 [
  "Cm Ab Eb Bb",
  "nostalgia",
  "Gm Cm7 Ebmaj7"
 ],
 [
  "Am F Dm",
  "calma",
  "Bbmaj7 Gm7 Dmadd9"
 ],
 [
  "Dm G7 C",
  "alegria",
  "F G7 C"
 ],
 [
  "C",
  "contraste",
  "E Ab Eb"
 ]
];
let scenarios=0,paths=0,differentFinal=0,differentRoot=0,differentDirection=0;
for(const source of inputs){
 const p=E.parseUserProgression(source);
 assert.equal(p.errors.length,0,source);
 const snapshot=JSON.stringify(p.chords);
 for(const mood of moods){
  const arr=E.emotionalContinuations(p.chords,mood);
  assert.equal(arr.length,3,source+' / '+mood);
  assert.equal(new Set(arr.map(x=>x.chords.join('|'))).size,3,source+' / '+mood+' unique routes');
  assert.equal(arr[0].isExploratory,false,'First path uses the original carefully tested recipes');
  assert.match(arr[0].variantDescription,/ajuste armónico estructural/);
  const roots=new Set(),endings=new Set(),directions=new Set();
  for(let i=0;i<arr.length;i++){
   const a=arr[i];
   const parsed=E.parseUserProgression(a.chords.join(' '));
   assert.equal(parsed.errors.length,0,source+' '+mood+' '+a.chords.join(' '));
   assert.equal(parsed.chords.length,3);
   assert.equal(a.destinationRoot,parsed.chords[2].root,'Destination is a pitch class, not a text-only variation');
   assert.equal(a.destinationType,parsed.chords[2].type);
   assert.equal(a.rootPath.length,3);
   assert.equal(a.harmonicArc.steps.length,3);
   assert.ok(Number.isFinite(a.creativeScore));
   if(a.expressiveEvidence.suspendedEnding)assert.notEqual(a.direction,'resolver');
   if(mood==='suspense')assert.notEqual(a.direction,'resolver');
   if(mood==='contraste'||mood==='asombro')assert.equal(a.direction,'cambiar dirección');
   if(i>0){
    const d=a.chords.filter((c,j)=>c!==arr[0].chords[j]).length;
    assert.ok(d>=1);
    assert.ok(a.variantDescription.includes(d+' de '+a.chords.length));
    assert.match(a.variantDescription,/fundamental final|otra fundamental/);
   }
   roots.add(a.destinationRoot);endings.add(a.chords[2]);directions.add(a.direction);paths++;
  }
  if(roots.size>1)differentRoot++;
  if(endings.size>1)differentFinal++;
  if(directions.size>1)differentDirection++;
  assert.equal(JSON.stringify(p.chords),snapshot,'Composers own chords remain untouched');
  scenarios++;
 }
}
for(const mood of ['calma','ternura','nostalgia']){
 const minor=E.emotionalContinuations(E.parseUserProgression('Cm Abmaj7 Fm7 G7').chords,mood);
 const major=E.emotionalContinuations(E.parseUserProgression('C F G7').chords,mood);
 assert.ok(['Cmadd9','Cm7'].includes(minor[0].chords.at(-1)),'Keep the original minor-tonic first route');
 assert.ok(['Cmaj7','Cadd9'].includes(major[0].chords.at(-1)),'Keep the original major-tonic first route');
 assert.ok(minor.every(x=>!['C','Cmaj7','Cadd9'].includes(x.chords.at(-1))),'Do not replace a minor tonic with an unasked major tonic');
 assert.ok(major.every(x=>!['Cm','Cm7','Cmadd9'].includes(x.chords.at(-1))),'Do not replace a major tonic with an unasked minor tonic');
}
for(const [source,mood,firstExpected] of fixed){
 const p=E.parseUserProgression(source);
 assert.equal(E.emotionalContinuations(p.chords,mood)[0].chords.join(' '),firstExpected,'Keep original first route: '+source+' '+mood);
}
assert.equal(scenarios,480);
assert.equal(paths,1440);
assert.ok(differentFinal>=420,'Most sets should offer a different chordal destination, except when context-fitting options are too weak');
assert.ok(differentRoot>=380,'Variety must be structural, not cosmetic chord naming');
assert.ok(differentDirection>=225,'Not every route should claim identical arrival');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
assert.ok(html.includes('q.variantDescription'),'No extra UI or mandatory selectors');
assert.equal((html.match(/data-quick-intent="/g)||[]).length,4);
assert.equal((html.match(/data-study-open="/g)||[]).length,3);
console.log('PASS meaningful variety: '+scenarios+' decisions, '+paths+' playable continuations, '+differentFinal+' differentiated endings, '+differentRoot+' different destination roots, '+differentDirection+' different direction profiles; primary routes preserved.');
