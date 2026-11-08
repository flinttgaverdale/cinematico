// Source-grounded research: structural claims must remain distinct from speculative
// formal/melodic/audiovisual inference. This is NOT a score transcription.
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=path.join(__dirname,"..");
const records=JSON.parse(fs.readFileSync(path.join(root,"research/score-microanalysis-phase1-2026-11-08.json"),"utf8"));
const sandbox={};vm.runInNewContext(fs.readFileSync(path.join(root,"engine.js"),"utf8"),sandbox);
const E=sandbox.CinematicoEngine;
const mod=x=>(x%12+12)%12;
const sorted=a=>Array.from(a).map(mod).sort((a,b)=>a-b);
const parse=s=>{const p=E.parseUserProgression(s);assert.equal(p.errors.length,0,s);return p.chords;};
assert.equal(records.caseStudies.length,4);
assert.equal(records.negativeControls.length,5);
assert.equal(records.caseStudies.reduce((sum,study)=>sum+study.observed.length,0),13);
for(const study of records.caseStudies){
 assert.ok(study.evidence==="A"||study.evidence==="B");
 assert.match(study.source.url,/^https:\/\//);
 assert.ok(study.observed.every(o=>o.tag&&o.interpretation));
 assert.ok(study.cannotAssert.length>0,"State limits of inference for "+study.composer);
}
const sil=records.caseStudies.find(s=>s.id==="silvestri-back-to-the-future");
const fifth=sil.observed.find(o=>o.tag==="lydian-melodic-inflection");
assert.equal(mod(fifth.melodicRaisedFourthPc-fifth.tonalCenterPc),6);
assert.equal(mod(fifth.followingFifthPc-fifth.tonalCenterPc),7);
assert.equal(mod(fifth.followingFifthPc-fifth.melodicRaisedFourthPc),1);
const tritone=E.tritoneTriadRelations(parse("Bb E"));
assert.equal(tritone.length,1);
assert.equal(tritone[0].majorMajor,true);
assert.equal(tritone[0].sharedPitchClasses.length,0);
const sb=E.triadicLayeringHypotheses({notes:sil.observed.find(o=>o.tag==="triads-a-tritone").unionPcs});
assert.ok(sb.some(h=>h.layers.some(x=>x.root==="E")&&h.layers.some(x=>x.root==="A#")),
 "A compatible pitch-class partition is NOT evidence of simultaneous performance");
assert.ok(sb.every(h=>h.caveat.includes("simultaneidad")));
const oct=[0,2,3,5,6,8,9,11];
const family=[0,1,2].map(t=>new Set(oct.map(x=>mod(x+t))));
const observed=new Set(sil.observed.find(o=>o.tag==="triads-a-tritone").unionPcs);
assert.equal(observed.size,6,"Six classes, not a complete eight-note collection");
assert.equal(family.filter(f=>[...observed].every(pc=>f.has(pc))).length,1,
 "The tritone triads fit one octatonic collection, but do not prove a passage is octatonic");
const horner=records.caseStudies.find(s=>s.id==="horner-beautiful-mind");
const s=horner.observed.find(o=>o.tag==="SLIDE-sequential");
const op=E.neoTransform(s.from.root,s.from.quality,s.operation);
assert.equal(op.target.root,s.to.root);
assert.equal(op.target.quality,s.to.quality);
assert.deepEqual(sorted(op.common),sorted(s.commonPcs));
assert.equal(op.movements.length,2);
const union=horner.observed.find(o=>o.tag==="SLIDEJOIN-simultaneous").unionPcs;
assert.equal(new Set(union).size,5,"SLIDEJOIN is five simultaneous pitch classes, not two consecutive chords");
const layered=E.triadicLayeringHypotheses({notes:union});
assert.ok(layered.some(h=>h.layers.some(x=>x.quality==="minor"&&x.root==="A")&&
 h.layers.some(x=>x.quality==="major"&&x.root==="G#")));
assert.equal(E.tritoneTriadRelations(parse("Am Ab")).length,0);
const herr=records.caseStudies.find(s=>s.id==="herrmann-vertigo");
const mm=E.parseUserProgression("EbmMaj7").chords[0];
assert.equal(mm.type,"mMaj7");
assert.deepEqual(sorted(mm.notes),sorted(herr.observed.find(o=>o.tag==="minor-major-seventh").structuralPcs));
assert.ok(!mm.notes.includes(0),"Melodic C is not automatically a fifth harmonic class of EbmMaj7");
const wills=records.caseStudies.find(s=>s.id==="williams-binary-sunset");
const db=E.parseUserProgression("Db/G").chords[0];
assert.equal(db.bassKind,"independent");
assert.equal(db.root,wills.observed[0].triadRoot);
assert.equal(db.bass,wills.observed[0].bassPc);
assert.ok(!db.notes.includes(db.bass),"Independent G bass must not become a Db triad tone");
assert.equal(E.tonalHypotheses([db]).status,"insufficient",
 "One chord cannot demonstrate Williams's notated half cadence");
const ep=E.parseUserProgression("Bbmaj7#11");
assert.equal(ep.errors.length,0);
assert.ok(ep.chords[0].notes.includes(4));
console.log("PASS score microanalysis: four source-annotated passages, 13 observations, two distinct layering models, Lydian inflection and formal caveats.");
