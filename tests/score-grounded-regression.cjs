// Source-grounded interoperability tests. Passing proves parser/model consistency,
// NOT complete original score fidelity, emotion, film authorship or musical quality.
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const repo=path.join(__dirname,"..");
const corpus=JSON.parse(fs.readFileSync(path.join(repo,"research/score-evidence-corpus-2026-11-08.json"),"utf8"));
const context={};vm.runInNewContext(fs.readFileSync(path.join(repo,"engine.js"),"utf8"),context);
const E=context.CinematicoEngine;
assert.equal(corpus.profiles.length,11);
assert.equal(new Set(corpus.profiles.map(p=>p.id)).size,11);
assert.equal(corpus.coverage.originalFilmScoresReadInFull,0);
assert.equal(corpus.coverage.independentHumanListeningTests,0);
for(const source of corpus.profiles){
 assert.match(source.source,/^https:\/\//);
 assert.ok(corpus.provenanceLevels[source.evidence],source.id+" must have a valid evidence grade");
 assert.ok(source.notVerified&&source.verified,source.id+" must disclose verification boundaries");
}
const parser=s=>{const parsed=E.parseUserProgression(s);assert.equal(parsed.errors.length,0,s);return parsed.chords;};
const score=corpus.validationFixtures[0];
const chords=parser(score.input);
assert.deepEqual(Array.from(chords,c=>c.type),score.expectChordTypes);
assert.equal(chords[3].label,"G(sus4)");
assert.equal(chords[5].label,"C(sus4)");
assert.equal(chords[1].bassKind,"independent");
assert.equal(chords[1].bass,10);
assert.equal(chords[2].bassKind,"inversion");
assert.equal(chords[2].bass,9);
assert.equal(E.voiceLead(chords).voicings.length,chords.length);
assert.equal(E.laboratoryVoices(chords,{count:3,style:"cinematic"}).voicings.length,chords.length);
const sunset=parser(corpus.validationFixtures[1].input)[0];
assert.equal(sunset.bassKind,"independent");
assert.equal(sunset.root,1);
assert.equal(sunset.bass,7);
assert.ok(!sunset.notes.includes(sunset.bass),"Db/G is a triad over independent G, not an inversion");
const horner=corpus.validationFixtures[2],slide=E.neoTransform(horner.from.root,horner.from.quality,horner.operation);
assert.equal(slide.target.root,horner.to.root);
assert.equal(slide.target.quality,horner.to.quality);
assert.equal(slide.common.length,1);
const herrmann=corpus.validationFixtures[3];
assert.equal(parser(herrmann.input)[0].type,herrmann.expectChordTypes[0]);
const newman=corpus.validationFixtures[4];
const dorian=E.scale(newman.tonic,{int:[0,2,3,5,7,9,10]});
assert.ok(dorian.includes(newman.mustContainPc),"A natural should be available in C Dorian");
assert.ok(!E.scale(0,{int:[0,2,3,5,7,8,10]}).includes(9),"The aeolian sixth must not be confused with Dorian");
for(const root of ["C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B"]){
 for(const type of ["sus2","sus4"]){
  const label=root+"("+type+")",chord=parser(label)[0],plain=parser(root+type)[0];
  assert.equal(chord.label,label,"Notation must remain literal");
  assert.equal(chord.type,type);
  assert.deepEqual([...chord.notes],[...plain.notes]);
 }
}
assert.ok(E.parseUserProgression("G(sus5)").errors.length>0);
console.log("PASS music-score interoperability: 11 graded provenance records, five independently labeled references, 24 parenthesized suspensions, bass and modal tests.");
