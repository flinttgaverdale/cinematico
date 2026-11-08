// Independent bass, metrically unverified sus4 gestures, and neo-Riemannian SLIDE.
const assert=require("node:assert/strict");
const fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const ctx={};vm.runInNewContext(fs.readFileSync(path.join(__dirname,"../engine.js"),"utf8"),ctx);
const E=ctx.CinematicoEngine,mod=n=>(n%12+12)%12;
const parse=s=>{const r=E.parseUserProgression(s);assert.equal(r.errors.length,0,s);return r.chords;};
const parts=parse("C/Bb C/E Cmadd9 G7sus4 G7 C");
assert.equal(parts[0].bassKind,"independent");
assert.equal(parts[0].bass,10);
assert.ok(!parts[0].notes.includes(10),"The foreign bass is not a new chord tone");
assert.equal(parts[1].bassKind,"inversion");
assert.ok(parts[2].notes.includes(3)&&!parts[2].notes.includes(4),"madd9 must retain its minor third");
assert.equal(parts[3].type,"7sus4");
for(const name of ["C/Bb","Cmaj7/Bb","C9/Eb","Cmaj7#11/G#"]){
 const chord=parse(name)[0],literal=JSON.stringify(chord),candidates=E.voicingCandidates(chord);
 assert.ok(candidates.length>0,"No four voice candidates for "+name);
 assert.ok(candidates.every(v=>v.length===4&&mod(v[0])===chord.bass),name);
 assert.equal(E.voiceLead([chord,chord]).voicings.length,2);
 assert.equal(JSON.stringify(chord),literal,"The supplied chord must not be rewritten");
}
const three=E.laboratoryVoices(parse("C/Bb F/A G7 C"),{count:3,style:"cinematic"});
assert.equal(three.voicings.length,4,"The three-voice realization must support a chromatic bass");
assert.equal(mod(three.voicings[0][0]),10);
const [sus,dom]=parse("G7sus4 G7");
const good=E.suspensionGestureDiagnostics([43,53,55,60],[43,53,55,59],sus,dom,"classical");
assert.equal(good.resolved,1);
assert.equal(good.penalty,0);
assert.ok(good.observations[0].text.includes("preparación y acento no comprobados"));
const bad=E.suspensionGestureDiagnostics([43,53,55,60],[43,53,55,62],sus,dom,"classical");
assert.equal(bad.unresolved,1);
assert.ok(bad.penalty>0);
const other=parse("Gsus4 C");
assert.equal(E.suspensionGestureDiagnostics([43,55,60],[48,55,64],other[0],other[1]).observations.length,0);
assert.ok(E.harmonicResolutionDiagnostics([43,53,55,60],[43,53,55,59],sus,dom).observations.some(o=>o.kind==="sus4-to-third"));
assert.equal(E.voiceLead(parse("G7sus4 G7 C"),"cinematic").voicings.length,3);
for(let root=0;root<12;root++)for(const mode of ["major","minor"]){
 const f=E.neoTransform(root,mode,"S");
 assert.equal(f.common.length,1);
 assert.equal(f.movements.length,2);
 assert.ok(f.movements.every(m=>Math.abs(m.semitones)===1));
 const back=E.neoTransform(f.target.root,f.target.quality,"S");
 assert.equal(back.target.root,root);
 assert.equal(back.target.quality,mode);
}
assert.equal(E.neoTransform(0,"major","S").target.root,1);
assert.equal(E.neoTransform(1,"minor","S").target.root,0);
for(const op of ["P","L","R"]){
 const result=E.neoTransform(0,"major",op);
 assert.equal(result.common.length,2);
 assert.equal(result.movements.length,1);
}
assert.ok(fs.readFileSync(path.join(__dirname,"../index.html"),"utf8").includes('<option value="S">S · SLIDE</option>'));
console.log("PASS independent bass, sus4 gestures, minor add9 and SLIDE across 12 roots, without rewriting input.");
