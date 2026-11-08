'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const ctx={};vm.runInNewContext(fs.readFileSync(path.join(root,'engine.js'),'utf8'),ctx);
const E=ctx.CinematicoEngine;
const corpus=JSON.parse(fs.readFileSync(path.join(root,'research/emotion-harmony-evidence-2026-11-08.json'),'utf8'));
assert.ok(corpus.sources.length>=12,'Research must include primary studies and scholarly books');
assert.ok(corpus.sources.every(s=>/^https:\/\//.test(s.url)&&s.access&&s.level),'Source provenance and access limitations must be explicit');
assert.equal(corpus.creativeDesign.mappingStatus.startsWith('C:'),true,'Creative mapping must not pretend to be validated science');
const dimensions=Object.values(E.GEMS_EMOTION_DIMENSIONS).flat();
assert.equal(dimensions.length,9,'Use exactly the nine established GEMS dimensions');
assert.equal(new Set(dimensions).size,9);
const intents=['misterio','melancolia','tension','esperanza','nostalgia','epica','tristeza','alegria','ternura','asombro','inquietud','suspense','oscuridad','calma','contraste'];
assert.equal(Object.keys(E.EMOTION_CREATIVE_PROFILES).length,intents.length,'Preserve all 15 existing intents, no visible additions');
for(const mood of intents){
 const profile=E.emotionCreativeProfile(mood);
 assert.equal(profile.id,mood);
 assert.ok(profile.creativeGesture&&profile.creativeAim);
 assert.match(profile.scope,/no clasificaci[oó]n GEMS validada/);
 assert.ok(profile.gemsAffinities.every(x=>dimensions.includes(x)),'Affinities only to existing GEMS concepts: '+mood);
}
assert.equal(E.emotionCreativeProfile('contraste').family,null,'Contrast is an operation, not a GEMS emotion');
assert.equal(E.emotionCreativeProfile('asombro').creativeGesture,'contrast');
assert.equal(E.emotionCreativeProfile('suspense').creativeGesture,'delay');
assert.equal(E.emotionCreativeProfile('calma').creativeGesture,'continuity');
const inputs=['Am F C G','Dm G7 C','Am F Dm','C G Am F','Cm Ab Eb Bb',
 'Em C G D','Cmaj7 Fmaj7 G7 C','C/Bb F/A G7 C','Am','C','G7 Cmaj7','Am Am Am'];
let cases=0,paths=0,changedEndings=0,suspended=0;
for(const source of inputs){
 const input=E.parseUserProgression(source);
 assert.equal(input.errors.length,0,source);
 for(const mood of intents){
  const before=JSON.stringify(input.chords);
  const options=E.emotionalContinuations(input.chords,mood);
  assert.equal(options.length,3,source+' '+mood+' should offer three playable original ideas');
  assert.equal(JSON.stringify(input.chords),before,'No input mutation');
  const seen=new Set();
  for(const option of options){
   assert.equal(option.chords.length,3);
   const text=option.chords.join(' ');
   assert.ok(!seen.has(text),'No duplicate paths');
   seen.add(text);
   const p=E.parseUserProgression(text);
   assert.equal(p.errors.length,0,'Suggestions must parse and be playable: '+text);
   assert.ok(Number.isFinite(option.contextScore)&&Number.isFinite(option.creativeScore)&&Number.isFinite(option.gestureFit));
   assert.ok(option.creativeScore===option.contextScore+option.gestureFit*1.6);
   assert.equal(option.expressiveProfile.id,mood);
   assert.ok(typeof option.gestureSummary==='string'&&option.gestureSummary.length>8);
   assert.equal(option.arcSummary,option.harmonicArc.summary,'Create uses the same harmonic journey as the engine');
   assert.equal(option.harmonicArc.steps.length,3,'Three readable stages: link, transformation, destination');
   assert.equal(option.harmonicArc.linkChangeLevels.length,3);
   assert.ok(option.harmonicArc.linkChangeLevels.every(x=>Number.isInteger(x)&&x>=0&&x<=2));
   assert.equal(option.arcSummary,option.harmonicArc.steps.join(' → '));
   assert.ok(option.arcSummary.length<110,'Keep the front of the card readable on mobile');
   assert.match(option.harmonicArc.scope,/no mide intensidad emocional/);
   assert.ok(!/provoca|garantiza|sentirás|intensidad emocional:/i.test(option.arcSummary),'No invented emotion intensity');
   assert.ok(typeof option.expressiveEvidence.suspendedEnding==='boolean');
   assert.ok(!/sentir[aá]|emocionar[aá]|alegr[ií]a inevitable/i.test(option.gestureSummary),'No emotional certainty in user heading');
   const ending=p.chords.at(-1);
   if(ending.type==='sus4'){
    suspended++;
    assert.equal(option.direction,'mantener tensión','A suspended final chord cannot count as resolved');
    assert.equal(option.expressiveEvidence.suspendedEnding,true);
   }
   if(option.direction==='resolver')assert.equal(option.expressiveEvidence.tonalArrival,true,'Arrival requires an unsuspended tonal goal');
   paths++;
  }
  if(new Set(options.map(x=>x.chords.at(-1))).size>1)changedEndings++;
  cases++;
 }
}
assert.ok(suspended>=10,'Suspense recipes should retain unresolved endings');
assert.ok(changedEndings>20,'Alternatives should frequently offer different final destinations');
const basic=E.parseUserProgression('Am F C G').chords;
assert.equal(E.emotionalContinuations(basic,'suspense')[0].direction,'mantener tensión');
assert.equal(E.emotionalContinuations(basic,'asombro')[0].direction,'cambiar dirección');
assert.ok(E.emotionalContinuations(basic,'esperanza').some(x=>x.chords.at(-1).includes('add9')));
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert.ok(html.includes('q.arcSummary||q.gestureSummary'),'Show the harmonic arc directly in Create');
assert.ok(html.includes('Gesto armónico: '),'Keep the detailed harmonic gesture behind optional explanation');
assert.ok(html.includes('id="simpleMood"'),'Keep all 15 intentions opt-in');
assert.ok(!html.includes('id="save"'),'Do not reintroduce an unwanted notebook');
console.log('PASS evidence-aware emotions: '+cases+' contexts, '+paths+' tested suggestions, '+changedEndings+' different-destination contexts, '+suspended+' suspended endings.');
