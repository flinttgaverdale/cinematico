// Evidence-linked composer research integrity and harmonic classification regression.
// Run: node tests/composer-research-regression.cjs
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const catalog=JSON.parse(fs.readFileSync(path.join(root,'research/composer-lenses-v2.json'),'utf8'));
const ectx={};
vm.runInNewContext(fs.readFileSync(path.join(root,'engine.js'),'utf8'),ectx);
const E=ectx.CinematicoEngine;
assert.ok(E);
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const from=html.indexOf('const COMPOSERS={'),to=html.indexOf('function keyNameForPc(',from);
assert.ok(from>=0&&to>from,'Composer metadata is present');
const ctx={};
vm.runInNewContext(html.slice(from,to).replace('const COMPOSERS=', 'var COMPOSERS=')+'\nthis.PROFILES=COMPOSERS;',ctx);
const profiles=ctx.PROFILES;
const actual=Object.keys(profiles).sort(),expected=Object.keys(catalog.entries).sort();
assert.deepEqual(actual,expected,'Research catalog must exactly cover the 11 published profiles');
assert.equal(actual.length,11);
const studies=new Set();
for(const id of actual){
 const p=catalog.entries[id],live=profiles[id];
 assert.ok(p.name===live.name,p.name);
 assert.match(p.source,/^https:\/\/[^\s]+$/);
 assert.ok(['A','B','C'].includes(p.evidenceGrade),id);
 assert.ok(p.work.length>5&&p.centralProcess.length>35,id);
 assert.ok(Array.isArray(p.needs)&&p.needs.length>=1,id);
 assert.ok(Array.isArray(p.chordObservable)&&p.chordObservable.length>=1,id);
 const parsed=E.parseUserProgression(p.exercise);
 assert.equal(parsed.errors.length,0,id+': '+parsed.errors.join(';'));
 assert.ok(parsed.chords.length>=3&&parsed.chords.length<=8,id);
 assert.ok(!studies.has(p.symbolicLens),'Research lenses must describe different experiments');
 studies.add(p.symbolicLens);
 assert.ok(p.avoid.length>30,'Each profile must have a specific anti-stereotype warning');
 const mode={int:live.signatureMode==='ionian'?[0,2,4,5,7,9,11]:[0,2,3,5,7,8,10]};
 const built=E.buildProfileProgression(live.signature,0,mode,'C');
 assert.ok(built.length>=3&&built.every(ch=>ch.label),id);
 assert.equal(E.composerAssistance(id,parsed.chords).every(x=>x.changesOriginal===false),true,id);
}
const major={int:[0,2,4,5,7,9,11]};
const chord=(degree,ext='')=>({d:degree,a:0,q:'major',e:ext});
const roles=(...steps)=>E.buildProfileProgression(steps,0,major,'C').map(x=>x.classification);
assert.equal(roles(chord(0),chord(3))[0],'diatonic','I–IV cannot automatically be a secondary dominant');
assert.equal(roles(chord(0,'7'),chord(3))[0],'secondaryDominant','I7–IV can tonicize IV');
assert.equal(roles(chord(1,'7'),chord(4))[0],'secondaryDominant','II7–V is a clear applied dominant');
assert.equal(roles(chord(4,'7'),chord(0))[0],'dominant','V7–I remains primary dominant');
console.log('PASS composer research: all 11 documented lenses, parseable original studies, no destructive advice, and correct applied-dominant disambiguation.');
