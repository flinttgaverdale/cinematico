'use strict';
// Run against current engine or a previous revision: node audit/composer-holdout-comparison.cjs [engine.js path]
const path=require('node:path');
require(process.argv[2]?path.resolve(process.argv[2]):path.join(__dirname,'../engine.js'));
const E=globalThis.CinematicoEngine;
const ids=['williams','horner','herrmann','elfman','zimmer','giacchino','silvestri','shore','morricone','newman','goransson'];
const materials=['Dm G Dm C','C D C Em','Em F Em Dm','G F C G','F#m Bm C#7','Ebmaj7 Cm7 Fm7 Bb7','C#m A E/G# Bsus4','Cm Ebm Abm','D D/F# G/D A/D','Fmaj7 Gm7 Am7 Bbmaj7'];
const cases=materials.flatMap(raw=>['asombro','calma','tension'].map(intent=>({raw,intent,ending:'auto'}))).concat(['Dm G Dm C','F#m Bm C#7','D D/F# G/D A/D'].flatMap(raw=>['open','closed'].map(ending=>({raw,intent:'nostalgia',ending}))));
const key=q=>q.map(c=>[c.root,c.type,c.bass].join(':')).join('|');
const profiles=Object.fromEntries(ids.map(id=>[id,{routes:0,triadic:0,bass:0,parallel:0,dominant:0,recall:0,gesture:0,cycle:0,reflected:0,expanded:0}]));
let pairs={},invalid=0,total=0,exact=0,near=0,comparisons=0,sharedDirect=0,distinctSets=0;
for(const c of cases){
 const p=E.parseUserProgression(c.raw).chords;
 const routes=ids.map(id=>E.composerContinuations(p,c.intent,id,{ending:c.ending}));
 const parsed=routes.map((qs,i)=>qs.map(q=>{
  const t=E.parseUserProgression(q.chords.join(' '));if(t.errors.length||!t.chords.length)invalid++;
  const a=profiles[ids[i]];a.routes++;
  a.triadic+=Number(q.phrase.transformedLinks>0);a.bass+=Number(q.phrase.sustainedLinks>0);
  a.parallel+=Number(q.phrase.links.some(l=>l.parallel));a.dominant+=Number(['dominant','dominantTriad'].includes(q.phrase.arrivalKind));
  a.recall+=Number(q.phrase.recalled.length>0);
  a.gesture+=Number(Boolean(q.motif?.gestures.some(g=>g.kind==='recall'||g.kind==='transposition')));
  a.cycle+=Number(Boolean(q.motif?.cycle));a.reflected+=Number(Boolean(q.motif?.mirrors.length||q.motif?.gestures.some(g=>g.kind==='rootReflection')));
  a.expanded+=Number(Boolean(q.motif?.gestures.some(g=>g.kind==='insertion'||g.kind==='omission')));total++;return t.chords;
 }));
 distinctSets+=new Set(parsed.map(qs=>qs.map(key).join('||'))).size;
 for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++){
  const k=ids[i]+'/'+ids[j],a=pairs[k]??(pairs[k]={compared:0,exact:0,near:0});
  for(let l=0;l<3;l++){
   const x=parsed[i][l],y=parsed[j][l];if(!x||!y)continue;
   if(x.length===1&&y.length===1&&key(x)===key(y)){sharedDirect++;continue;}
   comparisons++;a.compared++;
   const e=key(x)===key(y),ne=x.length===y.length&&x.every((c,m)=>c.root===y[m].root)&&x.filter((c,m)=>c.type!==y[m].type||c.bass!==y[m].bass).length<=1;
   if(e){exact++;a.exact++;}if(ne){near++;a.near++;}
  }
 }
}
console.log(JSON.stringify({cases:cases.length,total,invalid,comparisons,exact,near,sharedDirect,distinctSets,profiles,pairs},null,2));
if(invalid||total!==1188)process.exitCode=1;
