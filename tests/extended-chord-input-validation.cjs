// Symbolic parser alignment with the composition engine, not musical-style attribution.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const ctx={};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../engine.js'),'utf8'),ctx);
const E=ctx.CinematicoEngine;
const suffixes=['','m','dim','aug','7','maj7','mMaj7','m9','maj9','9','add9',
 '6','m6','dim7','m7b5','5','maj7#11','sus2','sus4','m7','madd9'];
const roots=['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B'];
const mod=n=>(n%12+12)%12;
let validated=0;
for(let pc=0;pc<12;pc++){
 for(const type of suffixes){
  const token=roots[pc]+type,parsed=E.parseUserProgression(token);
  assert.equal(parsed.errors.length,0,token+': '+parsed.errors.join('; '));
  assert.equal(parsed.chords.length,1,token);
  const chord=parsed.chords[0],expected=[...new Set(E.extensionIntervals(type).map(x=>mod(pc+x)))].sort((a,b)=>a-b);
  assert.deepEqual([...chord.notes].sort((a,b)=>a-b),expected,token);
  assert.equal(chord.type,type,token);
  assert.equal(chord.label,token,'Never rewrite the spelling supplied by the user');
  validated++;
 }
}
for(const input of [
 'Cmaj7#11 Dm7b5 E9 A6 Fm9 Gsus2 AmMaj7',
 'Cmaj7♯11 Dm7♭5 E9',
 'Dbmaj7#11/F G7/B Cm7',
 'Cmaj7#11/F#',
 'Gm7b5/Bb'
]){
 const result=E.parseUserProgression(input);
 assert.equal(result.errors.length,0,input+' '+result.errors.join('|'));
 assert.ok(result.chords.length>0);
}
for(const invalid of ['C7b9','Cmaj7#12','Hmaj7','Cmaj7#11/H','C9/Ebb']){
 assert.ok(E.parseUserProgression(invalid).errors.length>0,invalid);
}
assert.ok(E.parseUserProgression('C F G7 C').chords.length===4,'Legacy multi-chord parsing');
assert.ok(E.parseUserProgression('C, F; G7| C').chords.length===4,'Legacy separators');
assert.ok(E.parseUserProgression('C C C C C C C C C').errors.length>0,'Eight chord ceiling');
console.log('PASS parser alignment: '+validated+' chord symbols in 12 keys, extensions, inversions, Unicode, and malformed inputs.');
