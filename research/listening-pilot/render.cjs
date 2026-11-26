'use strict';
const assert=require('node:assert/strict');
const {createHash}=require('node:crypto');
const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require('playwright');

const output=process.argv[2];
const revision=process.argv[3];
const base=process.env.CINEMATICO_TEST_URL||'http://127.0.0.1:4173/';
if(!output||!revision)throw Error('Uso: node research/listening-pilot/render.cjs DIRECTORIO COMMIT');
const rate=48000;
const ids=['williams','horner','herrmann','elfman','zimmer','giacchino','shore','morricone'];

function wav(samples){
 const size=samples.length;
 const buffer=Buffer.alloc(size+44);
 buffer.write('RIFF'); buffer.writeUInt32LE(size+36,4);
 buffer.write('WAVEfmt ',8); buffer.writeUInt32LE(16,16);
 buffer.writeUInt16LE(1,20); buffer.writeUInt16LE(1,22);
 buffer.writeUInt32LE(rate,24); buffer.writeUInt32LE(rate*2,28);
 buffer.writeUInt16LE(2,32); buffer.writeUInt16LE(16,34);
 buffer.write('data',36); buffer.writeUInt32LE(size,40);
 samples.copy(buffer,44);
 return buffer;
}

async function main(){
 fs.mkdirSync(output);
 fs.mkdirSync(path.join(output,'participante'));
 const participant=path.join(output,'participante');
 const browser=await chromium.launch();
 try{
  const page=await browser.newPage();
  await page.goto(base,{waitUntil:'domcontentloaded'});
  const cases=await page.evaluate(ids=>{
   const {parseUserProgression,contextualComposerExperiment}=CinematicoEngine;
   const chords=parseUserProgression('Am F C G').chords;
   return ids.map(id=>{
    const experiment=contextualComposerExperiment(id,chords,'esperanza');
    return {id,procedure:experiment.id,...experiment.comparison};
   });
  },ids);
  cases.push({id:'control',procedure:'par-idéntico',before:['C','G'],after:['C','G']});
  const records=[];
  for(const [index,trial] of cases.entries()){
   assert.ok(trial.before.length>=2&&trial.after.length===trial.before.length);
   const id='p'+String(index+1).padStart(2,'0');
   const pcm=await page.evaluate(async ({trial,rate})=>{
    const lists=trial.id==="control"?[trial.before]:[trial.before,trial.after],signals=[];
    for(const labels of lists){
     const engine=CinematicoEngine;
     const plan=engine.composerListeningPlan(engine.parseUserProgression(labels.join(' ')).chords,{equalChordDuration:true});
     if(plan.status!=='ready')throw Error(plan.warning);
     const offline=new OfflineAudioContext(1,Math.ceil(rate*(plan.totalSeconds+.4)),rate);
     const master=createPianoMaster(offline);
     for(const step of plan.steps)for(const hz of step.frequencies){
      playPianoTone(offline,master,hz,.08+step.startSeconds,step.durationSeconds-.08);
     }
     const signal=(await offline.startRendering()).getChannelData(0);
     let squares=0,peak=0;
     for(const value of signal){squares+=value*value;peak=Math.max(peak,Math.abs(value));}
     signals.push({signal,peak,rms:Math.sqrt(squares/signal.length)});
    }
    // Match paired RMS while limiting headroom. No claim about perceived loudness.
    const level=Math.min(.045,...signals.map(s=>.75*s.rms/s.peak));
    const rendered=signals.map(({signal,rms})=>{
     if(!Number.isFinite(rms)||rms<=0)throw Error('Se produjo una señal inválida');
     const data=new DataView(new ArrayBuffer(signal.length*2));
     for(let i=0;i<signal.length;i++)data.setInt16(i*2,Math.round(signal[i]*level/rms*32767),true);
     const bytes=new Uint8Array(data.buffer);
     let text='';
     for(let i=0;i<bytes.length;i+=16384)text+=String.fromCharCode(...bytes.subarray(i,i+16384));
     return btoa(text);
    });
    return trial.id==="control"?[rendered[0],rendered[0]]:rendered;
   },{trial,rate});
   const order=index%2===0?['before','after']:['after','before'];
   const sides=order.map((side,position)=>{
    const name=id+'-'+(position+1)+'.wav';
    const samples=Buffer.from(pcm[side==='before'?0:1],'base64');
    const file=wav(samples);
    fs.writeFileSync(path.join(participant,name),file);
    return {name,meaning:side,frames:samples.length/2,sha256:createHash('sha256').update(file).digest('hex')};
   });
   assert.equal(sides[0].frames,sides[1].frames);
   assert.equal(sides[0].sha256===sides[1].sha256,trial.id==='control');
   records.push({id,trial,sides});
  }
  fs.copyFileSync(path.join(__dirname,'participant.html'),path.join(participant,'index.html'));
  const pairs=records.map(item=>({id:item.id,tracks:item.sides.map(x=>x.name)}));
  fs.writeFileSync(path.join(participant,'pairs.js'),'window.CINEMATICO_PILOT='+JSON.stringify({pairs})+';\n');
  fs.writeFileSync(path.join(output,'clave-coordinacion.json'),JSON.stringify({revision,rate,records},null,2)+'\n');
  console.log('PASS '+records.length+' pares, incluido control idéntico. WAV PCM mono a 48 kHz con duración emparejada.');
 }finally{await browser.close();}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
