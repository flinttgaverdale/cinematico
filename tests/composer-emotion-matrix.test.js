// Smoke test all composer x emotion combinations without browser or MIDI.
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const html=fs.readFileSync(path.join(__dirname,"..","index.html"),"utf8");
const sandbox={};sandbox.globalThis=sandbox;
vm.runInNewContext(fs.readFileSync(path.join(__dirname,"..","engine.js"),"utf8"),sandbox);
const engine=sandbox.CinematicoEngine;
const modeStart=html.indexOf("const MODES=");
const modeEnd=html.indexOf("const CHORD_TYPES=",modeStart);
const profilesStart=html.indexOf("const EMOTIONS=");
const profilesEnd=html.indexOf("function keyNameForPc(",profilesStart);
assert.ok(modeStart>=0&&modeEnd>modeStart&&profilesStart>=0&&profilesEnd>profilesStart);
const data=vm.runInNewContext(html.slice(modeStart,modeEnd)+html.slice(profilesStart,profilesEnd)+";({MODES,EMOTIONS,COMPOSERS})");
const keys=[0,2,5,9],results=[];
for(const tonic of keys)for(const [emotionId,emotion] of Object.entries(data.EMOTIONS))for(const [composerId,composer] of Object.entries(data.COMPOSERS)){
 const em=engine.buildProfileProgression(emotion.steps,tonic,data.MODES[emotion.mode],"C");
 const co=engine.buildProfileProgression(composer.signature,tonic,data.MODES[composer.signatureMode],"C");
 assert.equal(em.length,emotion.steps.length,emotionId);
 assert.equal(co.length,composer.signature.length,composerId);
 for(const chord of [...em,...co]){
  assert.ok(Number.isInteger(chord.root)&&chord.root>=0&&chord.root<12,emotionId+"/"+composerId);
  assert.ok(chord.notes.length>=2&&chord.notes.every(n=>Number.isInteger(n)&&n>=0&&n<12),emotionId+"/"+composerId);
 }
 results.push({tonic,emotionId,composerId,emotionRoots:em.map(c=>c.root).join(","),composerRoots:co.map(c=>c.root).join(",")});
}
assert.equal(results.length,4*12*11);
const composerUnique=new Set(results.filter(r=>r.tonic===0&&r.emotionId==="alegria").map(r=>r.composerRoots)).size;
const emotionUnique=new Set(results.filter(r=>r.tonic===0&&r.composerId==="williams").map(r=>r.emotionRoots)).size;
console.log("Composer/emotion smoke matrix passed:",results.length,"combinations;");
console.log("Unique composer root paths:",composerUnique,"of 11; unique emotion root paths:",emotionUnique,"of 12.");
