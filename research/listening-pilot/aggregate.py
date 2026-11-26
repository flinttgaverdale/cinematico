#!/usr/bin/env python3
"""Aggregate consented pilot responses without emitting participant-level data."""

import argparse
from collections import Counter
import csv
import json
from pathlib import Path


def aggregate(key, files):
    records = {record["id"]: record for record in key["records"]}
    counts = {identifier: Counter() for identifier in records}
    seen = set()
    for file in files:
        with file.open(encoding="utf-8-sig", newline="") as source:
            rows = list(csv.DictReader(source))
        participants = {row.get("participante_codigo") for row in rows}
        if len(participants) != 1 or not all(participants):
            raise ValueError(f"{file.name}: se esperaba un participante por archivo")
        if len(rows) != len(records) or {row.get("par") for row in rows} != records.keys():
            raise ValueError(f"{file.name}: faltan pares o hay pares duplicados")
        participant = next(iter(participants))
        if participant in seen:
            raise ValueError(f"{file.name}: código de participante duplicado")
        seen.add(participant)
        groups = {row.get("grupo") for row in rows}
        if groups not in ({"0"}, {"1"}):
            raise ValueError(f"{file.name}: grupo inválido")
        group = int(next(iter(groups)))
        for row in rows:
            identifier = row["par"]
            choice = row.get("eleccion")
            if row.get("revision") != key["revision"]:
                raise ValueError(f"{file.name}: revisión distinta de la clave")
            if choice in ("A", "B"):
                if records[identifier]["trial"]["id"] == "control":
                    choice = "opcion_" + choice
                else:
                    side = (group + int(choice == "B")) % 2
                    meaning = records[identifier]["sides"][side]["meaning"]
                    choice = {"before": "original", "after": "variante"}[meaning]
            elif choice not in ("Ambas por igual", "Ninguna", "Omitir"):
                raise ValueError(f"{file.name}: respuesta inválida")
            counts[identifier][choice] += 1
    result = {
        "revision": key["revision"],
        "participantes": len(seen),
        "respuestas": [
            {"par": identifier, "procedimiento": records[identifier]["trial"]["procedure"],
             "control": records[identifier]["trial"]["id"] == "control",
             "numero_de_respuestas": sum(total.values()), "conteos": dict(total)}
            for identifier, total in counts.items()
        ],
    }
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("key", type=Path)
    parser.add_argument("responses", type=Path, nargs="+")
    args = parser.parse_args()
    print(json.dumps(aggregate(json.loads(args.key.read_text()), args.responses), ensure_ascii=False, indent=2))


if __name__ == "__main__":
    try:
        main()
    except ValueError as error:
        raise SystemExit(str(error)) from None
