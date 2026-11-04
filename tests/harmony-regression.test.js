"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
require("../engine.js");
const E=globalThis.CinematicoEngine;
const MODES={
 ionian:{name:"Jónico",int:[0,2,4,5,7,9,11]},dorian:{name:"Dórico",int:[0,2,3,5,7,9,10]},
 phrygian:{name:"Frigio",int:[0,1,3,5,7,8,10]},lydian:{name:"Lidio",int:[0,2,4,6,7,9,11]},
 mixolydian:{name:"Mixolidio",int:[0,2,4,5,7,9,10]},aeolian:{name:"Eólico",int:[0,2,3,5,7,8,10]},
 locrian:{name:"Locrio",int:[0,1,3,5,6,8,10]}
};
const KEY_NAMES=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const DATA={MODES,KEYS_SHARP:{C:1},keyNameForPc:pc=>KEY_NAMES[pc],MODULATIONS:{},modeKey:"aeolian"};
function progression(steps,mode){return E.buildProfileProgression(steps,0,mode,"C");}

test("las siete fórmulas modales contienen siete notas distintas",()=>{
 for(const mode of Object.values(MODES)){const pcs=E.scale(0,mode);assert.equal(pcs.length,7);assert.equal(new Set(pcs).size,7);}
});
test("los acordes de séptima diatónicos permanecen dentro de cada modo",()=>{
 for(const mode of Object.values(MODES))for(let degree=0;degree<7;degree++){
  const chord=E.diatonicChord(0,mode,degree,"C",true);
  assert.equal(chord.notes.length,4);
  assert.ok(chord.notes.every(pc=>E.scale(0,mode).includes(pc)));
 }
});
test("el ♭II de Do eólico es cromático respecto al modo y se reconoce como préstamo frigio",()=>{
 const [chord]=progression([{d:1,a:-1,q:"major",e:""}],MODES.aeolian);
 assert.equal(chord.root,1);assert.equal(chord.classification,"modalInterchange");assert.equal(chord.borrowedFrom,"phrygian");
});
test("el ♭II de Do frigio es diatónico",()=>{
 const [chord]=progression([{d:1,a:-1,q:"major",e:""}],MODES.phrygian);
 assert.equal(chord.root,1);assert.equal(chord.classification,"diatonic");
});
test("♭VII mixolidio y ♭VI eólico no reciben una alteración duplicada",()=>{
 const [bVII]=progression([{d:6,a:-1,q:"major",e:""}],MODES.mixolydian);
 const [bVI]=progression([{d:5,a:-1,q:"major",e:""}],MODES.aeolian);
 assert.equal(bVII.root,10);assert.equal(bVII.classification,"diatonic");
 assert.equal(bVI.root,8);assert.equal(bVI.classification,"diatonic");
});
test("G mayor que conduce a Cm desde Do dórico se etiqueta como dominante modal",()=>{
 const [g]=progression([{d:4,a:0,q:"major",e:""},{d:0,a:0,q:"minor",e:""}],MODES.dorian);
 assert.equal(g.root,7);assert.equal(g.classification,"modalDominant");
});
test("A7 que resuelve a Dm se etiqueta como dominante secundaria",()=>{
 const [a7]=progression([{d:5,a:0,q:"major",e:"7"},{d:1,a:0,q:"minor",e:""}],MODES.dorian);
 assert.equal(a7.root,9);assert.equal(a7.classification,"secondaryDominant");
});
test("la napolitana N6 en Do menor coloca F en el bajo y conduce a G7-i",()=>{
 DATA.modeKey="aeolian";
 const [idea]=E.modulationIdeas(0,MODES.aeolian,{mods:["neapolitan"]},"C",DATA);
 assert.equal(idea.chord.roman,"♭II6");assert.equal(idea.chord.bass,5);
 assert.deepEqual(idea.resolution.map(x=>x.root),[1,7,0]);
 assert.deepEqual(idea.resolution[1].notes,[7,11,2,5]);
});
test("un acorde pivote se presenta como candidato, nunca como modulación confirmada",()=>{
 DATA.modeKey="ionian";
 const ideas=E.modulationIdeas(0,MODES.ionian,{mods:["relative"]},"C",{...DATA,modeKey:"ionian"});
 assert.ok(ideas.every(x=>x.pivots.every(p=>p.status==="candidate")));
 assert.ok(ideas.every(x=>String(x.transition).includes("no prueban modulación")||x.pivots.length===0));
});
test("la representación de menor con séptima mayor conserva la calidad",()=>{
 assert.equal(E.romanFor(0,0,"mMaj7"),"i(maj7)");
});
test("las extensiones suspendidas se reconocen",()=>{
 assert.equal(E.identifyType([0,2,7]).id,"sus2");
 assert.equal(E.identifyType([0,5,7]).id,"sus4");
});
