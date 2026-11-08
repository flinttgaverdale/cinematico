'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),ctx={};
vm.runInNewContext(fs.readFileSync(path.join(root,'engine.js'),'utf8'),ctx);
const E=ctx.CinematicoEngine;
const doc=JSON.parse(fs.readFileSync(path.join(root,'research/expressive-listening-pairs-v1.json'),'utf8'));
assert.match(doc.metadata.status,/Not audience research/);
assert.equal(doc.cases.length,15,'Exactly fifteen existing creative intentions');
assert.equal(new Set(doc.cases.map(x=>x.id)).size,15);
assert.deepEqual(doc.cases.map(x=>x.id).sort(),Object.keys(E.EMOTION_CREATIVE_PROFILES).sort());
assert.ok(doc.controls.equalDuration&&doc.controls.equalDynamics&&doc.controls.equalRegister);
assert.ok(doc.controls.randomizeAB&&doc.controls.askPreferenceBeforeLabel);
for(const item of doc.cases){
 assert.equal(item.claimLevel,'C',item.id+' cannot claim validated affect');
 assert.equal(item.listenRequired,true);
 assert.equal(item.family,E.emotionNeighborhood(item.id).id);
 assert.notEqual(item.a.join(' '),item.b.join(' '));
 for(const symbols of [item.source,item.a.join(' '),item.b.join(' ')]){
  const parsed=E.parseUserProgression(symbols);
  assert.equal(parsed.errors.length,0,item.id+' '+symbols+' '+parsed.errors.join(' / '));
 }
 assert.equal(item.a.length,3);
 assert.equal(item.b.length,3);
 assert.ok(item.question.length>20);
}
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert.equal((html.match(/data-quick-intent="/g)||[]).length,4);
assert.equal((html.match(/data-study-open="/g)||[]).length,3);
console.log('PASS: 15 evidence-aware listening probes, correct neighborhoods, 30 playable paths, no new UI or false affect claims');
