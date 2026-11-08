// Verify composer continuity analysis never claims actual voice movement.
// Run: node tests/composer-continuity-regression.cjs
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const context={};
vm.runInNewContext(fs.readFileSync(path.join(root,'engine.js'),'utf8'),context);
const E=context.CinematicoEngine;
const ids=Object.keys(E.COMPOSER_CREATIVE_LENSES);
const keys=['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
const normalize=p=>((p%12)+12)%12;
let totalRoutes=0,totalLinks=0,recognized=0;
for(const id of ids){
 for(let tonic=0;tonic<12;tonic++){
  const snapshot=JSON.stringify(E.COMPOSER_CREATIVE_LENSES[id]);
  const outcome=E.composerCreativePaths(id,tonic,keys[tonic]);
  for(const route of outcome.paths){
   const diag=route.insights,links=route.chords.length-1;
   assert.equal(diag.transitions.length,links,id);
   assert.equal(diag.returnToCenter,route.chords.at(-1).root===tonic);
   assert.equal(diag.chromaticCount,route.chords.filter(c=>c.chromatic).length);
   assert.equal(diag.sharedLinkCount,diag.transitions.filter(t=>t.commonCount>=2).length);
   assert.match(diag.scope,/no se han supuesto octavas/);
   for(let i=0;i<links;i++){
    const a=route.chords[i],b=route.chords[i+1],info=diag.transitions[i];
    const aPcs=new Set(a.notes.map(normalize));
    const bPcs=new Set(b.notes.map(normalize));
    const intersection=[...aPcs].filter(p=>bPcs.has(p));
    assert.equal(info.commonCount,intersection.length,'Do not infer actual voicing');
    assert.equal(info.common.length,intersection.length);
    if(info.operator){
      recognized++;
      assert.ok(['P','L','R'].includes(info.operator));
      const t=E.neoTransform(a.root,a.quality,info.operator);
      assert.equal(t.target.root,b.root);
      assert.equal(t.target.quality,b.quality);
      assert.equal(t.common.length,2);
      assert.ok(info.motion&&[1,2].includes(Math.abs(info.motion.semitones)));
      assert.match(info.explanation,/notas comunes/);
    }
    if(info.motion){
      assert.equal(aPcs.size,bPcs.size);
      assert.equal(info.commonCount,aPcs.size-1,'Single-note motion has a unique removed and added note');
    }
    totalLinks++;
   }
   totalRoutes++;
  }
  assert.equal(JSON.stringify(E.COMPOSER_CREATIVE_LENSES[id]),snapshot,'No mutation of reference material');
 }
}
assert.equal(totalRoutes,264,'11 composers × 2 routes × 12 key classes');
const key0=E.composerCreativePaths('horner',0,'C');
assert.equal(key0.paths[0].insights.transitions.map(t=>t.operator).join(''), 'PLR');
assert.equal(key0.paths[1].insights.transitions.map(t=>t.operator).join(''), 'RLP');
assert.equal(key0.paths[0].insights.transitions[0].motion.from,'E♭');
assert.equal(key0.paths[0].insights.transitions[0].motion.to,'E');
assert.equal(key0.paths[0].insights.transitions[1].motion.from,'C');
assert.equal(key0.paths[0].insights.transitions[1].motion.to,'B');
assert.equal(key0.paths[0].insights.transitions[2].motion.from,'E');
assert.equal(key0.paths[0].insights.transitions[2].motion.to,'D');
const newman=E.composerCreativePaths('newman',0,'C');
assert.equal(newman.paths[0].insights.returnToCenter,true);
assert.equal(newman.paths[1].insights.returnToCenter,false);
const silvestri=E.composerCreativePaths('silvestri',0,'C');
assert.equal(silvestri.paths[0].chords[0].label,'Cmaj7#11');
assert.equal(silvestri.paths[0].insights.transitions[0].operator,null,'Extended chords are not P/L/R');
assert.deepEqual(Object.keys(E.composerRouteInsights([],0)).sort(),['chromaticCount','ending','returnToCenter','sharedLinkCount','transitions'].sort());
const h=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert.match(h,/class="composer-path-arrow/);
assert.match(h,/composer-path-analysis/);
assert.match(h,/link\.operator/);
assert.match(h,/composer-path-contrast/);
assert.match(h,/Qué cambia entre los acordes/);
console.log('PASS composer continuity: '+totalRoutes+' routes, '+totalLinks+' observable links, '+recognized+' P/L/R links, no asserted voice leading.');
