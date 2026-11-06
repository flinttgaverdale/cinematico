// Run: node tests/phase1-regression.cjs
// Pure-engine regression checks. No browser, network or MIDI required.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const engineSource = fs.readFileSync(require('node:path').join(__dirname, '../engine.js'), 'utf8');
const context = { window: {} };
vm.runInNewContext(engineSource, context, { filename: 'engine.js' });
const engine = context.window.CinematicoEngine;
const moods = ['misterio','melancolia','tension','esperanza','nostalgia','epica','tristeza','alegria','ternura','asombro','inquietud','suspense','oscuridad','calma','contraste'];
const roots = ['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B'];
let checked = 0;
for (const root of roots) for (const quality of ['','m','7','maj7','m7','dim','sus4','add9']) {
  const parsed = engine.parseUserProgression(root + quality);
  assert.equal(parsed.errors.length, 0, root + quality);
  for (const mood of moods) {
    const paths = engine.emotionalContinuations(parsed.chords, mood);
    assert.ok(paths.length >= 1 && paths.length <= 3, root + quality + ' ' + mood);
    assert.equal(new Set(paths.map(p => p.chords.join(' '))).size, paths.length);
    for (const path of paths) {
      assert.equal(path.chords.length, 3);
      assert.equal(engine.parseUserProgression(path.chords.join(' ')).errors.length, 0);
      const prepared = engine.prepareContinuationForAnalysis(parsed.chords, path.chords);
      assert.equal(prepared.ok, true);
      assert.equal(prepared.chords.length, 4);
      checked++;
    }
  }
}
const four = engine.parseUserProgression('Am F C G').chords;
const sample = engine.emotionalContinuations(four, 'misterio')[0].chords;
const joined = engine.prepareContinuationForAnalysis(four, sample);
assert.equal(joined.ok, true);
assert.equal(joined.chords.length, 7);
assert.equal(joined.text, 'Am F C G ' + sample.join(' '));
assert.equal(four.length, 4, 'Original progression must remain unchanged');
assert.equal(engine.prepareContinuationForAnalysis(engine.parseUserProgression(Array(5).fill('Am').join(' ')).chords, sample).ok, true);
assert.equal(engine.prepareContinuationForAnalysis(engine.parseUserProgression(Array(6).fill('Am').join(' ')).chords, sample).ok, false);
assert.equal(engine.prepareContinuationForAnalysis(four, ['not-a-chord']).ok, false);
assert.equal(engine.prepareContinuationForAnalysis([], sample).ok, false);
assert.ok(engine.parseUserProgression(Array(9).fill('C').join(' ')).errors.length);
assert.ok(engine.parseUserProgression('Am H C').errors.length);
console.log('PASS: ' + checked + ' valid emotional continuations, all 15 moods, 12 roots, 8 chord qualities; input, overflow, preservation and parsing checks.');
