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
const p=E.parseUserProgression('Am F C G').chords;
assert.deepEqual(E.composerContinuations(p,'esperanza',''),E.emotionalContinuations(p,'esperanza'));
assert.equal(E.composerListeningPlan(E.parseUserProgression('Am').chords,{fullPreview:true,equalChordDuration:true}).status,'ready');
assert.equal(E.composerListeningPlan([...E.parseUserProgression('C G Am F Dm Em F G').chords,...E.parseUserProgression('Am F G').chords],{fullPreview:true,equalChordDuration:true}).status,'ready');
console.log('PASS '+count+' composer-continuation cases, original intact, 11 distinct profiles in 12 transpositions');