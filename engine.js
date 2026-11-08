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
 // A diatonic I–IV is not, by itself, an applied dominant to IV.
 // Reserve secondary-dominant classification for non-diatonic evidence;
 // the primary V–I remains valid even when its notes fit the selected key.
 if(dominant && (mod(nextChord.root)===mod(tonic) || !inMode)){
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
 // With five pitch classes and four voices, preserve the color-defining tones:
 // root, third, seventh and ninth/#11; omit the perfect fifth when necessary.
 const colorIntervals={
  "maj7#11":[0,4,11,6],
  "m9":[0,3,10,2],
  "maj9":[0,4,11,2],
  "9":[0,4,10,2]
 };
 const prioritized=colorIntervals[chord.type]?.map(n=>mod(chord.root+n)).filter(pc=>pcs.includes(pc));
 const required=pcs.length<=4?pcs:prioritized?.length===4?prioritized:
  pcs.filter(p=>[0,3,4,6,7,8,10,11].some(x=>mod(chord.root+x)===p)).slice(0,4);
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
function tendencyResolution(a,b,fromChord,toChord,style="classical"){
 const blank=()=>({penalty:0,leadingTone:0,seventh:0,retainedLeadingTone:0,details:[],observations:[]});
 if(!fromChord||!toChord||a.length!==b.length||fromChord.type!=="7"||
    mod(fromChord.root+5)!==mod(toChord.root))return blank();
 const intervals=new Set(fromChord.notes.map(p=>mod(p-fromChord.root)));
 if(!intervals.has(4)||!intervals.has(7)||!intervals.has(10))return blank();
 const target=mod(toChord.root),leading=mod(target-1),seventh=mod(fromChord.root+10);
 const retainedColor=["maj7","maj9","maj7#11"].includes(toChord.type)&&
  (toChord.notes||[]).some(pc=>mod(pc)===leading);
 const names=a.length===3?["Bajo","Intermedia","Superior"]:["Bajo","Tenor","Alto","Soprano"];
 let penalty=0,leadingTone=0,seventhCount=0,retainedLeadingTone=0;
 const details=[],observations=[];
 for(let i=1;i<a.length;i++){
  if(mod(a[i])===leading){
   const resolved=mod(b[i])===target&&b[i]-a[i]===1;
   const heldAsMajorSeventh=retainedColor&&style!=="classical"&&b[i]===a[i];
   if(heldAsMajorSeventh){
    retainedLeadingTone++;
    observations.push({kind:"retained-leading-tone",voice:i,
     text:names[i]+": sensible mantenida como séptima mayor del acorde de llegada; opción de color, no resolución clásica.",
     level:"contextual-info"});
   }else if(!resolved){
    penalty+=14;leadingTone++;
    const msg=names[i]+": sensible sin resolución ascendente";
    details.push(msg);
    observations.push({kind:"leading-tone",voice:i,text:msg,level:"classical-warning"});
   }
  }
  if(mod(a[i])===seventh){
   const resolved=b[i]-a[i]===-1||b[i]-a[i]===-2;
   if(!resolved){
    penalty+=10;seventhCount++;
    const msg=names[i]+": séptima de dominante sin resolución descendente";
    details.push(msg);
    observations.push({kind:"chordal-seventh",voice:i,text:msg,level:"classical-warning"});
   }
  }
 }
 return {penalty,leadingTone,seventh:seventhCount,retainedLeadingTone,details,observations};
}
// One source of truth for both the three-voice laboratory and four-voice graph.
function harmonicResolutionDiagnostics(a,b,fromChord,toChord,style="classical"){
 const result=tendencyResolution(a,b,fromChord,toChord,style);
 return {observations:result.observations,penalty:result.penalty,retainedLeadingTone:result.retainedLeadingTone};
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
 const tendency=tendencyResolution(a,b,fromChord,toChord,style);
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
  return d.reduce((sum,n,i)=>sum+Math.abs(n)*(i===0?.55:1)+Math.max(0,Math.abs(n)-(i===0?7:5))**2*(style==="classical"?2:.8),0)+parallel*(style==="classical"?12:1.5)+harmonicResolutionDiagnostics(a,b,fromChord,toChord,style).penalty*(style==="classical"?1:.6);
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
  harmonic:harmonicResolutionDiagnostics(voicings[i],v,chords[i],chords[i+1],style)
 }));
 const warnings=diagnostics.flatMap((d,i)=>[...d.observations,...d.harmonic.observations].filter(o=>o.level!=="contextual-info").map(o=>({
  index:i,kind:o.text,level:o.level,count:o.count,
  severity:style==="classical"&&o.level==="classical-warning"?"warning":"review"
 })));
 const expressiveNotes=diagnostics.flatMap((d,i)=>d.harmonic.observations.filter(o=>o.level==="contextual-info").map(o=>({index:i,text:o.text})));
 return {...base,count,voicings,voiceOrder,transitions,diagnostics,warnings,expressiveNotes,
  warning:style==="classical"?"Las quintas y octavas paralelas se señalan según criterios contrapuntísticos tradicionales; el contexto puede justificar excepciones.":"Las observaciones no son errores automáticos: comprueba su efecto expresivo, textura e instrumentación."};
}

