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
