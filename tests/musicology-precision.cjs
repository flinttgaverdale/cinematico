// Musicological precision regression: observable harmony vs interpretation.
// Run: node tests/musicology-precision.cjs
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const c={};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../engine.js'),'utf8'),c);
const E=c.CinematicoEngine;
const parse=s=>{const p=E.parseUserProgression(s);assert.equal(p.errors.length,0,s);return p.chords;};
const top=s=>E.tonalHypotheses(parse(s)).candidates[0];
const center=(s,mood)=>E.emotionalContinuations(parse(s),mood);
assert.equal(E.minorDominantEvidence(parse('Am Dm E7 Am'),9).raisedLeadingTone,true);
assert.equal(E.minorDominantEvidence(parse('Cm Fm G7 Cm'),0).raisedLeadingTone,true);
assert.equal(E.minorDominantEvidence(parse('Am Dm Em Am'),9).raisedLeadingTone,false);
assert.equal(E.minorDominantEvidence(parse('C G7 C'),0).raisedLeadingTone,false,
 'The B of a C-major V7 must not be called a chromatically raised leading tone in C minor');
assert.equal(top('Am Dm E7 Am').label,'A menor natural'); // compatibility API
assert.equal(top('Am Dm E7 Am').displayLabel,'A menor'); // editorial UI
assert.equal(top('Dm G7 C').displayLabel,'C mayor');
assert.equal(top('C F G7').displayLabel,'C mayor');
assert.equal(top('C F G').displayLabel,'C mayor');
assert.equal(top('C D7 G C').displayLabel,'C mayor');
assert.equal(E.cadenceEvidence(parse('C D7 G C'),0,'mayor').some(x=>x.kind==='V7/G'),true);
assert.equal(E.cadenceEvidence(parse('C F#7 Bm'),0,'mayor').some(x=>x.kind.startsWith('V7/')),false);
assert.equal(E.cadenceEvidence(parse('C F G7'),0,'mayor').some(x=>x.kind==='tónica–predominante–V posible'),true);
const inverted=E.cadenceEvidence(parse('C G7/B C'),0,'mayor').find(x=>x.kind==='V–I/i');
assert.ok(inverted&&inverted.weight<2.5,'Inverted dominant is a weaker harmonic clue');
assert.equal(E.cadenceEvidence(parse('Dm G7 C'),0,'mayor').some(x=>/perfecta/i.test(x.kind)),false);
for(const [source,mood,target] of [
 ['C F G7','alegria','C mayor'],
 ['Am Dm E7','melancolia','A menor'],
 ['Am F C G','esperanza','C mayor'],
 ['Cm Abmaj7 Fm7 G7','misterio','C menor']
]){
 const base=parse(source),suggestions=center(source,mood);
 assert.equal(suggestions.length,3,source);
 assert.ok(suggestions.every(x=>x.suggestedCenter===target),source);
 assert.equal(new Set(suggestions.map(x=>x.chords.join(' '))).size,3,source);
 for(const idea of suggestions){
  assert.ok(idea.anchorBasis.length>0);
  assert.match(idea.explanation,/No se confirma tonalidad ni cadencia/);
  assert.ok(E.prepareContinuationForAnalysis(base,idea.chords).ok);
  assert.equal(E.parseUserProgression(idea.chords.join(' ')).errors.length,0);
 }
 assert.equal(base.map(x=>x.label).join(' '),source,"Never mutate the composer’s input");
}
assert.equal(center('C F G7','alegria')[0].chords.at(-1),'C');
for(let shift=0;shift<12;shift++){
 const chords=parse('Dm G7 C').map(ch=>({...ch,root:(ch.root+shift)%12,bass:(ch.bass+shift)%12,notes:ch.notes.map(n=>(n+shift)%12)}));
 assert.equal(E.tonalHypotheses(chords).candidates[0].tonic,shift,'Transposition invariant tonal reading');
}
const composers=Object.keys(E.COMPOSER_TECHNIQUES);
assert.ok(composers.length>=10,'Composer technique catalog should be populated');
for(const composer of composers){
 const suggestions=E.composerAssistance(composer,parse('Am F C G'));
 assert.ok(suggestions.length>0,composer);
 assert.ok(suggestions.every(t=>!t.changesOriginal&&t.evidenceLevel==='orientative'),composer);
}
console.log('PASS: musicological precision — minor context, cadence clues, applied V, transpositions, emotional continuations and composer attribution.');