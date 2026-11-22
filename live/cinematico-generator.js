/* Cinemático Studio · MIDI Tool Generator beta 0.2 (Live 12 Suite)
   Source + harmonic engine are embedded in the downloadable .amxd.
   This is a MIDI Note Generator; Live's Generate > Apply starts each cycle.
   Assumes 4/4; three chords spanning 3 full bars. */
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
  if(!VALID.has(intent))return {ok:false,error:"Matiz no reconocido: "+intent,paths:[]};
  if(!Number.isInteger(choice)||choice<1||choice>3)return {ok:false,error:"Elige camino 1, 2 o 3.",paths:[]};
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
  intent=String(id).trim().toLowerCase();
  preview();
}
function variant(n){
  choice=Number(n);
  preview();
}
function preview(){
  var out=getProposals();
  if(!out.ok){labelStatus("Revisa la entrada: "+out.error);return;}
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
      notes.push({pitch:pitches[n],start_time:bar*4,duration:3.75,velocity:90,mute:0,probability:1});
    }
  }
  return {notes:notes,selected:selected.chords.slice(),source:source,intent:intent,variant:choice};
}
function applyToClip(){
  // Live 12 sends a dictionary when Apply is pressed in the Generator tab.
  // Never change any source chord. The notes payload only contains the new idea.
  try {
    var result=generatedNotes();
    outlet_dictionary(0,{notes:result.notes});
    labelStatus("CAMINO "+choice+": "+result.selected.join(" · "));
  }catch(err){
    outlet_dictionary(0,{notes:[]}); // No notes on invalid input.
    labelStatus("Corrige los acordes o los controles: "+String(err.message||err).slice(0,90));
  }
}
function msg_dictionary(payload){applyToClip();}
function dictionary(name){applyToClip();} // Compatibility with legacy Max routing.
function bang(){applyToClip();}
function loadbang(){preview();}
