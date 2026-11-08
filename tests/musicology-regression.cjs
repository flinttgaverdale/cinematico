// Focused musicological regression: separate minor tonic from natural-minor pitch collection.
// Run: node tests/musicology-regression.cjs
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const context={};
vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../engine.js'),'utf8'),context);
const E=context.CinematicoEngine;
function parse(s){const r=E.parseUserProgression(s);assert.equal(r.errors.length,0,s);return r.chords;}
const harmonicMinor=parse('Am Dm E7 Am');
const ev=E.minorDominantEvidence(harmonicMinor,9);
assert.equal(ev.raisedLeadingTone,true);
assert.equal(ev.dominantMajor,true);
assert.equal(ev.indices.join(','),'2');
assert.match(ev.description,/sensible elevada/);
assert.equal(E.minorDominantEvidence(parse('Am Dm Em Am'),9).raisedLeadingTone,false);
assert.equal(E.minorDominantEvidence(parse('C G7 C'),0).raisedLeadingTone,false);
const hypotheses=E.tonalHypotheses(harmonicMinor);
const aMinor=hypotheses.candidates.find(c=>c.tonic===9&&c.mode==='menor natural');
assert.ok(aMinor,'Minor tonic remains a candidate');
assert.equal(aMinor.minorDominant.raisedLeadingTone,true);
assert.ok(E.cadenceEvidence(parse('Dm G7 C'),0,'mayor').some(e=>e.kind==='predominante–V–I/i'));
assert.ok(E.cadenceEvidence(parse('C G7 Am'),0,'mayor').some(e=>e.kind==='V–vi'));
assert.ok(E.cadenceEvidence(parse('C F G'),0,'mayor').some(e=>e.kind==='semicadencia posible'));
assert.ok(!E.cadenceEvidence(parse('C G7 C'),0,'mayor').some(e=>/perfecta/i.test(e.kind)),'No formal perfect cadence from chord symbols alone');
for(const composer of Object.keys(E.COMPOSER_TECHNIQUES)){
 const techniques=E.composerAssistance(composer,parse('Am F C G'));
 assert.ok(techniques.length>0,composer);
 assert.ok(techniques.every(t=>t.changesOriginal===false),composer);
 assert.ok(techniques.every(t=>t.evidenceLevel==='orientative'),composer);
}
console.log('PASS: minor dominant evidence, cadence caution and non-destructive composer advice');
