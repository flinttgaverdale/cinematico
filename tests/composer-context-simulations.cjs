// Reproducible structural simulation; it does NOT listen to music or score aesthetics.
// Run: node tests/composer-context-simulations.cjs
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const root=path.join(__dirname,"..");
const globalContext={};
vm.runInNewContext(fs.readFileSync(path.join(root,"engine.js"),"utf8"),globalContext);
const E=globalContext.CinematicoEngine;
const fixture=JSON.parse(fs.readFileSync(path.join(root,"research/composer-context-briefs-2026-11-08.json"),"utf8"));
const ids=Object.keys(E.COMPOSER_CREATIVE_LENSES).sort();
const MOD=n=>((n%12)+12)%12;
assert.equal(ids.length,11);
assert.equal(fixture.briefs.length,10);
assert.equal(new Set(fixture.briefs.map(b=>b.id)).size,10);
const CRITERIA=["colorAdd","smoothMajority","noVClosing","minor","openRoot","major","tonicSharp11","nonmodal","disjoint","returnRoot","vClosing","severalRoots","twoOperators","threeDistinctChords","fewRoots","returnNoV","flatII"];
for(const b of fixture.briefs){
 assert.equal(b.criteria.length,3,"Equalized 3-criterion briefs: "+b.id);
 assert.equal(new Set(b.criteria).size,3,b.id);
 assert.ok(b.criteria.every(x=>CRITERIA.includes(x)),"Unsupported feature in "+b.id);
 assert.ok(!fixture.briefs.slice(0,fixture.briefs.indexOf(b)).some(other=>other.criteria.slice().sort().join("|")===b.criteria.slice().sort().join("|")),"Duplicated structural requirements: "+b.id);
}
function fingerprint(ch){
 return MOD(ch.root)+":"+[...new Set(ch.notes.map(MOD))].sort((a,b)=>a-b).join(",");
}
function describe(path,tonic,modeKey){
 const chords=path.chords;
 const insights=path.insights||E.composerRouteInsights(chords,tonic);
 const first=chords[0],last=chords[chords.length-1],prev=chords[chords.length-2];
 const vClosing=insights.returnToCenter&&MOD(prev.root)===MOD(tonic+7)&&
  ["major","dominant seventh","major seventh"].includes(prev.quality)&&
  prev.notes.map(MOD).includes(MOD(tonic+11))&&["major","minor","major seventh","minor seventh"].includes(last.quality);
 const classes=chords.map(fingerprint);
 const total=insights.transitions.length;
 const smooth=insights.transitions.filter(x=>x.commonCount>=2).length;
 const nonmodal=chords.filter(ch=>ch.chromatic).length;
 return Object.freeze({
  modeKey,tonic,
  colorAdd:chords.some(ch=>["maj7","maj7#11","add9","maj9","m7","m9","mMaj7"].includes(ch.type)),
  smoothMajority:total>0&&smooth/total>=0.6,
  noVClosing:!vClosing,
  minor:modeKey==="aeolian",
  openRoot:!insights.returnToCenter,
  major:modeKey==="ionian",
  tonicSharp11:chords.some(ch=>MOD(ch.root)===tonic&&ch.type==="maj7#11"),
  nonmodal:nonmodal>0,
  disjoint:insights.transitions.some(x=>x.commonCount===0),
  returnRoot:insights.returnToCenter,
  vClosing,
  severalRoots:new Set(chords.map(ch=>MOD(ch.root))).size>=3,
  twoOperators:insights.transitions.filter(t=>t.operator!==null).length>=2,
  threeDistinctChords:new Set(classes).size>=3,
  fewRoots:new Set(chords.map(ch=>MOD(ch.root))).size<=2,
  returnNoV:insights.returnToCenter&&!vClosing,
  flatII:chords.some(ch=>MOD(ch.root)===MOD(tonic+1)&&ch.quality==="major"),
  numOperators:insights.transitions.filter(t=>t.operator!==null).length,
  numChordKinds:new Set(classes).size,
  numRoots:new Set(chords.map(c=>MOD(c.root))).size,
  smoothLinks:smooth,totalLinks:total,chromaticCount:nonmodal
 });
}
function score(features,brief){
 const satisfied=brief.criteria.filter(c=>features[c]===true);
 return {met:satisfied.length,of:brief.criteria.length,satisfied,missing:brief.criteria.filter(c=>!satisfied.includes(c))};
}
function baselines(tonic,keyName){
 const major={int:[0,2,4,5,7,9,11]},minor={int:[0,2,3,5,7,8,10]};
 const M=(d,q,e="")=>({d,q,e,a:0});
 const rows=[
  {id:"control-major-functional",modeKey:"ionian",steps:[M(0,"major"),M(3,"major"),M(4,"major","7"),M(0,"major")],mode:major},
  {id:"control-minor-modal",modeKey:"aeolian",steps:[M(0,"minor"),M(5,"major"),M(6,"major"),M(0,"minor")],mode:minor}
 ];
 return rows.map(r=>{
  const chords=E.buildProfileProgression(r.steps,tonic,r.mode,keyName);
  return {id:r.id,routeIndex:0,modeKey:r.modeKey,chords,insights:E.composerRouteInsights(chords,tonic),control:true};
 });
}
const examples=[];
const rows=[];
let total=0;
const signatures=[];
for(let tonic=0;tonic<12;tonic++){
 const keyName=fixture.transpositionRoots[tonic];
 const cases=[];
 for(const id of ids){
  const reference=E.composerCreativePaths(id,tonic,keyName);
  assert.ok(reference&&reference.paths.length===2,id);
  for(let i=0;i<2;i++){
   const p=reference.paths[i];
   cases.push({id,routeIndex:i+1,modeKey:reference.modeKey,chords:p.chords,insights:p.insights,control:false});
  }
 }
 cases.push(...baselines(tonic,keyName));
 assert.equal(cases.length,24);
 for(const item of cases){
  const features=describe(item,tonic,item.modeKey);
  assert.equal(item.chords[0].root,tonic);
  for(const brief of fixture.briefs){
   const result=score(features,brief);
   rows.push({tonic,brief:brief.id,id:item.id,routeIndex:item.routeIndex,control:item.control,met:result.met,missing:result.missing});
   total++;
  }
  if(tonic===0){
   examples.push({id:item.id,routeIndex:item.routeIndex,control:item.control,mode:item.modeKey,
    chords:item.chords.map(c=>c.label),features,
    briefMatch:Object.fromEntries(fixture.briefs.map(brief=>[brief.id,score(features,brief).met]))});
   signatures.push(item.id+"#"+item.routeIndex+" "+item.chords.map(c=>c.label).join(" "));
  }
 }
}
assert.equal(total,2880,"24 routes × 10 briefs × 12 transpositions");
assert.equal(rows.filter(x=>!x.control).length,2640);
assert.equal(rows.filter(x=>x.control).length,240);
// Structural classification is pitch-class relative and should not depend on transposition.
for(const sample of examples){
 const same=rows.filter(x=>x.id===sample.id&&x.routeIndex===sample.routeIndex);
 assert.equal(same.length,120);
 for(const brief of fixture.briefs){
  const values=new Set(same.filter(r=>r.brief===brief.id).map(r=>r.met));
  assert.equal(values.size,1,"Transposition changed structural constraints: "+sample.id+" "+brief.id);
 }
}
const contexts=fixture.briefs.map(brief=>{
 const relevant=rows.filter(r=>r.tonic===0&&r.brief===brief.id);
 const candidates=relevant.filter(r=>!r.control),controls=relevant.filter(r=>r.control);
 const full=candidates.filter(r=>r.met===3);
 const partial=candidates.filter(r=>r.met===2);
 const noCoverage=candidates.filter(r=>r.met===0);
 const fullyByComposer=[...new Set(full.map(x=>x.id))].sort();
 return {id:brief.id,title:brief.title,requirements:brief.criteria,
  fullyMatchingRoutes:full.length,partiallyMatchingRoutes:partial.length,zeroMatchRoutes:noCoverage.length,
  fullProfiles:fullyByComposer,fullExamples:full.map(x=>x.id+"#"+x.routeIndex),
  baseline:controls.map(x=>({control:x.id,met:x.met}))};
});
const pairs=[];
for(const id of ids){
 const profile=examples.filter(e=>e.id===id);
 const first=profile[0],second=profile[1];
 const distinct=fixture.briefs.filter(b=>first.briefMatch[b.id]!==second.briefMatch[b.id]);
 pairs.push({id,changedContextCount:distinct.length,
  firstWins:distinct.filter(b=>first.briefMatch[b.id]>second.briefMatch[b.id]).length,
  secondWins:distinct.filter(b=>second.briefMatch[b.id]>first.briefMatch[b.id]).length,
  ties:fixture.briefs.length-distinct.length});
}
const report={date:"2026-11-08",version:"1.0",type:"structural-simulation-not-human-aesthetic-evaluation",
 sources:["https://doi.org/10.1145/3769106","https://doi.org/10.1007/s10462-026-11582-x","https://pubmed.ncbi.nlm.nih.gov/39793277/"],
 methodology:"Three binary harmonic requirements per brief, no emotion or composer-authenticity predictor. 22 original routes + 2 generic baseline controls, each in 12 keys and 10 fictional briefs.",
 totals:{profiles:ids.length,originalRoutes:22,baselines:2,briefs:fixture.briefs.length,tonics:12,routeBriefSimulations:total,originalSimulations:2640,baselineSimulations:240},
 contexts,pairs,exampleRoutes:examples};
assert.equal(report.contexts.length,10);
assert.equal(report.exampleRoutes.length,24);
assert.equal(report.pairs.length,11);
const json=JSON.stringify(report);
if(process.argv.includes("--json"))console.log("SIMULATION_REPORT_JSON "+json);
else {
 console.log("SIMULATION TOTALS",JSON.stringify(report.totals));
 console.log("SCENARIO COVERAGE",JSON.stringify(contexts.map(({id,fullyMatchingRoutes,partiallyMatchingRoutes,fullProfiles,baseline})=>({id,fullyMatchingRoutes,partiallyMatchingRoutes,fullProfiles,baseline}))));
 console.log("PROFILE CONTRASTS",JSON.stringify(pairs));
}
console.log("PASS composer contexts: "+total+" transposition-invariant structural simulations, honest baselines, 10 explicit non-aesthetic briefs.");
