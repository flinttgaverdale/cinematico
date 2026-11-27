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
assert.equal(typeof ctx.msg_dictionary,'function');
assert.equal(patch.patcher.project.amxdtype,1851877223,'Must be a MIDI Note Generator (nagg)');
assert.equal(patch.patcher.devicewidth,350,'The device must fit the Live clip-tool sidebar');
for(const box of patch.patcher.boxes.map(x=>x.box).filter(x=>x.presentation)){
 assert.ok(box.presentation_rect[0]+box.presentation_rect[2]<=350,'Clipped control '+box.id);
 assert.ok(box.presentation_rect[1]+box.presentation_rect[3]<=patch.patcher.openrect[3],'Clipped vertically '+box.id);
}
const E=ctx.require('cinematico-core.js');
const inputs=['Am F C G','Cm Ab Eb Bb','C F G7','Am F Dm','C G Am F','C',
 'Cmaj7#11 F#m/C# DmMaj7 G7/B','C/Bb F/A G7 C','F#dim7'];
const moods=Object.keys(E.EMOTION_CREATIVE_PROFILES);
let count=0;
for(const s of inputs)for(const mood of moods){
 const beforePreview=generated.length;
 ctx.chords(...s.split(' '));ctx.mood(mood);
 const options=E.composerContinuations(E.parseUserProgression(s).chords,mood);
 for(let variant=1;variant<=3;variant++){
  ctx.variant(variant);
  const from=generated.length;ctx.msg_dictionary({notes:[],clip:{}});
  assert.equal(from,beforePreview+variant-1,'The controls publish no MIDI before Apply');
  assert.equal(generated.length,from+1);
  const notes=generated.at(-1).notes;
  const selected=options[variant-1].chords;
  assert.deepEqual([...new Set(notes.map(x=>x.start_time))].sort((a,b)=>a-b),[0,4,8]);
  for(const [bar,label] of selected.entries()){
   const chord=E.parseUserProgression(label).chords[0];
   const pitches=Array.from(notes.filter(note=>note.start_time===bar*4),note=>note.pitch);
   assert.equal(Math.min(...pitches)%12,chord.bass,label+' bass');
   const actual=[...new Set(pitches.map(pitch=>pitch%12))].sort((a,b)=>a-b);
   const expected=[...new Set([...chord.notes,chord.bass])].sort((a,b)=>a-b);
   assert.deepEqual(actual,expected,label+' chord tones');
  }
  assert.ok(notes.every(x=>Number.isInteger(x.pitch)&&x.pitch>=0&&x.pitch<=127&&x.duration===3.75&&x.velocity===90));
  assert.ok(notes.every(x=>x.probability===1));
  assert.ok(notes.every(x=>x.start_time+x.duration<=x.start_time+4&&x.start_time+x.duration<=12));
  count++;
 }
}
ctx.variant(99);
ctx.msg_dictionary({notes:[]});
assert.equal(generated.at(-1).notes.length,0,'Invalid path must block Apply');
ctx.variant(1);
ctx.mood('invalid');
ctx.msg_dictionary({notes:[]});
assert.equal(generated.at(-1).notes.length,0,'Invalid mood must block Apply');
ctx.mood('esperanza');
ctx.msg_dictionary({notes:[]});
assert.ok(generated.at(-1).notes.length>0,'Valid controls must restore Apply');
ctx.chords('H');const old=generated.length;ctx.dictionary('live');
assert.equal(generated.length,old+1);
assert.equal(generated.at(-1).notes.length,0,'Invalid chords must not touch a clip');
assert.ok(status.some(x=>String(x).includes('Corrige los acordes')),'Invalid inputs should produce an understandable status');
console.log('PASS Live generator: '+count+' source/mood/route plans, correct 3-bar MIDI, input guarding, engine parity, patch structure');
