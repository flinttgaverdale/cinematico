const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const html = fs.readFileSync(path.join(__dirname, "../index.html"), "utf8");
const engineSource = fs.readFileSync(path.join(__dirname, "../engine.js"), "utf8");
const dataStart = html.indexOf("const NOTE_SHARP");
const dataEnd = html.indexOf("function keyNameForPc");
assert.ok(dataStart >= 0 && dataEnd > dataStart, "The original musical data block must exist");
const dataSource = html.slice(dataStart, dataEnd);
const context = vm.createContext({});
vm.runInContext(dataSource + `
function keyNameForPc(pc){return KEYS.find(k=>PC[k]===pc)||NOTE_SHARP[pc];}
globalThis.DATA={MODES,KEYS_SHARP,MODULATIONS,keyNameForPc,EMOTIONS,COMPOSERS};
`, context);
vm.runInContext(engineSource, context);
const E = context.CinematicoEngine;
const DATA = context.DATA;

const expectedTriads = {
  ionian:["","m","m","","","m","dim"],
  dorian:["m","m","","","m","dim",""],
  phrygian:["m","","","m","dim","","m"],
  lydian:["","","m","dim","","m","m"],
  mixolydian:["","m","dim","","m","m",""],
  aeolian:["m","dim","","m","m","",""],
  locrian:["dim","","m","m","","","m"]
};

test("the seven modes produce the correct diatonic triad qualities", () => {
  for (const [modeName, expected] of Object.entries(expectedTriads)) {
    const actual = Array.from({length:7},(_,degree)=>E.diatonicChord(0,DATA.MODES[modeName],degree,"C",false).type);
    assert.deepEqual(actual, expected, modeName);
  }
});

test("all diatonic seventh chords contain only notes from their mode in all 12 tonics", () => {
  for (const mode of Object.values(DATA.MODES)) for (let tonic=0;tonic<12;tonic++) {
    const keyName = DATA.keyNameForPc(tonic);
    const scale = new Set(E.scale(tonic,mode));
    for (let degree=0;degree<7;degree++) {
      const chord = E.diatonicChord(tonic,mode,degree,keyName,true);
      assert.equal(chord.notes.length,4);
      for (const note of chord.notes) assert.ok(scale.has(note), `${keyName} ${mode.name} degree ${degree}`);
    }
  }
});

test("the 12 emotions and 11 composer profiles work in every mode and tonic", () => {
  let combinations=0;
  for (const emotion of Object.values(DATA.EMOTIONS))
    for (const composer of Object.values(DATA.COMPOSERS))
      for (const modeName of Object.keys(DATA.MODES))
        for (let tonic=0;tonic<12;tonic++) {
          const result=E.analyze(tonic,emotion,composer,modeName,DATA);
          assert.equal(result.chords.length,7);
          assert.equal(result.triads.length,7);
          assert.equal(result.progression.length,emotion.steps.length);
          assert.equal(result.signature.length,composer.signature.length);
          assert.ok(result.mods.length>0);
          combinations++;
        }
  assert.equal(combinations,11088);
});

test("modal flats are not applied twice in Phrygian, Mixolydian and Aeolian", () => {
  const phrygian=E.analyze(0,DATA.EMOTIONS.oscuridad,DATA.COMPOSERS.elfman,"phrygian",DATA);
  assert.equal(phrygian.progression[1].label,"D♭");
  assert.equal(phrygian.progression[1].roman,"♭II");
  const mixolydian=E.analyze(0,DATA.EMOTIONS.heroismo,DATA.COMPOSERS.silvestri,"mixolydian",DATA);
  assert.equal(mixolydian.progression[1].label,"B♭");
  assert.equal(mixolydian.progression[1].roman,"♭VII");
  const aeolian=E.analyze(0,DATA.EMOTIONS.misterio,DATA.COMPOSERS.zimmer,"aeolian",DATA);
  assert.equal(aeolian.progression[1].label,"A♭");
  assert.equal(aeolian.progression[1].roman,"♭VI");
});

