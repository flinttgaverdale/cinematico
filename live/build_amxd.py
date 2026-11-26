#!/usr/bin/env python3
"""Reproducible standalone Cinemático Live 12 MIDI Generator AMXD builder.

Constructs a frozen mx@c AMXD container from our source .maxpat and two JS
dependencies. The 'nagg' type and patcher amxdtype mark a Note Generator.
This is independent of Max; runtime inside Ableton must still be tested.
"""
import argparse
from pathlib import Path
import json
import struct

ROOT = Path(__file__).resolve().parent.parent
PATH = ROOT / "downloads" / "Cinematico-Generator-Beta.amxd"
P = struct.pack
DIAGNOSTIC_NAME = "Cinematico-Generator-Diagnostico.amxd"
HFS_TIME = 3860000000


def field(tag, data):
    return tag.encode("ascii") + P(">I", 8 + len(data)) + data


def pad4(data):
    return data + b"\0" * (-len(data) % 4)


def directory(ftype, name, length, offset, flags):
    content = b"".join([
        field("type", ftype.encode("ascii")),
        field("fnam", pad4(name.encode("ascii") + b"\0")),
        field("sz32", P(">I", length)),
        field("of32", P(">I", offset)),
        field("vers", P(">I", 0)),
        field("flag", P(">I", flags)),
        field("mdat", P(">I", HFS_TIME))
    ])
    return field("dire", content)


def diagnostic_source(generator):
    """Log real Max messages in a separate synthetic-clip test build."""
    original = {
        "function msg_dictionary(payload){applyToClip();}":
            'function msg_dictionary(payload){captureHost("msg_dictionary",payload);applyToClip();}',
        "function dictionary(name){applyToClip();}":
            'function dictionary(name){captureNamedHost(name);applyToClip();}',
        "function bang(){applyToClip();}":
            'function bang(){captureHost("bang",null);applyToClip();}',
    }
    for before, after in original.items():
        if generator.count(before) != 1:
            raise ValueError("The host message handler changed: " + before)
        generator = generator.replace(before, after)
    return generator + r"""

function captureHost(message,payload){
  var log={message:message,payload:payload};
  try {post("CINEMATICO_DIAGNOSTIC "+JSON.stringify(log)+"\n");}
  catch(error){post("CINEMATICO_DIAGNOSTIC "+JSON.stringify({message:message,captureError:String(error)})+"\n");}
}
function captureNamedHost(name){
  var payload;
  try {payload=JSON.parse(new Dict(name).stringify());}
  catch(error){payload={captureError:String(error)};}
  captureHost("dictionary",payload);
}
"""


def build(diagnostic=False):
    main = (ROOT / "live" / "Cinematico-Generator.maxpat").read_bytes()
    patcher = json.loads(main)["patcher"]
    assert patcher["project"]["amxdtype"] == 1851877223, "Missing Note Generator type"
    generator = (ROOT / "live" / "cinematico-generator.js").read_bytes()
    if diagnostic:
        generator = diagnostic_source(generator.decode("utf-8")).encode("utf-8")
    sources = [
        ("JSON", DIAGNOSTIC_NAME if diagnostic else PATH.name, main, 17),
        ("TEXT", "cinematico-generator.js", generator, 0),
        ("TEXT", "cinematico-core.js", (ROOT / "live" / "cinematico-core.js").read_bytes(), 0),
    ]
    region = bytearray()
    entries = bytearray()
    for ftype, name, data, flags in sources:
        pos = 16 + len(region)
        region += data
        entries += directory(ftype, name, len(data), pos, flags)
    dlst = field("dlst", entries)
    footer = 16 + len(region)
    blob = b"mx@c" + P(">I", 16) + P(">Q", footer) + region + dlst
    return b"ampf" + P("<I", 4) + b"nagg" + b"meta" + P("<I", 4) + P("<I", 7) + b"ptch" + P("<I", len(blob)) + blob



if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--check", action="store_true")
    mode.add_argument("--diagnostic", type=Path, metavar="OUTPUT_DIR")
    args = parser.parse_args()
    expected = build(diagnostic=args.diagnostic is not None)
    if args.check:
        actual = PATH.read_bytes()
        assert actual == expected, "Committed AMXD is not identical to sources"
        assert actual[:12] == b"ampf\x04\0\0\0nagg"
        assert actual[32:36] == b"mx@c"
        assert len(actual) > 160000
        print(f"PASS frozen MIDI Note Generator .amxd ({len(actual)} bytes), assets embedded")
    elif args.diagnostic is not None:
        args.diagnostic.mkdir(parents=True, exist_ok=True)
        output = args.diagnostic / DIAGNOSTIC_NAME
        with output.open("xb") as file:
            file.write(expected)
        print(f"Created diagnostic {output} ({len(expected)} bytes)")
    else:
        PATH.parent.mkdir(parents=True, exist_ok=True)
        PATH.write_bytes(expected)
        print(f"Created {PATH} ({len(expected)} bytes)")
