(function(root){
"use strict";
const SHARP=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const FLAT=["C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B"];
const PC={"C":0,"C#":1,"Db":1,"D":2,"D#":3,"Eb":3,"E":4,"F":5,"F#":6,"Gb":6,"G":7,"G#":8,"Ab":8,"A":9,"A#":10,"Bb":10,"B":11};
const NATURAL={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
const LETTERS=["C","D","E","F","G","A","B"];
const MAJOR=[0,2,4,5,7,9,11];
const MODAL_INTERVALS={ionian:[0,2,4,5,7,9,11],dorian:[0,2,3,5,7,9,10],phrygian:[0,1,3,5,7,8,10],lydian:[0,2,4,6,7,9,11],mixolydian:[0,2,4,5,7,9,10],aeolian:[0,2,3,5,7,8,10],locrian:[0,1,3,5,6,8,10]};
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
function spellDegreePc(tonic,degree,pc,keyName){
 const root=keyLetter(keyName),ri=LETTERS.indexOf(root),letter=LETTERS[(ri+degree)%7];
 const natural=NATURAL[letter];let diff=mod(pc-natural);if(diff>6)diff-=12;
 return letter+accidentalText(diff);
}
function spellDegree(tonic,degree,mode,keyName,alter=0){
 return spellDegreePc(tonic,degree,mod(tonic+mode.int[degree]+alter),keyName);
}
function profileDegreePc(tonic,mode,degree,alter){
 const modal=mod(tonic+mode.int[degree]);
 if(!alter)return modal;
 const major=mod(tonic+MAJOR[degree]),delta=mod(modal-major),desired=alter<0?11:1;
 return delta===desired?modal:mod(modal+alter);
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
 const minor=["m","m6","m7","m9","m11","mMaj7","m7b5"].includes(type);
 const dim=["dim","dim7"].includes(type);
 const half=type==="m7b5";
 let numeral=minor||dim||half?base.toLowerCase():base;
 if(alter===-2)numeral="𝄫"+numeral;else if(alter===-1)numeral="♭"+numeral;
 else if(alter===1)numeral="♯"+numeral;else if(alter===2)numeral="𝄪"+numeral;
 if(half)numeral+="ø";else if(dim)numeral+="°";else if(type==="aug")numeral+="+";if(type==="mMaj7")numeral+="(maj7)";
 return numeral;
}
function identifyType(ints){
 const k=ints.join(",");
 const def=TYPE_DEFS.concat([{id:"sus2",label:"sus2",int:[0,2,7]},{id:"sus4",label:"sus4",int:[0,5,7]},{id:"5",label:"5",int:[0,7]}]).find(x=>x.int.join(",")===k);
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
 "major|7":"7","major|maj7":"maj7","major|add9":"add9","major|6":"6","major|9":"9","major|maj9":"maj9","major|maj7#11":"maj7#11","major|5":"5","major|sus2":"sus2","major|sus4":"sus4",
 "minor|7":"m7","minor|9":"m9","minor|m9":"m9","minor|6":"m6","minor|maj7":"mMaj7","minor|sus2":"sus2","minor|sus4":"sus4","dim|7":"dim7"};
 return map[q+"|"+(e||"")]??(q==="minor"?"m":q==="dim"?"dim":q==="aug"?"aug":"");
}
function extensionIntervals(type){
 const map={"":[0,4,7],"m":[0,3,7],"dim":[0,3,6],"aug":[0,4,8],"7":[0,4,7,10],
 "maj7":[0,4,7,11],"m7":[0,3,7,10],"mMaj7":[0,3,7,11],"m9":[0,3,7,10,2],
 "maj9":[0,4,7,11,2],"9":[0,4,7,10,2],"add9":[0,4,7,2],"6":[0,4,7,9],
 "m6":[0,3,7,9],"dim7":[0,3,6,9],"m7b5":[0,3,6,10],"5":[0,7],"maj7#11":[0,4,7,11,6],"sus2":[0,2,7],"sus4":[0,5,7]};
 return map[type]||[0,4,7];
}
function classifyProgressionChord(chord,tonic,mode,nextChord){
 const allowed=new Set(scale(tonic,mode)),pcs=chord.notes.map(mod);
 if(pcs.every(p=>allowed.has(p)))return {classification:"diatonic",harmonicRole:"diatonic",borrowed:false,chromatic:false,explanation:"Todas sus notas pertenecen al modo seleccionado."};
 const currentMode=Object.entries(MODAL_INTERVALS).find(([,ints])=>ints.join(",")===mode.int.join(","))?.[0];
 const dominant=["major","dominant seventh"].includes(chord.quality)&&nextChord&&mod(chord.root+5)===mod(nextChord.root);
 if(dominant){const primary=mod(nextChord.root)===mod(tonic);return {classification:primary?"modalDominant":"secondaryDominant",harmonicRole:primary?"modalDominant":"secondaryDominant",borrowed:false,chromatic:true,explanation:primary?"Dominante mayor que introduce la sensible del centro modal; su resolución al acorde de tónica debe confirmarse.":"Dominante secundaria dirigida al acorde siguiente por relación de quinta; verifica sensible y resolución de la séptima."};}
 const currentPcs=new Set((MODAL_INTERVALS[currentMode]||mode.int).map(n=>mod(tonic+n)));
 const borrowedCandidates=Object.entries(MODAL_INTERVALS).filter(([name,ints])=>name!==currentMode&&pcs.every(p=>ints.map(n=>mod(tonic+n)).includes(p))).map(([name,ints])=>({name,score:[...new Set(ints.map(n=>mod(tonic+n)))].filter(p=>!currentPcs.has(p)).length+[...currentPcs].filter(p=>!ints.map(n=>mod(tonic+n)).includes(p)).length}));
 borrowedCandidates.sort((a,b)=>a.score-b.score);
 const borrowedMode=borrowedCandidates[0]?.name;
 if(borrowedMode)return {classification:"modalInterchange",harmonicRole:"modalInterchange",borrowed:true,chromatic:true,borrowedFrom:borrowedMode,explanation:"El acorde encaja en el modo paralelo "+borrowedMode+": posible intercambio modal."};
 return {classification:"chromatic",harmonicRole:"chromatic",borrowed:false,chromatic:true,explanation:"Contiene notas ajenas al modo; no se atribuye función sin contexto adicional."};
}
function buildProfileProgression(steps,tonic,mode,keyName){
 const raw=steps.map(s=>{
  const degree=s.d,alter=s.a||0,pc=profileDegreePc(tonic,mode,degree,alter),rootName=spellDegreePc(tonic,degree,pc,keyName);
  const type=extensionType(s.q,s.e),intervals=extensionIntervals(type),pcs=intervals.map(i=>mod(pc+i));
  const chord=chordFromPcs(pcs,rootName),actualAlter=accidentalForPc(pc,degree,tonic);
  return {...chord,label:rootName+type,roman:romanFor(degree,actualAlter,type),degree,root:pc,extension:type,bass:pc};
 });
 return raw.map((chord,i)=>({...chord,...classifyProgressionChord(chord,tonic,mode,raw[i+1])}));
}
function relativeTarget(tonic,modeKey){
 const names=["ionian","dorian","phrygian","lydian","mixolydian","aeolian","locrian"],idx=names.indexOf(modeKey);
 if(idx===0)return {tonic:mod(tonic+9),mode:"aeolian"};
 if(idx===5)return {tonic:mod(tonic-9),mode:"ionian"};
 return {tonic:mod(tonic-MAJOR[idx]),mode:"ionian"};
}
function targetModeFor(id,tonic,modeKey){
 if(id==="relative")return relativeTarget(tonic,modeKey);
 if(id==="parallel")return {tonic,mode:modeKey==="ionian"?"aeolian":"ionian"};
 const offsets={up_semitone:1,down_semitone:-1,up_major3:4,down_major3:-4,up_minor3:3,down_minor3:-3,up_fifth:7,down_fifth:-7,tritone:6};
 return {tonic:mod(tonic+(offsets[id]||0)),mode:modeKey};
}
function noteNameForPc(pc,sharp){return spell(pc,sharp);}
function modulationIdeas(tonic,mode,composer,keyName,DATA){
 const sourcePcs=scale(tonic,mode),sourceTriads=sourcePcs.map((_,i)=>diatonicChord(tonic,mode,i,keyName,false));
 return composer.mods.map(id=>{
  if(id==="neapolitan"){
   const rootPc=mod(tonic+1),rootName=spellDegree(tonic,1,DATA.MODES.ionian,keyName,-1);
   const pcs=[mod(rootPc+4),mod(rootPc+7),rootPc],chord={label:rootName+"/"+spell(pcs[0]),root:rootPc,type:"",roman:"♭II6",notes:pcs,bass:pcs[0],inversion:1};
   const vr=mod(tonic+7),dominant={label:spell(vr)+"7",root:vr,type:"7",roman:"V7",notes:[0,4,7,10].map(n=>mod(vr+n)),bass:vr};
   const tonicChord={label:spell(tonic)+"m",root:tonic,type:"m",roman:"i",notes:[0,3,7].map(n=>mod(tonic+n)),bass:tonic};
   const phrygian=DATA.modeKey==="phrygian",aeolian=DATA.modeKey==="aeolian";
   return {id,kind:"color",name:phrygian?"♭II frigio (diatónico)":aeolian?"Napolitana N6 (contexto menor)":"♭II cromático (sin función napolitana asumida)",target:"♭II6 → V7 → i",feel:phrygian?"En frigio, ♭II es diatónico y no equivale automáticamente a una napolitana funcional.":aeolian?"La napolitana tradicional está en primera inversión y actúa como predominante hacia V7, que resuelve a i.":"Este ♭II es un color cromático. Solo debe llamarse napolitana funcional si se usa en contexto tonal menor y resuelve como N6 hacia V(7).",common:null,shared:[],pivots:[],chord,resolution:[chord,dominant,tonicChord],transition:phrygian?"Explora ♭II → i como color frigio; si quieres función tonal, añade una dominante claramente dirigida.":aeolian?"N6 en primera inversión (tercera en el bajo) → V7 con sensible elevada → i. Comprueba la conducción de voces y la cadencia.":"Úsalo como ♭II cromático; no se presupone función napolitana ni resolución tonal."};
  }
  const target=targetModeFor(id,tonic,DATA.modeKey),targetName=DATA.keyNameForPc(target.tonic),targetMode=DATA.MODES[target.mode]||DATA.MODES.ionian,targetPcs=scale(target.tonic,targetMode);
  const sharedPcs=sourcePcs.filter(p=>targetPcs.includes(p)),targetTriads=targetPcs.map((_,i)=>diatonicChord(target.tonic,targetMode,i,targetName,false)),pivots=[];
  for(const x of sourceTriads)for(const y of targetTriads)if(x.notes.slice().sort((p,q)=>p-q).join(",")===y.notes.slice().sort((p,q)=>p-q).join(","))pivots.push({source:x.label,target:y.label,sourceRoman:x.roman,targetRoman:y.roman,status:"candidate"});
  const unique=pivots.filter((p,i)=>pivots.findIndex(q=>q.source===p.source&&q.target===p.target)===i).slice(0,3),same=target.tonic===tonic;
  const names={relative:"Campo jónico relacionado",parallel:"Cambio de marco modal",up_semitone:"Desplazamiento cromático ascendente (semitono)",down_semitone:"Desplazamiento cromático descendente (semitono)",up_major3:"Mediante cromática ascendente (3ª mayor)",down_major3:"Mediante cromática descendente (3ª mayor)",up_minor3:"Mediante cromática ascendente (3ª menor)",down_minor3:"Mediante cromática descendente (3ª menor)",up_fifth:"Región de quinta ascendente",down_fifth:"Región de quinta descendente",tritone:"Región a distancia de tritono"};
  const transition=unique.length?"Candidatos a acorde pivote (no prueban modulación): "+unique.map(p=>p.source+" ("+p.sourceRoman+") puede reinterpretarse como "+p.target+" ("+p.targetRoman+")").join("; ")+". Confirma el destino con dominante, sensible, cadencia y conducción de voces.":sharedPcs.length?"No hay tríada pivote clara. Notas comunes: "+sharedPcs.map(p=>noteNameForPc(p,DATA.KEYS_SHARP[targetName]===1)).join(", ")+". Puedes conservar una nota y después afirmar el nuevo centro.":"No hay notas comunes entre ambos campos. El salto puede ser directo, pero prepara melodía, bajo o dominante del destino.";
  return {id,kind:same?"mode":"region",name:names[id]||"Cambio de región",target:targetName,targetMode:targetMode.name,targetPc:target.tonic,feel:DATA.MODULATIONS?.[id]?.feel||"Posibilidad de cambio de región; el nuevo centro debe confirmarse musicalmente.",common:sharedPcs.length,shared:sharedPcs.map(p=>noteNameForPc(p,DATA.KEYS_SHARP[targetName]===1)),pivots:unique,transition,confirmation:"Modulación no confirmada: requiere evidencia cadencial o funcional en el destino."};
 });
}
function analyze(tonic,emotion,composer,modeOverride,DATA){
 const modeKey=modeOverride||emotion.mode,mode=DATA.MODES[modeKey],keyName=DATA.keyNameForPc(tonic);
 const sharp=DATA.KEYS_SHARP[keyName]===1,pcs=scale(tonic,mode),scaleNames=spellScale(tonic,mode,keyName);
 const triads=pcs.map((_,i)=>diatonicChord(tonic,mode,i,keyName,false));
 const chords=pcs.map((_,i)=>diatonicChord(tonic,mode,i,keyName,true));
 const progression=buildProfileProgression(emotion.steps,tonic,mode,keyName);
 const signatureModeKey=composer.signatureMode||"ionian";
 const signatureMode=DATA.MODES[signatureModeKey]||DATA.MODES.ionian;
 const signature=buildProfileProgression(composer.signature,tonic,signatureMode,keyName);
 const mods=modulationIdeas(tonic,mode,composer,keyName,{...DATA,modeKey});
 return {mode,modeKey,signatureMode,signatureModeKey,scale:scaleNames,scalePcs:pcs,triads,chords,progression,signature,mods,sharp,keyName};
}
root.CinematicoEngine={PC,spell,spellDegree,spellScale,scale,diatonicChord,buildProfileProgression,modulationIdeas,analyze,extensionIntervals,romanFor,identifyType};
})(typeof window!=="undefined"?window:globalThis);
