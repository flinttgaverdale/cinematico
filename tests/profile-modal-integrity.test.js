// Run with: node tests/profile-modal-integrity.test.js
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const html=fs.readFileSync(path.join(__dirname,"..","index.html"),"utf8");
const engineSource=fs.readFileSync(path.join(__dirname,"..","engine.js"),"utf8");
const sandbox={};sandbox.globalThis=sandbox;
vm.runInNewContext(engineSource,sandbox);
const start=html.indexOf("const EMOTIONS=");
const end=html.indexOf("function keyNameForPc(",start);
assert.ok(start>0&&end>start,"Profiles are present");
const profiles=vm.runInNewContext(html.slice(start,end)+";({EMOTIONS,COMPOSERS})");
const {EMOTIONS,COMPOSERS}=profiles;
assert.equal(Object.keys(COMPOSERS).length,11);
assert.equal(Object.keys(EMOTIONS).length,12);
const intervals={ionian:[0,2,4,5,7,9,11],aeolian:[0,2,3,5,7,8,10],phrygian:[0,1,3,5,7,8,10],mixolydian:[0,2,4,5,7,9,10],dorian:[0,2,3,5,7,9,10],lydian:[0,2,4,6,7,9,11]};
for(const [group,entries,field] of [["composer",COMPOSERS,"signature"],["emotion",EMOTIONS,"steps"]]){
 for(const [id,profile] of Object.entries(entries)){
  const mode=profile.signatureMode||profile.mode;
  assert.ok(intervals[mode],group+" "+id+" unknown mode "+mode);
  for(const step of profile[field]){
   assert.ok(Number.isInteger(step.d)&&step.d>=0&&step.d<7,group+" "+id+" invalid degree");
   assert.ok(Number.isInteger(step.a),group+" "+id+" invalid alteration");
  }
 }
}
const root=(profile,field,index)=>{const mode=profile.signatureMode||profile.mode;const s=profile[field][index];return (intervals[mode][s.d]+s.a+12)%12;};
assert.equal(root(EMOTIONS.heroismo,"steps",1),10,"Mixolydian bVII is ten semitones above tonic");
assert.equal(root(EMOTIONS.oscuridad,"steps",1),1,"Phrygian bII is one semitone above tonic");
assert.equal(root(EMOTIONS.misterio,"steps",1),8,"Aeolian bVI is eight semitones above tonic");
for(const id of ["zimmer","goransson"])assert.equal(root(COMPOSERS[id],"signature",1),8,id+" bVI");
assert.equal(root(COMPOSERS.shore,"signature",1),5,"Shore iv root");
assert.equal(root(COMPOSERS.shore,"signature",2),5,"Shore IV root");
const audit=sandbox.CinematicoEngine.composerProfileAudit(COMPOSERS);
assert.equal(audit.identical.length,0,"No identical composer signatures");
console.log("Modal integrity and composer differentiation tests passed");
