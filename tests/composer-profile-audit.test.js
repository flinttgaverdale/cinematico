// Run with: node tests/composer-profile-audit.test.js
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const context={};context.globalThis=context;
vm.runInNewContext(fs.readFileSync(require("node:path").join(__dirname,"..","engine.js"),"utf8"),context);
const audit=context.CinematicoEngine.composerProfileAudit;
const chord=(d,a=0,q="minor")=>({d,a,q,e:""});
const profiles={
 first:{name:"A",signatureMode:"aeolian",signature:[chord(0),chord(1,-1,"major"),chord(0)]},
 duplicate:{name:"B",signatureMode:"aeolian",signature:[chord(0),chord(1,-1,"major"),chord(0)]},
 distinct:{name:"C",signatureMode:"aeolian",signature:[chord(0),chord(4),chord(1,-1,"major"),chord(0)]},
 differentMode:{name:"D",signatureMode:"phrygian",signature:[chord(0),chord(1,-1,"major"),chord(0)]}
};
const result=audit(profiles);
assert.equal(result.profiles.length,4);
assert.equal(result.identical.length,1);
assert.equal(result.identical[0].a,"first");
assert.equal(result.identical[0].b,"duplicate");
assert.ok(!result.identical.some(p=>p.a==="distinct"||p.b==="distinct"));
assert.ok(!result.identical.some(p=>p.a==="differentMode"||p.b==="differentMode"));
assert.equal(audit({}).pairs.length,0);
console.log("Composer profile audit tests passed");
