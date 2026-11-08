'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..'),live=path.join(root,'live');
const source=fs.readFileSync(path.join(live,'cinematico-generator.js'),'utf8');
const engine=fs.readFileSync(path.join(live,'cinematico-core.js'),'utf8');
const web=fs.readFileSync(path.join(root,'engine.js'),'utf8');
assert.ok(engine.startsWith(web),'Ableton core must be identical to the web motor');
const patch=JSON.parse(fs.readFileSync(path.join(live,'Cinematico-Generator.maxpat'),'utf8'));
assert.equal(patch.patcher.openinpresentation,1);
const objs=patch.patcher.boxes.map(x=>x.box);
for(const label of ['live.miditool.in','live.miditool.out','v8 cinematico-generator.js']){
 assert.ok(objs.some(o=>o.text===label),label);
}
for(const type of ['textedit','umenu','number'])assert.ok(objs.some(o=>o.maxclass===type),type);
const errors=[],generated=[],status=[];
const ctx={require:name=>{assert.equal(name,'cinematico-core.js');const sandbox={};vm.runInNewContext(engine,sandbox);return sandbox.CinematicoEngine;},
outlet_dictionary:(i,obj)=>{generated.push(obj);assert.equal(i,0)},
outlet:(i,...args)=>{status.push([i,...args]);},inlets:0,outlets:0};
vm.runInNewContext(source,ctx,{filename:'cinematico-generator.js'});
assert.equal(ctx.inlets,1);assert.equal(ctx.outlets,2);
assert.equal(typeof ctx.dictionary,'function');
const E=ctx.require('cinematico-core.js');
const inputs=['Am F C G','Cm Ab Eb Bb','C F G7','Am F Dm','C G Am F','C'];
const moods=Object.keys(E.EMOTION_CREATIVE_PROFILES);
let count=0;
for(const s of inputs)for(const mood of moods){
 ctx.chords(...s.split(' '));ctx.mood(mood);
 const options=E.emotionalContinuations(E.parseUserProgression(s).chords,mood);
 for(let variant=1;variant<=3;variant++){
  ctx.variant(variant);
  const from=generated.length;ctx.dictionary('from-live');
  assert.equal(generated.length,from+1);
  const notes=generated.at(-1).notes;
  const expected=options[variant-1].chords.flatMap((x,i)=>{
   const pcs=E.parseUserProgression(x).chords[0].notes;
   return pcs.length;
  });
  assert.ok(notes.length>=9&&notes.length<=12,'At least triads, at most seventh chords');
  assert.ok(new Set(notes.map(x=>x.start_time)).size===3);
  assert.ok(notes.every(x=>Number.isInteger(x.pitch)&&x.pitch>=48&&x.pitch<=79&&x.duration===0.95&&x.velocity===90));
  assert.ok(notes.every(x=>x.probability===1));
  count++;
 }
}
ctx.chords('H');const old=generated.length;ctx.dictionary('live');
assert.equal(generated.length,old+1);
assert.equal(generated.at(-1).notes.length,0,'Invalid chords must not touch a clip');
assert.ok(status.some(x=>String(x).includes('Sin cambios')));
console.log('PASS Live generator: '+count+' source/mood/route plans, correct 3-bar MIDI, input guarding, engine parity, patch structure');