test("the Dorian major V chord is marked as a parallel-Ionian interchange when no resolution is shown", () => {
  const result=E.analyze(0,DATA.EMOTIONS.esperanza,DATA.COMPOSERS.williams,"dorian",DATA);
  const dominant=result.progression.at(-1);
  assert.equal(dominant.label,"G");
  assert.equal(dominant.roman,"V");
  assert.equal(dominant.classification,"modalInterchange");
  assert.equal(dominant.borrowed,false);
  assert.equal(dominant.borrowedFrom,"ionian");
  assert.ok(!E.scale(0,DATA.MODES.dorian).includes(11));
  assert.ok(dominant.notes.includes(11));
});

test("relative and parallel changes identify the correct target mode", () => {
  const major=E.analyze(0,DATA.EMOTIONS.alegria,DATA.COMPOSERS.giacchino,"ionian",DATA);
  const relativeMajor=major.mods.find(x=>x.id==="relative");
  const parallelMajor=E.analyze(0,DATA.EMOTIONS.alegria,DATA.COMPOSERS.zimmer,"ionian",DATA).mods.find(x=>x.id==="parallel");
  assert.equal(relativeMajor.target,"A");
  assert.equal(relativeMajor.targetMode,"Menor (Eólico)");
  assert.equal(parallelMajor.target,"C");
  assert.equal(parallelMajor.targetMode,"Menor (Eólico)");
  const dorian=E.analyze(0,DATA.EMOTIONS.esperanza,DATA.COMPOSERS.williams,"dorian",DATA);
  const relativeDorian=dorian.mods.find(x=>x.id==="relative");
  assert.equal(relativeDorian.target,"Bb");
  assert.equal(relativeDorian.targetMode,"Mayor (Jónico)");
  assert.ok(relativeDorian.pivots.length>0);
});

test("the Neapolitan is represented as a harmonic colour, not a key modulation", () => {
  const result=E.analyze(0,DATA.EMOTIONS.tension,DATA.COMPOSERS.williams,"aeolian",DATA);
  const nap=result.mods.find(x=>x.id==="neapolitan");
  assert.equal(nap.kind,"color");
  assert.equal(nap.target,"♭II6 → V7 → i");
  assert.equal(nap.chord.notes.length,3);
  assert.equal(nap.chord.bass,5);
  assert.deepEqual(Array.from(nap.resolution,x=>x.root),[1,7,0]);
});

test("scale spelling preserves diatonic letter names in difficult keys", () => {
  assert.deepEqual(Array.from(E.spellScale(6,DATA.MODES.ionian,"F#")),["F♯","G♯","A♯","B","C♯","D♯","E♯"]);
  assert.deepEqual(Array.from(E.spellScale(1,DATA.MODES.aeolian,"Db")),["D♭","E♭","F♭","G♭","A♭","B𝄫","C♭"]);
});

test("the inline application script parses", () => {
  const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]).filter(x=>x.trim());
  assert.ok(scripts.length>0);
  for (const script of scripts) new vm.Script(script);
});

test("composer signatures remain independent from the selected emotional mode", () => {
  const emotion=DATA.EMOTIONS.alegria;
  const zimmer=DATA.COMPOSERS.zimmer;
  const zIonian=E.analyze(0,emotion,zimmer,"ionian",DATA);
  const zLydian=E.analyze(0,emotion,zimmer,"lydian",DATA);
  assert.equal(zLydian.signatureModeKey,"aeolian");
  assert.deepEqual(Array.from(zLydian.signature,x=>x.label),Array.from(zIonian.signature,x=>x.label));
  assert.deepEqual(Array.from(zLydian.signature,x=>x.roman),Array.from(zIonian.signature,x=>x.roman));
  assert.deepEqual(Array.from(zLydian.signature,x=>x.label),["Cm","A♭","E♭","B♭"]);
  const williams=E.analyze(0,emotion,DATA.COMPOSERS.williams,"lydian",DATA);
  assert.equal(williams.signatureModeKey,"ionian");
  assert.equal(williams.signature[1].label,"Fm6");
  assert.equal(Object.values(DATA.COMPOSERS).filter(c=>c.signatureMode).length,11);
});

