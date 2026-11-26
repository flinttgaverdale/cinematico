'use strict';
const assert=require('node:assert/strict');
require('../engine.js');
const E=globalThis.CinematicoEngine;
const ids=['williams','horner','herrmann','elfman','zimmer','giacchino','silvestri','shore','morricone','newman','goransson'];
const notes=['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
let count=0;
function check(raw,id,intent){
 const parsed=E.parseUserProgression(raw);assert.deepEqual(parsed.errors,[]);
 const before=JSON.stringify(parsed.chords);
 const paths=E.composerContinuations(parsed.chords,intent,id);
 assert.equal(paths.length,3,raw+' '+id+' '+intent);
 assert.deepEqual(paths.map(x=>x.id),['continuity','transformation','contrast']);
 assert.equal(new Set(paths.map(q=>q.chords.join(' '))).size,3);
 for(const q of paths){
  assert.deepEqual(E.parseUserProgression(q.chords.join(' ')).errors,[]);
  assert.deepEqual(q.original,parsed.chords.map(x=>x.label));
  assert.equal(q.composerId,id);assert.equal(q.evidence.grade,'D');
  assert.equal(q.phrase.links.length,q.chords.length);
  assert.equal(q.structure.groups.flatMap(g=>g.labels).join(' '),[...q.original,...q.chords].join(' '));
  assert.equal(q.structure.rhythm.known,false);
  assert.ok(q.motif&&Array.isArray(q.motif.gestures));
  for(const key of ['presentation','development','culmination','resolution','scope'])assert.ok(q.phrase[key]);
 }
 assert.equal(JSON.stringify(parsed.chords),before);
 count++;return paths.map(q=>q.chords.join(' ')).join('|');
}
for(let t=0;t<12;t++){
 const raw=[notes[(t+9)%12]+'m',notes[(t+5)%12],notes[t],notes[(t+7)%12]].join(' ');
 assert.equal(new Set(ids.map(id=>check(raw,id,'esperanza'))).size,11);
}
for(const raw of ['Dm7 G7 Cmaj7','Am/E Fmaj7/C Dm7 Gsus4','Cmaj7#11 E/Bb Bm7b5','F#dim7','C G Am F Dm Em F G'])
 for(const id of ids)for(const mood of ['suspense','nostalgia','contraste'])check(raw,id,mood);
for(const raw of ['Am F C G','Dm7 G7 Cmaj7','Am Dm E7'])for(const id of ids)for(const ending of ['open','closed']){
 const original=E.parseUserProgression(raw).chords;
 const paths=E.composerContinuations(original,'esperanza',id,{ending});
 assert.equal(paths.length,3);
 for(const path of paths){
  assert.deepEqual(E.parseUserProgression(path.chords.join(' ')).errors,[]);
  assert.equal(path.endingPreference,ending);
  if(ending==='closed')assert.ok(path.endingEvidence.rootArrival);
  else assert.ok(!path.endingEvidence.arrival||path.endingEvidence.suspended);
 }
 count++;
}
const p=E.parseUserProgression('Am F C G').chords;
const candidates=E.continuationCenters(E.analyzeCompositionMaterial(p),p);
assert.deepEqual(new Set(candidates.map(c=>c.tonic)),new Set([0,9]));
const c=label=>E.parseUserProgression(label).chords[0];
assert.equal(E.continuationExpectation(c('G7'),c('C'),candidates).kind,'resolution');
assert.equal(E.continuationExpectation(c('G7'),c('Am'),candidates).kind,'deceptive');
assert.equal(E.continuationExpectation(c('G7'),c('Csus4'),candidates).kind,'suspension');
assert.equal(E.continuationExpectation(c('G7'),c('C/G'),candidates).rootBass,false);
assert.equal(E.continuationExpectation(c('Gm7'),c('C'),candidates).dominant,false);
const cadence=E.parseUserProgression('Am Dm E7').chords;
for(const id of ids){
 const q=E.composerContinuations(cadence,'esperanza',id,{ending:'closed'})[0];
 assert.deepEqual(q.chords,['Am']);assert.ok(q.endingEvidence.rootArrival);
 assert.equal(q.expectations[0].kind,'resolution');assert.equal(q.memory[0].kind,'recuperación');
}

// Four phrase tasks must be grounded in the actual path, not inferred timing.
const phrase=labels=>E.harmonicPhraseEvidence(p,labels.split(' ').map(c),candidates,'auto');
assert.equal(phrase('G7 C').arrivalKind,'dominant');
assert.equal(phrase('G C').arrivalKind,'dominantTriad');
assert.equal(phrase('G7 C/G').arrivalKind,'inverted');
assert.equal(phrase('G7 Csus4').arrivalKind,'suspended');
assert.equal(phrase('Dm E7 Am').firstReturn,true);
assert.equal(phrase('Am F').recurrentLinks.length,1);
assert.equal(phrase('Em C Am').links[0].triadic,'R');
assert.equal(phrase('C/G G').sustainedLinks,2);
assert.equal(phrase('G7 C').preparation[0].kind,'resolution');
assert.equal(phrase('G7 C').preparation[0].from,'G7');
assert.ok(phrase('Am F').culmination.includes('no localiza'));
assert.ok(phrase('Am').development.includes('No es imprescindible'));
// Structural readings retain all original events; they never remove ornaments.
const st=(a,b,d)=>E.harmonicStructureEvidence(a.split(' ').map(c),b.split(' ').map(c),[{tonic:0,mode:'mayor'}],d);
const prolonged=st('C Cadd9 F/C','C G7 C');
assert.ok(prolonged.relevant.some(x=>x.kind==='neighborOverBass'&&x.start===0&&x.end===3));
assert.equal(prolonged.groups[0].labels.join(' '),'C Cadd9');
assert.equal(prolonged.closure,'centerArrival');
assert.equal(st('C','G7 C/G').closure,'invertedArrival');
assert.equal(st('C','F C').closure,'plagalArrival');
assert.equal(st('C','A7 Dm').closure,'localArrival');
assert.equal(st('C','G7').closure,'dominantOpen');
assert.equal(st('C','G7 Csus4').closure,'unstableOpen');
assert.equal(st('C','C/E F').rhythm.known,false);
assert.equal(st('C','C/E F',[4,2,2]).rhythm.continuationMean,2);
assert.equal(st('C','F',[4,0]).rhythm.known,false);
assert.ok(st('C','G/B Am').passingBass.length);
assert.equal(st('C','G G7 C').groups.length,4);
const full=[...p,...['Em','C','Am'].map(c)];
const sample=E.continuationInnerVoiceExample(p,full.slice(p.length),'horner');
const preview=E.composerListeningPlan(full,{fullPreview:true,equalChordDuration:true});
assert.ok(sample&&preview.status==='ready');
for(const [i,v] of sample.voices.entries())assert.deepEqual(v.notes,preview.steps.slice(p.length-1).map(x=>x.pitches[i+1]));
const motif=(a,b)=>E.harmonicMotifEvidence(a.split(' ').map(c),b.split(' ').map(c));
assert.ok(motif('Dm G7','Em A7').gestures.some(g=>g.kind==='transposition'&&g.offset===2));
assert.ok(motif('Am F C','Am F').gestures.some(g=>g.kind==='recall'));
assert.ok(motif('Am C','Am G C').gestures.some(g=>g.kind==='insertion'));
assert.ok(motif('Am G C','Am C').gestures.some(g=>g.kind==='omission'));
assert.ok(motif('C D F','C Bb G').gestures.some(g=>g.kind==='rootReflection'));
assert.equal(motif('C','E Ab C').cycle.closed,true);
assert.equal(motif('C','E Ab C').cycle.step,4);
assert.equal(motif('C','D E F#').cycle.closed,false);
assert.equal(motif('C','C C C').cycle,null);
assert.equal(motif('C','Cm').parallelChanges.length,1);
assert.equal(motif('C','E C').mirrors.length,1);
assert.ok(!motif('C/E F','D G').gestures.some(g=>g.kind==='transposition'&&g.model.join(' ')==='C/E F'&&g.candidate.join(' ')==='D G'));
const parse=raw=>E.parseUserProgression(raw).chords;
const dorian=E.modalIdentityEvidence(parse('Dm G Dm C'),parse('G Dm'));
assert.ok(dorian.candidates.some(x=>x.tonic===2&&x.mode==='dorian'&&x.compatible&&x.characterRetained));
assert.ok(E.modalIdentityEvidence(parse('Dm G Dm C'),parse('Bb Dm')).candidates.some(x=>x.mode==='dorian'&&!x.compatible));
assert.equal(E.modalIdentityEvidence(parse('Dm'),parse('G Dm')).candidates.length,0);
assert.ok(E.modalIdentityEvidence(parse('C D C Em'),parse('D C')).candidates.some(x=>x.tonic===0&&x.mode==='lydian'&&x.compatible));
assert.equal(E.internalChromaticEvidence(parse('Am'),parse('AmMaj7 Am7')).length,2);
assert.equal(E.internalChromaticEvidence(parse('Am'),parse('Am/E')).length,0);
const layers=E.composerLayerExercise(parse('Am F C G'),'herrmann');
assert.deepEqual(layers.lower.notes,parse('G')[0].notes);
assert.deepEqual(layers.upper.notes,layers.lower.notes.map(x=>(x+1)%12));
assert.equal(E.composerLayerExercise(parse('Am F C G7'),'herrmann'),null);
assert.equal(E.composerLayerExercise(parse('Am F C G'),'shore'),null);
assert.deepEqual(E.composerContinuations(p,'esperanza',''),E.emotionalContinuations(p,'esperanza'));
assert.equal(E.composerListeningPlan(E.parseUserProgression('Am').chords,{fullPreview:true,equalChordDuration:true}).status,'ready');
assert.equal(E.composerListeningPlan([...E.parseUserProgression('C G Am F Dm Em F G').chords,...E.parseUserProgression('Am F G').chords],{fullPreview:true,equalChordDuration:true}).status,'ready');
// The interpreted piano is an optional realization of the same harmony.
let pianoCases=0;
for(const raw of ['Am F C G','Dm7 G7 Cmaj7','Cmaj7#11 E/Bb Bm7b5','F#dim7','Dm G Dm C','C Cadd9 F/C C','Am Dm E7','C G Am F Dm Em F G']){
 const chords=parse(raw),neutral=E.composerListeningPlan(chords,{fullPreview:true,equalChordDuration:true}),fingerprints=new Set();
 for(const id of ids){
  const plan=E.composerPianoPerformance(chords,id);assert.equal(plan.status,'ready');
  assert.equal(plan.instrument,'piano');assert.equal(plan.totalSeconds,neutral.totalSeconds);
  assert.equal(plan.steps.length,chords.length);
  for(const [i,step] of plan.steps.entries()){
   assert.equal(step.pitches[0]%12,chords[i].bass);
   assert.deepEqual(step.pitches.map(p=>p%12),neutral.steps[i].pitches.map(p=>p%12));
  }
  for(const e of plan.events){
   assert.ok(Number.isFinite(e.frequency)&&e.startSeconds>=0&&e.durationSeconds>0&&e.startSeconds+e.durationSeconds<=plan.totalSeconds+1e-8);
   assert.ok(e.pitch>=21&&e.pitch<=108);
   for(const step of plan.steps)if(e.startSeconds<step.startSeconds+step.durationSeconds-1e-8&&e.startSeconds+e.durationSeconds>step.startSeconds+1e-8)assert.equal(e.pitch,step.pitches[e.voice]);
  }
  fingerprints.add(JSON.stringify(plan.events.map(e=>[e.pitch,e.startSeconds,e.durationSeconds,e.velocity])));
  pianoCases++;
 }
 assert.equal(fingerprints.size,11);
}
console.log('PASS '+pianoCases+' single-piano interpretations with preserved harmonic pitch classes');
console.log('PASS '+count+' composer-continuation cases, original intact, 11 distinct profiles in 12 transpositions, open and arrival targets');