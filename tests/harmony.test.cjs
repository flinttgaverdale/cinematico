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

test("the Dorian cadence explicitly identifies its borrowed major dominant", () => {
  const result=E.analyze(0,DATA.EMOTIONS.esperanza,DATA.COMPOSERS.williams,"dorian",DATA);
  const dominant=result.progression.at(-1);
  assert.equal(dominant.label,"G");
  assert.equal(dominant.roman,"V");
  assert.equal(dominant.borrowed,true);
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
  assert.equal(nap.target,"♭II (D♭)");
  assert.equal(nap.chord.notes.length,3);
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