test("the 12 emotional profiles retain their intended harmonic turns in C", () => {
  const expected = {
    alegria:["Cadd9","F","G","C"],
    tristeza:["Cm9","A♭","E♭","Cm"],
    nostalgia:["Cmaj7","Fm6","Cmaj7"],
    maravilla:["Cmaj7#11","D","C"],
    heroismo:["C5","B♭","F","C"],
    tension:["Cm","D♭","Cm"],
    oscuridad:["Cm","D♭","Cm"],
    esperanza:["F","Cm","Dm","G"],
    paz:["Cadd9","Am","F","G"],
    misterio:["Cm","A♭","Cm"],
    romance:["Dm7","G7","Cmaj9"],
    epica:["Cm","A♭","E♭","B♭"]
  };
  for (const [id,labels] of Object.entries(expected)) {
    const emotion=DATA.EMOTIONS[id];
    const result=E.analyze(0,emotion,DATA.COMPOSERS.giacchino,emotion.mode,DATA);
    assert.deepEqual(Array.from(result.progression,x=>x.label),labels,id);
  }
});

test("all composer reference gestures keep their intended formula in C", () => {
  const expected = {
    giacchino:["Cmaj7","E♭","Cmaj7"],
    williams:["C","Fm6","C"],
    zimmer:["Cm","A♭","E♭","B♭"],
    elfman:["Cm","D♭","Cm"],
    silvestri:["C","F","G","C"],
    horner:["Cm","B♭","Cm"],
    herrmann:["Cm","D♭","Cm"],
    shore:["Cm","D♭","Cm"],
    morricone:["Cm","B♭","Cm"],
    newman:["Cadd9","F","Cadd9"],
    goransson:["Cm","A♭","B♭","Cm"]
  };
  for (const [id,labels] of Object.entries(expected)) {
    const result=E.analyze(0,DATA.EMOTIONS.alegria,DATA.COMPOSERS[id],"ionian",DATA);
    assert.deepEqual(Array.from(result.signature,x=>x.label),labels,id);
  }
});

test("the ♭II differs between Aeolian chromaticism and Phrygian diatonic harmony", () => {
  const aeolian=E.buildProfileProgression([{d:1,a:-1,q:"major",e:""}],0,DATA.MODES.aeolian,"C")[0];
  const phrygian=E.buildProfileProgression([{d:1,a:-1,q:"major",e:""}],0,DATA.MODES.phrygian,"C")[0];
  assert.equal(aeolian.classification,"modalInterchange");
  assert.equal(aeolian.borrowedFrom,"phrygian");
  assert.equal(phrygian.classification,"diatonic");
});
test("modal and secondary dominant labels require a chord that leads by fifth", () => {
  const dorian=E.buildProfileProgression([{d:4,a:0,q:"major",e:""},{d:0,a:0,q:"minor",e:""}],0,DATA.MODES.dorian,"C");
  assert.equal(dorian[0].classification,"modalDominant");
  const secondary=E.buildProfileProgression([{d:5,a:0,q:"major",e:"7"},{d:1,a:0,q:"minor",e:""}],0,DATA.MODES.dorian,"C");
  assert.equal(secondary[0].classification,"secondaryDominant");
  const primary=E.buildProfileProgression([{d:4,a:0,q:"major",e:"7"},{d:0,a:0,q:"major",e:""}],0,DATA.MODES.ionian,"C");
  assert.equal(primary[0].classification,"dominant");
});

test("modulation recommendations are ranked by emotion and progression context", () => {
  const joy=E.analyze(0,DATA.EMOTIONS.alegria,DATA.COMPOSERS.giacchino,"ionian",DATA);
  const suspense=E.analyze(0,DATA.EMOTIONS.tension,DATA.COMPOSERS.giacchino,"aeolian",DATA);
  const wonder=E.analyze(0,DATA.EMOTIONS.maravilla,DATA.COMPOSERS.giacchino,"lydian",DATA);
  assert.equal(joy.mods.length,7);
  assert.notDeepEqual(Array.from(joy.mods,x=>x.id),Array.from(suspense.mods,x=>x.id));
  assert.notDeepEqual(Array.from(joy.mods,x=>x.id),Array.from(wonder.mods,x=>x.id));
  assert.ok(joy.mods.some(x=>x.id==="neapolitan"));
  assert.ok(joy.mods[0].fitReason.length>0);
  assert.ok(joy.mods.every(x=>x.cadence && x.cadence.dominant && x.cadence.tonic));
  assert.ok(joy.mods.every(x=>typeof x.score==="number"));
  const minorV=suspense.mods.find(x=>x.id==="down_fifth");
  assert.ok(!minorV.fitReason.includes("dominante del destino"),"a minor v chord must not be described as a dominant V7");
});

