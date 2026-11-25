'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const root=path.join(__dirname,'..');
const archive=path.join(root,'downloads/Cinematico-Live-Preview.zip');
assert.ok(fs.existsSync(archive),'Release zip must be committed');
const size=fs.statSync(archive).size;
assert.ok(size>150000&&size<400000,'Unexpected archive size '+size);
const check=String.raw`
from io import BytesIO
from pathlib import Path
from struct import unpack
from sys import argv
from zipfile import ZipFile

def variable_length(track):
    value = 0
    while True:
        byte, = track.read(1)
        value = (value << 7) + (byte & 127)
        if byte < 128:
            return value

def assert_demo_timing(data):
    assert data[:8] == b'MThd\0\0\0\x06'
    format_number, tracks, ppq = unpack('>HHH', data[8:14])
    assert format_number == 0 and tracks == 1 and ppq == 480
    assert data[14:18] == b'MTrk'
    assert unpack('>I', data[18:22])[0] == len(data) - 22
    track = BytesIO(data[22:])
    start_times, durations, sounding = set(), set(), {}
    ticks = 0
    while track.tell() < len(data) - 22:
        ticks += variable_length(track)
        status, = track.read(1)
        if status == 255:
            event_type, = track.read(1)
            track.read(variable_length(track))
        else:
            pitch, velocity = track.read(2)
            assert status in (128, 144)
            if status == 144 and velocity:
                start_times.add(ticks)
                sounding[pitch] = ticks
            else:
                durations.add(ticks - sounding.pop(pitch))
    assert not sounding
    assert start_times == {0, 4 * ppq, 8 * ppq}, start_times
    assert durations == {1824}, durations

with ZipFile(Path(argv[1])) as archive:
    assert archive.testzip() is None
    names = archive.namelist()
    prefix = 'Cinematico-Live-Preview/'
    assert len(names) == 8, names
    assert all(name.startswith(prefix) for name in names)
    assert archive.read(prefix + 'cinematico-core.js').decode('utf8').startswith(Path(argv[2]).read_text())
    assert archive.read(prefix + 'Cinematico-Generator.maxpat').startswith(b'{')
    demos = [name for name in names if name.endswith('.mid')]
    assert len(demos) == 3
    for name in demos:
        assert_demo_timing(archive.read(name))
    print('PASS ZIP integrity: 8 files, web engine parity, 3 MIDI demos at 0, 4 and 8 beats')
`;
const run=cp.spawnSync('python3',['-c',check,archive,path.join(root,'engine.js')],{encoding:'utf8'});
assert.equal(run.status,0,run.stderr||run.stdout);
console.log(run.stdout.trim());
