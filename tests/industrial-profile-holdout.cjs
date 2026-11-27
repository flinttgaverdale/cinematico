'use strict';
const assert = require('node:assert/strict');
require('../engine.js');
const engine = global.CinematicoEngine;
const composers = ['williams', 'horner', 'herrmann', 'elfman', 'zimmer', 'giacchino', 'silvestri', 'shore', 'morricone', 'newman', 'goransson'];

// Frozen before measuring this revision. These are original chord examples,
// not transcriptions. Keep evaluation outside any future tuning cycle.
const corpora = {
  diagnostico: [
    ['Am F C G', 'nostalgia', 'auto'], ['Cmaj7#11 F#m/C# DmMaj7 G7/B', 'contraste', 'open'],
    ['D D/F# G Gm', 'melancolia', 'auto'], ['Bbm Db/Eb Eb7 Ab', 'ternura', 'auto'],
    ['E Eaug Amaj7/E B7/E', 'tension', 'open'], ['F Ab Dm7b5 G7', 'asombro', 'auto'],
    ['C/Bb F/A G7 C', 'calma', 'auto'], ['Bm BmMaj7 Bm7 Em/B', 'misterio', 'open'],
    ['Amaj7 Cmaj7 Fmaj7 E7', 'epica', 'closed'], ['F#m Asus2 Dadd9 Esus4', 'inquietud', 'open'],
    ['Gmaj9 D/F# Em7 Cadd9', 'esperanza', 'auto'], ['Ab B Dbm Eb7', 'oscuridad', 'closed'],
  ],
  evaluacion: [
    ['Emadd9 Cmaj7/E A7/E B7', 'tristeza', 'open'], ['Gm Bb/D Cm/Eb F7', 'alegria', 'closed'],
    ['Ebm Gb Abm/Bb Db7', 'epica', 'auto'], ['Bmaj7 F#/A# G#m9 Em', 'melancolia', 'auto'],
    ['Dm/F Gm7 C7sus4 C7 Fmaj9', 'ternura', 'auto'], ['Fm Abadd9 Gb C7sus4', 'suspense', 'open'],
    ['Dbmaj7#11 Ab7/Gb Dbadd9 Bb7', 'contraste', 'auto'], ['Bb F/A Gm7 Ebm', 'nostalgia', 'auto'],
    ['Dadd9 Cadd9 G/B A7', 'esperanza', 'closed'], ['A E/G# F#m/A B7 A', 'calma', 'auto'],
    ['CmMaj7 Db/C Gm/C Bb7', 'misterio', 'open'], ['G Ebmaj7 C#m7b5 D7', 'asombro', 'auto'],
  ],
};

function parse(source) {
  const result = engine.parseUserProgression(source);
  assert.deepEqual(result.errors, [], source);
  return result.chords;
}

const identity = chords => chords.map(ch => `${ch.root}/${ch.type}/${ch.bass}`).join(' ');
const rootPattern = chords => chords.map(ch => ch.root).join(' ');

function alternatives(input, mood, composer, ending) {
  const label = `${input.map(ch => ch.label)} · ${mood} · ${composer} · ${ending}`;
  const routes = engine.composerContinuations(input, mood, composer, { ending });
  assert.deepEqual(routes.map(route => route.id), ['continuity', 'transformation', 'contrast'], label);
  const plans = routes.map(route => {
    assert.deepEqual(route.original, input.map(chord => chord.label), label);
    assert.equal(route.composerId, composer, label);
    assert.equal(route.endingPreference, ending, label);
    assert.ok(route.phrase && route.structure && route.evidence, label);
    assert.ok(route.chords.length >= 1 && route.chords.length <= 3, label);
    return { route, chords: route.chords.flatMap(parse) };
  });
  assert.equal(new Set(plans.map(plan => identity(plan.chords))).size, 3, label);
  return plans;
}