test("progression analysis exposes chord tones, default bass and shared pitch classes", () => {
  const chords=E.buildProfileProgression([
    {d:0,a:0,q:"major",e:"add9"},
    {d:3,a:0,q:"major",e:""}
  ],0,DATA.MODES.ionian,"C");
  assert.equal(chords[0].bass,0);
  assert.equal(chords[0].inversion,0);
  assert.ok(chords[0].notes.includes(0));
  assert.deepEqual(Array.from(chords[0].commonWithNext),[0]);
});

test("extended chords are identified independently of note order", () => {
 for(const type of ["add9","m9","maj9","9","maj7#11","6","m6"]){
  const notes=E.extensionIntervals(type).map(x=>x%12);
  assert.equal(E.identifyType(notes).id,type);
  assert.equal(E.identifyType([...notes].reverse()).id,type);
 }
});
test("roman numerals retain extensions and altered sonorities", () => {
 assert.equal(E.romanFor(1,0,"m7"),"ii7");
 assert.equal(E.romanFor(4,0,"7"),"V7");
 assert.equal(E.romanFor(0,0,"maj9"),"Imaj9");
 assert.equal(E.romanFor(0,0,"add9"),"I(add9)");
 assert.equal(E.romanFor(1,-1,"m7b5"),"♭iiø7");
});
test("parallel-mode compatibility is a hypothesis, not proven borrowing", () => {
 const chord=E.buildProfileProgression([{d:1,a:-1,q:"major",e:""}],0,DATA.MODES.aeolian,"C")[0];
 assert.equal(chord.classification,"modalInterchange");
 assert.equal(chord.borrowed,false);
 assert.match(chord.explanation,/hipótesis/);
});
test("a major chord without target leading tone is not automatically a dominant", () => {
 const progression=E.buildProfileProgression([{d:4,a:0,q:"major",e:""},{d:0,a:0,q:"minor",e:""}],0,DATA.MODES.dorian,"C");
 assert.equal(progression[0].classification,"modalDominant");
});

test("structural chord quality survives added tensions and arbitrary pitch-class ordering", () => {
 const progress=E.buildProfileProgression([
  {d:4,a:0,q:"major",e:"9"},
  {d:0,a:0,q:"major",e:"maj9"}
 ],0,DATA.MODES.ionian,"C");
 assert.equal(progress[0].quality,"dominant seventh");
 assert.equal(progress[0].classification,"dominant");
 assert.equal(progress[1].quality,"major seventh");
 const minor=E.buildProfileProgression([{d:0,a:0,q:"minor",e:"m9"}],0,DATA.MODES.aeolian,"C");
 assert.equal(minor[0].quality,"minor seventh");
});
test("modal destinations explicitly flag non-diatonic V7 cadences", () => {
 const result=E.analyze(0,DATA.EMOTIONS.esperanza,DATA.COMPOSERS.williams,"dorian",DATA);
 const parallel=result.mods.find(m=>m.id==="parallel");
 assert.equal(typeof parallel.dominantDiatonic,"boolean");
 const regions=result.mods.filter(m=>m.kind!=="color");
 for(const region of regions){
  if(!region.dominantDiatonic)assert.match(region.transition,/ajenas al modo/);
 }
});