function parseUserProgression(input){
 const tokens=String(input||"").trim().split(/[\s,;|]+/).filter(Boolean);
 if(!tokens.length)return {chords:[],errors:[]};
 if(tokens.length>8)return {chords:[],errors:["Máximo 8 acordes por análisis."]};
 const names={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
 // Use the very same interval catalogue as the compositional engine. This
 // prevents creative reference chords becoming impossible to analyse.
 const supported=["maj7#11","mMaj7","m7b5","maj9","madd9","add9",
  "sus4","sus2","dim7","maj7","m9","m7","m6","dim","aug","9","7","6","5","m",""];
 const suffixRegex="("+supported.filter(Boolean).map(x=>x.replace(/[#]/g,"[#♯]").replace(/b(?=5$)/g,"[b♭]")).join("|")+")?";
 const shape=new RegExp("^([A-Ga-g])([#♯b♭]?)"+suffixRegex+"(?:\\/([A-Ga-g])([#♯b♭]?))?$");
 const pc=(letter,acc)=>mod(names[letter.toUpperCase()]+
  (acc==="#"||acc==="♯"?1:acc==="b"||acc==="♭"?-1:0));
 const chords=[],errors=[];
 for(const token of tokens){
  const match=shape.exec(token);
  if(!match){errors.push("Acorde no reconocido: "+token);continue;}
  const type=(match[3]||"").replaceAll("♯","#").replaceAll("♭","b");
  if(!supported.includes(type)){errors.push("Tipo de acorde no reconocido: "+token);continue;}
  const root=pc(match[1],match[2]),bass=match[4]?pc(match[4],match[5]):root;
  const intervals=extensionIntervals(type);
  const notes=[...new Set(intervals.map(i=>mod(root+i)))];
  if(!notes.includes(bass)){
   errors.push("El bajo de "+token+" no pertenece al acorde; usa una inversión.");
   continue;
  }
  chords.push({root,bass,notes,type,quality:type==="m"?"minor":type===""?"major":"other",
   intervals:intervals.slice(),label:token,roman:"—"});
 }
 return {chords:errors.length?[]:chords,errors};
}
// Chord families preserve triadic identity when optional colors are added.
const MAJOR_TONIC_TYPES=["","maj7","maj9","maj7#11","add9","6"];
const MINOR_TONIC_TYPES=["m","m7","m9","mMaj7","madd9","m6"];
const DOMINANT_TYPES=["","7","9"];
// A diatonic target is identified by its triad, never by a count of matching
// notes: Bm7 has three C-major notes, but its F# makes the triad non-diatonic.
function diatonicTargetTriad(chord,scaleSet){
 const intervals=chord.notes.map(n=>mod(n-chord.root));
 const third=intervals.includes(4)?4:intervals.includes(3)?3:null;
 return third!==null&&[0,third,7].every(n=>intervals.includes(n)&&scaleSet.has(mod(chord.root+n)));
}
// Symbolic cadence evidence. No claim about meter, melody, or phrase boundaries.
function cadenceEvidence(chords,tonic,mode){
 const events=[];if(!Array.isArray(chords)||!chords.length)return events;
 const minor=mode==="menor natural",t=mod(tonic),v=mod(t+7),ii=mod(t+2),iv=mod(t+5);
 const tonicQuality=minor?MINOR_TONIC_TYPES:MAJOR_TONIC_TYPES;
 const isTonic=c=>mod(c.root)===t&&tonicQuality.includes(c.type);
 const isDominant=c=>mod(c.root)===v&&DOMINANT_TYPES.includes(c.type);
 const isPredominant=c=>(mod(c.root)===ii&&(minor?["dim","m7b5","m"].includes(c.type):["m","m7","m9","madd9"].includes(c.type)))||(mod(c.root)===iv&&(minor?["m","m7","m9","madd9"].includes(c.type):MAJOR_TONIC_TYPES.includes(c.type)));
 const diatonic=new Set((minor?[0,2,3,5,7,8,10]:[0,2,4,5,7,9,11]).map(n=>mod(t+n)));
 for(let i=1;i<chords.length;i++){
  const prev=chords[i-1],cur=chords[i],prevRoot=mod(prev.root),curRoot=mod(cur.root);
  if(isDominant(prev)&&isTonic(cur)){
   const rootPositions=mod(prev.bass??prev.root)===v&&mod(cur.bass??cur.root)===t;
    events.push({kind:"V–I/i",index:i,weight:rootPositions?2.5:1.5,description:"Dominante hacia tónica; "+(rootPositions?"bajos en posición fundamental":"al menos una inversión")+"; llegada armónica, no cadencia formal confirmada"});
   if(i>=2&&isPredominant(chords[i-2]))events.push({kind:"predominante–V–I/i",index:i,weight:2.3,description:"Preparación predominante, dominante y llegada"});
  }
  if(prevRoot===iv&&isTonic(cur)&&isPredominant(prev))events.push({kind:"IV–I / iv–i",index:i,weight:.8,description:"Movimiento plagal posible"});
  if(isDominant(prev)&&curRoot===mod(t+(minor?8:9))&&(minor?MAJOR_TONIC_TYPES:MINOR_TONIC_TYPES).includes(cur.type))
   events.push({kind:minor?"V–VI":"V–vi",index:i,weight:.7,description:"Resolución interrumpida posible"});
  // Applied dominant-seventh core, optionally with a ninth. V7/ names
  // the functional core, not an exact transcription of every extension.
  if(["7","9"].includes(prev.type)&&curRoot===mod(prevRoot+5)&&diatonic.has(curRoot)&&curRoot!==t&&prevRoot!==v
    &&diatonicTargetTriad(cur,diatonic))
   events.push({kind:"V7/"+spell(curRoot),index:i,weight:.65,description:"Dominante secundaria con resolución local; posible tonicización"});
 }
 // Ending on a dominant is a harmonic half-cadence clue, not proof of a phrase ending.
 if(chords.length>=2&&isDominant(chords[chords.length-1])&&!isDominant(chords[chords.length-2])){
  events.push({kind:"semicadencia posible",index:chords.length-1,weight:.4,description:"Final del fragmento sobre dominante; requiere comprobar frase y métrica"});
  const preceding=chords[chords.length-2];
  const earlierTonic=chords.slice(0,-2).some(c=>isTonic(c));
  if(earlierTonic&&isPredominant(preceding))
   events.push({kind:"tónica–predominante–V posible",index:chords.length-1,weight:1.5,description:"Dirección T–PD–V hacia la dominante; no confirma una semicadencia formal"});
 }
 return events;
}
// Evidence for chromatic dominant practice in minor. This describes harmonic
// vocabulary, not a claim that a complete passage uses one fixed minor scale.
function minorDominantEvidence(chords,tonic){
 const empty=description=>({raisedLeadingTone:false,dominantMajor:false,indices:[],minorContext:false,description});
 if(!Array.isArray(chords)||!chords.length)return empty("No hay acordes para evaluar una dominante en menor.");
 const t=mod(tonic),leading=mod(t+11),dominantRoot=mod(t+7);
 // A major V7 implies a raised leading tone in minor only if the minor tonic is evidenced.
 const minorContext=chords.some(ch=>ch&&mod(ch.root)===t&&MINOR_TONIC_TYPES.includes(ch.type));
 if(!minorContext)return empty("No hay tónica menor que justifique atribuir a este centro una sensible elevada.");
 const indices=[];
 for(let i=0;i<chords.length;i++){
  const ch=chords[i];if(!ch||!Array.isArray(ch.notes))continue;
  if(mod(ch.root)===dominantRoot&&DOMINANT_TYPES.includes(ch.type)&&ch.notes.some(n=>mod(n)===leading))indices.push(i);
 }
 return {raisedLeadingTone:indices.length>0,dominantMajor:indices.length>0,minorContext:true,indices,
  description:indices.length?"Se observan tónica menor y dominante mayor con sensible elevada; es práctica tonal menor, no prueba de una escala fija.":"Hay tónica menor, pero no se observa su dominante mayor con sensible elevada."};
}
// Prefer conventional readable keys for tonal labels. These are display spellings,
// not a full double-accidental-aware engraving system.
function tonalCenterSpelling(tonic,minor=false,chords=[]){
 const pc=mod(tonic);
 // Preserve the composer's chosen root spelling when that tonic actually appears.
 const source=Array.isArray(chords)?chords.find(c=>c&&mod(c.root)===pc&&typeof c.label==="string"):null;
 const match=source&&/^([A-Ga-g])([#♯b♭]?)/.exec(source.label);
 if(match)return match[1].toUpperCase()+(match[2]==="♯"?"#":match[2]==="♭"?"b":match[2]);
 const preferFlat=minor?[3,10].includes(pc):[1,3,8,10].includes(pc);
 return spell(pc,!preferFlat);
}
// Conservative tonal hypotheses: compatibility is not proof of a tonic.
// Readable harmonic observations: separate local tonicization, harmonic arrival
// and possible phrase ending without claiming to hear meter, melody or form.
function harmonicContextSummary(chords){
 const reading=tonalHypotheses(chords);
 const best=reading.candidates[0];
 if(!best)return {status:"empty",center:null,observations:[],caveat:"Introduce una progresión para explorar su contexto."};
 const events=best.cadences||[],observations=[];
 const applied=[...new Set(events.filter(e=>e.kind.startsWith("V7/")).map(e=>e.kind.slice(3)))];
 if(applied.length)observations.push("Dominante aplicada hacia "+applied.join(", ")+": posible tonicización local; no demuestra una modulación.");
 if(best.minorDominant?.raisedLeadingTone)
  observations.push("Dominante mayor con sensible elevada sobre un centro menor: recurso tonal menor, no cambio obligatorio de escala.");
 if(events.some(e=>e.kind==="V–I/i"))
  observations.push("Se observa un enlace dominante–tónica; sin melodía ni articulación de frase no se confirma una cadencia formal.");
 else if(events.some(e=>e.kind==="semicadencia posible"))
  observations.push("El fragmento acaba sobre una posible dominante; el cierre de frase no se puede confirmar solo con acordes.");
 if(!observations.length)
  observations.push("No se identifica una llegada dominante–tónica concluyente en la hipótesis principal.");
 return {status:reading.status,center:best.displayLabel||best.label,observations,
  caveat:(reading.status==="ambiguous"?"Hay varias lecturas tonales cercanas. ":reading.status==="insufficient"?"Hay pocos acordes para determinar un centro. ":"Centro tonal provisional. ")+
   "Se analizan acordes, no melodía, ritmo, duraciones ni límites de frase."};
}

function tonalHypotheses(chords){
 if(!Array.isArray(chords)||!chords.length)return {status:"empty",candidates:[],explanation:"Introduce acordes para explorar posibles centros tonales."};
 const patterns=[{mode:"mayor",steps:[0,2,4,5,7,9,11]},{mode:"menor natural",steps:[0,2,3,5,7,8,10]}];
 const candidates=[];
 for(let tonic=0;tonic<12;tonic++)for(const pattern of patterns){
  const scaleSet=new Set(pattern.steps.map(x=>mod(x+tonic)));
  const minorContext=pattern.mode==="menor natural"&&chords.some(ch=>mod(ch.root)===tonic&&MINOR_TONIC_TYPES.includes(ch.type));
  let coverage=0,roots=0,tonicRoots=0,totalWeight=0;
  for(let i=0;i<chords.length;i++){
   const chord=chords[i],weight=i===chords.length-1?1.15:1;totalWeight+=weight;
   const majorV=minorContext&&mod(chord.root)===mod(tonic+7)&&DOMINANT_TYPES.includes(chord.type);
   coverage+=weight*(chord.notes.filter(pc=>scaleSet.has(mod(pc))||(majorV&&mod(pc)===mod(tonic+11))).length/chord.notes.length);
   if(scaleSet.has(mod(chord.root)))roots+=weight;
   if(mod(chord.root)===tonic)tonicRoots+=i===chords.length-1?1.3:1;
  }
  const cadences=cadenceEvidence(chords,tonic,pattern.mode);const cadenceScore=cadences.reduce((sum,x)=>sum+x.weight*(x.index===chords.length-1?1:.45),0);
  const terminalDominantArrival=cadences.some(x=>x.index===chords.length-1&&x.kind==="V–I/i")?.7:0;
  const score=coverage/totalWeight*7+roots/totalWeight+tonicRoots/totalWeight*.8+cadenceScore+terminalDominantArrival;
  candidates.push({tonic,mode:pattern.mode,label:tonalCenterSpelling(tonic,pattern.mode==="menor natural",chords)+" "+pattern.mode,displayLabel:tonalCenterSpelling(tonic,pattern.mode==="menor natural",chords)+" "+(pattern.mode==="menor natural"?"menor":"mayor"),score:Math.round(score*100)/100,coverage:Math.round(coverage/totalWeight*100),cadences,minorDominant:pattern.mode==="menor natural"?minorDominantEvidence(chords,tonic):null});
 }
 candidates.sort((a,b)=>b.score-a.score||a.tonic-b.tonic);
 const best=candidates[0],second=candidates[1],close=candidates.filter(x=>best.score-x.score<0.6);
 const minorCaveat=best.mode==="menor natural"&&best.minorDominant?.raisedLeadingTone?" Aparece una dominante con sensible elevada, habitual en la tonalidad menor; «menor natural» aquí es solo la escala de referencia.":"";
 return {status:chords.length<3?"insufficient":close.length>1?"ambiguous":"suggestive",
  candidates:candidates.slice(0,3),explanation:(chords.length<3?"Hay pocos acordes para sugerir un centro tonal fiable.":close.length>1?"Varias tonalidades explican estos acordes de forma parecida; no se puede asegurar una tónica solo con sus símbolos.":"Esta es una posibilidad armónica, no una tonalidad confirmada. El ritmo, la melodía y las cadencias pueden cambiar la percepción.")+minorCaveat};
}
function progressionInsights(chords){return chords.map((ch,i)=>{const next=chords[i+1],prev=chords[i-1];const shared=next?ch.notes.filter(n=>next.notes.includes(n)):[];const bassMotion=next?((next.bass-ch.bass+18)%12)-6:null;return {index:i,label:ch.label,notes:ch.notes.map(n=>spell(n)),previous:prev?.label||null,next:next?.label||null,shared:shared.map(n=>spell(n)),bassMotion,description:next?(shared.length?shared.length+" nota(s) común(es) con "+next.label+": "+shared.map(n=>spell(n)).join(", ")+".":"Sin notas comunes con "+next.label+"."):"Final de la progresión; puedes estudiar su función de llegada."};});}
// Detects an observable interval relationship, not a film-composer attribution.
function tritoneTriadRelations(chords){
 if(!Array.isArray(chords))return [];
 const quality=ch=>{
  if(!ch||!Array.isArray(ch.notes)||!Number.isFinite(ch.root))return null;
  const pcs=new Set(ch.notes.map(mod)),root=mod(ch.root);
  if(pcs.size!==3)return null;
  if(pcs.has(mod(root+4))&&pcs.has(mod(root+7)))return "major";
  if(pcs.has(mod(root+3))&&pcs.has(mod(root+7)))return "minor";
  return null;
 };
 const found=[];
 for(let i=0;i<chords.length-1;i++){
  const a=chords[i],b=chords[i+1],qa=quality(a),qb=quality(b);
  if(!qa||!qb||mod(a.root-b.root)!==6)continue;
  found.push({fromIndex:i,toIndex:i+1,from:a.label,to:b.label,
   relation:qa+"-"+qb,majorMajor:qa==="major"&&qb==="major",
   sharedPitchClasses:[...new Set(a.notes.map(mod))].filter(pc=>b.notes.some(n=>mod(n)===pc)).map(spell),
   observation:"Fundamentales separadas por tritono (6 semitonos); relación entre tríadas "+(qa==="major"?"mayores":"menores")+" y "+(qb==="major"?"mayores":"menores")+".",
   caveat:"Relación armónica observable; no demuestra intención narrativa ni influencia de un compositor."});
 }
 return found;
}
// Simultaneous triadic layering is distinct from successive triadic motion.
// This analyzes supplied pitch classes only; it cannot infer orchestration or perceptual fusion.
function triadicLayeringHypotheses(chord){
 if(!chord||!Array.isArray(chord.notes))return [];
 const pitchClasses=new Set(chord.notes.map(mod));
 if(pitchClasses.size<5)return [];
 const triads=[];
 for(let root=0;root<12;root++)for(const [quality,third] of [["major",4],["minor",3]]){
  const notes=[root,mod(root+third),mod(root+7)];
  if(notes.every(pc=>pitchClasses.has(pc)))triads.push({root,quality,notes});
 }
 const results=[];
 for(let i=0;i<triads.length;i++)for(let j=i+1;j<triads.length;j++){
  const a=triads[i],b=triads[j];
  const union=new Set([...a.notes,...b.notes]);
  if(union.size!==pitchClasses.size||[...pitchClasses].some(pc=>!union.has(pc)))continue;
  results.push({layers:[a,b].map(t=>({root:spell(t.root),quality:t.quality,notes:t.notes.map(spell)})),
   observation:"Conjunto de clases de altura compatible con dos tríadas superpuestas"+(a.notes.some(pc=>b.notes.includes(pc))?" con notas compartidas.":" sin notas compartidas."),
   caveat:"Hipótesis de partición: sin registro, instrumentación ni simultaneidad temporal no puede confirmarse policordio o politonalidad perceptiva."});
 }
 return results;
}
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
// Optional three-chord continuations. Mood labels are creative intentions, not predictions.
// Context-aware, non-destructive three-chord paths; creative intentions, not emotion predictions.
function harmonicContinuations(chords){
 if(!Array.isArray(chords)||!chords.length)return [];
 const last=chords[chords.length-1];
 if(!last||!Number.isFinite(last.root)||!Array.isArray(last.notes))return [];
 const history=chords.slice(-4),root=mod(last.root);
 const minor=ch=>ch.type==="m"||ch.type==="m7";
 const make=(r,quality="major")=>{
  r=mod(r);
  const type=quality==="minor"?"m":quality==="dominant"?"7":"";
  const intervals=quality==="minor"?[0,3,7]:quality==="dominant"?[0,4,7,10]:[0,4,7];
  const useSharp=(quality==="minor"&&[1,6,8].includes(r))||(quality==="dominant"&&[1,6,8].includes(r));
  return {root:r,bass:r,type,notes:intervals.map(n=>mod(r+n)),label:spell(r,useSharp)+type};
 };
 const keyOf=ch=>[...new Set(ch.notes.map(mod))].sort((a,b)=>a-b).join(",");
 const shared=(a,b)=>{const x=new Set(a.notes.map(mod));return b.notes.filter(n=>x.has(mod(n))).length;};
 const contextSet=new Set(history.flatMap(ch=>ch.notes.map(mod)));
 const candidates=[];
 const add=(id,title,intent,path,target,mode)=>{
  if(path.some((ch,i)=>keyOf(ch)===keyOf(i?path[i-1]:last)))return;
  const full=[last,...path],motion=full.slice(1).map((ch,i)=>pitchClassMotionEstimate(full[i],ch).distance);
  const common=full.slice(1).map((ch,i)=>{const a=new Set(full[i].notes.map(mod));return ch.notes.filter(n=>a.has(mod(n))).map(spell);});
  const contextMatches=path[0].notes.filter(n=>contextSet.has(mod(n))).length;
  const historicalReturn=history.slice(0,-1).some(ch=>keyOf(ch)===keyOf(path[2]));
  const totalMotion=motion.reduce((a,b)=>a+b,0);
  const score=contextMatches*3+common[0].length*2+common[1].length+common[2].length-totalMotion-(historicalReturn?2:0);
  candidates.push({id,title,intent,path,target,mode,motion,common,contextMatches,historicalReturn,score});
 };
 // A potential minor destination can be prepared with a dominant; alternative
 // destinations are derived from both recent roots and the preceding pitch classes.
 const anchors=[root,mod(root+9),mod(root+5),mod(history[0].root+9)];
 for(const target of [...new Set(anchors)]){
  add("shadow","Hacia la melancolía","Explora una llegada menor preparada por una dominante potencial.",
   [make(mod(target+5),"minor"),make(mod(target+7),"dominant"),make(target,"minor")],target,"minor");
 }
 const parallel=minor(last)?"major":"minor";
 for(const pivot of [...new Set([root,mod(history[0].root)])]){
  add("parallel","Cambio de color","Reinterpreta una fundamental del fragmento con otra tercera; no presupone cambio de tonalidad.",
   [make(pivot,parallel),make(mod(pivot+5),"minor"),make(pivot,parallel)],pivot,parallel);
 }
 for(const offset of [1,8,6]){
  const target=mod(root+offset);
  add("mystery","Misterio y apertura","Explora una región cromática distante y una llegada menor no necesariamente funcional.",
   [make(target),make(mod(target+5),"minor"),make(target,"minor")],target,"minor");
 }
 const order=["shadow","parallel","mystery"];
 return order.flatMap(id=>{
  const best=candidates.filter(c=>c.id===id).sort((a,b)=>b.score-a.score||a.target-b.target)[0];
  if(!best)return [];
  return [{id:best.id,title:best.title,intent:best.intent,source:last.label,
   chords:best.path.map(ch=>ch.label),rootTarget:spell(best.target,false),
   destinationQuality:best.mode,estimatedMotion:best.motion,sharedNotes:best.common,
   contextMatches:best.contextMatches,contextWindow:history.length,contextScore:best.score,
   historicalReturn:best.historicalReturn,
   explain:"Se compararon alternativas usando hasta cuatro acordes previos: notas compartidas, enlace desde el final y movimiento mínimo estimado.",
   caveat:"El carácter emocional y la tonalidad de llegada son hipótesis creativas. Sin melodía, duraciones, acentos y registro no puede confirmarse el efecto. No se aplica ningún cambio."}];
 });
}

// Emotion-specific continuation studies. All proposals are non-destructive and
// describe harmonic devices, not a reliable prediction of perceived emotion.
// Degrees use a tentative tonal center, falling back to the last chord root.
 // A final V7 can point toward a previously stated tonic, without establishing a cadence.
function emotionalContinuations(chords,emotion){
 if(!Array.isArray(chords)||!chords.length)return [];
 const last=chords[chords.length-1];
 if(!last||!Number.isFinite(last.root)||!Array.isArray(last.notes))return [];
 const root=mod(last.root);
  const tonal=tonalHypotheses(chords),leading=tonal.candidates[0];
  const gap=leading&&tonal.candidates[1]?leading.score-tonal.candidates[1].score:0;
  const dominantGoal=mod(root+5);
  // Prefer a root already stated earlier when the final V7 targets it.
  const tonicInHistory=last.type==="7"?chords.slice(0,-1).find(c=>mod(c.root)===dominantGoal&&["","m","maj7","m7","add9","madd9"].includes(c.type)):null;
  const reliableCenter=tonal.status==="suggestive"&&gap>=0.65&&chords.length>=3;
  const tonic=tonicInHistory?dominantGoal:(reliableCenter?leading.tonic:root);
  const minor=tonicInHistory?["m","m7","madd9"].includes(tonicInHistory.type):(reliableCenter?leading.mode==="menor natural":["m","m7","madd9"].includes(last.type));
  const anchorBasis=tonicInHistory?"dominante dirigida a una tónica anterior":reliableCenter?"principal hipótesis tonal":"último acorde (sin centro confirmado)";
 const make=(offset,kind="M")=>{
  const r=mod(tonic+offset);
  const intervals={M:[0,4,7],m:[0,3,7],dom:[0,4,7,10],maj7:[0,4,7,11],m7:[0,3,7,10],sus4:[0,5,7],add9:[0,4,7,14],madd9:[0,3,7,14],dim:[0,3,6]}[kind];
  if(!intervals)return null;
  const suffix={M:"",m:"m",dom:"7",maj7:"maj7",m7:"m7",sus4:"sus4",add9:"add9",madd9:"madd9",dim:"dim"}[kind];
  const writtenTonic=chords.find(c=>mod(c.root)===tonic)?.label||"";
   const sharpKey=/#|♯/.test(writtenTonic)?true:/b|♭/.test(writtenTonic)?false:(minor?[1,4,6,8,11].includes(tonic):[2,4,6,7,9,11].includes(tonic));
   const useSharp=minor&&r===mod(tonic+11)?true:sharpKey;
   return {root:r,bass:r,type:suffix,notes:[...new Set(intervals.map(n=>mod(r+n)))],label:spell(r,useSharp)+suffix};
 };
 const recipes={
 misterio:{title:"Misterio",device:"Desplazamiento cromático y llegada ambigua",why:"El semitono altera el centro percibido; la llegada menor evita una confirmación tonal evidente.",patterns:[[[1,"M"],[6,"m"],[8,"m"]],[[6,"M"],[1,"m"],[8,"m"]],[[8,"M"],[1,"m"],[6,"m"]]]},
 melancolia:{title:"Melancolía",device:"Predominante menor y dominante de llegada",why:"La preparación con predominante menor y dominante dibuja una dirección hacia una llegada menor.",patterns:[[[5,"m"],[7,"dom"],[0,"m"]],[[2,"dim"],[7,"dom"],[0,"m"]],[[9,"m"],[7,"dom"],[0,"m"]]]},
 tension:{title:"Tensión",device:"Dominantes encadenadas y resolución aplazada",why:"Las séptimas de dominante introducen tendencias de resolución que se posponen antes de llegar al último acorde.",patterns:[[[2,"dom"],[7,"dom"],[0,"m"]],[[9,"dom"],[2,"dom"],[7,"dom"]],[[6,"dom"],[7,"dom"],[0,"m"]]]},
 esperanza:{title:"Esperanza",device:"Apertura hacia acordes mayores",why:"El recorrido pasa por regiones mayores y una llegada con novena añadida, que puede sugerir apertura sin cerrar completamente la frase.",patterns:[[[5,"M"],[7,"M"],[0,"add9"]],[[9,"m"],[5,"M"],[0,"maj7"]],[[2,"m"],[7,"M"],[0,"add9"]]]},
 nostalgia:{title:"Nostalgia",device:"Mediantes y color de séptima mayor",why:"Las relaciones de tercera y la séptima mayor pueden conservar notas comunes y producir una evocación armónica menos directa.",patterns:[[[8,"M"],[5,"m"],[0,"maj7"]],[[9,"m7"],[5,"maj7"],[0,"maj7"]],[[4,"m"],[9,"m7"],[0,"maj7"]]]},
 epica:{title:"Épica",device:"Movimiento amplio de fundamentales y llegada afirmativa",why:"Los saltos entre regiones armónicas y la llegada mayor crean una base para un gesto expansivo; el carácter épico requiere además ritmo, registro y orquestación.",patterns:[[[8,"M"],[10,"M"],[0,"M"]],[[5,"M"],[10,"M"],[0,"M"]],[[3,"M"],[10,"M"],[0,"M"]]]},
 tristeza:{title:"Tristeza",device:"Descenso hacia una llegada menor",why:"La llegada menor y el movimiento por regiones vecinas ofrecen un contorno más recogido que una cadencia mayor afirmativa.",patterns:[[[8,"M"],[5,"m"],[0,"m"]],[[10,"M"],[5,"m"],[0,"m"]],[[3,"M"],[7,"dom"],[0,"m"]]]},
 alegria:{title:"Alegría",device:"Predominante y cadencia mayor",why:"Una preparación sencilla seguida de dominante y llegada mayor ofrece claridad tonal; el ritmo decidirá gran parte del carácter.",patterns:[[[2,"m"],[7,"dom"],[0,"M"]],[[5,"M"],[7,"dom"],[0,"M"]],[[9,"m"],[7,"dom"],[0,"M"]]]},
 ternura:{title:"Ternura",device:"Enlace cercano con novenas y séptimas",why:"Las notas comunes y las extensiones suaves permiten transiciones poco abruptas, especialmente con dinámica y registro contenidos.",patterns:[[[9,"m7"],[5,"maj7"],[0,"add9"]],[[5,"maj7"],[2,"m7"],[0,"maj7"]],[[4,"m7"],[5,"maj7"],[0,"add9"]]]},
 asombro:{title:"Asombro / magia",device:"Mediantes cromáticas y apertura armónica",why:"Las mediantes cromáticas cambian de región sin seguir una cadencia habitual; la novena final deja una sonoridad abierta.",patterns:[[[4,"M"],[8,"M"],[0,"add9"]],[[8,"M"],[4,"m"],[0,"maj7"]],[[3,"M"],[8,"M"],[0,"add9"]]]},
 inquietud:{title:"Inquietud",device:"Desplazamientos de semitono y acorde disminuido",why:"La proximidad cromática y la tríada disminuida generan inestabilidad sin una resolución inmediata.",patterns:[[[1,"dim"],[6,"m"],[0,"m"]],[[11,"dim"],[1,"m"],[0,"m"]],[[6,"dim"],[1,"M"],[0,"m"]]]},
 suspense:{title:"Suspense",device:"Suspensión de la resolución",why:"La dominante y la cuarta suspendida retienen una expectativa de llegada; la última sonoridad evita resolver la tercera.",patterns:[[[2,"m"],[7,"dom"],[0,"sus4"]],[[6,"dim"],[7,"dom"],[0,"sus4"]],[[9,"m"],[7,"dom"],[0,"sus4"]]]},
 oscuridad:{title:"Oscuridad",device:"Región cromática y llegada menor",why:"El contraste cromático y el acorde menor final pueden aportar densidad armónica, aunque el registro grave y la textura serán decisivos.",patterns:[[[6,"m"],[1,"M"],[0,"m"]],[[3,"m"],[6,"M"],[0,"m"]],[[8,"m"],[1,"M"],[0,"m"]]]},
 calma:{title:"Calma",device:"Continuidad por notas comunes",why:"Séptimas mayores, novenas y acordes próximos favorecen enlaces graduales si se interpretan sin acentos bruscos.",patterns:[[[5,"maj7"],[2,"m7"],[0,"maj7"]],[[9,"m7"],[5,"maj7"],[0,"add9"]],[[4,"m7"],[5,"maj7"],[0,"maj7"]]]},
 contraste:{title:"Contraste inesperado",device:"Mediantes cromáticas y cambio de modo",why:"El cambio de calidad y las relaciones cromáticas separan claramente esta continuación del recorrido anterior.",patterns:[[[6,"M"],[8,"m"],[0,minor?"M":"m"]],[[4,"M"],[8,"M"],[0,minor?"M":"m"]],[[1,"M"],[6,"m"],[0,minor?"M":"m"]]]}
 };
 // Preserve a minor tonic in gentle/reflective lenses unless the user chose a
 // deliberately bright or contrasting intent. Emotions remain creative hypotheses.
 const gentleMinor={
  calma:{why:"En contexto menor, enlaces con notas comunes y novena añadida conservan la sonoridad íntima sin forzar una llegada mayor.",patterns:[
   [[8,"maj7"],[5,"m7"],[0,"madd9"]],[[3,"M"],[8,"maj7"],[0,"madd9"]],[[5,"m7"],[3,"M"],[0,"madd9"]]]},
  ternura:{why:"Las sonoridades relativas, las notas comunes y una tónica menor con novena permiten una continuidad cálida sin cambiar involuntariamente de modo.",patterns:[
   [[8,"maj7"],[5,"m7"],[0,"madd9"]],[[3,"maj7"],[8,"maj7"],[0,"madd9"]],[[5,"m7"],[10,"M"],[0,"madd9"]]]},
  nostalgia:{why:"En un centro menor, los acordes relativos y la novena de tónica pueden mantener la ambivalencia sin imponer una tónica mayor.",patterns:[
   [[8,"maj7"],[3,"M"],[0,"madd9"]],[[5,"m7"],[10,"M"],[0,"m7"]],[[3,"maj7"],[8,"maj7"],[0,"madd9"]]]}
 };
 const spec=minor&&gentleMinor[emotion]?{...recipes[emotion],...gentleMinor[emotion]}:(recipes[emotion]||recipes.misterio);
 const context=new Set(chords.slice(-4).flatMap(c=>c.notes.map(mod)));
 const fingerprint=c=>[...new Set(c.notes.map(mod))].sort((a,b)=>a-b).join(",");
 const seen=new Set(),options=[];
  const plausible=tonal.candidates.filter(c=>leading.score-c.score<0.65);
  if(!plausible.some(c=>c.tonic===tonic))plausible.unshift({tonic,mode:minor?"menor natural":"mayor",label:spell(tonic)+(minor?" menor":" mayor")});
 for(const pattern of spec.patterns){
  const path=pattern.map(([offset,kind])=>make(offset,kind));
  if(path.some((c,i)=>!c||fingerprint(c)===fingerprint(i?path[i-1]:last)))continue;
  const key=path.map(fingerprint).join("|");
  if(seen.has(key))continue;seen.add(key);
  const full=[last,...path],shared=full.slice(1).map((c,i)=>c.notes.filter(n=>full[i].notes.some(p=>mod(p)===mod(n))).length);
  const movement=full.slice(1).map((c,i)=>pitchClassMotionEstimate(full[i],c).distance);
  const familiarity=path[0].notes.filter(n=>context.has(mod(n))).length;
  const cadenceFit=plausible.length?Math.max(...plausible.map(c=>cadenceEvidence([...chords,...path],c.tonic,c.mode).filter(x=>x.index>=chords.length).reduce((sum,x)=>sum+x.weight,0))):0;const contextFit=path.reduce((sum,c)=>sum+c.notes.filter(n=>context.has(mod(n))).length,0);const score=shared.reduce((a,b)=>a+b,0)*2+familiarity*2+contextFit*.5+cadenceFit*2-movement.reduce((a,b)=>a+b,0);const lastRoot=mod(path[path.length-1].root);const resolves=lastRoot===tonic||plausible.some(c=>lastRoot===c.tonic);const dominantEnding=lastRoot===mod(tonic+7)||plausible.some(c=>lastRoot===mod(c.tonic+7));const direction=resolves?"resolver":dominantEnding?"mantener tensión":cadenceFit>0?"tonicizar":"cambiar dirección";
  const center=tonalCenterSpelling(tonic,minor,chords)+(minor?" menor":" mayor");
  const startLink=shared[0]||0;
  const continuity=startLink>=2?"El primer acorde propuesto conserva "+startLink+" notas con tu último acorde.":startLink===1?"El primer acorde propuesto conserva una nota con tu último acorde.":"El primer acorde propuesto cambia todas las notas del último acorde.";
  const directionText=direction==="resolver"?"La secuencia termina sobre una posible tónica"+(center?" ("+center+")":"")+".":direction==="mantener tensión"?"La secuencia termina sobre una posible dominante y deja abierta la resolución.":direction==="tonicizar"?"Aparece una relación de dominante que puede sugerir un centro local.":"La secuencia se aleja de una llegada tonal clara y permite explorar otro recorrido.";
  const explanation=continuity+" "+directionText+" "+spec.why+" Centro de referencia: "+center+" ("+anchorBasis+"). No se confirma tonalidad ni cadencia sin frase, melodía y ritmo.";
  options.push({id:emotion,title:spec.title,device:spec.device,intent:spec.why,chords:path.map(c=>c.label),sharedNotes:shared,estimatedMotion:movement,contextMatches:familiarity,contextScore:score,cadenceFit,direction,explanation,suggestedCenter:center,anchorBasis,caveat:"Hipótesis armónica, no predicción emocional: melodía, ritmo, registro, textura e interpretación pueden cambiar el efecto. No se altera tu progresión."});
 }
 options.sort((a,b)=>b.contextScore-a.contextScore||a.chords.join(" ").localeCompare(b.chords.join(" ")));
 if(!options.length)return [];
 // Preserve the strongest context fit as the first idea. For the remaining
 // variants, prefer a different harmonic path instead of three almost identical
 // suggestions. These are symbolic distances, never aesthetic scores.
 const distinct=[options[0]],remaining=options.slice(1);
 const distance=(a,b)=>a.chords.reduce((sum,ch,i)=>sum+(ch!==b.chords[i]?1:0),0);
 while(distinct.length<3&&remaining.length){
  remaining.sort((a,b)=>{
   const novelty=o=>Math.min(...distinct.map(reference=>distance(o,reference)));
   const diversity=o=>novelty(o)*2+(distinct.every(x=>x.direction!==o.direction)?1.5:0);
   return diversity(b)-diversity(a)||b.contextScore-a.contextScore||
    a.chords.join(" ").localeCompare(b.chords.join(" "));
  });
  distinct.push(remaining.shift());
 }
 return distinct.map((o,i)=>({...o,variant:i+1,
  title:i===0?spec.title:spec.title+" · alternativa "+(i+1),
  variantDescription:i===0
   ?"Primer camino por ajuste armónico estructural, no por calidad artística."
   :"Frente a la primera opción, cambia "+distance(o,distinct[0])+
    " de "+o.chords.length+" acordes propuestos; compara ambos antes de elegir."}));
}
// Validate a complete continuation without dropping or altering the user's chords.
// This helper is shared by the web interface and future hosts.
function prepareContinuationForAnalysis(original,additional,maxChords=8){
 const labels=items=>Array.isArray(items)?items.map(x=>typeof x==="string"?x:x&&x.label):[];
 const base=labels(original),next=labels(additional);
 if(!base.length||!next.length||[...base,...next].some(x=>typeof x!=="string"||!x.trim()))
  return {ok:false,error:"No hay acordes suficientes para analizar esta opción.",chords:[],text:""};
 if(base.length+next.length>maxChords)
  return {ok:false,error:"Esta opción suma "+(base.length+next.length)+" acordes. El estudio admite un máximo de "+maxChords+". Reduce tu idea inicial para analizarla completa.",chords:[],text:""};
 const text=[...base,...next].join(" ");
 const parsed=parseUserProgression(text);
 if(parsed.errors.length||parsed.chords.length!==base.length+next.length)
  return {ok:false,error:parsed.errors.join(" · ")||"No hemos podido interpretar todos los acordes.",chords:[],text:""};
 return {ok:true,error:"",chords:parsed.chords,text};
}
// Bounded three/four-chord paths anchored in the user's progression.
// Scores compare pitch-class sets only: they are not aesthetic or emotional predictions.
function harmonicTrajectories(chords,start=0){
 if(!Array.isArray(chords)||!Number.isInteger(start)||start<0||start>=chords.length)return [];
 const base=chords.slice(start,start+4);
 if(base.length<3)return [];
 const pcs=ch=>new Set(ch.notes.map(mod));
 const difference=(a,b)=>{const x=pcs(a),y=pcs(b);return [...x].filter(n=>!y.has(n)).length+[...y].filter(n=>!x.has(n)).length;};
 const adjacent=(path)=>path.slice(1).reduce((sum,ch,i)=>sum+pitchClassMotionEstimate(path[i],ch).distance,0);
 const baseMotion=adjacent(base);
 const strategies=[
  {id:"continuity",title:"Continuidad",explain:"Prioriza conservar clases de altura respecto a la idea original."},
  {id:"contrast",title:"Contraste",explain:"Busca una desviación armónica perceptible manteniendo el inicio y la llegada."},
  {id:"direction",title:"Dirección armónica",explain:"Explora la conexión con el acorde siguiente al cambio; no afirma una cadencia ni resolución tonal."}
 ];
 const candidates=[];
 for(let index=1;index<base.length-1;index++){
  const options=chordAlternatives(base,index);
  for(const candidate of options){
   const changed=difference(base[index],candidate);
   if(changed===0||changed>4)continue;
   const path=base.map((ch,i)=>i===index?candidate:ch);
   const movement=adjacent(path);
   const incoming=pcs(base[index-1]),outgoing=pcs(base[index+1]);
   const bridge=[...pcs(candidate)].filter(pc=>incoming.has(pc)||outgoing.has(pc)).length;
   const dominantPreparation=mod(candidate.root+5)===mod(base[index+1].root)&&pcs(candidate).has(mod(candidate.root+4));
   candidates.push({index,candidate,path,changed,bridge,movement,motionDelta:movement-baseMotion,dominantPreparation});
  }
 }
 const seen=new Set();
 return strategies.flatMap(strategy=>{
  const ranked=candidates.map(c=>{
   const score=strategy.id==="continuity"?c.bridge*3-c.changed*3-c.motionDelta:
    strategy.id==="contrast"?c.changed*3+c.bridge-Math.max(0,c.motionDelta):
    (c.dominantPreparation?18:0)+c.bridge*2-c.motionDelta-Math.abs(c.changed-2);
   return {...c,score};
  }).sort((a,b)=>b.score-a.score||a.changed-b.changed||a.index-b.index||a.candidate.label.localeCompare(b.candidate.label));
  const choice=ranked.find(c=>!seen.has(c.index+":"+[...pcs(c.candidate)].sort((a,b)=>a-b).join(",")));
  if(!choice)return [];
  seen.add(choice.index+":"+[...pcs(choice.candidate)].sort((a,b)=>a-b).join(","));
  return [{id:strategy.id,title:strategy.title,explain:strategy.explain,
   chords:choice.path.map(ch=>ch.label),changedPosition:start+choice.index,
   original:base[choice.index].label,replacement:choice.candidate.label,
   preserved:base.length-1,changedPitchClasses:choice.changed,
   motionDelta:choice.motionDelta,neighborShared:choice.bridge,
   dominantPreparation:choice.dominantPreparation,
   why:choice.candidate.why,
   caveat:"Comparación de clases de altura sin melodía, ritmo, registro ni función tonal confirmada. Propuesta opcional: no modifica tu progresión."}];
 });
}


/* Neutral A/B listening plan, Web Audio playback done by UI only.
   Same synthesized instrument, total time and per-voice envelope in both routes.
   Different chord counts imply different chord rates; this is not a blinded test. */
function composerListeningPlan(chords,options={}){
 if(!Array.isArray(chords)||chords.length<2||chords.length>8)
  return {status:"invalid",steps:[],warning:"Se necesitan entre 2 y 8 acordes para escuchar el ejemplo."};
 const equalChordDuration=options.equalChordDuration===true;
 // Two honest comparison controls: equal total phrase duration (default),
 // or an equal 2-second harmonic pulse per chord across routes.
 const totalSeconds=equalChordDuration?chords.length*2:8;
 const choice=voiceLead(chords,"cinematic");
 if(choice.voicings.length!==chords.length)
  return {status:"unavailable",steps:[],warning:"No hay una disposición de cuatro voces para estos acordes."};
 const stepSeconds=totalSeconds/chords.length;
 return {status:"ready",steps:choice.voicings.map((pitches,i)=>({
   chord:chords[i].label,startSeconds:i*stepSeconds,
   durationSeconds:stepSeconds,pitches:pitches.slice(),
   frequencies:pitches.map(note=>440*Math.pow(2,(note-69)/12))
  })),
  totalSeconds,voicingStyle:"cinematic",fixedInstrumentation:true,
  timingBasis:equalChordDuration?"equal-chord":"equal-total",
  warning:equalChordDuration
   ?"Maqueta con 2 segundos por acorde: pulso armónico igual entre rutas, pero duración total distinta si cambia la cantidad de acordes. No se han simulado instrumentos ni fraseo real."
   :"Maqueta de cuatro voces sintetizadas: mismo sonido, volumen por voz y duración total. La cantidad de acordes cambia el ritmo armónico; no se han simulado instrumentos, melodías ni dinámica real."};
}

/* Evidence-informed composer exploration: non-destructive, original harmonic experiments. */
const COMPOSER_CREATIVE_LENSES={
 "williams": {
  "mode": "ionian",
  "focus": "Intercambio modal y control de la llegada",
  "evidence": "A/B",
  "work": "Star Wars — Binary Sunset",
  "source": "https://academic.oup.com/book/63100/chapter/567207145",
  "limit": "Sin frase y melodía no podemos confirmar una cadencia dramática ni un leitmotiv.",
  "routes": [
   {
    "name": "Color que vuelve a casa",
    "intention": "Prueba un iv menor y un retorno sobrio; decide si esa sombra basta.",
    "steps": [
     {
      "d": 0,
      "a": 0,
      "q": "major",
      "e": ""
     },
     {
      "d": 3,
      "a": 0,
      "q": "minor",
      "e": ""
     },
     {
      "d": 0,
      "a": 0,
      "q": "major",
      "e": ""
     }
    ]
   },
   {
    "name": "Llegada con más recorrido",
    "intention": "Contrasta una región cromática antes de V7–I; escucha si la resolución es demasiado explícita.",
    "steps": [
     {
      "d": 0,
      "a": 0,
      "q": "major",
      "e": ""
     },
     {
      "d": 5,
      "a": -1,
      "q": "major",
      "e": ""
     },
     {
      "d": 4,
      "a": 0,
      "q": "major",
      "e": "7"
     },
     {
      "d": 0,
      "a": 0,
      "q": "major",
      "e": ""
     }
    ]
   }
  ]
 },
 "herrmann": {
  "mode": "aeolian",
  "focus": "Recurrencia y fricción cromática",
  "evidence": "A/B",
  "work": "Vertigo — Main Title; Scene d'amour",
  "source": "https://mtosmt.org/issues/mto.22.28.1/mto.22.28.1.murphy.html",
  "limit": "Reiteración real, registro, duración y suspensión no se deducen de los acordes.",
  "routes": [
   {
    "name": "Centro con roce cromático",
    "intention": "Alterna la tónica menor con ♭II; el retorno mantiene un punto reconocible.",
    "steps": [
     {
      "d": 0,
      "a": 0,
      "q": "minor",
      "e": ""
     },
     {
      "d": 1,
      "a": -1,
      "q": "major",
      "e": ""
     },
     {
      "d": 0,
      "a": 0,
      "q": "minor",
      "e": ""
     },
     {
      "d": 4,
      "a": 0,
      "q": "minor",
      "e": ""
     }
    ]
   },
   {
    "name": "Región cercana pero extraña",
    "intention": "Compara un acorde distante por semitono antes de regresar al mismo centro.",
    "steps": [
     {
      "d": 0,
      "a": 0,
      "q": "minor",
      "e": ""
     },
     {
      "d": 6,
      "a": 1,
      "q": "major",
      "e": "maj7"
     },
     {
      "d": 0,
      "a": 0,
      "q": "minor",
      "e": ""
     }
    ]
   }
  ]
 },
 "zimmer": {
  "mode": "aeolian",
  "focus": "Escalar una idea sin multiplicar los cambios",
  "evidence": "C",
  "work": "Interstellar — proceso del tema íntimo",
  "source": "https://www.bafta.org/media-centre/press-releases/a-life-in-pictures-christopher-nolan/",
  "limit": "El cifrado no demuestra pedal sostenido, capas, ostinato ni diseño sonoro.",
  "routes": [
   {
    "name": "Permanencia del núcleo",
    "intention": "Repite el centro menor entre cambios de color; prueba aumentar la densidad sin añadir acordes.",
    "steps": [
     {
      "d": 0,
      "a": 0,
      "q": "minor",
      "e": ""
     },
     {
      "d": 5,
      "a": 0,
      "q": "major",
      "e": ""
     },
     {
      "d": 0,
      "a": 0,
      "q": "minor",
      "e": ""
     },
     {
      "d": 5,
      "a": 0,
      "q": "major",
      "e": ""
     }
    ]
   },
   {
    "name": "Arco modal sin clausura fuerte",
    "intention": "Deja el ciclo en ♭VII; decide tú si prolongarlo o volver a i.",
    "steps": [
     {
      "d": 0,
      "a": 0,
      "q": "minor",
      "e": ""
     },
     {
      "d": 5,
      "a": 0,
      "q": "major",
      "e": ""
     },
     {
      "d": 2,
      "a": 0,
      "q": "major",
      "e": ""
     },
     {
      "d": 6,
      "a": 0,
      "q": "major",
      "e": ""
     }
    ]
   }
  ]
 },
 "giacchino": {
  "mode": "ionian",
  "focus": "Identidad temática y grados de intimidad",
  "evidence": "C",
  "work": "Up — Married Life",
  "source": "https://michaelgiacchino.com/projects/up/",
  "limit": "Variación del motivo y tratamiento instrumental requieren melodía y contexto.",
  "routes": [
   {
    "name": "Arco tonal sencillo",
    "intention": "Imagina una melodía estable sobre acordes claros: deja respirar su frase.",
    "steps": [
     {
      "d": 0,
      "a": 0,
      "q": "major",
      "e": ""
     },
     {
      "d": 5,
      "a": 0,
      "q": "minor",
      "e": ""
     },
     {
      "d": 3,
      "a": 0,
      "q": "major",
      "e": ""
     },
     {
      "d": 4,
      "a": 0,
      "q": "major",
      "e": "7"
     },
     {
      "d": 0,
      "a": 0,
      "q": "major",
      "e": ""
     }
    ]
   },
   {
    "name": "El mismo arco con otro color",
    "intention": "Compara extensiones suaves sin tocar el motivo imaginado: no tiene por qué sonar más emocional.",
    "steps": [
     {
      "d": 0,
      "a": 0,
      "q": "major",
      "e": "maj7"
     },
     {
      "d": 5,
      "a": 0,
      "q": "minor",
      "e": "7"
     },
     {
      "d": 3,
      "a": 0,
      "q": "major",
      "e": "maj7"
     },
     {
      "d": 4,
      "a": 0,
      "q": "major",
      "e": "7"
     },
     {
      "d": 0,
      "a": 0,
      "q": "major",
      "e": "maj7"
     }
    ]
   }
  ]
 },
 "elfman": {
  "mode": "aeolian",
  "focus": "Teatralidad cromática frente a fragilidad",
  "evidence": "C",
  "work": "Edward Scissorhands",
  "source": "https://www.avclub.com/danny-elfman-on-oingo-boingo-film-scores-and-the-beat-1798274010",
  "limit": "Un ♭II o un acorde disminuido no confirma danza, coro ni carácter grotesco.",
  "routes": [
   {
    "name": "Gesto inquietante",
    "intention": "Introduce ♭II y contrástalo con una dominante que busca regreso.",
    "steps": [
     {
      "d": 0,
      "a": 0,
      "q": "minor",
      "e": ""
     },
     {
      "d": 1,
      "a": -1,
      "q": "major",
      "e": ""
     },
     {
      "d": 4,
      "a": 0,
      "q": "major",
      "e": "7"
     },
     {
      "d": 0,
      "a": 0,
      "q": "minor",
      "e": ""
     }
    ]
   },
   {
    "name": "Fragilidad sin sobresalto",
    "intention": "Cambia el cromatismo explícito por un color mayor suave; evita imponer un vals.",
    "steps": [
     {
      "d": 0,
      "a": 0,
      "q": "minor",
      "e": ""
     },
     {
      "d": 5,
      "a": 0,
      "q": "major",
      "e": "maj7"
     },
     {
      "d": 2,
      "a": 0,
      "q": "major",
      "e": ""
     },
     {
      "d": 0,
      "a": 0,
      "q": "minor",
      "e": ""
     }
    ]
   }
  ]
 },
 "silvestri": {
  "mode": "ionian",
  "focus": "Color lidio y relaciones de tritono",
  "evidence": "A/B",
  "work": "Back to the Future — análisis con notación",
  "source": "https://www.blogs.berklee.edu/wp-content/uploads/2017/09/BTTF-Analysis.pdf",
  "limit": "Un acorde de tritono no certifica una escala octatónica, ni la cifra identifica el motivo de la película.",
  "routes": [
   {
    "name": "Brillo lidio",
    "intention": "Colorea la tónica con ♯11 y explora II mayor; no es obligado convertirlo en V/V.",
    "steps": [
     {
      "d": 0,
      "a": 0,
      "q": "major",
      "e": "maj7#11"
     },
     {
      "d": 1,
      "a": 0,
      "q": "major",
      "e": ""
     },
     {
      "d": 0,
      "a": 0,
      "q": "major",
      "e": ""
     }
    ]
   },
   {
    "name": "Choque por tritono",
    "intention": "Compara dos centros separados seis semitonos y regresa mediante IV.",
    "steps": [
     {
      "d": 0,
      "a": 0,
      "q": "major",
      "e": ""
     },
     {
      "d": 4,
      "a": -1,
      "q": "major",
      "e": ""
     },
     {
      "d": 3,
      "a": 0,
      "q": "major",
      "e": ""
     },
     {
      "d": 0,
      "a": 0,
      "q": "major",
      "e": ""
     }
    ]
   }
  ]
 },
 "horner": {
  "mode": "aeolian",
  "focus": "Continuidad por transformaciones triádicas",
  "evidence": "A/B",
  "work": "A Beautiful Mind — análisis neo-riemanniano",
  "source": "https://franklehman.com/wp-content/uploads/2020/02/MTS-Article.pdf",
  "limit": "Estos son ejercicios originales P/L/R; el análisis académico trata una red L/R/S más compleja.",
  "routes": [
   {
    "name": "Cadena P–L–R",
    "intention": "Escucha dos notas comunes en cada cambio, incluso al abandonar el centro menor.",
    "steps": [
     {
      "d": 0,
      "a": 0,
      "q": "minor",
      "e": ""
     },
     {
      "d": 0,
      "a": 0,
      "q": "major",
      "e": ""
     },
     {
      "d": 2,
      "a": 1,
      "q": "minor",
      "e": ""
     },
     {
      "d": 4,
      "a": 0,
      "q": "major",
      "e": ""
     }
    ]
   },
   {
    "name": "Cadena R–L–P",
    "intention": "Parte de la misma tríada y construye otra trayectoria de proximidad entre voces.",
    "steps": [
     {
      "d": 0,
      "a": 0,
      "q": "minor",
      "e": ""
     },
     {
      "d": 2,
      "a": 0,
      "q": "major",
      "e": ""
     },
     {
      "d": 4,
      "a": 0,
      "q": "minor",
      "e": ""
     },
     {
      "d": 4,
      "a": 0,
      "q": "major",
      "e": ""
     }
    ]
   }
  ]
 },
 "shore": {
  "mode": "aeolian",
  "focus": "Retorno y relectura modal de una idea",
  "evidence": "B/C",
  "work": "The Lord of the Rings — transformaciones de temas",
  "source": "https://soundtrackworld.com/2020/01/interview-howard-shore/",
  "limit": "Una transformación de leitmotiv no puede verificarse solo a partir de acordes.",
  "routes": [
   {
    "name": "El mismo centro, otro modo",
    "intention": "Contrasta iv menor e IV mayor sin cambiar el punto de partida.",
    "steps": [
     {
      "d": 0,
      "a": 0,
      "q": "minor",
      "e": ""
     },
     {
      "d": 3,
      "a": 0,
      "q": "minor",
      "e": ""
     },
     {
      "d": 3,
      "a": 0,
      "q": "major",
      "e": ""
     },
     {
      "d": 4,
      "a": 0,
      "q": "major",
      "e": "7"
     },
     {
      "d": 0,
      "a": 0,
      "q": "minor",
      "e": ""
     }
    ]
   },
   {
    "name": "Recorrido y regreso",
    "intention": "Dale tiempo a la región ♭VI antes de cerrar en menor; conserva tu idea melódica si la tienes.",
    "steps": [
     {
      "d": 0,
      "a": 0,
      "q": "minor",
      "e": ""
     },
     {
      "d": 5,
      "a": 0,
      "q": "major",
      "e": ""
     },
     {
      "d": 3,
      "a": 0,
      "q": "minor",
      "e": ""
     },
     {
      "d": 4,
      "a": 0,
      "q": "major",
      "e": "7"
     },
     {
      "d": 0,
      "a": 0,
      "q": "minor",
      "e": ""
     }
    ]
   }
  ]
 },
 "morricone": {
  "mode": "aeolian",
  "focus": "Economía de materiales y módulos contrastantes",
  "evidence": "C",
  "work": "Once Upon a Time in the West; The Mission",
  "source": "https://www.bfi.org.uk/sight-and-sound/interviews/if-you-want-call-yourself-composer-you-follow-every-step-instrumentation-ennio-morricone-interviewed-2006",
  "limit": "La armónica, el oboe y el sentido narrativo no son propiedades de la progresión armónica.",
  "routes": [
   {
    "name": "Giro de pocos materiales",
    "intention": "Trabaja tres regiones y repite un gesto propio; prueba qué sucede al quitar una.",
    "steps": [
     {
      "d": 0,
      "a": 0,
      "q": "minor",
      "e": ""
     },
     {
      "d": 6,
      "a": 0,
      "q": "major",
      "e": ""
     },
     {
      "d": 5,
      "a": 0,
      "q": "major",
      "e": ""
     },
     {
      "d": 0,
      "a": 0,
      "q": "minor",
      "e": ""
     }
    ]
   },
   {
    "name": "Centro frente a color modal",
    "intention": "Contrasta i con IV mayor y ♭VII; valora un pedal hipotético sin asumir que ya existe.",
    "steps": [
     {
      "d": 0,
      "a": 0,
      "q": "minor",
      "e": ""
     },
     {
      "d": 3,
      "a": 0,
      "q": "major",
      "e": ""
     },
     {
      "d": 6,
      "a": 0,
      "q": "major",
      "e": ""
     },
     {
      "d": 0,
      "a": 0,
      "q": "minor",
      "e": ""
     }
    ]
   }
  ]
 },
 "newman": {
  "mode": "ionian",
  "focus": "Sonoridad abierta y posibilidad de no cerrar",
  "evidence": "C",
  "work": "Saving Mr. Banks; American Beauty",
  "source": "https://www.bfi.org.uk/interviews/scoring-mr-banks-composers-life-hollywood",
  "limit": "Espacio, silencio y colocación de voces no pueden inferirse del cifrado.",
  "routes": [
   {
    "name": "Color sin sobresalto",
    "intention": "Mantén extensiones ligeras entre regiones próximas y compara si necesitas resolver.",
    "steps": [
     {
      "d": 0,
      "a": 0,
      "q": "major",
      "e": "add9"
     },
     {
      "d": 3,
      "a": 0,
      "q": "major",
      "e": "maj7"
     },
     {
      "d": 1,
      "a": 0,
      "q": "minor",
      "e": "7"
     },
     {
      "d": 0,
      "a": 0,
      "q": "major",
      "e": "add9"
     }
    ]
   },
   {
    "name": "Final deliberadamente abierto",
    "intention": "Prueba acabar en IVmaj7 sin cadencia auténtica; el silencio posterior lo decides tú.",
    "steps": [
     {
      "d": 0,
      "a": 0,
      "q": "major",
      "e": "add9"
     },
     {
      "d": 4,
      "a": 0,
      "q": "major",
      "e": "sus4"
     },
     {
      "d": 5,
      "a": 0,
      "q": "minor",
      "e": "7"
     },
     {
      "d": 3,
      "a": 0,
      "q": "major",
      "e": "maj7"
     }
    ]
   }
  ]
 },
 "goransson": {
  "mode": "aeolian",
  "focus": "Cambio de energía sobre material reconocible",
  "evidence": "C",
  "work": "Oppenheimer — Can You Hear the Music",
  "source": "https://www.soundonsound.com/people/ludwig-goransson",
  "limit": "Velocidad, vibrato, acentos y articulación requieren decisiones temporales e instrumentales.",
  "routes": [
   {
    "name": "Armonía con retornos",
    "intention": "Conserva i entre regiones; contrasta una versión sobria y otra con articulación más tensa.",
    "steps": [
     {
      "d": 0,
      "a": 0,
      "q": "minor",
      "e": ""
     },
     {
      "d": 5,
      "a": 0,
      "q": "major",
      "e": ""
     },
     {
      "d": 0,
      "a": 0,
      "q": "minor",
      "e": ""
     },
     {
      "d": 6,
      "a": 0,
      "q": "major",
      "e": ""
     },
     {
      "d": 0,
      "a": 0,
      "q": "minor",
      "e": ""
     }
    ]
   },
   {
    "name": "Otra curva de tensión",
    "intention": "Cambia la ruta armónica, pero mantén un mismo motivo rítmico imaginado para comparar energía.",
    "steps": [
     {
      "d": 0,
      "a": 0,
      "q": "minor",
      "e": ""
     },
     {
      "d": 3,
      "a": 0,
      "q": "minor",
      "e": ""
     },
     {
      "d": 6,
      "a": 0,
      "q": "major",
      "e": ""
     },
     {
      "d": 0,
      "a": 0,
      "q": "minor",
      "e": ""
     }
    ]
   }
  ]
 }
};

/* Distinguish observable pitch-class continuity from performed voice leading.
   These are equivalence classes, not register-specific melodic trajectories. */
function composerMemberName(chord,pc){
 const distance=mod(pc-chord.root);
 const degree=distance===0?0:[1,2].includes(distance)?1:[3,4].includes(distance)?2:[5,6].includes(distance)?3:[7,8].includes(distance)?4:distance===9?5:6;
 return spellDegreePc(chord.root,degree,mod(pc),chord.label);
}
// Compare compositional routes by observable harmony, without style attribution
// or treating an identical score on simple structural briefs as identical music.
function composerRouteComparison(paths){
 if(!Array.isArray(paths)||paths.length!==2||paths.some(p=>!p||!Array.isArray(p.chords)||!p.insights))
  return null;
 const [a,b]=paths;
 const rootsA=a.chords.map(c=>mod(c.root)),rootsB=b.chords.map(c=>mod(c.root));
 const sameLength=rootsA.length===rootsB.length;
 const sameRoots=sameLength&&rootsA.every((root,i)=>root===rootsB[i]);
 const changedColors=sameRoots?a.chords.filter((c,i)=>{
  const other=b.chords[i];
  const setA=[...new Set(c.notes.map(mod))].sort((x,y)=>x-y);
  const setB=[...new Set(other.notes.map(mod))].sort((x,y)=>x-y);
  return c.type!==other.type||setA.join(",")!==setB.join(",");
 }).length:null;
 const operations=p=>p.insights.transitions.map(x=>x.operator).filter(Boolean).join("–");
 const opsA=operations(a),opsB=operations(b);
 const rootChanges=sameLength?rootsA.filter((root,i)=>root!==rootsB[i]).length:null;
 let message,dimension;
 if(sameRoots&&changedColors>0){
  dimension="color";
  message="Comparten la misma secuencia de fundamentales, pero cambian las calidades o extensiones de color en "+
   changedColors+" de "+a.chords.length+" posiciones. Escucha el color sin atribuirle automáticamente más emoción.";
 }else if(opsA&&opsB&&opsA!==opsB){
  dimension="transformation";
  message="Las dos rutas muestran transformaciones triádicas en diferente orden: "+opsA+" frente a "+opsB+
   ". Es un contraste de recorrido, no una clasificación de estilo.";
 }else if(a.insights.returnToCenter!==b.insights.returnToCenter){
  dimension="ending";
  message="Una ruta vuelve a la fundamental inicial y la otra termina sobre una fundamental distinta; eso no confirma por sí solo una cadencia ni modulación.";
 }else if(sameLength&&rootChanges>0){
  dimension="roots";
  message="Cambian "+rootChanges+" de "+a.chords.length+" fundamentales en las posiciones comparables. Explora si su dirección encaja con tu frase.";
 }else if(a.insights.chromaticCount!==b.insights.chromaticCount){
  dimension="chromatic";
  message="Las rutas utilizan diferente cantidad de acordes ajenos al modo de referencia; eso no equivale necesariamente a más tensión percibida.";
 }else if(a.insights.sharedLinkCount!==b.insights.sharedLinkCount){
  dimension="shared-notes";
  message="Las rutas difieren en enlaces con notas comunes. Es una medida de clases de altura, no de conducción de voces real.";
 }else{
  dimension="unresolved";
  message="Las métricas armónicas no distinguen claramente ambas rutas. Para contrastarlas, prueba ritmo, registro o textura sin cambiar los acordes.";
 }
 return {dimension,message,sameRoots,changedColors,rootChanges,operators:[opsA,opsB],
  limitation:"Comparación estructural de ejemplos originales; no se deduce timbre, emoción, calidad estética ni identidad exclusiva de un compositor."};
}

function composerRouteInsights(chords,tonic){
 if(!Array.isArray(chords)||chords.length<2)return {transitions:[],sharedLinkCount:0,chromaticCount:0,returnToCenter:false,ending:"Sin enlace suficiente."};
 const transitions=chords.slice(1).map((target,i)=>{
  const source=chords[i],a=[...new Set(source.notes.map(mod))],b=[...new Set(target.notes.map(mod))];
  const common=a.filter(pc=>b.includes(pc)),removed=a.filter(pc=>!b.includes(pc)),added=b.filter(pc=>!a.includes(pc));
  const sourceTriad=a.length===3&&["major","minor"].includes(source.quality);
  const targetTriad=b.length===3&&["major","minor"].includes(target.quality);
  const operator=(sourceTriad&&targetTriad?["P","L","R"].find(op=>{
   const candidate=neoTransform(source.root,source.quality,op);
   return candidate?.target.root===target.root&&candidate?.target.quality===target.quality&&
    candidate.target.notes.every(pc=>b.includes(pc));
  }):null)||null;
  let motion=null;
  if(removed.length===1&&added.length===1&&common.length>=2){
   let semitones=mod(added[0]-removed[0]);if(semitones>6)semitones-=12;
   motion={from:composerMemberName(source,removed[0]),to:composerMemberName(target,added[0]),semitones};
  }
  const operatorName={P:"Paralela",L:"Leittonwechsel",R:"Relativa"}[operator]||null;
  const explanation=operator
   ?operator+" · "+operatorName+": "+common.length+" notas comunes, "+motion.from+" → "+motion.to+" ("+Math.abs(motion.semitones)+" semitono"+(Math.abs(motion.semitones)===1?"":"s")+")."
   :motion
    ?"Conserva "+common.length+" notas; una clase de altura pasa de "+motion.from+" a "+motion.to+"."
    :common.length
     ?"Comparte "+common.length+" nota"+(common.length===1?"":"s")+"; no se ha determinado una conducción de voces."
     :"Sin notas comunes; comprobar la distancia y la disposición de voces antes de decidir.";
  return {from:source.label,to:target.label,common:common.map(pc=>composerMemberName(source,pc)),commonCount:common.length,operator,operatorName,motion,explanation};
 });
 const sharedLinkCount=transitions.filter(x=>x.commonCount>=2).length;
 const chromaticCount=chords.filter(c=>c.chromatic===true).length;
 const returnToCenter=mod(chords[chords.length-1].root)===mod(tonic);
 const ending=returnToCenter?"Regresa a la fundamental de partida. No demuestra por sí solo una cadencia.":
   "Termina fuera de la fundamental de partida; no implica necesariamente una modulación.";
 return {transitions,sharedLinkCount,chromaticCount,returnToCenter,ending,
  scope:"Notas comunes por clases de altura: no se han supuesto octavas, voces, duraciones ni una interpretación real."};
}
function composerCreativePaths(composerId,tonic,keyName){
 const profile=COMPOSER_CREATIVE_LENSES[composerId];
 if(!profile||!Number.isInteger(tonic)||tonic<0||tonic>11)return null;
 const mode={int:MODAL_INTERVALS[profile.mode]};
 const destinationKey=keyName||rootKeyName(tonic);
 const paths=profile.routes.map((r)=>{
  const chords=buildProfileProgression(r.steps,tonic,mode,destinationKey);
  const sameAsPrevious=chords.slice(1).filter((c,i)=>c.label===chords[i].label).length;
  const chromatic=chords.filter(c=>c.chromatic).length;
  const commonTransitions=chords.slice(1).map((c,i)=>chords[i].commonWithNext.length);
  return {id:r.name,name:r.name,intention:r.intention,chords,
   insights:composerRouteInsights(chords,tonic),
   chromaticChords:chromatic,commonTransitions,
   note:"Ejercicio creativo original. Ninguna de estas cifras equivale a una transcripción o una predicción de estilo."};
 });
 return {composerId,modeKey:profile.mode,focus:profile.focus,evidence:profile.evidence,
  work:profile.work,source:profile.source,limit:profile.limit,paths,
  originalIsUntouched:true,
  caveat:"La armonía es un punto de partida: melodía, ritmo, registro y orquestación siguen bajo control del compositor."};
}

/* Explainable composition assistance: observations and optional experiments, never edits. */
const COMPOSER_TECHNIQUES={
 williams:[{id:"sequence",name:"Secuencia motívica",domain:"Desarrollo",reason:"Traslada un motivo por grados sucesivos para construir dirección, conservando su identidad rítmica.",action:"Prueba una secuencia ascendente o descendente de tu motivo; decide tú dónde interrumpirla.",source:"Lenguaje sinfónico y desarrollo temático; recurso compartido con la tradición romántica."},{id:"dominant",name:"Preparación de dominante",domain:"Armonía",reason:"Una dominante preparada puede reforzar la llegada sin reemplazar tu tema.",action:"Examina si el penúltimo acorde admite una dominante secundaria o una cadencia más dirigida.",source:"Sintaxis tonal sinfónica; no exclusiva de Williams."},{id:"counterpoint",name:"Contramelodía",domain:"Textura",reason:"Una segunda línea puede intensificar el desarrollo sin modificar la melodía principal.",action:"Busca notas comunes y movimiento contrario en una voz secundaria.",source:"Escritura contrapuntística sinfónica."}],
 herrmann:[{id:"minorMajorSeventh",name:"Menor con séptima mayor",domain:"Color armónico",reason:"Una tríada menor y su séptima mayor forman una sonoridad de fricción característica del análisis publicado sobre el preludio de Vertigo; no es una firma exclusiva.",action:"Prueba un acorde mMaj7 como color opcional sobre una tónica menor, y compara sin reescribir tu progresión.",source:"Scott Murphy (2022), Music Theory Online 28/1, ejemplo 1: acorde menor con séptima mayor en Vertigo; ejercicio original, no transcripción."},{id:"cell",name:"Célula reiterada",domain:"Motivo",reason:"La repetición con cambios mínimos permite sostener tensión sin una gran progresión.",action:"Aísla dos o tres notas de tu motivo y experimenta con su reiteración y registro.",source:"Economía motívica y repetición en música dramática."},{id:"delay",name:"Resolución aplazada",domain:"Tensión",reason:"Retener una disonancia puede prolongar la expectativa.",action:"Localiza una nota de tendencia y compara resolverla ahora o prolongarla un compás.",source:"Suspensión y ambigüedad armónica."}],
 zimmer:[{id:"pedal",name:"Pedal armónico",domain:"Textura",reason:"Una nota grave sostenida unifica acordes cambiantes y concentra la tensión.",action:"Prueba mantener la tónica o dominante en el bajo mientras evolucionan las voces superiores.",source:"Pedales y construcción por capas; no exclusivos de Zimmer."},{id:"ostinato",name:"Ostinato gradual",domain:"Ritmo",reason:"La repetición rítmica permite aumentar energía sin aumentar el ritmo de cambio armónico.",action:"Extrae una célula rítmica y cambia su registro, acentuación o densidad gradualmente.",source:"Recursos minimalistas y postminimalistas."},{id:"density",name:"Escala desde un núcleo íntimo",domain:"Orquestación",reason:"Una idea íntima puede adquirir escala mediante timbre, registro y densidad sin cambiar su identidad.",action:"Conserva la misma célula en piano y después compárala con órgano y conjunto amplio; escucha qué cambia sin reharmonizar.",source:"Hans Zimmer y Christopher Nolan, entrevistas sobre Interstellar: tema inicial íntimo y posterior uso expresivo del órgano."}],
 giacchino:[
 {id:"motif",name:"Motivo reconocible con variación",domain:"Desarrollo",reason:"Un motivo breve conserva identidad aunque cambien armonía, registro o instrumentación.",action:"Extrae tres o cuatro notas de tu idea y repítelas con un nuevo acompañamiento; comprueba qué rasgo mantiene su identidad.",source:"Trabajo temático y variación orquestal; referencia estilística, no transcripción."},
 {id:"color",name:"Cambio de color orquestal",domain:"Orquestación",reason:"La misma armonía puede expresar otra intención al cambiar el timbre y la articulación.",action:"Compara la frase en maderas ligeras y en cuerdas graves, sin tocar los acordes.",source:"Énfasis de Giacchino en el color instrumental y el carácter narrativo."},
 {id:"contrast",name:"Contención expresiva",domain:"Forma",reason:"Una escena emocionalmente intensa puede funcionar mejor con una textura íntima que con una gran culminación orquestal.",action:"Compara tu idea con acompañamiento reducido frente a una versión expansiva; decide cuál deja respirar mejor la emoción.",source:"Michael Giacchino, notas del compositor para Up: Married Life; contraste entre intimidad y énfasis orquestal."}],
 elfman:[
 {id:"chromatic",name:"Vecindad cromática inquietante",domain:"Armonía",reason:"Una voz que oscila por semitono crea ambigüedad alrededor de un acorde estable.",action:"Mantén dos notas de una tríada y desplaza la tercera un semitono; escucha si aumenta la extrañeza.",source:"Cromatismo teatral y recursos de la escritura fantástica; no exclusivo."},
 {id:"dance",name:"Danza y contraste de carácter",domain:"Ritmo",reason:"Una pulsación de danza puede convivir con una sonoridad frágil o extraña; el contraste no exige añadir cromatismo.",action:"Compara una frase ternaria ligera con una textura coral sostenida, manteniendo la misma melodía.",source:"Danny Elfman, entrevista sobre Edward Scissorhands: influencias de Tchaikovsky y Prokofiev, escritura coral y carácter invernal."},
 {id:"register",name:"Contraste de registros extremos",domain:"Orquestación",reason:"Separar líneas agudas y graves puede volver grotesca o frágil una textura.",action:"Sitúa el motivo una octava más arriba y responde con una línea grave corta; conserva tu armonía.",source:"Recurso orquestal compartido; no se deduce de los acordes ni se presenta como procedimiento exclusivo de Elfman."}],
 silvestri:[
 {id:"fanfare",name:"Tema heroico reconocible",domain:"Motivo",reason:"Una identidad temática clara puede reaparecer en situaciones diferentes sin necesitar un tema nuevo para cada personaje.",action:"Diseña una célula reconocible y compara su retorno en una escena de descubrimiento y otra de acción, cambiando el acompañamiento.",source:"Alan Silvestri, entrevistas sobre Back to the Future: tema central ligado al heroísmo de la historia, no exclusivamente a Marty."},
 {id:"cadence",name:"Llegada tonal definida",domain:"Armonía",reason:"Una preparación dominante-tónica puede dar dirección a una frase expansiva.",action:"Compara tu cierre actual con una preparación de dominante y decide cuál conserva mejor la emoción.",source:"Sintaxis tonal de aventura y acción; recurso compartido."},
 {id:"rhythmic",name:"Impulso rítmico en ostinato",domain:"Ritmo",reason:"Un patrón de acompañamiento insistente sostiene movimiento sin cambiar el tema.",action:"Mantén los acordes y añade un pulso repetido en cuerdas graves, dejando espacio a la melodía.",source:"Escritura de acción orquestal; ejercicio no atribuido a una partitura concreta."}],
 horner:[
 {id:"modal",name:"Giro melódico modal",domain:"Melodía",reason:"Evitar la sensible tonal puede producir una llegada abierta y evocadora.",action:"Compara una frase que usa el séptimo grado menor con otra que usa la sensible; no cambies la melodía original hasta elegir.",source:"El modalismo es un recurso compartido; para Horner, el estudio de Lehman (2013) sobre A Beautiful Mind aporta evidencia más específica de transformaciones triádicas."},
 {id:"triadic",name:"Trayectoria de tríadas cromáticas",domain:"Armonía",reason:"Una sucesión de tríadas enlazadas por transformaciones puede construir un recorrido reconocible sin depender de cadencias funcionales.",action:"Toma una tríada mayor o menor de tu idea y compara dos transformaciones P, L o R sucesivas en el laboratorio; decide si la continuidad de notas comunes sirve a tu escena.",source:"Frank Lehman (2013), análisis de tres cues de A Beautiful Mind: redes de transformaciones L, R y S. Ejercicio simplificado, no transcripción de la obra."},
 {id:"longline",name:"Arco lírico prolongado",domain:"Desarrollo",reason:"Una melodía de respiración larga puede aumentar la emoción sin añadir acordes.",action:"Une dos motivos cortos en una frase más larga y retrasa su nota culminante.",source:"Fraseo lírico y desarrollo temático sinfónico; procedimiento compartido."}],
 shore:[
 {id:"leitmotif",name:"Transformación de leitmotiv",domain:"Desarrollo",reason:"Un mismo motivo cambia de significado al alterar su intervalo, ritmo o contexto.",action:"Repite tu célula temática en modo distinto o con inversión de un intervalo y compara el resultado.",source:"Mark Richards (2016), estudio de temas cinematográficos, y estudios académicos abiertos de The Lord of the Rings: distinguir motivo y armonía; no se detecta un leitmotiv solo con acordes."},
 {id:"modal",name:"Cambio de modo con nota común",domain:"Armonía",reason:"Una tercera alterada cambia el carácter conservando la fundamental y la quinta.",action:"Compara la tríada mayor y menor sobre una misma fundamental en un punto expresivo.",source:"Intercambio modal y cromatismo de la tradición sinfónica; no exclusivo."},
 {id:"orchestral",name:"Profundidad de capas corales",domain:"Orquestación",reason:"Un sostén de voces largas detrás de la melodía crea escala y gravedad.",action:"Mantén las notas comunes en voces largas y reserva los cambios de acorde para las voces interiores.",source:"Textura coral-orquestal asociada a parte de su lenguaje; recurso general."}],
 morricone:[
 {id:"sparse",name:"Economía de materiales",domain:"Textura",reason:"Un solo motivo y un acompañamiento mínimo pueden hacer más reconocible la idea.",action:"Reduce tu arreglo a una melodía, una nota pedal y un gesto de respuesta; reintroduce solo lo imprescindible.",source:"Economía temática y protagonismo del timbre en numerosas partituras; no fórmula universal."},
 {id:"timbre",name:"Timbre ligado al personaje",domain:"Orquestación",reason:"Un sonido recurrente puede identificar un personaje y adquirir otro significado al cambiar el contexto.",action:"Asigna a tu motivo un timbre distintivo y compara su reaparición aislada con otra acompañada; no cambies la armonía.",source:"Ennio Morricone, declaraciones sobre la armónica como símbolo narrativo en Once Upon a Time in the West."},
 {id:"modal",name:"Pedal con armonía modal",domain:"Armonía",reason:"Un bajo fijo bajo acordes vecinos mantiene tensión sin forzar una cadencia clásica.",action:"Conserva la nota fundamental en el grave y compara dos acordes de color modal encima.",source:"Pedales y modalismo en escritura cinematográfica; procedimiento compartido."}],
 newman:[
 {id:"space",name:"Silencio y espacio armónico",domain:"Textura",reason:"Dejar respirar una frase permite que una nota o acorde conserve su resonancia.",action:"Retira la mitad de los ataques del acompañamiento y escucha si la intención se vuelve más íntima.",source:"Escritura de economía expresiva y finales no resueltos, descrita por el compositor."},
 {id:"color",name:"Acordes abiertos y novenas",domain:"Armonía",reason:"Las notas añadidas pueden colorear una tríada sin exigir progresión funcional.",action:"Compara la tríada de partida con una novena añadida y conserva solo las tensiones que sirvan a tu frase.",source:"Chelsea Oden (2016), análisis con transcripciones parciales de Brooks Was Here y American Beauty: quintas abiertas, ostinati y ambigüedad modal. No es una receta universal."},
 {id:"pulse",name:"Percusión discreta y espacio",domain:"Orquestación",reason:"Un pulso breve puede sostener el carácter de una escena sin convertir cada cambio en una cadencia.",action:"Compara un acompañamiento de ataques percusivos espaciados con uno sostenido; no cambies los acordes.",source:"Thomas Newman, American Beauty: contraste entre Dead Already (percusión) y Any Other Name (carácter lírico), descrito en la reseña del álbum de AllMusic."}],
 goransson:[
 {id:"rhythm",name:"Contrarritmo entre capas",domain:"Ritmo",reason:"Dos figuras que se complementan pueden generar movimiento sin aumentar la densidad armónica.",action:"Divide un patrón de ocho pulsos en dos voces con acentos alternos; comprueba que no se estorben.",source:"Trabajo de contrarritmos y diálogo de tradiciones instrumentales descrito en Black Panther."},
 {id:"tempo",name:"Aceleración de la percepción",domain:"Forma",reason:"Subdivisiones progresivas intensifican la energía aunque los acordes permanezcan.",action:"Compara corcheas, tresillos y semicorcheas sobre el mismo acorde antes de decidir si cambiar el tempo real.",source:"Experimentación con cambios métricos y tempo en Oppenheimer; propuesta simplificada."},
 {id:"timbre",name:"Transformación expresiva del solista",domain:"Orquestación",reason:"Articulación, vibrato y registro pueden cambiar la tensión de una misma línea.",action:"Mantén la melodía en un violín solista y compara legato suave con ataques tensos y glissandi puntuales.",source:"Exploración expresiva del violín solista documentada en Oppenheimer."}],

};
function composerAssistance(composerId,progression=[]){
 const techniques=COMPOSER_TECHNIQUES[composerId]||[];
 const chords=Array.isArray(progression)?progression:[];
 return techniques.map(t=>{
  let observation="Aplica esta técnica a un fragmento de tu propia idea.";
  if(t.id==="chromatic"&&chords.length){
   const c=chords.find(c=>c.type===""||c.type==="m");
   if(c)observation="En "+c.label+" puedes desplazar una sola nota un semitono, conservando las otras dos. Es una exploración de fricción cromática, no una técnica exclusiva ni una secuencia detectada.";
  }else if(t.id==="minorMajorSeventh"&&chords.length){
   const minorChord=chords.find(c=>c.type==="m");
   observation=minorChord
    ?"Sobre "+minorChord.label+" puedes probar una séptima mayor como opción de color (mMaj7), sin cambiar tu progresión. La referencia a Vertigo no implica imitación exacta."
    :"Elige una tríada menor para comparar su versión mMaj7. No se ha detectado esa sonoridad en tu material.";
  }else if(t.id==="dominant"&&chords.length>1){
   observation="Revisa la llegada de "+chords[chords.length-2].label+" a "+chords[chords.length-1].label+" y escucha si pide una preparación más dirigida.";
  }else if(t.id==="pedal"&&chords.length){
   observation="Puedes probar un pedal sobre "+spell(chords[0].root)+" mientras comparas la progresión sin cambiar sus acordes.";
  }else if(t.id==="counterpoint"&&chords.length>1){
   const common=chords[0].notes.filter(pc=>chords[1].notes.includes(pc));
   observation=common.length
    ?"Los dos primeros acordes comparten "+common.length+" nota(s). Prueba una voz contraria, pero verifica el movimiento con una melodía real."
    :"Los dos primeros acordes no comparten notas. Prueba movimiento contrario en una voz, sin asumir que ya existe una contramelodía.";
  }else if(t.id==="triadic"&&chords.length){
   const triad=chords.find(ch=>(ch.type===""||ch.type==="m")&&Array.isArray(ch.notes)&&ch.notes.length===3);
   observation=triad?"Puedes comenzar por "+triad.label+" y comparar transformaciones de tríadas. No se ha identificado una secuencia concreta de Horner en tu material.":"No hay una tríada mayor o menor simple en esta progresión. El ejercicio requiere elegir una tríada de partida.";
  }else if(t.id==="modal"&&chords.length){
   observation="El primer acorde es "+chords[0].label+". Compara una variante modal sin asumir que se ha producido una modulación.";
  }else if(t.id==="color"&&chords.length){
   observation="Mantén "+chords[0].label+" como referencia y prueba otra distribución o timbre. Los acordes no contienen información instrumental.";
  }else if(t.id==="space"&&chords.length){
   observation="Tu progresión contiene "+chords.length+" acordes; prueba dejar más espacio entre ataques. No se han analizado duraciones ni silencios.";
  }else if(t.id==="leitmotif"||t.id==="motif"){
   observation="Para comprobar una transformación temática se necesita una melodía. Aquí solo se propone un ejercicio; no se ha detectado ningún motivo.";
  }else if(t.id==="tempo"||t.id==="rhythm"||t.id==="dance"||t.id==="pulse"||t.id==="ostinato"||t.id==="rhythmic"){
   observation="Esta propuesta afecta al ritmo. No se han analizado duraciones, compases ni acentos a partir de los acordes.";
  }
  const requiresMelody=["sequence","motif","leitmotif","longline","fanfare","cell","counterpoint"].includes(t.id);
  const requiresTiming=["dance","rhythm","tempo","pulse","ostinato","rhythmic","space","delay"].includes(t.id);
  const harmonicOnly=["dominant","cadence","chromatic","modal","triadic","minorMajorSeventh"].includes(t.id);
  return {...t,observation,requiresMelody,requiresTiming,harmonicOnly,
   evidenceLevel:"orientative",changesOriginal:false};
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
// Small, explainable developments of the user's own material; no edits or inferred performance.
function gradualDevelopmentIdeas(chords,index){
 if(!Array.isArray(chords)||!Number.isInteger(index)||index<0||index>=chords.length)return [];
 const ch=chords[index],pcs=new Set(ch.notes.map(mod)),root=mod(ch.root),ideas=[];
 if(pcs.has(mod(root+7))){
  ideas.push({id:"retain-fifth",title:"Mantener un eje de quinta",description:"Prueba conservar "+spell(root)+" y "+spell(root+7)+" como referencia mientras decides si cambia el resto del acorde.",change:"No se altera ningún acorde; es una propuesta de disposición o prolongación.",requires:"Registro, duración y distribución de voces."});
 }
 if(ch.type===""||ch.type==="m"){
  const third=mod(root+(ch.type==="m"?3:4)),other=mod(root+(ch.type==="m"?4:3));
  ideas.push({id:"modal-third",title:"Explorar la tercera paralela",description:"Compara "+spell(third)+" con "+spell(other)+" manteniendo la fundamental "+spell(root)+" y la quinta "+spell(root+7)+".",change:"Cambia una clase de altura (la tercera) en un experimento hipotético.",requires:"Centro tonal y contexto para decidir si realmente hay intercambio modal."});
 }
 const next=chords[index+1];
 if(next){
  const common=[...pcs].filter(pc=>next.notes.some(n=>mod(n)===pc));
  if(common.length)ideas.push({id:"common-tone-bridge",title:"Prolongar una nota común",description:"Prueba sostener "+spell(common[0])+" al pasar de "+ch.label+" a "+next.label+"; compara el efecto de conservarla o rearticularla.",change:"Se conservan las alturas de los acordes.",requires:"Duración, ritmo y voz asignada para comprobar el efecto real."});
  else ideas.push({id:"nearest-connection",title:"Buscar un enlace gradual",description:"No hay clases de altura compartidas entre "+ch.label+" y "+next.label+". Explora una voz que se desplace por semitono o tono antes de cambiar la armonía completa.",change:"No hay sustitución automática.",requires:"Voces concretas y registro para verificar el movimiento."});
 }
 return ideas.slice(0,3);
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
// Phrase-level proposals describe interpretive decisions; they never rewrite chords.
const PHRASE_STRATEGIES={
 williams:{id:"prepared-resolution",name:"Preparación y resolución expresiva",preparation:"Presentar el motivo y preparar el acorde de color mediante una línea de aproximación.",development:"Mantener la nota característica del acorde de color mientras las otras voces se mueven con independencia.",arrival:"Resolver la tensión con una llegada clara, evitando tratar la cadencia como un mero cambio de acorde.",focus:"desarrollo temático y resolución dirigida"},
 zimmer:{id:"cyclic-build",name:"Ciclo y acumulación",preparation:"Establecer una célula repetible sobre el primer acorde.",development:"Repetir el patrón y aumentar gradualmente densidad o registro sin cambiar la armonía.",arrival:"Conservar el pulso del ciclo y transformar la intensidad del regreso.",focus:"repetición, densidad y arco dinámico"},
 newman:{id:"sparse-color",name:"Espacio y resonancia",preparation:"Exponer pocas notas, dejando respiración entre gestos.",development:"Sostener notas comunes y explorar el registro o la resonancia del acorde central.",arrival:"Permitir que la llegada sea discreta, con silencios o una textura reducida.",focus:"espacio, timbre y continuidad de notas comunes"}
};
function composerEmotionPhraseStudy(tonic,emotion,composerId,DATA,modeOverride){
 const profile=PHRASE_STRATEGIES[composerId];
 if(!profile)return {status:"not-studied",composerId,proposals:[],warning:"No se ha validado un tratamiento de frase para este perfil."};
 const modeKey=modeOverride||emotion?.mode;
 if(!emotion||!DATA?.MODES?.[modeKey]||!Array.isArray(emotion.steps)||emotion.steps.length<3)
  return {status:"insufficient-material",composerId,proposals:[]};
 const progression=buildProfileProgression(emotion.steps,tonic,DATA.MODES[modeKey],DATA.keyNameForPc(tonic));
 const middle=Math.floor((progression.length-1)/2);
 const anchor=progression[middle],previous=progression[middle-1],next=progression[middle+1];
 const sharedPrevious=anchor.notes.filter(n=>previous.notes.includes(n));
 const sharedNext=anchor.notes.filter(n=>next.notes.includes(n));
 return {status:"study",composerId,modeKey,strategy:profile.id,name:profile.name,
  focus:profile.focus,anchorIndex:middle,anchorChord:anchor.label,
  preservedProgression:progression.map(ch=>ch.label),
  sharedPrevious,sharedNext,
  proposals:[
   {stage:"preparation",chord:previous.label,action:profile.preparation},
   {stage:"development",chord:anchor.label,action:profile.development},
   {stage:"arrival",chord:next.label,action:profile.arrival}
  ],
  warning:"Hipótesis de tratamiento de frase, no reconstrucción ni atribución exclusiva del lenguaje del compositor. Ritmo, melodía, instrumentación y registro requieren juicio humano."};
}
function composerEmotionExperiment(tonic,emotion,composer,DATA,modeOverride){
 const keyName=DATA.keyNameForPc(tonic);
 const emotionalMode=DATA.MODES[modeOverride||emotion.mode];
 const composerMode=DATA.MODES[composer.signatureMode||"ionian"];
 if(!emotionalMode||!composerMode)return {status:"unsupported",alternatives:[]};
 const base=buildProfileProgression(emotion.steps,tonic,emotionalMode,keyName);
 const signature=buildProfileProgression(composer.signature,tonic,composerMode,keyName);
 if(base.length<3||signature.length<2)return {status:"insufficient-material",alternatives:[]};
 const originalFingerprint=ch=>mod(ch.root)+":"+ch.notes.map(n=>mod(n-ch.root)).sort((a,b)=>a-b).join(",");
 const candidates=signature.slice(1,-1);
 const options=[];
 for(const candidate of candidates){
  for(let index=1;index<base.length-1;index++){
   const original=base[index];
   if(originalFingerprint(candidate)===originalFingerprint(original))continue;
   const replaced=base.map((ch,i)=>i===index?{...candidate}:{...ch});
   const chords=replaced.map((ch,i)=>{
    const next=replaced[i+1];
    return {...ch,...classifyProgressionChord(ch,tonic,emotionalMode,next),
     commonWithNext:next?ch.notes.filter(pc=>next.notes.includes(pc)):[]};
   });
   const common=original.notes.filter(n=>candidate.notes.includes(n)).length;
   const before=base[index-1],after=base[index+1];
   const neighboringCommon=before.notes.filter(n=>candidate.notes.includes(n)).length+
    after.notes.filter(n=>candidate.notes.includes(n)).length;
   const rootMotion=mod(candidate.root-before.root);
   const context=contextualContrastDiagnostics(base,index,candidate);
   const motionDelta=context.motionDelta;
   const classification=classifyProgressionChord(candidate,tonic,emotionalMode,after);
   const chromaticCount=candidate.notes.filter(pc=>!scale(tonic,emotionalMode).includes(mod(pc))).length;
   const isLocalDominant=classification.classification==="dominant"||classification.classification==="modalDominant"||classification.classification==="secondaryDominant";
   const score=common*3+neighboringCommon*2-(rootMotion===6?2:0)-motionDelta-
    chromaticCount*2+(isLocalDominant?2:0);
   options.push({index,score,changedFrom:original.label,changedTo:candidate.label,
    progression:chords,diagnostics:{commonWithOriginal:common,commonWithNeighbors:neighboringCommon,motionDelta,
     chromaticDifference:context.chromaticDifference,chromaticCount,
     harmonicRole:classification.classification,roleExplanation:classification.explanation},
    explanation:"Sustitución experimental de un acorde interior por un gesto del perfil compositivo; conserva inicio, final y los demás acordes. La continuidad se estima por clases de altura, sin conducción registral. No representa una atribución histórica."});
  }
 }
 options.sort((a,b)=>b.score-a.score||a.index-b.index);
 const unique=[],seen=new Set();
 for(const option of options){
  const fingerprint=option.index+":"+originalFingerprint(option.progression[option.index]);
  if(!seen.has(fingerprint)){seen.add(fingerprint);unique.push(option);}
 }
 return {status:unique.length?"suggestions":"no-distinct-gesture",base,alternatives:unique.slice(0,3),
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
root.CinematicoEngine={harmonicContextSummary,composerRouteComparison,minorDominantEvidence,cadenceEvidence,tonalHypotheses,composerEmotionPhraseStudy,composerEmotionExperiment,composerProfileAudit,tensionDestinations,harmonicContrastCharacter,contextualContrastDiagnostics,pitchClassMotionEstimate,compareHarmonicAlternatives,harmonicContinuityIdeas,gradualDevelopmentIdeas,harmonicResolutionDiagnostics,voiceMotionDiagnostics,threeVoiceCandidates,laboratoryVoices,sustainedToneAnalysis,adjacentVoiceMotion,progressionInsights,tritoneTriadRelations,triadicLayeringHypotheses,harmonicTrajectories,harmonicContinuations,emotionalContinuations,prepareContinuationForAnalysis,chordAlternatives,parseUserProgression,COMPOSER_TECHNIQUES,COMPOSER_CREATIVE_LENSES,composerCreativePaths,composerRouteInsights,composerListeningPlan,composerAssistance,neoTriad,neoTransform,tendencyResolution,voiceLead,voicingCandidates,transitionCost,PC,spell,spellDegree,spellScale,scale,diatonicChord,buildProfileProgression,modulationIdeas,analyze,extensionIntervals,romanFor,identifyType};
})(typeof window!=="undefined"?window:globalThis);
