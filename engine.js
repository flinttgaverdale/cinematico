(function(root){
"use strict";
const SHARP=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const FLAT=["C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B"];
const PC={"C":0,"C#":1,"Db":1,"D":2,"D#":3,"Eb":3,"E":4,"F":5,"F#":6,"Gb":6,"G":7,"G#":8,"Ab":8,"A":9,"A#":10,"Bb":10,"B":11};
const NATURAL={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
const LETTERS=["C","D","E","F","G","A","B"];
const MAJOR=[0,2,4,5,7,9,11];
const TYPE_DEFS=[
 {id:"",label:"",int:[0,4,7]},{id:"m",label:"m",int:[0,3,7]},
 {id:"dim",label:"°",int:[0,3,6]},{id:"aug",label:"+",int:[0,4,8]},
 {id:"maj7",label:"maj7",int:[0,4,7,11]},{id:"7",label:"7",int:[0,4,7,10]},
 {id:"m7",label:"m7",int:[0,3,7,10]},{id:"m7b5",label:"ø7",int:[0,3,6,10]},
 {id:"dim7",label:"°7",int:[0,3,6,9]},{id:"mMaj7",label:"m(maj7)",int:[0,3,7,11]}
];
const mod=n=>((n%12)+12)%12;
function spell(pc,sharp=true){return (sharp?SHARP:FLAT)[mod(pc)];}
function keyLetter(keyName){return (keyName||"C")[0].toUpperCase();}
function accidentalText(n){return n===2?"𝄪":n===1?"♯":n===-1?"♭":n===-2?"𝄫":n>2?"+"+n:n< -2?String(n):"";}
function spellDegree(tonic,degree,mode,keyName,alter=0){
 const root=keyLetter(keyName),ri=LETTERS.indexOf(root),letter=LETTERS[(ri+degree)%7];
 const target=mod(tonic+mode.int[degree]+alter),natural=NATURAL[letter];
 let diff=mod(target-natural);if(diff>6)diff-=12;
 return letter+accidentalText(diff);
}
function spellScale(tonic,mode,keyName){return mode.int.map((_,i)=>spellDegree(tonic,i,mode,keyName));}
function scale(tonic,mode){return mode.int.map(n=>mod(tonic+n));}
function accidentalForPc(pc,degree,tonic){const base=mod(tonic+MAJOR[degree]);let d=mod(pc-base);if(d>6)d-=12;return d;}
function qualityOf(intervals){
 const k=intervals.join(",");
 const map={"0,4,7":"major","0,3,7":"minor","0,3,6":"diminished","0,4,8":"augmented",
 "0,4,7,11":"major seventh","0,4,7,10":"dominant seventh","0,3,7,10":"minor seventh",
 "0,3,6,10":"half-diminished seventh","0,3,6,9":"diminished seventh","0,3,7,11":"minor-major seventh"};
 return map[k]||"other";
}
function romanFor(degree,alter,type){
 const base=["I","II","III","IV","V","VI","VII"][degree];
 const minor=["m","m6","m7","m9","m11","mMaj7"].includes(type);
 const dim=["dim","dim7"].includes(type);
 const half=type==="m7b5";
 let numeral=minor||dim||half?base.toLowerCase():base;
 if(alter===-2)numeral="𝄫"+numeral;else if(alter===-1)numeral="♭"+numeral;
 else if(alter===1)numeral="♯"+numeral;else if(alter===2)numeral="𝄪"+numeral;
 if(half)numeral+="ø";else if(dim)numeral+="°";else if(type==="aug")numeral+="+";
 return numeral;
}
function identifyType(ints){
 const k=ints.join(",");
 const def=TYPE_DEFS.find(x=>x.int.join(",")===k);
 return def||{id:"custom",label:"",int:ints};
}
function chordFromPcs(pcs,rootName){
 const root=pcs[0],ints=pcs.map(p=>mod(p-root)),type=identifyType(ints);
 return {root,notes:pcs,type:type.id,quality:qualityOf(ints),intervals:ints,label:(rootName||spell(root))+type.label};
}
function diatonicChord(tonic,mode,degree,keyName,seventh=true){
 const sc=scale(tonic,mode),count=seventh?4:3;
 const pcs=Array.from({length:count},(_,i)=>sc[(degree+i*2)%7]);
 const name=spellDegree(tonic,degree,mode,keyName);
 const chord=chordFromPcs(pcs,name);
 const alter=accidentalForPc(sc[degree],degree,tonic);
 return {...chord,degree,roman:romanFor(degree,alter,chord.type),notes:pcs};
}
function profileRoot(tonic,mode,degree,alter){
 const pc=mod(tonic+mode.int[degree]+(alter||0));
 const name=spellDegree(tonic,degree,mode,rootKeyName(tonic),alter||0);
 return {pc,name};
}
function rootKeyName(tonic){return Object.keys(PC).filter(k=>k.length<=2&&PC[k]===mod(tonic)).sort((a,b)=>a.length-b.length)[0]||spell(tonic);}
function extensionType(q,e){
 const map={"major|":"","minor|":"m","dim|":"dim","aug|":"aug",
 "major|7":"7","major|maj7":"maj7","major|add9":"add9","major|6":"6","major|9":"9","major|maj9":"maj9","major|maj7#11":"maj7#11","major|5":"5",
 "minor|7":"m7","minor|9":"m9","minor|m9":"m9","minor|6":"m6","minor|maj7":"mMaj7","dim|7":"dim7"};
 return map[q+"|"+(e||"")]??(q==="minor"?"m":q==="dim"?"dim":q==="aug"?"aug":"");
}
function extensionIntervals(type){
 const map={"":[0,4,7],"m":[0,3,7],"dim":[0,3,6],"aug":[0,4,8],"7":[0,4,7,10],
 "maj7":[0,4,7,11],"m7":[0,3,7,10],"mMaj7":[0,3,7,11],"m9":[0,3,7,10,2],
 "maj9":[0,4,7,11,2],"9":[0,4,7,10,2],"add9":[0,4,7,2],"6":[0,4,7,9],
 "m6":[0,3,7,9],"dim7":[0,3,6,9],"m7b5":[0,3,6,10],"5":[0,7],"maj7#11":[0,4,7,11,6]};
 return map[type]||[0,4,7];
}
function buildProfileProgression(steps,tonic,mode,keyName){
 return steps.map(s=>{
  const degree=s.d,alter=s.a||0,pc=mod(tonic+mode.int[degree]+alter);
  const rootName=spellDegree(tonic,degree,mode,keyName,alter);
  const type=extensionType(s.q,s.e),intervals=extensionIntervals(type),pcs=intervals.map(i=>mod(pc+i));
  const chord=chordFromPcs(pcs,rootName);
  const actualAlter=accidentalForPc(pc,degree,tonic);
  const roman=romanFor(degree,actualAlter,type);
  const diatonic=mod(pc-(tonic+mode.int[degree]))===0;
  return {...chord,label:rootName+(type==="m"?"m":type==="dim"?"°":type==="aug"?"+":type),roman,degree,root:pc,
   diatonic,borrowed:!diatonic||!isQualityDiatonic(type,tonic,mode,degree),extension:type};
 });
}
function isQualityDiatonic(type,tonic,mode,degree){
 const triad=diatonicChord(tonic,mode,degree,rootKeyName(tonic),false).type;
 const expected={"major":"","minor":"m","diminished":"dim","augmented":"aug"}[qualityOf(extensionIntervals(type).slice(0,3))];
 return triad===type||triad===expected;
}
function relativeTarget(tonic,mode){
 const names=["ionian","dorian","phrygian","lydian","mixolydian","aeolian","locrian"];
 const idx=names.indexOf(Object.keys(root.MODES||{}).find(k=>root.MODES[k]===mode));
 if(idx===0)return {tonic:mod(tonic+9),mode:"aeolian"};
 if(idx===5)return {tonic:mod(tonic-9),mode:"ionian"};
 return {tonic:mod(tonic-MAJOR[idx]),mode:"ionian"};
}
function targetModeFor(id,tonic,mode){
 if(id==="relative")return relativeTarget(tonic,mode);
 if(id==="parallel")return {tonic,mode:mode.name==="Mayor (Jónico)"?"aeolian":"ionian"};
 const offsets={up_semitone:1,down_semitone:-1,up_major3:4,down_major3:-4,up_minor3:3,down_minor3:-3,up_fifth:7,down_fifth:-7,tritone:6};
 return {tonic:mod(tonic+(offsets[id]||0)),mode:Object.keys(root.MODES||{}).find(k=>root.MODES[k]===mode)||"ionian"};
}
function noteNameForPc(pc,sharp){return spell(pc,sharp);}
function modulationIdeas(tonic,mode,composer,keyName,DATA){
 const sourcePcs=scale(tonic,mode),sourceTriads=sourcePcs.map((_,i)=>diatonicChord(tonic,mode,i,keyName,false));
 return composer.mods.map(id=>{
  if(id==="neapolitan"){
   const rootPc=mod(tonic+1),rootName=spellDegree(tonic,1,mode,keyName,-1);
   const chord={label:rootName,type:"",roman:"♭II",notes:[rootPc,mod(rootPc+4),mod(rootPc+7)].map(x=>x)};
   return {id,kind:"color",name:"Acorde napolitano",target:"♭II",feel:"No es una modulación: es un acorde mayor sobre el segundo grado rebajado. En menor suele actuar como predominante y pide una resolución convincente.",common:0,shared:[],pivots:[],transition:"Prueba ♭II6 → V → i, o mantén una nota común en la melodía.",chord};
  }
  const target=targetModeFor(id,tonic,mode),targetName=DATA.keyNameForPc(target.tonic);
  const targetMode=DATA.MODES[target.mode]||DATA.MODES.ionian;
  const targetPcs=scale(target.tonic,targetMode);
  const sharedPcs=sourcePcs.filter(p=>targetPcs.includes(p));
  const targetTriads=targetPcs.map((_,i)=>diatonicChord(target.tonic,targetMode,i,targetName,false));
  const pivots=[];
  for(const a of sourceTriads)for(const b of targetTriads){
   if(a.notes.slice().sort((x,y)=>x-y).join(",")===b.notes.slice().sort((x,y)=>x-y).join(",")){
    pivots.push({source:a.label,target:b.label,sourceRoman:a.roman,targetRoman:b.roman});
   }
  }
  const unique=pivots.filter((p,i)=>pivots.findIndex(q=>q.source===p.source&&q.target===p.target)===i).slice(0,3);
  const isModeShift=target.tonic===tonic;
  let transition=unique.length
   ?"Acorde pivote posible: "+unique.map(p=>p.source+" ("+p.sourceRoman+") → "+p.target+" ("+p.targetRoman+")").join("; ")+"."
   :sharedPcs.length
    ?"No aparece una tríada común clara. Conserva una nota compartida ("+sharedPcs.map(p=>noteNameForPc(p,DATA.KEYS_SHARP[targetName]===1)).slice(0,3).join(", ")+") y cambia después la armonía."
    :"No hay notas comunes entre las escalas. Prepara el salto con una secuencia cromática, pedal o dominante del destino.";
  return {id,kind:isModeShift?"mode":"modulation",name:id==="relative"?"Región relativa":id==="parallel"?"Modo paralelo":id==="tritone"?"Región a distancia de tritono":id.includes("fifth")?"Región de quinta":id.includes("semitone")?"Desplazamiento cromático": "Mediante cromática",
   target:targetName,targetMode:targetMode.name,targetPc:target.tonic,feel:DATA.MODULATIONS?.[id]?.feel||"Cambio de centro tonal con color modal conservado.",common:sharedPcs.length,
   shared:sharedPcs.map(p=>noteNameForPc(p,DATA.KEYS_SHARP[targetName]===1)),pivots:unique,transition};
 });
}
function analyze(tonic,emotion,composer,modeOverride,DATA){
 const modeKey=modeOverride||emotion.mode,mode=DATA.MODES[modeKey],keyName=DATA.keyNameForPc(tonic);
 const sharp=DATA.KEYS_SHARP[keyName]===1,pcs=scale(tonic,mode),scaleNames=spellScale(tonic,mode,keyName);
 const triads=pcs.map((_,i)=>diatonicChord(tonic,mode,i,keyName,false));
 const chords=pcs.map((_,i)=>diatonicChord(tonic,mode,i,keyName,true));
 const progression=buildProfileProgression(emotion.steps,tonic,mode,keyName);
 const signature=buildProfileProgression(composer.signature,tonic,mode,keyName);
 const mods=modulationIdeas(tonic,mode,composer,keyName,DATA);
 return {mode,modeKey,scale:scaleNames,scalePcs:pcs,triads,chords,progression,signature,mods,sharp,keyName};
}
root.CinematicoEngine={PC,spell,spellDegree,spellScale,scale,diatonicChord,buildProfileProgression,modulationIdeas,analyze};
})(typeof window!=="undefined"?window:globalThis);