test("four-voice optimizer produces complete registral paths for emotional progressions", () => {
 const data=E.analyze(0,DATA.EMOTIONS.nostalgia,DATA.COMPOSERS.williams,"ionian",DATA);
 for(const style of ["classical","cinematic","minimal"]){
  const r=E.voiceLead(data.progression,style);
  assert.equal(r.voicings.length,3);
  assert.equal(r.transitions.length,2);
  assert.ok(Number.isFinite(r.cost));
  for(let i=0;i<r.voicings.length;i++){
   const notes=r.voicings[i];
   assert.equal(notes.length,4);
   assert.ok(notes.every((n,j)=>j===0||n>notes[j-1]));
   assert.ok(notes.every(n=>data.progression[i].notes.includes(n%12)));
  }
 }
});
test("voice leading handles all twelve emotion profiles", () => {
 for(const emotion of Object.values(DATA.EMOTIONS)){
  const result=E.analyze(0,emotion,DATA.COMPOSERS.williams,emotion.mode,DATA);
  const leading=E.voiceLead(result.progression,"cinematic");
  assert.equal(leading.voicings.length,result.progression.length,emotion.name);
 }
});

test("pinned note remains fixed across global voice-leading optimization", () => {
 const data=E.analyze(0,DATA.EMOTIONS.nostalgia,DATA.COMPOSERS.williams,"ionian",DATA);
 const baseline=E.voiceLead(data.progression,"cinematic");
 const pitch=baseline.voicings[1][2];
 const locked=E.voiceLead(data.progression,"cinematic",{1:{2:pitch}});
 assert.equal(locked.voicings[1][2],pitch);
 assert.equal(locked.voicings.length,data.progression.length);
 const impossible=E.voiceLead(data.progression,"cinematic",{1:{2:127}});
 assert.equal(impossible.voicings.length,0);
 assert.match(impossible.warning,/nota|voz|disposición/i);
});

test("dominant tendency tones are evaluated only for authentic root resolution", () => {
 const dominant={root:7,notes:[7,11,2,5]};
 const tonic={root:0,notes:[0,3,7]};
 const good=E.tendencyResolution([43,53,59,65],[48,52,60,63],dominant,tonic);
 const bad=E.tendencyResolution([43,53,59,65],[48,53,59,65],dominant,tonic);
 assert.equal(good.penalty,0);
 assert.ok(bad.penalty>good.penalty);
 assert.equal(E.tendencyResolution([43,53,59,65],[48,53,59,65],dominant,{root:2,notes:[2,5,9]}).penalty,0);
});

test("P L R transformations preserve two notes and one chromatic or whole-tone move", () => {
 const expected={P:[0,"minor",-1],L:[4,"minor",-1],R:[9,"minor",2]};
 for(const [op,[root,quality,delta]] of Object.entries(expected)){
  const t=E.neoTransform(0,"major",op);
  assert.equal(t.target.root,root);
  assert.equal(t.target.quality,quality);
  assert.equal(t.common.length,2);
  assert.equal(t.movement.semitones,delta);
 }
 for(let root=0;root<12;root++)for(const quality of ["major","minor"])for(const op of ["P","L","R"]){
  const t=E.neoTransform(root,quality,op);
  const reverse=E.neoTransform(t.target.root,t.target.quality,op);
  assert.deepEqual(new Set(reverse.target.notes),new Set(t.source.notes));
  assert.equal(t.common.length,2);
 }
 assert.equal(E.neoTransform(0,"diminished","P"),null);
});

test("composer assistance offers explainable options without mutating original material", () => {
 const chords=[{root:0,type:"m",label:"Cm"},{root:7,type:"7",label:"G7"}];
 const original=JSON.stringify(chords);
 for(const id of ["williams","herrmann","zimmer"]){
  const ideas=E.composerAssistance(id,chords);
  assert.equal(ideas.length,3);
  assert.ok(ideas.every(x=>x.action&&x.reason&&x.observation&&x.changesOriginal===false));
 }
 assert.equal(JSON.stringify(chords),original);
 assert.equal(E.composerAssistance("unknown",chords).length,0);
});

test("user chord parsing is non-destructive and validates input",()=>{
 const parsed=E.parseUserProgression("Cm Abmaj7 Fm7 G7");
 assert.equal(parsed.errors.length,0);
 assert.equal(parsed.chords.length,4);
 assert.equal(parsed.chords[0].root,0);
 assert.equal(parsed.chords[0].notes.join(","),"0,3,7");
 assert.equal(E.parseUserProgression("C/E").chords[0].bass,4);
 assert.equal(E.parseUserProgression("C/H").errors.length,1);
 assert.equal(E.parseUserProgression("C/F#").errors.length,1);
 assert.equal(E.parseUserProgression("C ".repeat(17)).errors.length,1);
});

