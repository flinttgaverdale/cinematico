const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const sandbox={};sandbox.globalThis=sandbox;
vm.runInNewContext(fs.readFileSync(path.join(__dirname,"..","engine.js"),"utf8"),sandbox);
const api=sandbox.CinematicoEngine;
for(const input of ["H7","C/G#","Am F ? G","C ".repeat(17)]){
 const result=api.parseUserProgression(input);
 assert.equal(result.chords.length,0,"Invalid progression must not yield partial results");
 assert.ok(result.errors.length>0,"Invalid progression must explain the problem");
}
assert.equal(api.parseUserProgression("").chords.length,0);
for(const input of ["Am F C G","Cmaj7 G7 Fadd9","C/E F/A G/B"]){
 const result=api.parseUserProgression(input);
 assert.equal(result.errors.length,0,input);
 assert.ok(result.chords.length>0,input);
}
const progression=api.parseUserProgression("Am F C G").chords;
for(const count of [3,4]){
 const original=api.laboratoryVoices(progression,{count,style:"cinematic"});
 assert.equal(original.voicings.length,4);
 const pitch=original.voicings[0][0];
 const locked=api.laboratoryVoices(progression,{count,style:"cinematic",locks:{0:{0:pitch}}});
 assert.equal(locked.voicings[0][0],pitch,"A valid bass lock must be honored");
 const impossible=api.laboratoryVoices(progression,{count,style:"cinematic",locks:{0:{0:127}}});
 assert.equal(impossible.voicings.length,0,"An impossible lock must not be silently ignored");
 assert.ok(impossible.warning,"An impossible lock must explain the failure");
}
console.log("Input validation and manual voice lock cases passed");
