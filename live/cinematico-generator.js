/* Cinemático Live Generator · Max for Live 12 · beta 0.1
   Keep these files together: cinematico-generator.js, cinematico-core.js.
   Installed in a MIDI GENERATOR template, not a MIDI Effect.
   NOTE: Only an explicit MIDI Tool Apply action generates notes. */
var inlets=1;
var outlets=2;
var Engine=require("cinematico-core.js");
var source="Am F C G";
var intent="esperanza";
var choice=1;
var VALID=new Set(Object.keys(Engine.EMOTION_CREATIVE_PROFILES));
function labelStatus(text){outlet(1,"set",String(text).slice(0,180));}
function normalized(){return Engine.parseUserProgression(source);}
function getProposals(){
  var parsed=normalized();
  if(parsed.errors.length)return {ok:false,error:parsed.errors.join("; "),paths:[]};
  if(!parsed.chords.length)return {ok:false,error:"Escribe al menos un acorde.",paths:[]};
  var paths=Engine.emotionalContinuations(parsed.chords,intent);
  if(paths.length!==3)return {ok:false,error:"No hay tres alternativas válidas.",paths:[]};
  return {ok:true,paths:paths};
}
function chords(){
  source=Array.prototype.slice.call(arguments).join(" ").trim().replace(/\s+/g," ");
  preview();
}
function text(){chords.apply(null,arguments);}
function mood(id){
  var value=String(id).trim().toLowerCase();
  if(!VALID.has(value)){labelStatus("Matiz no reconocido: "+value);return;}
  intent=value;
  preview();
}
function variant(n){
  var v=Number(n);
  if(!Number.isInteger(v)||v<1||v>3){labelStatus("Elige camino 1, 2 o 3.");return;}
  choice=v;preview();
}
function preview(){
  var out=getProposals();
  if(!out.ok){labelStatus("Revisa tus acordes: "+out.error);return;}
  labelStatus("CAMINO "+choice+" / "+intent+": "+out.paths[choice-1].chords.join(" - "));
}
function chordVoicing(label){
  var parsed=Engine.parseUserProgression(label);
  if(parsed.errors.length||parsed.chords.length!==1)throw Error("Acorde no válido: "+label);
  var ch=parsed.chords[0],r=ch.root;
  var intervals=Array.from(new Set(ch.notes.map(function(pc){return (pc-r+12)%12;}))).sort(function(a,b){return a-b;});
  if(!intervals.includes(0))intervals.unshift(0);
  var ordered=intervals.slice(0,4);
  return ordered.map(function(i){return 48+r+i;});
}
function generatedNotes(){
  var out=getProposals();
  if(!out.ok)throw Error(out.error);
  var selected=out.paths[choice-1];
  var notes=[];
  for(var bar=0;bar<selected.chords.length;bar++){
    var pitches=chordVoicing(selected.chords[bar]);
    for(var n=0;n<pitches.length;n++){
      notes.push({pitch:pitches[n],start_time:bar,duration:0.95,velocity:90,mute:0,probability:1});
    }
  }
  return {notes:notes,selected:selected.chords.slice(),source:source,intent:intent,variant:choice};
}
function dictionary(name){
  // live.miditool.in sends a dictionary; editing it is deliberately avoided.
  // Generator output is additive, not a transformation of the original clip.
  try {
    var result=generatedNotes();
    outlet_dictionary(0,{notes:result.notes});
    labelStatus("Enviado: "+result.selected.join(" - ")+". Usa Deshacer en Live si lo necesitas.");
  }catch(err){
    outlet_dictionary(0,{notes:[]}); // Always close Live's apply cycle.
    labelStatus("Sin cambios: "+String(err.message||err).slice(0,110));
  }
}
function bang(){dictionary("");}
function loadbang(){preview();}