test("laboratory three and four voices have independent valid pitches",()=>{
 const chords=E.parseUserProgression("Cm Abmaj7 Fm7 G7").chords;
 for(const count of [3,4]){
  const result=E.laboratoryVoices(chords,{count,style:"classical"});
  assert.equal(result.voicings.length,chords.length);
  assert.equal(result.voiceOrder.length,count);
  result.voicings.forEach((voices,i)=>{
   assert.equal(voices.length,count);
   assert.equal(voices[0]%12,chords[i].bass);
   assert.ok(voices.every((n,j)=>chords[i].notes.includes(n%12)&&(j===0||n>voices[j-1])));
  });
  assert.equal(result.transitions.length,chords.length-1);
 }
 assert.equal(E.laboratoryVoices(chords,{count:5}).count,4);
});
test("three-voice melody lock is respected and impossible locks fail safely",()=>{
 const chords=E.parseUserProgression("Cm Fm G7 Cm").chords;
 const initial=E.laboratoryVoices(chords,{count:3});
 assert.ok(initial.voicings.length);
 const pitch=initial.voicings[0][2];
 const locked=E.laboratoryVoices(chords,{count:3,locks:{0:{3:pitch}}});
 assert.equal(locked.voicings[0][2],pitch);
 const impossible=E.laboratoryVoices(chords,{count:3,locks:{0:{3:1}}});
 assert.equal(impossible.voicings.length,0);
});
test("sustained tones and adjacent pitch-class comparisons are non-destructive",()=>{
 const chords=E.parseUserProgression("Cm Abmaj7 Fm7 G7").chords;
 const original=JSON.stringify(chords);
 const tones=E.sustainedToneAnalysis(chords);
 assert.equal(tones.length,12);
 assert.equal(tones[0].steps.length,4);
 const links=E.adjacentVoiceMotion(chords);
 assert.equal(links.length,3);
 assert.equal(JSON.stringify(chords),original);
});

test("motion diagnostics distinguish parallels, contrary and oblique motion",()=>{
 const fifths=E.voiceMotionDiagnostics([48,55,64],[50,57,65]);
 assert.equal(fifths.parallelFifths,1);
 assert.equal(fifths.parallelOctaves,0);
 const contrary=E.voiceMotionDiagnostics([48,60,67],[50,59,67]);
 assert.ok(contrary.contraryPairs>=1);
 assert.ok(contrary.obliquePairs>=1);
 const stationary=E.voiceMotionDiagnostics([48,55],[48,55]);
 assert.equal(stationary.parallelFifths,0);
});
test("cinematic mode reports contrapuntal parallels as review, not errors",()=>{
 const chords=E.parseUserProgression("Cm Fm G7 Cm").chords;
 for(const style of ["classical","cinematic"]){
  const result=E.laboratoryVoices(chords,{count:3,style});
  assert.equal(result.diagnostics.length,3);
  assert.ok(result.warnings.every(w=>w.severity==="review"||style==="classical"&&w.severity==="warning"));
 }
});

test("harmonic resolution diagnostics require a dominant-to-tonic context",()=>{
 const V={root:7,notes:[7,11,2,5]},I={root:0,notes:[0,4,7]};
 const a=[43,53,59],resolved=[48,52,60],unresolved=[48,53,59];
 assert.equal(E.harmonicResolutionDiagnostics(a,resolved,V,I).penalty,0);
 const flagged=E.harmonicResolutionDiagnostics(a,unresolved,V,I);
 assert.ok(flagged.penalty>0);
 assert.ok(flagged.observations.some(x=>x.kind==="leading-tone"));
 assert.equal(E.harmonicResolutionDiagnostics(a,unresolved,V,{root:2,notes:[2,5,9]}).penalty,0);
});
test("three-voice laboratory exposes harmonic resolution diagnostics",()=>{
 const chords=E.parseUserProgression("G7 C").chords;
 const result=E.laboratoryVoices(chords,{count:3,style:"classical"});
 assert.equal(result.diagnostics.length,1);
 assert.ok(Array.isArray(result.diagnostics[0].harmonic.observations));
});

