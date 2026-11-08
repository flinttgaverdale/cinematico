// Context and composer-route comparisons: observable evidence, not aesthetic labels.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const context={};
vm.runInNewContext(fs.readFileSync(path.join(root,'engine.js'),'utf8'),context);
const E=context.CinematicoEngine;
const parse=s=>{
 const result=E.parseUserProgression(s);
 assert.equal(result.errors.length,0,s);
 return result.chords;
};
const examples=[
 ['C D7 G C','tonicización local'],
 ['Am Dm E7 Am','sensible elevada'],
 ['Dm G7 C','cadencia formal'],
 ['C F G7','posible dominante'],
];
for(const [progression,phrase] of examples){
 const chords=parse(progression),before=JSON.stringify(chords);
 const context=E.harmonicContextSummary(chords);
 assert.ok(context.center&&context.observations.length>0,progression);
 assert.ok(context.observations.join(' ').includes(phrase),progression+' missing '+phrase);
 assert.equal(JSON.stringify(chords),before,'Context summary must not mutate user material');
 assert.match(context.caveat,/melodía, ritmo, duraciones/);
}
assert.equal(E.harmonicContextSummary([]).status,'empty');
assert.ok(!E.harmonicContextSummary(parse('C G7 C')).observations.some(x=>x.includes('sensible elevada')),
 'Major tonic must not be confused with minor raised leading tone');
const keys=['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
for(const id of Object.keys(E.COMPOSER_CREATIVE_LENSES)){
 for(let tonic=0;tonic<12;tonic++){
  const study=E.composerCreativePaths(id,tonic,keys[tonic]);
  const before=JSON.stringify(study);
  const comparison=E.composerRouteComparison(study.paths);
  assert.ok(comparison&&comparison.message.length>35,id+' '+tonic);
  assert.ok(comparison.limitation.includes('no se deduce'),id);
  assert.equal(JSON.stringify(study),before,'Comparison must be non-destructive');
 }
}
const giacchino=E.composerRouteComparison(E.composerCreativePaths('giacchino',0,'C').paths);
assert.equal(giacchino.dimension,'color');
assert.equal(giacchino.sameRoots,true);
assert.equal(giacchino.changedColors,4);
const horner=E.composerRouteComparison(E.composerCreativePaths('horner',0,'C').paths);
assert.equal(horner.dimension,'transformation');
assert.equal(horner.operators[0],'P–L–R');
assert.equal(horner.operators[1],'R–L–P');
assert.equal(E.composerRouteComparison([]),null);
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert.ok(html.includes('composerRouteComparison(study.paths)'));
assert.ok(html.includes('harmonicContextSummary(userMaterial)'));
assert.ok(html.includes('Lectura de contexto'));
console.log('PASS: harmonic context and comparative composer lenses (11 profiles, 12 keys, 4 contextual counterexamples).');
