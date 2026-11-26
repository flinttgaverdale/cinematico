'use strict';
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const base=process.env.CINEMATICO_TEST_URL||'http://127.0.0.1:4173/';
(async()=>{
 const browser=await chromium.launch();
 try{
  const page=await browser.newPage();
  await page.goto(base,{waitUntil:'domcontentloaded'});
  for(const rate of [44100,48000]){
   const measured=await page.evaluate(async rate=>{
    async function render(frames,play){
     const context=new OfflineAudioContext(1,frames,rate);
     play(context,createPianoMaster(context));
     const result=await context.startRendering();
     return result.getChannelData(0);
    }
    function rms(pcm,from,to){
     const samples=pcm.subarray(Math.round(rate*from),Math.round(rate*to));
     return Math.sqrt(samples.reduce((energy,value)=>energy+value*value,0)/samples.length);
    }
    const isolated=await render(rate,(context,master)=>playPianoTone(context,master,261.6256,.08,.6));
    const sequences=['Am F C G','Am F Cmaj9 G','Cmaj7#11 C/Bb F/A G7/B'];
    const mixes=[];
    for(const labels of sequences){
     const plan=CinematicoEngine.composerListeningPlan(CinematicoEngine.parseUserProgression(labels).chords,{equalChordDuration:true});
     if(plan.status!=='ready')throw Error(plan.warning);
     const pcm=await render(Math.ceil(rate*(plan.totalSeconds+.4)),(context,master)=>{
      for(const step of plan.steps)for(const hz of step.frequencies){
       playPianoTone(context,master,hz,.08+step.startSeconds,step.durationSeconds-.08);
      }
     });
     let peak=0;
     for(const sample of pcm)peak=Math.max(peak,Math.abs(sample));
     mixes.push({peak,rms:rms(pcm,.08,plan.totalSeconds),seconds:plan.totalSeconds});
    }
    return {mixes,
     preAttack:rms(isolated,0,.06),attack:rms(isolated,.10,.20),
     decay:rms(isolated,.5,.65),release:rms(isolated,.70,.78),silence:rms(isolated,.95,1)};
   },rate);
   assert.ok(measured.preAttack<1e-6);
   assert.ok(measured.attack>0.005);
   assert.ok(measured.attack>measured.decay&&measured.decay>measured.release);
   assert.ok(measured.release>1e-5&&measured.silence<1e-5);
   for(const mix of measured.mixes){
    assert.equal(mix.seconds,8);
    assert.ok(Number.isFinite(mix.peak)&&mix.peak>.03&&mix.peak<.95,'Polyphony should be audible and avoid clipping');
    assert.ok(mix.rms>.005);
   }
   const levelChange=20*Math.log10(measured.mixes[1].rms/measured.mixes[0].rms);
   assert.ok(Math.abs(levelChange)<6,'Similar sequences should have comparable signal levels');
   console.log('PASS offline piano render '+rate+' Hz · peak '+
    measured.mixes.map(mix=>mix.peak.toFixed(3)).join(', ')+' · envelope and matched A/B timing');
  }
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
