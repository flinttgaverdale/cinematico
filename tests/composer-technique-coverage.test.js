const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const html=fs.readFileSync(path.join(__dirname,"..","index.html"),"utf8");
const context={};context.globalThis=context;
vm.runInNewContext(fs.readFileSync(path.join(__dirname,"..","engine.js"),"utf8"),context);
const a=html.indexOf("const COMPOSERS="),b=html.indexOf("function keyNameForPc(",a);
assert.ok(a>=0&&b>a);
const {COMPOSERS}=vm.runInNewContext(html.slice(a,b)+";({COMPOSERS})");
const api=context.CinematicoEngine;
const progression=api.parseUserProgression("Am F C G").chords;
const before=JSON.stringify(progression);
let count=0;
for(const [id,composer] of Object.entries(COMPOSERS)){
 const suggestions=api.composerAssistance(id,progression);
 assert.equal(suggestions.length,3,"Missing technique library for "+composer.name);
 assert.equal(new Set(suggestions.map(s=>s.id)).size,3,"Duplicate techniques: "+id);
 for(const technique of suggestions){
  for(const key of ["id","name","domain","reason","action","source","observation"]){
   assert.ok(typeof technique[key]==="string"&&technique[key].trim(),id+" missing "+key);
  }
  assert.equal(technique.changesOriginal,false,id+" must not change user's chords");
  count++;
 }
}
assert.equal(JSON.stringify(progression),before,"Technique suggestions must not mutate user material");
assert.equal(api.composerAssistance("unknown",progression).length,0);
const shore=api.composerAssistance("shore",progression).find(t=>t.id==="leitmotif");
assert.ok(shore.requiresMelody&&shore.observation.includes("no se ha detectado ningún motivo"));
const goransson=api.composerAssistance("goransson",progression).find(t=>t.id==="tempo");
assert.ok(goransson.requiresTiming&&goransson.observation.includes("No se han analizado duraciones"));
const newman=api.composerAssistance("newman",progression).find(t=>t.id==="space");
assert.ok(newman.requiresTiming&&newman.observation.includes("No se han analizado duraciones"));
const williams=api.composerAssistance("williams",progression).find(t=>t.id==="counterpoint");
assert.ok(williams.requiresMelody&&williams.observation.includes("comparten"));
console.log("Composer technique coverage passed:",Object.keys(COMPOSERS).length,"composers",count,"resources");
