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
 const ints=[...new Set(intervals.map(mod))].sort((a,b)=>a-b);
 const has=(...tones)=>tones.every(n=>ints.includes(n));
 // Interpret quality from structural chord tones, independently of extensions and ordering.
 // An altered fifth is not silently interpreted as a perfect fifth.
 if(has(0,4,7,10))return "dominant seventh";
 if(has(0,4,7,11))return "major seventh";
 if(has(0,3,7,10))return "minor seventh";
 if(has(0,3,7,11))return "minor-major seventh";
 if(has(0,3,6,10))return "half-diminished seventh";
 if(has(0,3,6,9))return "diminished seventh";
 if(has(0,4,7))return "major";
 if(has(0,3,7))return "minor";
 if(has(0,3,6))return "diminished";
 if(has(0,4,8))return "augmented";
 return "other";
}
function romanFor(degree,alter,type){
 const base=["I","II","III","IV","V","VI","VII"][degree];
 const minor=["m","m6","m7","m9","m11","mMaj7","m7b5"].includes(type);
 const dim=["dim","dim7"].includes(type);
 const half=type==="m7b5";
 let numeral=minor||dim||half?base.toLowerCase():base;
 if(alter===-2)numeral="𝄫"+numeral;else if(alter===-1)numeral="♭"+numeral;
 else if(alter===1)numeral="♯"+numeral;else if(alter===2)numeral="𝄪"+numeral;
 if(half)numeral+="ø";else if(dim)numeral+="°";else if(type==="aug")numeral+="+";
 const suffix={"7":"7","maj7":"maj7","m7":"7","m9":"9","maj9":"maj9","9":"9","add9":"(add9)","6":"6","m6":"6","dim7":"7","m7b5":"7","mMaj7":"(maj7)","maj7#11":"maj7(♯11)","sus2":"(sus2)","sus4":"(sus4)","5":"5"}[type]||"";
 return numeral+suffix;
}
function identifyType(ints){
 const normalized=[...new Set(ints.map(mod))].sort((a,b)=>a-b);
 const defs=TYPE_DEFS.concat([
  {id:"sus2",label:"sus2",int:[0,2,7]},{id:"sus4",label:"sus4",int:[0,5,7]},{id:"5",label:"5",int:[0,7]},
  ...["m9","maj9","9","add9","6","m6","maj7#11"].map(id=>({id,label:id,int:extensionIntervals(id)}))
 ]);
 return defs.find(x=>x.int.length===normalized.length&&x.int.every(n=>normalized.includes(n)))||{id:"custom",label:"",int:normalized};
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
 const allowed=new Set(scale(tonic,mode)),pcs=chord.notes.map(mod),inMode=pcs.every(p=>allowed.has(p));
 const currentMode=Object.entries(MODAL_INTERVALS).find(([,ints])=>ints.join(",")===mode.int.join(","))?.[0];
 const dominant=["major","dominant seventh"].includes(chord.quality)&&nextChord&&mod(chord.root+5)===mod(nextChord.root)&&pcs.includes(mod(nextChord.root+11));
 if(dominant){
  const primary=mod(nextChord.root)===mod(tonic);
  const classification=primary?(inMode?"dominant":"modalDominant"):"secondaryDominant";
  return {classification,harmonicRole:classification,borrowed:false,chromatic:!inMode,explanation:classification==="dominant"?"Dominante diatónica que conduce a la tónica por quinta descendente.":classification==="modalDominant"?"Dominante mayor que introduce una sensible ajena al modo y conduce al centro modal.":"Dominante secundaria dirigida al acorde siguiente por relación de quinta; verifica sensible y resolución de la séptima."};
 }
 if(inMode)return {classification:"diatonic",harmonicRole:"diatonic",borrowed:false,chromatic:false,explanation:"Todas sus notas pertenecen al modo seleccionado."};
 const currentPcs=new Set((MODAL_INTERVALS[currentMode]||mode.int).map(n=>mod(tonic+n)));
 const borrowedCandidates=Object.entries(MODAL_INTERVALS).filter(([name,ints])=>name!==currentMode&&pcs.every(p=>ints.map(n=>mod(tonic+n)).includes(p))).map(([name,ints])=>({name,score:[...new Set(ints.map(n=>mod(tonic+n)))].filter(p=>!currentPcs.has(p)).length+[...currentPcs].filter(p=>!ints.map(n=>mod(tonic+n)).includes(p)).length}));
 borrowedCandidates.sort((a,b)=>a.score-b.score);
 const borrowedMode=borrowedCandidates[0]?.name;
 if(borrowedMode)return {classification:"modalInterchange",harmonicRole:"modalInterchange",borrowed:false,chromatic:true,borrowedFrom:borrowedMode,explanation:"Compatible con el modo paralelo "+borrowedMode+"; el intercambio modal es una hipótesis, no una función demostrada."};
 return {classification:"chromatic",harmonicRole:"chromatic",borrowed:false,chromatic:true,explanation:"Contiene notas ajenas al modo; no se atribuye función sin contexto adicional."};
}
function buildProfileProgression(steps,tonic,mode,keyName){
 const raw=steps.map(s=>{
  const degree=s.d,alter=s.a||0,pc=profileDegreePc(tonic,mode,degree,alter),rootName=spellDegreePc(tonic,degree,pc,keyName);
  const type=extensionType(s.q,s.e),intervals=extensionIntervals(type),pcs=intervals.map(i=>mod(pc+i));
  const chord=chordFromPcs(pcs,rootName),actualAlter=accidentalForPc(pc,degree,tonic);
  return {...chord,label:rootName+type,roman:romanFor(degree,actualAlter,type),degree,root:pc,extension:type,bass:pc};
 });
 return raw.map((chord,i)=>{
  const next=raw[i+1],commonWithNext=next?chord.notes.filter(pc=>next.notes.includes(pc)):[];
  return {...chord,...classifyProgressionChord(chord,tonic,mode,next),bass:chord.root,inversion:0,commonWithNext};
 });
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
function modulationIdeas(tonic,mode,composer,keyName,DATA,progression,emotion){
 const sourcePcs=scale(tonic,mode),sourceTriads=sourcePcs.map((_,i)=>diatonicChord(tonic,mode,i,keyName,false));
 const emotionId=Object.entries(DATA.EMOTIONS||{}).find(([,value])=>value===emotion)?.[0]||"";
 const preferences={
  alegria:["up_fifth","up_major3","relative","up_semitone"],
  tristeza:["down_minor3","relative","down_fifth","parallel"],
  nostalgia:["parallel","down_major3","relative","down_fifth"],
  maravilla:["up_major3","up_fifth","tritone","parallel"],
  heroismo:["up_fifth","up_major3","up_semitone","relative"],
  tension:["up_semitone","tritone","down_semitone","neapolitan"],
  oscuridad:["down_semitone","tritone","down_minor3","neapolitan"],
  esperanza:["up_fifth","relative","up_major3","parallel"],
  paz:["relative","down_fifth","parallel","up_fifth"],
  misterio:["tritone","down_minor3","parallel","down_semitone"],
  romance:["relative","up_fifth","parallel","up_major3"],
  epica:["up_fifth","up_minor3","up_major3","tritone"]
 };
 const pref=preferences[emotionId]||["relative","up_fifth","parallel","up_major3"];
 const progress=progression||[],roots=progress.map(chord=>chord.root),last=progress.at(-1);
 const candidateIds=["relative","parallel","up_semitone","down_semitone","up_major3","down_major3","up_minor3","down_minor3","up_fifth","down_fifth","tritone","neapolitan"];
 const candidates=candidateIds.map(id=>{
  if(id==="neapolitan"){
   const rootPc=mod(tonic+1),rootName=spellDegree(tonic,1,DATA.MODES.ionian,keyName,-1);
   const pcs=[mod(rootPc+4),mod(rootPc+7),rootPc],chord={label:rootName+"/"+spell(pcs[0]),root:rootPc,type:"",roman:"♭II6",notes:pcs,bass:pcs[0],inversion:1};
   const vr=mod(tonic+7),dominant={label:spell(vr)+"7",root:vr,type:"7",roman:"V7",notes:[0,4,7,10].map(n=>mod(vr+n)),bass:vr};
   const tonicChord=diatonicChord(tonic,mode,0,keyName,false),phrygian=DATA.modeKey==="phrygian";
   const name=phrygian?"♭II frigio (diatónico)":DATA.modeKey==="aeolian"?"Napolitana N6 (menor)":"Napolitana N6 (color cromático)";
   const target=phrygian?"♭II frigio":("♭II6 → V7 → "+tonicChord.roman);
   const feel=phrygian?"En frigio, ♭II pertenece a la escala: úsalo como color modal, no como napolitana funcional automática.":"Acorde mayor sobre ♭II en primera inversión; puede actuar como predominante hacia V7 y la tónica, si la conducción de voces confirma esa función.";
   const transition=phrygian?"♭II es diatónico en frigio. Prueba su color contra i o un pedal, sin dar por supuesta una cadencia tonal.":"N6 en primera inversión (tercera en el bajo) → V7 con sensible elevada → "+tonicChord.roman+". Comprueba la conducción de voces y la cadencia.";
   const rank=pref.indexOf(id),score=(rank<0?0:3.2-rank*.65)+(last&&last.root===tonic?0.3:0);
   return {id,kind:"color",name,target,feel,common:null,shared:[],pivots:[],chord,resolution:[chord,dominant,tonicChord],transition,score,fitReason:"Color cromático/modal asociado a "+(emotion?.name||"la intención elegida")+". No cambia por sí solo el centro tonal.",cadence:{dominant:dominant.label,tonic:tonicChord.label,label:phrygian?"color modal sobre ♭II":"N6 → V7 → "+tonicChord.label}};
  }
  const target=targetModeFor(id,tonic,DATA.modeKey),targetName=DATA.keyNameForPc(target.tonic),targetMode=DATA.MODES[target.mode]||DATA.MODES.ionian,targetPcs=scale(target.tonic,targetMode);
  const sharedPcs=sourcePcs.filter(p=>targetPcs.includes(p)),targetTriads=targetPcs.map((_,i)=>diatonicChord(target.tonic,targetMode,i,targetName,false)),pivots=[];
  for(const x of sourceTriads)for(const y of targetTriads)if(x.notes.slice().sort((p,q)=>p-q).join(",")===y.notes.slice().sort((p,q)=>p-q).join(","))pivots.push({source:x.label,target:y.label,sourceRoman:x.roman,targetRoman:y.roman,status:"candidate"});
  const unique=pivots.filter((p,i)=>pivots.findIndex(q=>q.source===p.source&&q.target===p.target)===i).slice(0,3),same=target.tonic===tonic;
  const names={relative:"Campo relativo",parallel:"Cambio de modo paralelo",up_semitone:"Región cromática ascendente (semitono)",down_semitone:"Región cromática descendente (semitono)",up_major3:"Mediante cromática ascendente (3ª mayor)",down_major3:"Mediante cromática descendente (3ª mayor)",up_minor3:"Mediante cromática ascendente (3ª menor)",down_minor3:"Mediante cromática descendente (3ª menor)",up_fifth:"Región de quinta ascendente",down_fifth:"Región de quinta descendente",tritone:"Región a distancia de tritono"};
  const dominantRoot=mod(target.tonic+7),dominant={label:spell(dominantRoot)+"7",root:dominantRoot,type:"7",roman:"V7",notes:[0,4,7,10].map(n=>mod(dominantRoot+n)),bass:dominantRoot};
  const dominantDiatonic=dominant.notes.every(pc=>targetPcs.includes(pc));
  const tonicTriad=diatonicChord(target.tonic,targetMode,0,targetName,false),tonicLabel=tonicTriad.label;
  const rank=pref.indexOf(id),preferenceScore=rank<0?0:3.1-rank*.62;
  const pivotScore=Math.min(unique.length,2)*1.25,sharedScore=Math.min(sharedPcs.length,7)*.55;
  const dominantEvidence=last&&["major","dominant seventh"].includes(last.quality)&&mod(last.root-target.tonic)===7&&last.notes.includes(mod(target.tonic+11))?2.4:0;
  const tonicEvidence=roots.includes(target.tonic)?1.1:0;
  const composerRank=Array.isArray(composer.mods)?composer.mods.indexOf(id):-1;
  const composerScore=composerRank<0?0:Math.max(0,.32-composerRank*.04);
  const score=preferenceScore+pivotScore+sharedScore+dominantEvidence+tonicEvidence+composerScore;
  const reasonBits=[];
  if(rank>=0)reasonBits.push("Encaja con "+(emotion?.name||"la intención elegida")+" por su carácter "+(DATA.MODULATIONS?.[id]?.feel||"contrastante"));
  if(unique.length)reasonBits.push("ofrece "+unique.length+" posible(s) acorde(s) pivote");
  if(dominantEvidence)reasonBits.push("el último acorde puede reinterpretarse como dominante del destino");
  else if(sharedPcs.length)reasonBits.push("conserva "+sharedPcs.length+" nota(s) del campo de origen");
  const cadenceCaveat=dominantDiatonic?"":" Advertencia: V7 contiene notas ajenas al modo de destino; es una tonicización tonal cromática, no una cadencia modal diatónica.";
  const transition=unique.length?"Candidatos a acorde pivote (no prueban modulación): "+unique.map(p=>p.source+" ("+p.sourceRoman+") puede reinterpretarse como "+p.target+" ("+p.targetRoman+")").join("; ")+". Después, prepara "+dominant.label+" → "+tonicLabel+" para afirmar el destino.":sharedPcs.length?"No hay tríada pivote clara. Notas comunes: "+sharedPcs.map(p=>noteNameForPc(p,DATA.KEYS_SHARP[targetName]===1)).join(", ")+". Conserva una de ellas y prepara "+dominant.label+" → "+tonicLabel+".":"No hay notas comunes entre ambos campos. Haz perceptible el salto mediante el bajo o una melodía puente y prepara "+dominant.label+" → "+tonicLabel+".";
  return {id,kind:same?"mode":"region",name:names[id]||"Cambio de región",target:targetName,targetMode:targetMode.name,targetPc:target.tonic,feel:DATA.MODULATIONS?.[id]?.feel||"Posibilidad de cambio de región; el nuevo centro debe confirmarse musicalmente.",common:sharedPcs.length,shared:sharedPcs.map(p=>noteNameForPc(p,DATA.KEYS_SHARP[targetName]===1)),pivots:unique,transition:transition+cadenceCaveat,dominantDiatonic,confirmation:"Modulación no confirmada: requiere evidencia cadencial o funcional en el destino.",score,fitReason:reasonBits.join("; ")+".",cadence:{dominant:dominant.label,tonic:tonicLabel,label:"V7 → "+tonicLabel}};
 });
 candidates.sort((a,b)=>b.score-a.score);
 const color=candidates.find(candidate=>candidate.id==="neapolitan");
 const regions=candidates.filter(candidate=>candidate.id!=="neapolitan").slice(0,6);
 return color?[...regions,color]:regions;
}
// Four-voice, register-aware voice-leading. These are suggested realizations, not strict SATB exercises.
const VOICE_RANGES=[[36,60],[48,67],[55,74],[60,84]]; // bass, tenor, alto, soprano
function midiName(n){return spell(n%12)+(Math.floor(n/12)-1);}
function voicingCandidates(chord,style="cinematic"){
 const pcs=[...new Set(chord.notes.map(mod))];
 const ranges=VOICE_RANGES;
 const possibilities=ranges.map(([lo,hi])=>Array.from({length:hi-lo+1},(_,i)=>lo+i).filter(n=>pcs.includes(n%12)));
 const out=[];
 // Assign each distinct chord tone at least once when possible; extensions beyond four tones are optional.
 const required=pcs.length<=4?pcs:pcs.filter(p=>[0,3,4,6,7,8,10,11].some(x=>mod(chord.root+x)===p)).slice(0,4);
 const bassPc=mod(chord.bass??chord.root);
 function walk(i,notes){
  if(out.length>=650)return;
  if(i===4){
   if(required.some(pc=>!notes.some(n=>n%12===pc)))return;
   out.push(notes.slice());return;
  }
  for(const n of possibilities[i]){
   if(i===0&&n%12!==bassPc)continue;
   if(i&&n<=notes[i-1])continue;
   if(i>=2&&n-notes[i-1]>(style==="cinematic"?19:12))continue;
   notes.push(n);walk(i+1,notes);notes.pop();
  }
 }
 walk(0,[]);
 // When a five-note chord cannot fit all tones, prioritize its structural notes.
 return out.slice(0,300);
}

// Neo-Riemannian P/L/R apply to major/minor triads only (pitch-class sets).
function neoTriad(root,quality){
 const r=mod(root);
 if(quality!=="major"&&quality!=="minor")return null;
 return [r,mod(r+(quality==="major"?4:3)),mod(r+7)];
}
function neoTransform(root,quality,operation){
 const source=neoTriad(root,quality);
 if(!source||!["P","L","R"].includes(operation))return null;
 const major=quality==="major";
 const targetRoot=mod(root+(operation==="P"?0:operation==="L"?(major?4:8):(major?9:3)));
 const targetQuality=major?"minor":"major";
 const target=neoTriad(targetRoot,targetQuality);
 const common=source.filter(p=>target.includes(p));
 const removed=source.filter(p=>!target.includes(p));
 const added=target.filter(p=>!source.includes(p));
 let movement=null;
 if(removed.length===1&&added.length===1){
  let delta=mod(added[0]-removed[0]);if(delta>6)delta-=12;
  movement={from:removed[0],to:added[0],semitones:delta};
 }
 return {operation,source:{root:mod(root),quality,notes:source},target:{root:targetRoot,quality:targetQuality,notes:target},common,movement,description:{P:"Paralela: conserva fundamental y quinta; cambia la tercera.",L:"Leittonwechsel: conserva dos notas y desplaza la tercera voz un semitono.",R:"Relativa: conserva dos notas y desplaza la tercera voz un tono."}[operation]};
}
function tendencyResolution(a,b,fromChord,toChord){
 // Only score an actual dominant-to-tonic root motion; avoid assuming function from chord color alone.
 if(!fromChord||!toChord||mod(fromChord.root+5)!==mod(toChord.root))return {penalty:0,leadingTone:0,seventh:0,details:[]};
 const intervals=new Set(fromChord.notes.map(p=>mod(p-fromChord.root)));
 if(!intervals.has(4)||!intervals.has(7))return {penalty:0,leadingTone:0,seventh:0,details:[]};
 const target=mod(toChord.root),leading=mod(target-1),seventh=mod(fromChord.root+10);
 let penalty=0,leadingTone=0,seventhCount=0;const details=[];
 for(let i=1;i<4;i++){
  if(mod(a[i])===leading){
   const resolved=mod(b[i])===target&&b[i]-a[i]===1;
   if(!resolved){penalty+=14;leadingTone++;details.push(["Tenor","Alto","Soprano"][i-1]+": sensible sin resolución ascendente");}
  }
  if(intervals.has(10)&&mod(a[i])===seventh){
   const resolved=b[i]-a[i]===-1||b[i]-a[i]===-2;
   if(!resolved){penalty+=10;seventhCount++;details.push(["Tenor","Alto","Soprano"][i-1]+": séptima sin resolución descendente");}
  }
 }
 return {penalty,leadingTone,seventh:seventhCount,details};
}
function harmonicResolutionDiagnostics(a,b,fromChord,toChord){
 const observations=[];
 if(!fromChord||!toChord||a.length!==b.length)return {observations,penalty:0};
 const root=mod(fromChord.root),target=mod(toChord.root);
 const intervals=new Set(fromChord.notes.map(p=>mod(p-root)));
 const dominantLike=mod(root+5)===target&&intervals.has(4)&&intervals.has(7);
 let penalty=0;
 if(!dominantLike)return {observations,penalty};
 const leading=mod(target-1),seventh=mod(root+10);
 for(let i=1;i<a.length;i++){
  if(mod(a[i])===leading&&b[i]-a[i]!==1){
   observations.push({kind:"leading-tone",voice:i,text:"Sensible sin ascenso por semitono hacia la tónica",level:"classical-warning"});
   penalty+=14;
  }
  if(intervals.has(10)&&mod(a[i])===seventh&&![-1,-2].includes(b[i]-a[i])){
   observations.push({kind:"chordal-seventh",voice:i,text:"Séptima de dominante sin descenso conjunto",level:"classical-warning"});
   penalty+=10;
  }
 }
 return {observations,penalty};
}
function voiceMotionDiagnostics(a,b){
 const diffs=a.map((n,i)=>b[i]-n),observations=[];
 let parallelFifths=0,parallelOctaves=0,contraryPairs=0,obliquePairs=0;
 for(let i=0;i<a.length;i++)for(let j=i+1;j<a.length;j++){
  const x=diffs[i],y=diffs[j];
  if(x*y<0)contraryPairs++;
  if((x===0)!==(y===0))obliquePairs++;
  if(x*y<=0)continue;
  const from=mod(a[j]-a[i]),to=mod(b[j]-b[i]);
  if(from===7&&to===7)parallelFifths++;
  if(from===0&&to===0)parallelOctaves++;
 }
 const largeLeaps=diffs.flatMap((d,i)=>Math.abs(d)>12?[{voice:i,semitones:d}]:[]);
 if(parallelFifths)observations.push({kind:"parallel-fifths",count:parallelFifths,level:"classical-warning",text:"Quintas paralelas entre voces móviles"});
 if(parallelOctaves)observations.push({kind:"parallel-octaves",count:parallelOctaves,level:"classical-warning",text:"Octavas o unísonos paralelos entre voces móviles"});
 if(largeLeaps.length)observations.push({kind:"large-leaps",count:largeLeaps.length,level:"review",text:"Saltos superiores a una octava: revisar registro y función expresiva"});
 return {diffs,parallelFifths,parallelOctaves,contraryPairs,obliquePairs,largeLeaps,observations};
}
// Optional musical priorities: these guide voice movement, not harmonic substitution.
function expressiveVoiceCost(a,b,style){
 const diffs=a.map((n,i)=>b[i]-n);
 const upper=diffs.slice(1);
 const sustained=upper.filter(n=>n===0).length;
 const stepwise=upper.filter(n=>Math.abs(n)<=2).length;
 const bass=diffs[0];
 const contrary=upper.filter(n=>bass*n<0).length;
 const simultaneous=upper.filter(n=>bass*n>0).length;
 if(style==="sustained")return -sustained*4-stepwise*1.5;
 if(style==="contrary")return -contrary*3+simultaneous*1.5;
 return 0;
}
function transitionCost(a,b,style,fromChord=null,toChord=null){
 const diffs=a.map((n,i)=>b[i]-n);
 const motion=diffs.reduce((sum,d,i)=>sum+Math.abs(d)*(i===0?.55:1),0);
 const leap=diffs.reduce((sum,d,i)=>sum+Math.max(0,Math.abs(d)-(i===0?7:5))**2,0);
 let parallels=0;
 for(let i=0;i<4;i++)for(let j=i+1;j<4;j++){
  const from=mod(a[j]-a[i]),to=mod(b[j]-b[i]);
  if(from===to&&(from===0||from===7)&&diffs[i]*diffs[j]>0)parallels++;
 }
 const tendency=tendencyResolution(a,b,fromChord,toChord);
 const weights=style==="classical"?{motion:1,leap:2,parallel:12}:style==="minimal"||style==="sustained"?{motion:2,leap:1.5,parallel:1}:style==="contrary"?{motion:1,leap:1.3,parallel:5}:{motion:1,leap:.8,parallel:1.5};
 return {total:motion*weights.motion+leap*weights.leap+parallels*weights.parallel+tendency.penalty*(style==="minimal"||style==="sustained"?.2:style==="cinematic"?.6:1)+expressiveVoiceCost(a,b,style),motion,leap,parallels,diffs,tendency};
}
// Shared dynamic-programming solver for independent three- and four-voice models.
// Keeps scoring musical-style-specific while centralizing path reconstruction.
function optimizeVoiceLayers(layers,chords,initialScore,transitionScore){
 if(!layers.length)return {voicings:[],cost:0};
 if(layers.some(layer=>!layer.length))return {voicings:[],cost:null};
 let costs=layers[0].map(initialScore);
 const links=[];
 for(let k=1;k<layers.length;k++){
  const next=layers[k].map(()=>Infinity),back=layers[k].map(()=>-1);
  for(let j=0;j<layers[k].length;j++)for(let i=0;i<layers[k-1].length;i++){
   const cost=costs[i]+transitionScore(layers[k-1][i],layers[k][j],chords[k-1],chords[k]);
   if(cost<next[j]){next[j]=cost;back[j]=i;}
  }
  links.push(back);costs=next;
 }
 let best=costs.indexOf(Math.min(...costs));
 const voicings=Array(layers.length);
 for(let k=layers.length-1;k>=0;k--){
  voicings[k]=layers[k][best];
  if(k)best=links[k-1][best];
 }
 return {voicings,cost:Math.min(...costs)};
}
function voiceLead(progression,style="cinematic",locks={}){
 const valid=["classical","cinematic","minimal","sustained","contrary"].includes(style)?style:"cinematic";
 if(!progression?.length)return {style:valid,voicings:[],transitions:[],cost:0};
 const layers=progression.map((chord,i)=>voicingCandidates(chord,valid).filter(v=>Object.entries(locks[i]||{}).every(([voice,pitch])=>v[Number(voice)]===Number(pitch))));
 const solution=optimizeVoiceLayers(layers,progression,
  v=>v.reduce((sum,n,i)=>sum+Math.abs(n-[48,57,64,72][i])*.15,0),
  (a,b,from,to)=>transitionCost(a,b,valid,from,to).total);
 if(!solution.voicings.length)return {style:valid,...solution,transitions:[],warning:"No hay una disposición válida con esas notas fijadas. Libera alguna voz o prueba otro acorde."};
 const voicings=solution.voicings;
 const transitions=voicings.slice(1).map((v,i)=>transitionCost(voicings[i],v,valid,progression[i],progression[i+1]));
 return {style:valid,...solution,transitions,names:voicings.map(v=>v.map(midiName)),voiceOrder:["Bajo","Tenor","Alto","Soprano"],warning:"Realización orientativa: la función, la instrumentación y las resoluciones deben revisarse musicalmente."};
}

function threeVoiceCandidates(chord,style="cinematic"){
 const pcs=[...new Set(chord.notes.map(mod))],bass=mod(chord.bass??chord.root);
 const ranges=[[36,60],[52,76],[60,84]];
 const choices=ranges.map(([lo,hi])=>Array.from({length:hi-lo+1},(_,i)=>lo+i).filter(n=>pcs.includes(n%12)));
 const out=[];
 // Three voices cannot contain all four distinct notes of a seventh chord.
 // Retain the specified bass and prioritize third and seventh; the fifth is optional.
 const third=pcs.find(p=>[3,4].includes(mod(p-chord.root)));
 const seventh=pcs.find(p=>[10,11].includes(mod(p-chord.root)));
 const ninth=pcs.find(p=>mod(p-chord.root)===2);
 const required=new Set([bass]);
 if(pcs.length<=3)pcs.forEach(p=>required.add(p));
 else {
  // Keep the chord-defining color: seventh in seventh chords, ninth in add9 chords.
  const color=seventh===undefined?ninth:seventh;
  for(const p of [third,color,mod(chord.root)]){
   if(p!==undefined&&pcs.includes(p)&&required.size<3)required.add(p);
  }
 }
 for(const low of choices[0]){
  if(low%12!==bass)continue;
  for(const middle of choices[1]){
   if(middle<=low||middle-low>24)continue;
   for(const high of choices[2]){
    if(high<=middle||high-middle>(style==="classical"?12:19))continue;
    const notes=[low,middle,high],represented=new Set(notes.map(n=>n%12));
    if([...required].some(p=>!represented.has(p)))continue;
    out.push(notes);
   }
  }
 }
 return out;
}
function threeVoiceLead(chords,style="cinematic",locks={}){
 if(!chords?.length)return {voicings:[],transitions:[],cost:0};
 const layers=chords.map((ch,i)=>threeVoiceCandidates(ch,style).filter(v=>Object.entries(locks[i]||{}).every(([voice,pitch])=>v[Number(voice)]===Number(pitch))));
 if(layers.some(layer=>!layer.length))return {voicings:[],transitions:[],cost:null,warning:"No hay disposición a tres voces compatible con los acordes y notas fijadas."};
 const score=(a,b,fromChord,toChord)=>{
  const d=a.map((n,i)=>b[i]-n);
  let parallel=0;
  for(let i=0;i<3;i++)for(let j=i+1;j<3;j++)
   if(d[i]*d[j]>0&&mod(a[j]-a[i])===mod(b[j]-b[i])&&[0,7].includes(mod(a[j]-a[i])))parallel++;
  return d.reduce((sum,n,i)=>sum+Math.abs(n)*(i===0?.55:1)+Math.max(0,Math.abs(n)-(i===0?7:5))**2*(style==="classical"?2:.8),0)+parallel*(style==="classical"?12:1.5)+harmonicResolutionDiagnostics(a,b,fromChord,toChord).penalty*(style==="classical"?1:.6);
 };
 const solution=optimizeVoiceLayers(layers,chords,
  v=>v.reduce((sum,n,i)=>sum+Math.abs(n-[48,64,72][i])*.15,0),score);
 const voicings=solution.voicings;
 return {...solution,transitions:voicings.slice(1).map((v,i)=>({diffs:v.map((n,j)=>n-voicings[i][j])}))};
}
function laboratoryVoices(chords,options={}){
 const style=["classical","cinematic","sustained","contrary"].includes(options.style)?options.style:"cinematic";
 const count=Number(options.count)===3?3:4;
 // In three voices, locks use indices 0 (bass) and 2 (upper voice) in the UI.
 const locks=count===3?Object.fromEntries(Object.entries(options.locks||{}).map(([i,voices])=>[i,Object.fromEntries(Object.entries(voices).map(([v,n])=>[v==="3"?"2":v,n]))])):options.locks||{};
 const base=count===3?threeVoiceLead(chords,style,locks):voiceLead(chords,style,locks);
 if(!base.voicings.length)return {...base,count};
 const voicings=base.voicings;
 const voiceOrder=count===3?["Bajo","Voz intermedia","Superior"]:base.voiceOrder;
 const transitions=voicings.slice(1).map((v,i)=>({diffs:v.map((n,j)=>n-voicings[i][j])}));
 const diagnostics=voicings.slice(1).map((v,i)=>({
  ...voiceMotionDiagnostics(voicings[i],v),
  harmonic:harmonicResolutionDiagnostics(voicings[i],v,chords[i],chords[i+1])
 }));
 const warnings=diagnostics.flatMap((d,i)=>[...d.observations,...d.harmonic.observations].map(o=>({
  index:i,kind:o.text,level:o.level,count:o.count,
  severity:style==="classical"&&o.level==="classical-warning"?"warning":"review"
 })));
 return {...base,count,voicings,voiceOrder,transitions,diagnostics,warnings,
  warning:style==="classical"?"Las quintas y octavas paralelas se señalan según criterios contrapuntísticos tradicionales; el contexto puede justificar excepciones.":"Las observaciones no son errores automáticos: comprueba su efecto expresivo, textura e instrumentación."};
}

function parseUserProgression(input){const tokens=String(input||"").trim().split(/[\s,;|]+/).filter(Boolean);if(!tokens.length)return {chords:[],errors:[]};if(tokens.length>16)return {chords:[],errors:["Máximo 16 acordes por análisis."]};const names={"C":0,"D":2,"E":4,"F":5,"G":7,"A":9,"B":11};const shapes={"":{intervals:[0,4,7],type:""},"m":{intervals:[0,3,7],type:"m"},"dim":{intervals:[0,3,6],type:"dim"},"aug":{intervals:[0,4,8],type:"aug"},"7":{intervals:[0,4,7,10],type:"7"},"maj7":{intervals:[0,4,7,11],type:"maj7"},"m7":{intervals:[0,3,7,10],type:"m7"},"sus4":{intervals:[0,5,7],type:"sus4"},"add9":{intervals:[0,4,7,14],type:"add9"},"madd9":{intervals:[0,3,7,14],type:"madd9"}};const chords=[],errors=[];for(const token of tokens){const match=/^([A-Ga-g])([#♯b♭]?)(maj7|madd9|add9|sus4|dim|aug|m7|m|7)?(?:\/([A-Ga-g])([#♯b♭]?))?$/.exec(token);if(!match){errors.push("Acorde no reconocido: "+token);continue;}const pc=(letter,acc)=>((names[letter.toUpperCase()]+(acc==="#"||acc==="♯"?1:acc==="b"||acc==="♭"?-1:0))%12+12)%12;const root=pc(match[1],match[2]),shape=shapes[match[3]||""],bass=match[4]?pc(match[4],match[5]):root;const notes=[...new Set(shape.intervals.map(i=>(root+i)%12))];if(!notes.includes(bass)){errors.push("El bajo de "+token+" no pertenece al acorde; usa una inversión.");continue;}chords.push({root,bass,notes,type:shape.type,quality:shape.type==="m"?"minor":shape.type===""?"major":"other",intervals:shape.intervals,label:token,roman:"—"});}return {chords:errors.length?[]:chords,errors};}
function progressionInsights(chords){return chords.map((ch,i)=>{const next=chords[i+1],prev=chords[i-1];const shared=next?ch.notes.filter(n=>next.notes.includes(n)):[];const bassMotion=next?((next.bass-ch.bass+18)%12)-6:null;return {index:i,label:ch.label,notes:ch.notes.map(n=>spell(n)),previous:prev?.label||null,next:next?.label||null,shared:shared.map(n=>spell(n)),bassMotion,description:next?(shared.length?shared.length+" nota(s) común(es) con "+next.label+": "+shared.map(n=>spell(n)).join(", ")+".":"Sin notas comunes con "+next.label+"."):"Final de la progresión; puedes estudiar su función de llegada."};});}
// Relative comparison of proposed chords, not an absolute aesthetic ranking.
// Contrast is a selectable compositional lens, not a universal quality judgement.
// Pitch-class voice-motion proxy: exhaustive assignment, no octave or voice claims.
function pitchClassMotionEstimate(from,to){
 const a=[...new Set(from.notes.map(mod))],b=[...new Set(to.notes.map(mod))];
 if(!a.length||!b.length)return {distance:0,matched:0,unmatched:Math.max(a.length,b.length),caveat:"Sin alturas registrales ni asignación de voces."};
 const left=a.length<=b.length?a:b,right=a.length<=b.length?b:a;
 let best=Infinity;
 function search(i,used,total){
  if(total>=best)return;
  if(i===left.length){best=Math.min(best,total);return;}
  for(let j=0;j<right.length;j++)if(!(used&(1<<j))){
   const delta=mod(left[i]-right[j]),distance=Math.min(delta,12-delta);
   search(i+1,used|(1<<j),total+distance);
  }
 }
 search(0,0,0);
 return {distance:best,matched:left.length,unmatched:right.length-left.length,
  caveat:"Distancia mínima entre clases de altura; no representa voces, registro, octavas ni paralelismos reales."};
}
function contextualContrastDiagnostics(chords,index,proposal){
 if(!Array.isArray(chords)||!chords[index]||!proposal)return null;
 const current=chords[index],prev=chords[index-1]||null,next=chords[index+1]||null;
 const pcset=ch=>new Set(ch.notes.map(mod));
 const neighbors=[prev,next].filter(Boolean),reference=new Set(neighbors.flatMap(ch=>[...pcset(ch)]));
 const originalDeparture=[...pcset(current)].filter(pc=>!reference.has(pc)).length;
 const proposedDeparture=[...pcset(proposal)].filter(pc=>!reference.has(pc)).length;
 const chromaticDifference=proposedDeparture-originalDeparture;
 const fromOriginal= pitchClassMotionEstimate(current,proposal);
 const incoming=prev?pitchClassMotionEstimate(prev,proposal):null;
 const outgoing=next?pitchClassMotionEstimate(proposal,next):null;
 const currentIncoming=prev?pitchClassMotionEstimate(prev,current):null;
 const currentOutgoing=next?pitchClassMotionEstimate(current,next):null;
 const motionDelta=(incoming?.distance??0)+(outgoing?.distance??0)-
  (currentIncoming?.distance??0)-(currentOutgoing?.distance??0);
 const dominantToNext=!!next&&mod(proposal.root+5)===mod(next.root)&&
  pcset(proposal).has(mod(proposal.root+4));
 const reasons=[
  "Color respecto a acordes vecinos: "+(chromaticDifference>0?"más notas ajenas al conjunto cercano":chromaticDifference<0?"menos notas ajenas al conjunto cercano":"igual número de notas ajenas al conjunto cercano"),
  "Movimiento mínimo estimado hacia vecinos: "+(motionDelta>0?"aumenta":motionDelta<0?"disminuye":"no cambia")+" ("+(motionDelta>0?"+":"")+motionDelta+" semitonos acumulados)",
  dominantToNext?"Posible preparación dominante del acorde siguiente; requiere contexto tonal para confirmarlo":"No se identifica preparación dominante directa del siguiente acorde"
 ];
 return {originalDeparture,proposedDeparture,chromaticDifference,motionDelta,fromOriginal,incoming,outgoing,dominantToNext,reasons,
  caveat:"Contexto local, no tonalidad inferida. La conducción se aproxima por clases de altura sin registro, ritmo ni voces asignadas."};
}
// Three distinct hypotheses; local evidence only, never an inferred global key.
function harmonicContrastCharacter(chords,index,proposal){
 if(!Array.isArray(chords)||!chords[index]||!proposal)return null;
 const current=chords[index],next=chords[index+1]||null;
 const pcs=ch=>new Set(ch.notes.map(mod));
 const quality=ch=>{
  const p=pcs(ch),r=mod(ch.root);
  if(p.has(mod(r+3))&&!p.has(mod(r+4)))return "minor";
  if(p.has(mod(r+4))&&!p.has(mod(r+3)))return "major";
  return "other";
 };
 const currentQuality=quality(current),candidateQuality=quality(proposal);
 const sameRoot=mod(current.root)===mod(proposal.root);
 const modalColor=sameRoot&&currentQuality!==candidateQuality&&
  currentQuality!=="other"&&candidateQuality!=="other";
 const candidatePcs=pcs(proposal);
 const dominant=!!next&&mod(proposal.root+5)===mod(next.root)&&
  candidatePcs.has(mod(proposal.root+4))&&candidatePcs.has(mod(proposal.root+7));
 const leading=next?mod(next.root-1):null;
 const leadingPresent=next!==null&&candidatePcs.has(leading);
 const seventh=mod(proposal.root+10);
 const seventhPresent=dominant&&candidatePcs.has(seventh);
 const tonal=dominant?{
  kind:"tonal",evidence:"Posible dominante hacia "+next.label+
   (leadingPresent?"; contiene la sensible del objetivo":"")+
   (seventhPresent?"; contiene séptima de dominante":"")+
   ". La función requiere confirmación tonal y conducción de voces.",
  confidence:"hipótesis local"}:null;
 const modal=modalColor?{
  kind:"modal",evidence:"Cambio mayor/menor sobre la misma fundamental ("+
   currentQuality+" → "+candidateQuality+"); posible intercambio modal, sin tonalidad establecida.",
  confidence:"hipótesis local"}:null;
 const currentPcs=pcs(current);
 const introduced=[...candidatePcs].filter(pc=>!currentPcs.has(pc));
 const chromatic= introduced.length?{
  kind:"chromatic",evidence:introduced.length+" clase(s) de altura nueva(s) respecto al acorde original; el cromatismo respecto a una escala exige una tonalidad explícita.",
  confidence:"diferencia verificable, interpretación abierta"}:null;
 const hypotheses=[tonal,modal,chromatic].filter(Boolean);
 return {hypotheses,tonal,modal,chromatic,dominant,modalColor,introduced:introduced.map(spell),
  caveat:"Tonal, modal y cromático son lecturas potenciales y pueden coexistir; no se deduce una tonalidad ni se afirma resolución real."};
}
function compareHarmonicAlternatives(chords,index,alternatives,intention="neutral"){
 if(!Array.isArray(chords)||!chords[index]||!Array.isArray(alternatives))return [];
 const current=chords[index],prev=chords[index-1],next=chords[index+1];
 const setOf=ch=>new Set(ch.notes.map(mod));
 const currentSet=setOf(current),currentRoot=mod(current.root);
 const scored=alternatives.map(proposal=>{
  const candidate=setOf(proposal);
  const sharedOriginal=[...candidate].filter(pc=>currentSet.has(pc)).length;
  const sharedPrevious=prev?[...candidate].filter(pc=>setOf(prev).has(pc)).length:null;
  const sharedNext=next?[...candidate].filter(pc=>setOf(next).has(pc)).length:null;
  const changed=[...candidate].filter(pc=>!currentSet.has(pc)).length+
   [...currentSet].filter(pc=>!candidate.has(pc)).length;
  const continuity=(sharedPrevious??0)+(sharedNext??0);
  const rootShift=mod(proposal.root-currentRoot)!==0;
  const thirdOf=ch=>{
   const pcs=setOf(ch),root=mod(ch.root);
   return pcs.has(mod(root+3))&&!pcs.has(mod(root+4))?"minor":
    pcs.has(mod(root+4))&&!pcs.has(mod(root+3))?"major":"other";
  };
  const qualityChange=thirdOf(proposal)!==thirdOf(current);
  // Descriptive additive score; no timing, voicing, dynamics or tonal function.
  const contrastScore=changed*2+(rootShift?1:0)+(qualityChange?1:0);
  const context=contextualContrastDiagnostics(chords,index,proposal);
  const character=harmonicContrastCharacter(chords,index,proposal);
  const contextualContrastScore=contrastScore+Math.max(-2,Math.min(2,context.chromaticDifference))+
   Math.max(-2,Math.min(2,context.motionDelta));
  const contrastReasons=[
   changed+" cambio(s) de clase de altura respecto al acorde original",
   rootShift?"Fundamental diferente":"Fundamental conservada",
   qualityChange?"Cambio de cualidad de tercera":"Cualidad de tercera conservada"
  ];
  return {...proposal,comparison:{sharedOriginal,sharedPrevious,sharedNext,changed,
   continuity,contrast:changed,contrastScore,contextualContrastScore,rootShift,qualityChange,contrastReasons,context,character,
   reasons:[sharedOriginal+" nota(s) conservada(s) respecto al acorde original",
    ...(prev?[sharedPrevious+" nota(s) compartida(s) con el anterior"]:[]),
    ...(next?[sharedNext+" nota(s) compartida(s) con el siguiente"]:[])],
   caveat:"Indicadores descriptivos: no miden tensión percibida, función tonal, ritmo ni calidad artística. El contraste estructural no equivale a sorpresa percibida."}};
 });
 const withRanks=scored.map(p=>({...p,comparison:{...p.comparison,
  continuityRank:1+scored.filter(q=>q.comparison.continuity>p.comparison.continuity).length,
  contrastRank:1+scored.filter(q=>q.comparison.contextualContrastScore>p.comparison.contextualContrastScore).length}}));
 if(intention!=="contrast")return withRanks;
 return withRanks.sort((a,b)=>b.comparison.contextualContrastScore-a.comparison.contextualContrastScore||
  b.comparison.continuity-a.comparison.continuity||a.label.localeCompare(b.label));
}
function chordAlternatives(chords,index){if(!Array.isArray(chords)||index<0||index>=chords.length)return [];const c=chords[index],previous=chords[index-1],next=chords[index+1];const proposals=[];function add(root,type,intervals,why){const notes=[...new Set(intervals.map(x=>mod(root+x)))];if(root===c.root&&type===c.type)return;const label=spell(root)+(type||"");const common=c.notes.filter(n=>notes.includes(n));const nextCommon=next?notes.filter(n=>next.notes.includes(n)):[];proposals.push({label,root,type,notes,common:common.map(n=>spell(n)),nextCommon:nextCommon.map(n=>spell(n)),why,original:c.label,changesOriginal:false});}if(c.type===""||c.type==="m"){for(const op of ["P","L","R"]){const t=neoTransform(c.root,c.type==="m"?"minor":"major",op);if(t)add(t.target.root,t.target.quality==="minor"?"m":"",t.target.quality==="minor"?[0,3,7]:[0,4,7],"Transformación "+op+": conserva dos notas de la tríada y desplaza una voz "+Math.abs(t.movement.semitones)+" semitono(s).");}}if(next){const dominant=mod(next.root+7);add(dominant,"7",[0,4,7,10],"Dominante potencial del acorde siguiente ("+next.label+"). Comprueba la resolución y el contexto tonal; no implica modulación.");}if(previous&&c.type==="m")add(c.root,"m7",[0,3,7,10],"Añadir séptima introduce una tensión que puedes preparar o resolver en la siguiente voz.");return proposals.slice(0,5);}
/* Explainable composition assistance: observations and optional experiments, never edits. */
const COMPOSER_TECHNIQUES={
 williams:[{id:"sequence",name:"Secuencia motívica",domain:"Desarrollo",reason:"Traslada un motivo por grados sucesivos para construir dirección, conservando su identidad rítmica.",action:"Prueba una secuencia ascendente o descendente de tu motivo; decide tú dónde interrumpirla.",source:"Lenguaje sinfónico y desarrollo temático; recurso compartido con la tradición romántica."},{id:"dominant",name:"Preparación de dominante",domain:"Armonía",reason:"Una dominante preparada puede reforzar la llegada sin reemplazar tu tema.",action:"Examina si el penúltimo acorde admite una dominante secundaria o una cadencia más dirigida.",source:"Sintaxis tonal sinfónica; no exclusiva de Williams."},{id:"counterpoint",name:"Contramelodía",domain:"Textura",reason:"Una segunda línea puede intensificar el desarrollo sin modificar la melodía principal.",action:"Busca notas comunes y movimiento contrario en una voz secundaria.",source:"Escritura contrapuntística sinfónica."}],
 herrmann:[{id:"chromatic",name:"Desplazamiento cromático",domain:"Armonía",reason:"Pequeños cambios de una voz pueden alterar la percepción de estabilidad.",action:"Mantén dos notas y prueba un desplazamiento cromático de la tercera en una tríada.",source:"Cromatismo y células armónicas; procedimiento compartido por múltiples autores."},{id:"cell",name:"Célula reiterada",domain:"Motivo",reason:"La repetición con cambios mínimos permite sostener tensión sin una gran progresión.",action:"Aísla dos o tres notas de tu motivo y experimenta con su reiteración y registro.",source:"Economía motívica y repetición en música dramática."},{id:"delay",name:"Resolución aplazada",domain:"Tensión",reason:"Retener una disonancia puede prolongar la expectativa.",action:"Localiza una nota de tendencia y compara resolverla ahora o prolongarla un compás.",source:"Suspensión y ambigüedad armónica."}],
 zimmer:[{id:"pedal",name:"Pedal armónico",domain:"Textura",reason:"Una nota grave sostenida unifica acordes cambiantes y concentra la tensión.",action:"Prueba mantener la tónica o dominante en el bajo mientras evolucionan las voces superiores.",source:"Pedales y construcción por capas; no exclusivos de Zimmer."},{id:"ostinato",name:"Ostinato gradual",domain:"Ritmo",reason:"La repetición rítmica permite aumentar energía sin aumentar el ritmo de cambio armónico.",action:"Extrae una célula rítmica y cambia su registro, acentuación o densidad gradualmente.",source:"Recursos minimalistas y postminimalistas."},{id:"density",name:"Acumulación de capas",domain:"Orquestación",reason:"El crecimiento de densidad puede producir un clímax sin reharmonizar.",action:"Mantén tus acordes y añade capas por etapas, escuchando el cambio de tensión.",source:"Desarrollo textural y orquestal."}]
};
function composerAssistance(composerId,progression=[]){
 const techniques=COMPOSER_TECHNIQUES[composerId]||[];
 const chords=Array.isArray(progression)?progression:[];
 return techniques.map(t=>{
  let observation="Aplica esta técnica a un fragmento de tu propia idea.";
  if(t.id==="chromatic"&&chords.length){
   const c=chords.find(c=>c.type===""||c.type==="m");
   if(c)observation="La tríada "+c.label+" admite operaciones P, L y R: compara notas comunes antes de escoger.";
  }else if(t.id==="dominant"&&chords.length>1){
   observation="Revisa la llegada de "+chords[chords.length-2].label+" a "+chords[chords.length-1].label+" y escucha si pide una preparación más dirigida.";
  }else if(t.id==="pedal"&&chords.length){
   observation="Puedes probar un pedal sobre "+spell(chords[0].root)+" mientras comparas la progresión sin cambiar sus acordes.";
  }else if(t.id==="counterpoint"&&chords.length){
   observation="Observa las notas compartidas entre los primeros acordes y prueba una voz que se mueva en dirección contraria.";
  }
  return {...t,observation,changesOriginal:false};
 });
}

// Pitch-class observations are independent of composer style and do not modify input.
function sustainedToneAnalysis(chords){
 if(!Array.isArray(chords)||!chords.length)return [];
 const roles={0:"fundamental",1:"segunda menor / novena bemol",2:"segunda / novena",3:"tercera menor",4:"tercera mayor",5:"cuarta / oncena",6:"quinta disminuida / oncena aumentada",7:"quinta justa",8:"quinta aumentada / sexta menor",9:"sexta / trecena",10:"séptima menor",11:"séptima mayor"};
 return Array.from({length:12},(_,pc)=>{
  const steps=chords.map((ch,index)=>{
   const root=mod(ch.root),interval=mod(pc-root),chordTone=ch.notes.some(n=>mod(n)===pc);
   const rootBass=mod(ch.bass??ch.root)===pc;
   const classification=rootBass?"bajo indicado":chordTone?"nota del acorde":interval===1?"tensión cromática ♭9":interval===2?"tensión 9":interval===5?"tensión 11 / suspensión posible":interval===6?"tensión cromática ♯11 / ♭5":interval===9?"tensión 13":interval===11?"tensión de séptima mayor":interval===10?"tensión de séptima menor":"nota externa / color";
   return {index,chord:ch.label,interval,role:roles[interval],chordTone,rootBass,classification};
  });
  const chordToneCount=steps.filter(x=>x.chordTone).length;
  const externalCount=steps.length-chordToneCount;
  const externalRuns=[];let run=null;
  for(const step of steps){
   if(!step.chordTone){
    if(!run)run={start:step.index,end:step.index,length:0};
    run.end=step.index;run.length++;
   }else if(run){externalRuns.push(run);run=null;}
  }
  if(run)externalRuns.push(run);
  const changeCount=steps.slice(1).filter((step,i)=>step.chordTone!==steps[i].chordTone).length;
  const bassCount=steps.filter(x=>x.rootBass).length;
  return {pc,note:spell(pc),steps,chordToneCount,externalCount,externalRuns,changeCount,bassCount,
   distinctRoles:new Set(steps.map(x=>x.interval)).size,
   caveat:"Función vertical estimada: sin duración, octava, acento ni voces reales no puede distinguirse una suspensión, apoyatura o pedal ejecutado."};
 }).sort((a,b)=>b.chordToneCount-a.chordToneCount||b.distinctRoles-a.distinctRoles||a.pc-b.pc);
}
// Harmonic context only: proposals describe possible held pitch classes,
// never claim that a melody or MIDI performance actually contains them.
function harmonicContinuityIdeas(chords){
 if(!Array.isArray(chords))return [];
 return chords.slice(0,-1).map((from,index)=>{
  const to=chords[index+1],fromPcs=new Set(from.notes.map(mod)),toPcs=new Set(to.notes.map(mod));
  const common=[...fromPcs].filter(pc=>toPcs.has(pc));
  const changed=[...fromPcs].filter(pc=>!toPcs.has(pc));
  const ideas=[];
  for(const pc of common.slice(0,3)){
   ideas.push({kind:"common-tone",pc,note:spell(pc),title:"Conservar nota común",description:"Mantener "+spell(pc)+" puede conectar "+from.label+" con "+to.label+" sin cambiar de altura.",certainty:"posibilidad"});
  }
  for(const pc of changed.slice(0,3)){
   const interval=mod(pc-to.root);
   const role=interval===2?"novena":interval===5?"oncena":interval===9?"trecena":interval===11?"séptima mayor":interval===10?"séptima menor":interval===1?"novena bemol":interval===6?"oncena aumentada / quinta disminuida":"color externo";
   ideas.push({kind:"held-tension",pc,note:spell(pc),interval,title:"Explorar tensión mantenida",description:"Si se mantiene "+spell(pc)+" sobre "+to.label+", funcionaría verticalmente como "+role+"; comprobar su sonoridad y eventual resolución.",certainty:"posibilidad"});
  }
  const nearest=changed.flatMap(pc=>[...toPcs].map(dest=>({pc,dest,delta:((dest-pc+18)%12)-6}))).filter(x=>x.delta!==0).sort((a,b)=>Math.abs(a.delta)-Math.abs(b.delta)||a.pc-b.pc||a.dest-b.dest)[0];
  if(nearest)ideas.push({kind:"stepwise-option",pc:nearest.pc,note:spell(nearest.pc),target:spell(nearest.dest),semitones:nearest.delta,title:"Explorar movimiento cercano",description:"Una voz podría pasar de "+spell(nearest.pc)+" a "+spell(nearest.dest)+" ("+(nearest.delta>0?"+":"")+nearest.delta+" semitonos); no se presupone registro ni voz real.",certainty:"posibilidad"});
  return {index,from:from.label,to:to.label,common:common.map(spell),ideas,
   caveat:"Sugerencias entre clases de altura: sin melodía, ritmo ni registro no describen notas realmente ejecutadas."};
 });
}
// Compare individual pitch-class paths without inferring voices or rhythmic suspensions.
function tensionDestinations(chords,index){
 if(!Array.isArray(chords)||!Number.isInteger(index)||index<0||index>=chords.length-1)return [];
 const from=chords[index],to=chords[index+1];
 const source=[...new Set(from.notes.map(mod))],target=[...new Set(to.notes.map(mod))];
 const roles=sustainedToneAnalysis([to]);
 const dominantLike=mod(from.root+5)===mod(to.root)&&source.includes(mod(from.root+4))&&source.includes(mod(from.root+7));
 return source.filter(pc=>!target.includes(pc)||[10,11].includes(mod(pc-from.root))||dominantLike&&pc===mod(to.root-1)).map(pc=>{
  const leading=dominantLike&&pc===mod(to.root-1);
  const seventh=[10,11].includes(mod(pc-from.root));
  const paths=roles.map(role=>{
   const step=role.steps[0];
   return {pc:role.pc,note:role.note,semitones:mod(role.pc-pc+6)-6,role:step.role,chordTone:step.chordTone,
    stable:step.chordTone&&[0,3,4,7].includes(step.interval)};
  });
  const resolve=paths.filter(p=>p.stable&&[1,2].includes(Math.abs(p.semitones)))
   .map(p=>({...p,conventional:leading?p.semitones===1&&p.pc===mod(to.root):seventh?p.semitones<0:false}))
   .sort((a,b)=>Number(b.conventional)-Number(a.conventional)||Math.abs(a.semitones)-Math.abs(b.semitones)||a.pc-b.pc);
  const hold=paths.find(p=>p.pc===pc);
  const displace=paths.filter(p=>!p.stable&&[1,2].includes(Math.abs(p.semitones))&&[1,2,5,6,8,9,10,11].includes(mod(p.pc-to.root)))
   .sort((a,b)=>Number(b.chordTone)-Number(a.chordTone)||Math.abs(a.semitones)-Math.abs(b.semitones)||a.pc-b.pc).slice(0,2);
  return {pc,note:spell(pc),from:from.label,to:to.label,
   reason:leading?"Sensible potencial del acorde de llegada":seventh?"Séptima del acorde de partida":"Nota que queda fuera del acorde siguiente",
   resolve,hold,displace,
   caveat:"Posibilidades para una voz. El registro, la duración y el resto de voces determinarán el resultado al escucharlo."};
 });
}
function adjacentVoiceMotion(chords){
 if(!Array.isArray(chords))return [];
 return chords.slice(0,-1).map((ch,i)=>{
  const next=chords[i+1],common=ch.notes.filter(pc=>next.notes.includes(pc));
  const leaving=ch.notes.filter(pc=>!next.notes.includes(pc));
  const arriving=next.notes.filter(pc=>!ch.notes.includes(pc));
  const motions=leaving.map(pc=>{
   const candidates=arriving.map(to=>({from:spell(pc),to:spell(to),semitones:((to-pc+18)%12)-6}));
   return candidates.sort((a,b)=>Math.abs(a.semitones)-Math.abs(b.semitones))[0]||null;
  }).filter(Boolean);
  return {from:ch.label,to:next.label,common:common.map(spell),leaving:leaving.map(spell),arriving:arriving.map(spell),possibleMotions:motions,
   caveat:"Movimientos posibles entre clases de altura, no una conducción de voces real sin registro y asignación de voces."};
 });
}


/**
 * Audit stylistic reference progressions without claiming score provenance.
 * Transposition-invariant fingerprint: ordered root intervals + chord quality.
 * Detects exact duplicates and rotations; rotations are marked as related,
 * not identical, because phrase placement can change harmonic meaning.
 */
function composerProfileAudit(profiles){
 const entries=Object.entries(profiles||{}).map(([id,p])=>{
  const steps=Array.isArray(p.signature)?p.signature:[];
  const mode=p.signatureMode||"ionian";
  const intervals=MODAL_INTERVALS[mode]||MODAL_INTERVALS.ionian;
  const roots=steps.map(x=>mod(intervals[Number(x.d)] + Number(x.a||0)));
  const qualities=steps.map(x=>String(x.q||"")+"|"+String(x.e||""));
  const movements=steps.slice(1).map((x,i)=>mod(roots[i+1]-roots[i]));
  const fingerprint=steps.map((x,i)=>[roots[i],qualities[i]].join(":")).join(";");
  return {id,name:p.name||id,mode,length:steps.length,fingerprint,movements,qualities};
 });
 const pairs=[];
 for(let i=0;i<entries.length;i++)for(let j=i+1;j<entries.length;j++){
  const a=entries[i],b=entries[j];
  const exact=a.fingerprint===b.fingerprint;
  const sameMotion=a.movements.length===b.movements.length&&a.movements.every((n,k)=>n===b.movements[k]);
  const sameQualities=a.qualities.length===b.qualities.length&&a.qualities.every((n,k)=>n===b.qualities[k]);
  if(exact||sameMotion&&sameQualities)pairs.push({a:a.id,b:b.id,kind:exact?"identical":"related",reason:exact?"Mismas alturas relativas y calidades de acordes, incluso si los modos declarados difieren":"Movimiento de raíces y calidades similares; comprobar grados y contexto"});
 }
 return {profiles:entries,pairs,identical:pairs.filter(x=>x.kind==="identical")};
}

// Experimental, opt-in composition bridge: preserve the emotional frame and
// suggest a single composer-derived substitution without mutating either source.
function composerEmotionExperiment(tonic,emotion,composer,DATA){
 const keyName=DATA.keyNameForPc(tonic);
 const emotionalMode=DATA.MODES[emotion.mode];
 const composerMode=DATA.MODES[composer.signatureMode||"ionian"];
 if(!emotionalMode||!composerMode)return {status:"unsupported",alternatives:[]};
 const base=buildProfileProgression(emotion.steps,tonic,emotionalMode,keyName);
 const signature=buildProfileProgression(composer.signature,tonic,composerMode,keyName);
 if(base.length<3||signature.length<2)return {status:"insufficient-material",alternatives:[]};
 const originalFingerprint=ch=>mod(ch.root)+":"+ch.notes.map(n=>mod(n-ch.root)).sort((a,b)=>a-b).join(",");
 const existing=new Set(base.map(originalFingerprint));
 const candidates=signature.slice(1,-1).filter(ch=>!existing.has(originalFingerprint(ch)));
 const options=[];
 for(const candidate of candidates){
  for(let index=1;index<base.length-1;index++){
   const chords=base.map((ch,i)=>i===index?{...candidate}: {...ch});
   const original=base[index];
   const common=original.notes.filter(n=>candidate.notes.includes(n)).length;
   const before=base[index-1],after=base[index+1];
   const neighboringCommon=before.notes.filter(n=>candidate.notes.includes(n)).length+
    after.notes.filter(n=>candidate.notes.includes(n)).length;
   const rootMotion=mod(candidate.root-before.root);
   const score=common*3+neighboringCommon*2-(rootMotion===6?2:0);
   options.push({index,score,changedFrom:original.label,changedTo:candidate.label,
    progression:chords,explanation:"Sustitución experimental de un acorde interior por un gesto del perfil compositivo; conserva inicio, final y los demás acordes. No representa una atribución histórica."});
  }
 }
 options.sort((a,b)=>b.score-a.score||a.index-b.index);
 return {status:options.length?"suggestions":"no-distinct-gesture",base,alternatives:options.slice(0,3),
  limitation:"Experimento armónico: no modela todavía melodía, duración, ritmo, textura ni fraseo. No aplicar automáticamente."};
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
 const mods=modulationIdeas(tonic,mode,composer,keyName,{...DATA,modeKey},progression,emotion);
 return {mode,modeKey,signatureMode,signatureModeKey,scale:scaleNames,scalePcs:pcs,triads,chords,progression,signature,mods,sharp,keyName};
}
root.CinematicoEngine={composerEmotionExperiment,composerProfileAudit,tensionDestinations,harmonicContrastCharacter,contextualContrastDiagnostics,pitchClassMotionEstimate,compareHarmonicAlternatives,harmonicContinuityIdeas,harmonicResolutionDiagnostics,voiceMotionDiagnostics,threeVoiceCandidates,laboratoryVoices,sustainedToneAnalysis,adjacentVoiceMotion,progressionInsights,chordAlternatives,parseUserProgression,COMPOSER_TECHNIQUES,composerAssistance,neoTriad,neoTransform,tendencyResolution,voiceLead,voicingCandidates,transitionCost,PC,spell,spellDegree,spellScale,scale,diatonicChord,buildProfileProgression,modulationIdeas,analyze,extensionIntervals,romanFor,identifyType};
})(typeof window!=="undefined"?window:globalThis);
