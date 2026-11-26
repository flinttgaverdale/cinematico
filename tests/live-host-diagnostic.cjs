'use strict';

const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const output = fs.mkdtempSync(path.join(os.tmpdir(), 'cine-live-test-'));
const stable = path.join(root, 'downloads', 'Cinematico-Generator-Beta.amxd');
const stableBytes = fs.readFileSync(stable);

try {
  execFileSync('python3', ['live/build_amxd.py', '--diagnostic', output], { cwd: root });
  const device = fs.readFileSync(path.join(output, 'Cinematico-Generator-Diagnostico.amxd'));
  assert.equal(device.toString('ascii', 8, 12), 'nagg');
  assert.ok(device.includes('Cinematico-Generator-Diagnostico.amxd'));
  assert.deepEqual(fs.readFileSync(stable), stableBytes);
  assert.ok(!stableBytes.includes('CINEMATICO_DIAGNOSTIC'));

  const patch = fs.readFileSync(path.join(root, 'live', 'Cinematico-Generator.maxpat'));
  const core = fs.readFileSync(path.join(root, 'live', 'cinematico-core.js'));
  const scriptsEnd = 32 + Number(device.readBigUInt64BE(40));
  const source = device.toString('utf8', 48 + patch.length, scriptsEnd - core.length);
  const engine = {};
  vm.runInNewContext(core.toString(), engine);
  const payload = { notes: [], probe: 'fixture only' };
  const logs = [], generated = [];
  const ctx = {
    require: () => engine.CinematicoEngine,
    post: log => logs.push(JSON.parse(log.replace(/^CINEMATICO_DIAGNOSTIC /, ''))),
    outlet: () => {},
    outlet_dictionary: (_, value) => generated.push(JSON.parse(JSON.stringify(value))),
    Dict: function(name) {
      assert.equal(name, 'sample');
      this.stringify = () => JSON.stringify(payload);
    }
  };
  vm.runInNewContext(source, ctx);
  ctx.msg_dictionary(payload);
  ctx.dictionary('sample');
  ctx.bang();
  assert.deepEqual(logs, [
    { message: 'msg_dictionary', payload },
    { message: 'dictionary', payload },
    { message: 'bang', payload: null },
  ]);
  assert.equal(generated.length, 3);
  assert.ok(generated[0].notes.length > 0);
  assert.deepEqual(generated[1], generated[0]);
  assert.deepEqual(generated[2], generated[0]);
  console.log('PASS diagnostic AMXD records three host entry points and preserves generator output');
} finally {
  fs.rmSync(output, { recursive: true, force: true });
}
