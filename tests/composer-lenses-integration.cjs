// Musicological composer-lens integration: independent reference and calibrated scope.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname,'..');
const ctx = {};
vm.runInNewContext(fs.readFileSync(path.join(root,'engine.js'),'utf8'), ctx);
const E=ctx.CinematicoEngine;
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const start=html.indexOf('const COMPOSERS={'),end=html.indexOf('function keyNameForPc(',start);
assert.ok(start>=0&&end>start);
const profileCtx={};
vm.runInNewContext(html.slice(start,end).replace('const COMPOSERS=','var COMPOSERS=')+'\nthis.profiles=COMPOSERS;',profileCtx);
const P=profileCtx.profiles;
const ids=Object.keys(P);
assert.equal(ids.length,11);
assert.deepEqual([...ids].sort(),[...Object.keys(E.COMPOSER_CREATIVE_LENSES)].sort());
const keys=['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
const seen=new Set();
let generated=0;
for(const [id,prof] of Object.entries(P)){
 assert.ok(prof.name&&prof.sigLabel);
 const metadata=E.COMPOSER_CREATIVE_LENSES[id];
 assert.match(metadata.source,/^https:\/\//);
 assert.ok(metadata.limit.length>40&&metadata.focus.length>15);
 assert.equal(metadata.routes.length,2,id);
 const originalSignature=JSON.stringify(prof.signature);
 const routeAtC=E.composerCreativePaths(id,0,'C');
 assert.equal(routeAtC.paths.length,2);
 for(const route of routeAtC.paths){
  assert.ok(route.name.length>5&&route.intention.length>35,id);
  assert.equal(route.chords[0].root,0,id);
  assert.ok(route.chords.length>=3&&route.chords.length<=6,id);
  assert.equal(route.note.includes('transcripción'),true,id);
  const fp=route.chords.map(ch=>ch.root+':'+ch.type).join('|');
  assert.ok(!seen.has(fp),'Two profiles share the same nominal harmonic journey: '+id+' '+fp);
  seen.add(fp);
 }
 for(let tonic=0;tonic<12;tonic++){
  const next=E.composerCreativePaths(id,tonic,keys[tonic]);
  assert.equal(next.paths.length,2);
  assert.equal(next.originalIsUntouched,true);
  const mode={int:metadata.mode==='ionian'?[0,2,4,5,7,9,11]:[0,2,3,5,7,8,10]};
  for(let i=0;i<2;i++){
   const route=next.paths[i],first=route.chords[0];
   assert.equal(first.root,tonic,'Signature transposed to '+keys[tonic]+' '+id);
   assert.ok(route.chords.every(c=>typeof c.label==='string'&&c.roman.length>0&&Number.isInteger(c.root)),id);
   assert.ok(route.chords.every(c=>c.notes.length>=3&&c.notes.every(n=>n>=0&&n<=11)),id);
   const originally=E.buildProfileProgression(metadata.routes[i].steps,tonic,mode,keys[tonic]);
   assert.equal(route.chords.map(c=>c.label).join('|'),originally.map(c=>c.label).join('|'));
   generated++;
  }
 }
 assert.equal(JSON.stringify(prof.signature),originalSignature,'Research generator cannot edit source signatures');
}
// Musically distinctive paths; no unqualified composer attribution.
const labels=id=>E.composerCreativePaths(id,0,'C').paths.map(p=>p.chords.map(c=>c.label));
assert.equal(labels('williams')[0].join(' '),'C Fm C');
assert.ok(labels('herrmann')[0].includes('D♭'),'bII must be a semitone above C, not D major');
assert.ok(labels('elfman')[0].includes('D♭'));
assert.deepEqual([...labels('giacchino')[0]],[ 'C','Am','F','G7','C']);
assert.deepEqual([...labels('giacchino')[1]],[ 'Cmaj7','Am7','Fmaj7','G7','Cmaj7']);
assert.equal(labels('silvestri')[0][0],'Cmaj7#11');
assert.equal(labels('silvestri')[1][1],'G♭');
assert.equal(labels('newman')[1].at(-1),'Fmaj7','Open ending should not manufacture an authentic cadence');
assert.equal(labels('shore')[0][1],'Fm');
assert.equal(labels('shore')[0][2],'F');
assert.ok(labels('zimmer')[0][0]===labels('zimmer')[0][2],"Zimmer exercise sustains a recognisable center");
assert.notEqual(labels('zimmer')[0].join(' '),labels('goransson')[0].join(' '));
const horner=E.composerCreativePaths('horner',0,'C').paths;
for(const [index,ops] of [[0,['P','L','R']],[1,['R','L','P']]]){
 const chords=horner[index].chords;
 for(let j=0;j<3;j++){
  const transition=E.neoTransform(chords[j].root,chords[j].quality,ops[j]);
  assert.ok(transition,'Horner needs proper triadic transforms');
  assert.equal(transition.target.root,chords[j+1].root);
  assert.equal(transition.target.quality,chords[j+1].quality);
  assert.equal(transition.common.length,2,'P L R must preserve exactly two pitch classes');
 }
}
const chrom=E.COMPOSER_CREATIVE_LENSES.herrmann.routes[0].steps[1];
assert.equal(chrom.a,-1,'bII alteration is explicit');
assert.equal(E.composerCreativePaths('unknown',0,'C'),null);
assert.equal(E.composerCreativePaths('williams',NaN,'C'),null);
assert.ok(html.includes('id="composerExplorations"'),'Independent composer reference panel');
assert.ok(html.includes('renderComposerExplorations();'),'Changing composer/key must re-render creative paths');
assert.ok(html.includes('Ejercicio original, no transcripción ni firma exclusiva'),'A careful label for legacy signatures');
assert.ok(!/Percusión africana\/mundial/i.test(html),'Avoid generic cultural stereotyping');
console.log('PASS composer-lenses: '+ids.length+' profiles, '+generated+' transposed routes, 22 distinct C paths, neo-Riemannian operators, bII, UI integration and limits.');
