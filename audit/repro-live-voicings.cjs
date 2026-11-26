'use strict';
// Regression reproducer for two confirmed musical integrity bugs in
// cinematico-generator.js. EXPECTED to fail until fixed by Codex.
// Run: node audit/repro-live-voicings.cjs
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const music = {};
vm.runInNewContext(fs.readFileSync(path.join(root, 'engine.js'), 'utf8'), music);
const E = music.CinematicoEngine;
if (!E) throw Error('Missing engine');
const ctx = {
  require(name) { if (name !== 'cinematico-core.js') throw Error('Unexpected require ' + name); return E; },
  outlet() {}, outlet_dictionary() {}
};
vm.runInNewContext(fs.readFileSync(path.join(root, 'live/cinematico-generator.js'), 'utf8'), ctx);
const errors = [];
const input = ['C/E', 'G7/B', 'C/Bb', 'D7/F#'];
for (const notation of input) {
  const chord = E.parseUserProgression(notation).chords[0];
  const notes = Array.from(ctx.chordVoicing(notation));
  const actualBass = notes.length ? Math.min(...notes) % 12 : null;
  if (actualBass !== chord.bass) errors.push(
    'SLASH BASS ' + notation + ': expected pc ' + chord.bass +
    ', generated bass pc ' + actualBass + ', MIDI=' + notes.join(','));
}
for (const notation of ['Cmaj7#11', 'Bbmaj7#11']) {
  const chord = E.parseUserProgression(notation).chords[0];
  const notes = Array.from(ctx.chordVoicing(notation));
  const pcs = notes.map(p => p % 12);
  const expectedSeventh = (chord.root + 11) % 12;
  const expectedSharpEleventh = (chord.root + 6) % 12;
  if (!pcs.includes(expectedSeventh) || !pcs.includes(expectedSharpEleventh)) {
    errors.push('EXTENSION ' + notation + ': 7M and #11 must both survive; actual pcs=' + pcs.join(','));
  }
}
if (errors.length) {
  console.error('FAIL — ' + errors.length + ' confirmed voicing problems:\n' + errors.map((e, i) => (i + 1) + '. ' + e).join('\n'));
  process.exitCode = 1;
} else {
  console.log('PASS — bass inversions and identity-defining extensions preserved.');
}