function profileStats() {
  return { routes: 0, repeated: 0, stationaryRoot: 0, pedal: 0,
    recoveries: 0, sharedLinks: 0, extended: 0, minorMajor7: 0, direct: 0, changedWithIntent: 0 };
}

const allCases = Object.values(corpora).flat().map(([source]) => identity(parse(source)));
assert.equal(new Set(allCases).size, allCases.length, 'Diagnostic and evaluation chord inputs are distinct');
const results = {};
for (const [corpus, cases] of Object.entries(corpora)) {
  const profiles = Object.fromEntries(composers.map(composer => [composer, profileStats()]));
  const pairs = { compared: 0, exact: 0, near: 0, sharedDirect: 0 };
  const examples = [];
  for (const [source, mood, ending] of cases) {
    const input = parse(source);
    const original = identity(input);
    const perComposer = composers.map(composer => alternatives(input, mood, composer, ending));
    for (const [index, composer] of composers.entries()) {
      const stats = profiles[composer];
      const plans = perComposer[index];
      const alternativeMood = mood === 'tension' ? 'calma' : 'tension';
      const withOtherIntent = alternatives(input, alternativeMood, composer, ending);
      stats.changedWithIntent += Number(plans.some((p, i) => identity(p.chords) !== identity(withOtherIntent[i].chords)));
      for (const { route, chords } of plans) {
        const prior = [input.at(-1), ...chords.slice(0, -1)];
        stats.routes++;
        stats.repeated += Number(chords.some((ch, i) => i > 0 && identity([ch]) === identity([chords[i - 1]])));
        stats.stationaryRoot += Number(chords.every(ch => ch.root === input.at(-1).root));
        stats.pedal += Number(chords.some((ch, i) => ch.root !== prior[i].root && ch.bass === prior[i].bass));
        stats.recoveries += Number(route.memory.some(event => event.kind === 'recuperación'));
        stats.sharedLinks += route.sharedNotes.filter(n => n >= 2).length;
        stats.extended += chords.filter(ch => ch.notes.length > 3).length;
        stats.minorMajor7 += chords.filter(ch => ch.type === 'mMaj7').length;
        stats.direct += Number(route.endingEvidence.directed);
      }
    }
    assert.equal(identity(input), original, 'Input remains intact');
    for (let i = 0; i < composers.length; i++) {
      for (let j = i + 1; j < composers.length; j++) {
        for (let route = 0; route < 3; route++) {
          const a = perComposer[i][route], b = perComposer[j][route];
          const exact = identity(a.chords) === identity(b.chords);
          if (exact && a.chords.length === 1 && a.route.endingEvidence.directed && b.route.endingEvidence.directed) {
            pairs.sharedDirect++;
            continue;
          }
          pairs.compared++;
          pairs.exact += Number(exact);
          pairs.near += Number(rootPattern(a.chords) === rootPattern(b.chords) &&
            a.chords.filter((ch, k) => identity([ch]) !== identity([b.chords[k]])).length <= 1);
        }
      }
    }
    examples.push({ source, mood, ending, profiles: Object.fromEntries(composers.map((composer, i) => [composer,
      perComposer[i].map(plan => plan.route.chords)])) });
  }
  results[corpus] = { profiles, pairs, examples };
}

// This positive control probes direction without identifying which cadence
// would be preferred in an actual composition.
const positive = parse('C F Dm G7');
const direction = composers.map(composer => {
  const closed = alternatives(positive, 'esperanza', composer, 'closed')[0];
  const open = alternatives(positive, 'esperanza', composer, 'open')[0];
  assert.deepEqual(closed.route.chords, ['C'], composer);
  assert.ok(closed.route.endingEvidence.directed, composer);
  return { composer, closed: closed.route.chords, open: open.route.chords,
    openDirected: open.route.endingEvidence.directed };
});

if (process.argv.includes('--summary')) {
  console.log('PASS profile evaluation: 11 composers, 24 independent materials, 1650 valid routes');
} else {
  console.log(JSON.stringify({ ...results, direction }, null, 2));
}
