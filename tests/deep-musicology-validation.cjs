// Musicological falsification suite: symbolic counterexamples, NOT score transcripts.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),ctx={};
vm.runInNewContext(fs.readFileSync(path.join(root,'engine.js'),'utf8'),ctx);
const E=ctx.CinematicoEngine;
const cases=JSON.parse(fs.readFileSync(path.join(root,'research/musicological-negative-controls-2026-11-08.json'),'utf8')).cases;
const audit=JSON.parse(fs.readFileSync(path.join(root,'research/musicological-evidence-audit-2026-11-08.json'),'utf8'));
const mod=n=>(n%12+12)%12;
const parse=label=>{
 const result=E.parseUserProgression(label);
 assert.equal(result.errors.length,0,label+' '+result.errors.join('; '));
 return result.chords;
};
const matches=(events,required)=>events.some(e=>required==='V7/'?e.kind.startsWith('V7/'):e.kind===required);
assert.equal(cases.length,22,'Frozen challenge set should have 22 original structural scenarios');
assert.equal(new Set(cases.map(x=>x.id)).size,cases.length);
let checked=0,requiredEvidence=0,forbiddenEvidence=0;
for(const scenario of cases){
 const source=parse(scenario.progression),snapshot=JSON.stringify(source);
 const sourceResult=E.cadenceEvidence(source,scenario.tonic,scenario.mode);
 for(const expected of scenario.required||[]){
  assert.ok(matches(sourceResult,expected),scenario.id+': missing '+expected);
  requiredEvidence++;
 }
 for(const absent of scenario.forbidden||[]){
  assert.ok(!matches(sourceResult,absent),scenario.id+': false positive '+absent);
  forbiddenEvidence++;
 }
 if(typeof scenario.raisedLeadingTone==='boolean')
  assert.equal(E.minorDominantEvidence(source,scenario.tonic).raisedLeadingTone,
   scenario.raisedLeadingTone,scenario.id);
 if(scenario.expectedTop){
  const result=E.tonalHypotheses(source);
  assert.equal(result.candidates[0].tonic,scenario.tonic,scenario.id);
  assert.equal(result.candidates[0].mode,scenario.expectedTop,scenario.id);
 }
 assert.ok(!sourceResult.some(x=>/perfecta|PAC confirmada|auténtica perfecta/i.test(x.kind)),
  'Chord symbols cannot certify a formal perfect authentic cadence');
 for(let shift=0;shift<12;shift++){
  const shifted=source.map(ch=>({...ch,root:mod(ch.root+shift),
   bass:mod(ch.bass+shift),notes:ch.notes.map(n=>mod(n+shift))}));
  const result=E.cadenceEvidence(shifted,mod(scenario.tonic+shift),scenario.mode);
  // Applied-dominant targets are re-spelled after transposition; compare
  // harmonic function, not the literal pitch name of the original key.
  for(const expected of scenario.required||[])
   assert.ok(expected.startsWith('V7/')?result.some(e=>e.kind.startsWith('V7/')):matches(result,expected),
    scenario.id+' transposition +'+shift+' missing '+expected);
  for(const absent of scenario.forbidden||[])
   assert.ok(!(absent.startsWith('V7/')?result.some(e=>e.kind.startsWith('V7/')):matches(result,absent)),
    scenario.id+' transposition +'+shift+' false '+absent);
  if(typeof scenario.raisedLeadingTone==='boolean')
   assert.equal(E.minorDominantEvidence(shifted,mod(scenario.tonic+shift)).raisedLeadingTone,
    scenario.raisedLeadingTone,scenario.id+' transposition +'+shift);
  checked++;
 }
 assert.equal(JSON.stringify(source),snapshot,scenario.id+' source mutated');
}
const major={int:[0,2,4,5,7,9,11]},minor={int:[0,2,3,5,7,8,10]};
const built=steps=>E.buildProfileProgression(steps,0,major,'C');
const plain=built([{d:0,q:'major',e:''},{d:3,q:'major',e:''}]);
const applied=built([{d:0,q:'major',e:'7'},{d:3,q:'major',e:''}]);
assert.equal(plain[0].classification,'diatonic','I-IV does not establish V/IV');
assert.equal(applied[0].classification,'secondaryDominant','I7-IV may act V7/IV');
const minorDominant=E.buildProfileProgression([{d:0,q:'minor'},{d:4,q:'major',e:'7'},{d:0,q:'minor'}],0,minor,'C');
assert.equal(minorDominant[1].classification,'modalDominant');
const horner=E.composerCreativePaths('horner',0,'C').paths;
assert.equal(horner[0].insights.transitions.map(x=>x.operator).join('–'),'P–L–R');
assert.equal(horner[1].insights.transitions.map(x=>x.operator).join('–'),'R–L–P');
// Score analyses can motivate an exercise; they do not turn that exercise into the score.
const oldLedger=audit.profiles.find(p=>p.id==='horner');
assert.match(oldLedger.observed,/NO es esa transcripción/);
assert.match(oldLedger.limit,/S documentada no es igual a P/);
// Two major triads a tritone apart fit a larger octatonic class, yet do not
// determine that collection uniquely. The check is set-theoretic only.
const octatonic=new Set([10,11,1,2,4,5,7,8]);
const paired=new Set([10,2,5,4,8,11]);
assert.ok([...paired].every(pc=>octatonic.has(pc)));
assert.ok(paired.size<octatonic.size);
assert.equal(audit.profiles.length,11);
assert.deepEqual([...audit.profiles.map(p=>p.id)].sort(),
 [...Object.keys(E.COMPOSER_CREATIVE_LENSES)].sort());
for(const record of audit.profiles){
 assert.match(record.source,/^https:\/\//);
 assert.ok(record.observed.length>90&&record.limit.length>70&&record.transfer.length>40,record.id);
 assert.ok(['A/B','B/C','C'].includes(record.level),record.id);
 assert.ok(record.observed!==record.transfer,'Observation cannot be its creative experiment');
 assert.ok(record.limit.match(/no |Sin |requiere|NO |no puede/i),record.id);
 assert.equal(record.source,E.COMPOSER_CREATIVE_LENSES[record.id].source,
  'App profile source must match the verified research ledger: '+record.id);
}
assert.equal(audit.methodology.independentHumanListeners,0,'Do not invent auditory validation');
assert.equal(audit.methodology.independentlyScoredCompleteFilmScores,0);
console.log('PASS deep musicology: '+cases.length+' negative-control scenarios × 12 transpositions = '+checked+
 ' formal cases; '+requiredEvidence+' required, '+forbiddenEvidence+
 ' forbidden clues; 11 documented composer dossiers, explicit out-of-scope claims.');
