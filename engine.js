(function(root){
"use strict";
const MAJOR=[0,2,4,5,7,9,11];
const NOTE_SHARP=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const NOTE_FLAT=["C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B"];
const PC={"C":0,"C#":1,"Db":1,"D":2,"D#":3,"Eb":3,"E":4,"F":5,"F#":6,"Gb":6,"G":7,"G#":8,"Ab":8,"A":9,"A#":10,"Bb":10,"B":11};
const TYPES=[
 {id:"",label:"",int:[0,4,7]},{id:"m",label:"m",int:[0,3,7]},
 {id:"dim",label:"°",int:[0,3,6]},{id:"aug",label:"+",int:[0,4,8]},
 {id:"maj7",label:"maj7",int:[0,4,7,11]},{id:"7",label:"7",int:[0,4,7,10]},
 {id:"m7",label:"m7",int:[0,3,7,10]},{id:"m7b5",label:"ø7",int:[0,3,6,10]},
 {id:"dim7",label:"°7",int:[0,3,6,9]},{id:"mMaj7",label:"m(maj7)",int:[0,3,7,11]}
];
const mod=(n)=>((n%12)+12)%12;
function spell(pc,sharp){return (sharp?NOTE_SHARP:NOTE_FLAT)[mod(pc)];}
function scale(tonic,mode){return mode.int.map(n=>mod(tonic+n));}
function chordType(intervals){
 const key=intervals.join(",");
 const t=TYPES.find(x=>x.int.slice(0,intervals.length).join(",")===key);
 return t||{id:"custom",label:"",int:intervals};
}
function chordFromPcs(pcs,sharp){
 const root=pcs[0], ints=pcs.map(p=>mod(p-root));
 const type=chordType(ints);
 return {root,notes:pcs,label:spell(root,sharp)+type.label,type:type.id,intervals:ints};
}
function diatonicChord(tonic,mode,degree,sharp,seventh){
 const sc=scale(tonic,mode), n=seventh?4:3;
 const pcs=Array.from({length:n},(_,i)=>sc[(degree+i*2)%7]);
 return chordFromPcs(pcs,sharp);
}
function roman(degree,type,alteration){
 const base=["I","II","III","IV","V","VI","VII"][degree];
 const minor=["m","m7","m7b5","mMaj7"].includes(type);
 const diminished=["dim","dim7","m7b5"].includes(type);
 let numeral=minor?base.toLowerCase():base;
 if(diminished)numeral+="°";
 if(type==="aug")numeral+="+";
 return (alteration<0?"♭":alteration>0?"♯":"")+numeral;
}
function progressionStepPc(tonic,sc,degree,alteration){
 const majorPc=mod(tonic+MAJOR[degree]);
 const modalPc=sc[degree];
 if(!alteration)return modalPc;
 const modalDelta=mod(modalPc-majorPc);
 const desired=alteration<0?11:1;
 // Do not flatten/sharpen a note a second time when the selected mode already contains that alteration.
 if(modalDelta===desired)return modalPc;
 return mod(modalPc+alteration);
}
function extensionType(quality,ext){
 const map={
  "major|":"", "minor|":"m", "dim|":"dim", "aug|":"aug",
  "major|7":"7","major|maj7":"maj7","major|add9":"add9","major|6":"6","major|9":"9","major|maj9":"maj9","major|maj7#11":"maj7#11","major|5":"5",
  "minor|7":"m7","minor|9":"m9","minor|m9":"m9","minor|6":"m6","minor|maj7":"mMaj7",
  "dim|7":"dim7"
 };
 return map[quality+"|"+(ext||"")] ?? (quality==="minor"?"m":quality==="dim"?"dim":"");
}
function buildProfileProgression(steps,tonic,mode,sharp){
 const sc=scale(tonic,mode);
 return steps.map(s=>{
  const root=progressionStepPc(tonic,sc,s.d,s.a||0);
  const typ=extensionType(s.q,s.e);
  const def=TYPES.find(t=>t.id===typ);
  let intervals=def?def.int:[0,4,7];
  if(typ==="add9")intervals=[0,4,7,2];
  if(typ==="maj9")intervals=[0,4,7,11,2];
  if(typ==="m9")intervals=[0,3,7,10,2];
  if(typ==="9")intervals=[0,4,7,10,2];
  if(typ==="6")intervals=[0,4,7,9];
  if(typ==="m6")intervals=[0,3,7,9];
  if(typ==="maj7#11")intervals=[0,4,7,11,6];
  if(typ==="5")intervals=[0,7];
  const pcs=intervals.map(i=>mod(root+i));
  const label=spell(root,sharp)+(typ==="m"?"m":typ==="dim"?"°":typ==="aug"?"+":typ);
  const delta=mod(root-(tonic+MAJOR[s.d]));
  const alteration=delta===11?-1:delta===1?1:0;
  const chord=chordFromPcs(pcs,sharp);
  return {...chord,label,roman:roman(s.d,typ,alteration),degree:s.d,root};
 });
}
function modulationIdeas(tonic,mode,composer,sharp){
 const defs={
 relative:{name:"Tonalidad relativa",interval:mode.family==="major"?9:3,feel:"Comparte la mayor parte de las notas; cambia el centro emocional."},
 parallel:{name:"Modo paralelo",interval:0,feel:"Conserva la tónica y cambia el color modal."},
 up_semitone:{name:"Subir un semitono",interval:1,feel:"Un desplazamiento cromático que puede elevar la intensidad."},
 down_semitone:{name:"Bajar un semitono",interval:11,feel:"Oscurece o desplaza la escena con un giro cercano."},
 up_major3:{name:"Mediante cromática ascendente",interval:4,feel:"Salto luminoso y cinematográfico; necesita una transición clara."},
 down_major3:{name:"Mediante cromática descendente",interval:8,feel:"Cambio de color expresivo y algo inesperado."},
 up_minor3:{name:"Mediante menor ascendente",interval:3,feel:"Sorpresa cercana, útil para expandir una idea."},
 down_minor3:{name:"Mediante menor descendente",interval:9,feel:"Desplazamiento melancólico sin alejarse demasiado."},
 up_fifth:{name:"Quinta ascendente",interval:7,feel:"Sensación de apertura y empuje hacia una nueva región."},
 down_fifth:{name:"Quinta descendente",interval:5,feel:"Movimiento amplio, con sensación de reposo."},
 neapolitan:{name:"Región napolitana",interval:1,feel:"Color dramático; prueba el bII como acorde-puerta."},
 tritone:{name:"Relación de tritono",interval:6,feel:"Contraste fuerte; conviene preparar el cambio con intención."}
 };
 return composer.mods.map(id=>{
  const d=defs[id]; const target=mod(tonic+d.interval);
  const from=scale(tonic,mode), targetScale=scale(target,mode);
  const common=from.filter(p=>targetScale.includes(p)).length;
  const shared=from.filter(p=>targetScale.includes(p)).map(p=>spell(p,sharp));
  return {id,name:d.name,target:spell(target,sharp),targetPc:target,feel:d.feel,common,shared};
 });
}
function analyze(tonic,emotion,composer,modeOverride,DATA){
 const mode=DATA.MODES[modeOverride||emotion.mode];
 const sharp=DATA.KEYS_SHARP[DATA.keyNameForPc(tonic)]===1;
 const sc=scale(tonic,mode);
 const chords=sc.map((_,i)=>diatonicChord(tonic,mode,i,sharp,true));
 const progression=buildProfileProgression(emotion.steps,tonic,mode,sharp);
 const signature=buildProfileProgression(composer.signature,tonic,mode,sharp);
 const mods=modulationIdeas(tonic,mode,composer,sharp);
 return {mode,scale:sc.map(p=>spell(p,sharp)),chords,progression,signature,mods,sharp};
}
root.CinematicoEngine={PC,spell,scale,diatonicChord,buildProfileProgression,modulationIdeas,analyze};
})(typeof window!=="undefined"?window:globalThis);