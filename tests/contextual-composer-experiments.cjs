'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const sandbox={};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..','engine.js'),'utf8'),sandbox);
const E=sandbox.CinematicoEngine;
const parse=(text)=>{
 const parsed=E.parseUserProgression(text);
 assert.deepEqual(Array.from(parsed.errors),[],text);
 return parsed.chords;
};
const profiles=Object.keys(E.COMPOSER_CREATIVE_LENSES);
const intents=Object.keys(E.EMOTION_CREATIVE_PROFILES);
const example=parse('Am F C G');
const sample=profiles.map(id=>E.contextualComposerExperiment(id,example,'esperanza'));
assert.equal(new Set(sample.map(trial=>trial.id)).size,11);
const concrete=sample.filter(trial=>trial.comparison);
assert.equal(new Set(concrete.map(trial=>trial.comparison.after.join(' '))).size,concrete.length);
const find=id=>sample.find(trial=>trial.composerId===id);
assert.ok(find('williams').comparison.after.includes('D7'));
assert.ok(find('herrmann').comparison.after.includes('AmMaj7'));
assert.ok(find('zimmer').comparison.after.some(label=>label.endsWith('/C')));
assert.equal(find('silvestri').comparison,null,'The raised fourth is a task for melody');
assert.equal(find('goransson').comparison,null,'Unheard rhythm experiment must not advertise a comparison');
assert.equal(E.contextualComposerExperiment('williams',example,'suspense').comparison,null);
assert.equal(E.contextualComposerExperiment('horner',example,'asombro').title,'Ensaya una transformación S');
assert.match(E.contextualComposerExperiment('silvestri',parse('B F#'),'asombro').action,/Mi|E y E♯|E con E♯/);
assert.equal(E.contextualComposerExperiment('constructor',example,'esperanza'),null);
assert.equal(E.contextualComposerExperiment('newman',[],'calma'),null);
assert.equal(E.contextualComposerExperiment('newman',example,'constructor').intent,null);

const slash=E.analyzeCompositionMaterial(parse('C/Bb F/A G(sus4) G C'));
assert.equal(slash.basses[0].kind,'independent');
assert.equal(slash.basses[0].pc,10);
assert.equal(slash.basses[1].kind,'inversion');
assert.equal(slash.links[0].bassMotion,-1);
assert.ok(slash.tonal.candidates[0].cadences.length);
assert.equal(E.analyzeCompositionMaterial(parse('Cm')).compatibleModes.length,0);
const dorian=E.analyzeCompositionMaterial(parse('Cm F Gm Cm'));
assert.ok(dorian.compatibleModes.some(candidate=>candidate.tonic===0&&candidate.mode==='dorian'));
assert.ok(!dorian.compatibleModes.some(candidate=>candidate.tonic===0&&candidate.mode==='aeolian'));

const corpus=['Am F C G','C/Bb F/A G(sus4) G C','Cm6 F7 G7 Cm9','Cmaj7#11 Bbm7 Eb9 Abmaj9',
 'C F# Bbm E', 'Dm', 'Dm F/A Am7 Db/G Cm7 Fsus2 E7 Am','Cm Cm Fm Cm'];
let cases=0;
for(const [i,text] of corpus.entries())for(let offset=0;offset<12;offset++){
 const transposed=Array.from(parse(text),ch=>E.spell(ch.root+offset)+ch.type+
  (ch.bassKind==='root'?'':'/'+E.spell(ch.bass+offset))).join(' ');
 const chords=parse(transposed);
 const snapshot=JSON.stringify(chords);
 for(const id of profiles){
  const intent=intents[(offset+i)%intents.length];
  const trial=E.contextualComposerExperiment(id,chords,intent);
  assert.equal(trial.intent,intent);
  assert.equal(trial.changesOriginal,false);
  assert.equal(trial.evidence.grade,'D');
  assert.ok(trial.action.length>20&&trial.change.length>20&&trial.effect.length>20);
  if(trial.comparison){
   const {before,after}=trial.comparison;
   assert.equal(before.length,after.length);
   assert.notEqual(before.join(' '),after.join(' '));
   const inputLabels=chords.map(ch=>ch.label);
   assert.ok(before.every(label=>inputLabels.includes(label)));
   assert.equal(parse(after.join(' ')).length,after.length);
   for(const [position,label] of before.entries()){
    if(label.includes('/'))assert.equal(after[position],label,'A written bass stays intact in the audition');
   }
  }else assert.ok(trial.requires.length,'An interpretive suggestion describes missing performance information');
  assert.equal(JSON.stringify(chords),snapshot,'Contextual comparison leaves original unchanged');
  cases++;
 }
}
for(const trial of concrete){
 const before=E.composerListeningPlan(parse(trial.comparison.before.join(' ')),{equalChordDuration:true});
 const after=E.composerListeningPlan(parse(trial.comparison.after.join(' ')),{equalChordDuration:true});
 assert.equal(before.status,'ready',trial.id);
 assert.equal(after.status,'ready',trial.id);
 assert.equal(before.totalSeconds,after.totalSeconds,trial.id+' uses the same audition length');
}
console.log('PASS '+cases+' contextual procedures across 11 lenses and 12 roots, plus distinct actions and equal-pulse audition pairs.');
