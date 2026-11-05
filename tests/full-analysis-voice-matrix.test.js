// Exercise the same analyze() entry point used by the browser, plus both voice counts.
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const html=fs.readFileSync(path.join(__dirname,"..","index.html"),"utf8");
const sandbox={};sandbox.globalThis=sandbox;
vm.runInNewContext(fs.readFileSync(path.join(__dirname,"..","engine.js"),"utf8"),sandbox);
const api=sandbox.CinematicoEngine;
const start=html.indexOf("const NOTE_SHARP="),modeEnd=html.indexOf("const CHORD_TYPES=",start);
const profilesStart=html.indexOf("const EMOTIONS="),profilesEnd=html.indexOf("function keyNameForPc(",profilesStart);
assert.ok(start>=0&&modeEnd>start&&profilesStart>=0&&profilesEnd>profilesStart);
const {MODES,EMOTIONS,COMPOSERS,KEYS_SHARP,MODULATIONS}=vm.runInNewContext(html.slice(start,modeEnd)+html.slice(profilesStart,profilesEnd)+";({MODES,EMOTIONS,COMPOSERS,KEYS_SHARP,MODULATIONS})");
const data={MODES,KEYS_SHARP,MODULATIONS,keyNameForPc:pc=>Object.keys(api.PC).find(k=>api.PC[k]===pc)||"C"};
let analyses=0,voiceChecks=0;
for(const tonic of [0,2,5,9])for(const [emotionId,emotion] of Object.entries(EMOTIONS))for(const [composerId,composer] of Object.entries(COMPOSERS)){
 const label=[tonic,emotionId,composerId].join("/");
 const before=JSON.stringify({emotion,composer});
 const analysis=api.analyze(tonic,emotion,composer,null,data);
 assert.equal(analysis.scale.length,7,label);
 assert.equal(analysis.chords.length,7,label);
 assert.equal(analysis.progression.length,emotion.steps.length,label);
 assert.equal(JSON.stringify({emotion,composer}),before,"Analysis must not mutate composer or emotion: "+label);
 analyses++;
 for(const count of [3,4]){
  const result=api.laboratoryVoices(analysis.progression,{count,style:"cinematic"});
  assert.equal(result.voicings.length,analysis.progression.length,label+"/"+count);
  assert.ok(result.voicings.every(v=>v.length===count),label+"/"+count);
  assert.equal(result.transitions.length,analysis.progression.length-1,label+"/"+count);
  voiceChecks++;
 }
}
console.log("Full analysis and voice lab matrix passed",analyses,"analyses",voiceChecks,"voice lab cases");
