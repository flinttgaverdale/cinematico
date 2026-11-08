'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..'),ctx={};
vm.runInNewContext(fs.readFileSync(path.join(root,'engine.js'),'utf8'),ctx);
const E=ctx.CinematicoEngine,html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const data=JSON.parse(fs.readFileSync(path.join(root,'research/emotion-harmony-evidence-2026-11-08.json'),'utf8'));
const groupData=data.creativeDesign.neighborhoods;
assert.equal(Object.keys(E.EXPRESSION_NEIGHBORHOODS).length,5,'Exactly five broad creative groups');
const expected=['misterio','melancolia','tension','esperanza','nostalgia','epica','tristeza','alegria','ternura','asombro','inquietud','suspense','oscuridad','calma','contraste'];
const appearances=[],groups=[];
for(const [key,group] of Object.entries(E.EXPRESSION_NEIGHBORHOODS)){
 groups.push(group.label);
 assert.ok(group.members.length>=2,'No one-emotion microscopic category');
 assert.equal(group.label,groupData.categories.find(x=>x.id===key)?.label,'Literature corpus and implementation agree');
 for(const mood of group.members){
  appearances.push(mood);
  assert.equal(E.emotionNeighborhood(mood).id,key,'Stable neighborhood label');
  assert.equal(E.emotionCreativeProfile(mood).neighborhoodId,key,'Existing creative profile keeps neighborhood');
  assert.equal(E.emotionCreativeProfile(mood).neighborhoodLabel,group.label);
  assert.match(E.emotionNeighborhood(mood).scope,/no equivale/);
  const neighbors=E.emotionNeighborhood(mood).relatedIntents;
  assert.ok(neighbors.length>=1);
  assert.ok(neighbors.every(x=>expected.includes(x)&&x!==mood));
  for(const other of group.members.filter(x=>x!==mood))
   assert.ok(neighbors.includes(other),mood+' must acknowledge '+other+' as nearby');
 }
}
assert.equal(appearances.length,expected.length,'No missing or duplicate emotion');
assert.deepEqual(appearances.slice().sort(),expected.slice().sort(),'All original 15 moods retained');
for(const [a,b] of E.EXPRESSION_BRIDGES){
 assert.ok(E.emotionNeighborhood(a).relatedIntents.includes(b),a+' ↔ '+b);
 assert.ok(E.emotionNeighborhood(b).relatedIntents.includes(a),b+' ↔ '+a);
}
const matcher=html.match(/<select id="simpleMood">([\s\S]*?)<\/select>/);
assert.ok(matcher,'Keep the optional select for composing');
const selectHtml=matcher[1];
const groupTags=[...selectHtml.matchAll(/<optgroup label="([^"]+)">([\s\S]*?)<\/optgroup>/g)];
assert.equal(groupTags.length,5,'Only five easy-to-understand optional groups, no new controls');
assert.deepEqual(groupTags.map(x=>x[1]),groups);
const found=[];
for(let i=0;i<groupTags.length;i++){
 const ids=[...groupTags[i][2].matchAll(/<option value="([^"]+)"(?: selected)?>([^<]+)<\/option>/g)].map(x=>x[1]);
 assert.deepEqual(ids.slice().sort(),Object.values(E.EXPRESSION_NEIGHBORHOODS)[i].members.slice().sort(),'UI must reflect internal taxonomy');
 found.push(...ids);
}
assert.deepEqual(found.slice().sort(),expected.slice().sort(),'Every optional nuance appears exactly once');
assert.equal((selectHtml.match(/ selected>/g)||[]).length,1,'One default nuance');
assert.match(selectHtml,/<option value="esperanza" selected>/,'Quick intent default remains aligned');
assert.equal((html.match(/data-quick-intent="/g)||[]).length,4,'The same four primary choices');
assert.equal((html.match(/data-study-open="/g)||[]).length,3,'The advanced study is still intentionally compact');
assert.ok(!html.includes('id="save"'),'No accidental notebook');
const origin=E.parseUserProgression('Am F C G').chords;
for(const mood of expected){
 const ideas=E.emotionalContinuations(origin,mood);
 assert.equal(ideas.length,3,mood);
 for(const proposal of ideas){
  assert.equal(proposal.expressiveProfile.neighborhoodId,E.emotionNeighborhood(mood).id);
  assert.equal(proposal.expressiveProfile.id,mood,'Family must not override user's requested nuance');
 }
}
assert.ok(data.sources.some(x=>x.id==="eerola_vuoskoski_2011_perceived"));
assert.ok(data.sources.some(x=>x.id==="eerola_saari_2025_expressed"));
console.log('PASS soft emotion neighborhoods: five broad groups, 15 intact nuances, contextual creativity and porous boundaries');