test("inverted seventh chords retain bass, third and seventh in three voices",()=>{
 for(const symbol of ["G7/B","G7/F","Cmaj7/E","Cm7/Bb"]){
  const chord=E.parseUserProgression(symbol).chords[0];
  const choices=E.threeVoiceCandidates(chord,"classical");
  assert.ok(choices.length>0,symbol+" must have candidates");
  const root=chord.root,third=chord.notes.find(p=>[3,4].includes((p-root+12)%12));
  const seventh=chord.notes.find(p=>[10,11].includes((p-root+12)%12));
  for(const notes of choices){
   const pcs=notes.map(n=>n%12);
   assert.equal(pcs[0],chord.bass);
   assert.ok(pcs.includes(third),symbol+" third");
   assert.ok(pcs.includes(seventh),symbol+" seventh");
  }
 }
});
test("all supported user chord types yield bounded laboratory candidates",()=>{
 for(const symbol of ["C","Cm","C7","Cmaj7","Cm7","Cdim","Caug","Csus4","Cadd9","Cmadd9","C/E"]){
  const chord=E.parseUserProgression(symbol).chords[0];
  assert.ok(chord,symbol);
  for(const style of ["classical","cinematic"]){
   const candidates=E.threeVoiceCandidates(chord,style);
   assert.ok(candidates.length<5000,symbol+" "+style);
   assert.ok(candidates.every(v=>v.length===3&&v[0]<v[1]&&v[1]<v[2]));
  }
 }
});
test("laboratory repeated short progressions are deterministic and do not mutate source",()=>{
 const chords=E.parseUserProgression("Cm Abmaj7 Fm7 G7 Cm").chords;
 const snapshot=JSON.stringify(chords);
 for(const count of [3,4]){
  const first=E.laboratoryVoices(chords,{count,style:"cinematic"});
  const second=E.laboratoryVoices(chords,{count,style:"cinematic"});
  assert.equal(JSON.stringify(first.voicings),JSON.stringify(second.voicings));
 }
 assert.equal(JSON.stringify(chords),snapshot);
});

test("laboratory interface retains progressive disclosure and only 3 or 4 voices",()=>{
 assert.ok(html.includes('id="labLockDetails"'));
 assert.ok(html.includes('<option value="3">Tres voces'));
 assert.ok(html.includes('<option value="4">Cuatro voces SATB'));
 assert.ok(!html.includes('<option value="5">Cinco voces'));
 for(const id of ["labVoiceCount","labVoiceStyle","labLockChord","labLockVoice","labLockPitch","labVoiceOutput"]){
  assert.ok(html.includes('id="'+id+'"'),id+" missing");
 }
});

test("longer laboratory progressions preserve voicing count and finite cost",()=>{
 const chords=E.parseUserProgression("Cm Abmaj7 Fm7 G7 Cm Eb Bb7 Eb Cm Abmaj7 Fm7 G7").chords;
 assert.equal(chords.length,12);
 for(const count of [3,4]){
  const start=process.hrtime.bigint();
  const result=E.laboratoryVoices(chords,{count,style:"cinematic"});
  const elapsedMs=Number(process.hrtime.bigint()-start)/1e6;
  assert.equal(result.voicings.length,chords.length);
  assert.ok(Number.isFinite(result.cost));
  assert.ok(result.voicings.every(v=>v.length===count));
  console.log("Laboratorio "+count+" voces, 12 acordes: "+elapsedMs.toFixed(1)+" ms (CI; no es medición de navegador)");
 }
});
test("single chord, empty progression and impossible locks are stable",()=>{
 const chord=E.parseUserProgression("Cm").chords[0];
 for(const count of [3,4]){
  const one=E.laboratoryVoices([chord],{count});
  assert.equal(one.voicings.length,1);
  assert.equal(one.transitions.length,0);
  const empty=E.laboratoryVoices([],{count});
  assert.equal(empty.voicings.length,0);
  const impossible=E.laboratoryVoices([chord],{count,locks:{0:{0:0}}});
  assert.equal(impossible.voicings.length,0);
 }
});
