{
  "patcher": {
    "fileversion": 1,
    "appversion": {
      "major": 9,
      "minor": 0,
      "revision": 0,
      "architecture": "x64",
      "modernui": 1
    },
    "rect": [
      100,
      100,
      960,
      620
    ],
    "bglocked": 0,
    "openinpresentation": 1,
    "default_fontsize": 12,
    "default_fontface": 0,
    "default_fontname": "Arial",
    "gridonopen": 1,
    "gridsize": [
      15,
      15
    ],
    "gridsnaponopen": 1,
    "toolbarvisible": 1,
    "boxes": [
      {
        "box": {
          "id": "obj-1",
          "maxclass": "comment",
          "patching_rect": [
            20,
            15,
            780,
            36
          ],
          "text": "CINEMÁTICO STUDIO / GENERADOR ARMÓNICO · beta 0.1",
          "fontsize": 22,
          "fontface": 1,
          "textcolor": [
            0.92,
            0.78,
            0.51,
            1
          ],
          "presentation": 1,
          "presentation_rect": [
            20,
            15,
            780,
            36
          ]
        }
      },
      {
        "box": {
          "id": "obj-2",
          "maxclass": "comment",
          "patching_rect": [
            20,
            54,
            820,
            20
          ],
          "text": "Escribe tus acordes, elige una intención y un camino. Inserta solo al pulsar Apply en el clip.",
          "fontsize": 11,
          "presentation": 1,
          "presentation_rect": [
            20,
            54,
            820,
            20
          ]
        }
      },
      {
        "box": {
          "id": "obj-3",
          "maxclass": "comment",
          "patching_rect": [
            20,
            87,
            260,
            20
          ],
          "text": "PROGRESIÓN DE PARTIDA",
          "fontface": 1,
          "fontsize": 12,
          "presentation": 1,
          "presentation_rect": [
            20,
            87,
            260,
            20
          ]
        }
      },
      {
        "box": {
          "id": "obj-4",
          "maxclass": "textedit",
          "patching_rect": [
            20,
            110,
            470,
            45
          ],
          "keymode": 1,
          "outputmode": 1,
          "lines": 1,
          "wordwrap": 0,
          "presentation": 1,
          "presentation_rect": [
            20,
            110,
            470,
            45
          ]
        }
      },
      {
        "box": {
          "id": "obj-5",
          "maxclass": "textbutton",
          "patching_rect": [
            502,
            110,
            165,
            40
          ],
          "text": "Actualizar acordes",
          "texton": "Actualizar acordes",
          "presentation": 1,
          "presentation_rect": [
            502,
            110,
            165,
            40
          ]
        }
      },
      {
        "box": {
          "id": "obj-6",
          "maxclass": "comment",
          "patching_rect": [
            20,
            169,
            200,
            20
          ],
          "text": "INTENCIÓN MUSICAL",
          "fontface": 1,
          "fontsize": 12,
          "presentation": 1,
          "presentation_rect": [
            20,
            169,
            200,
            20
          ]
        }
      },
      {
        "box": {
          "id": "obj-7",
          "maxclass": "umenu",
          "patching_rect": [
            20,
            191,
            220,
            30
          ],
          "items": [
            "misterio",
            "melancolia",
            "tension",
            "esperanza",
            "nostalgia",
            "epica",
            "tristeza",
            "alegria",
            "ternura",
            "asombro",
            "inquietud",
            "suspense",
            "oscuridad",
            "calma",
            "contraste"
          ],
          "fontsize": 13,
          "presentation": 1,
          "presentation_rect": [
            20,
            191,
            220,
            30
          ]
        }
      },
      {
        "box": {
          "id": "obj-8",
          "maxclass": "comment",
          "patching_rect": [
            265,
            169,
            160,
            20
          ],
          "text": "CAMINO (1, 2 o 3)",
          "fontface": 1,
          "fontsize": 12,
          "presentation": 1,
          "presentation_rect": [
            265,
            169,
            160,
            20
          ]
        }
      },
      {
        "box": {
          "id": "obj-9",
          "maxclass": "number",
          "patching_rect": [
            265,
            191,
            76,
            30
          ],
          "minimum": 1,
          "maximum": 3,
          "presentation": 1,
          "presentation_rect": [
            265,
            191,
            76,
            30
          ]
        }
      },
      {
        "box": {
          "id": "obj-10",
          "maxclass": "textbutton",
          "patching_rect": [
            360,
            191,
            175,
            30
          ],
          "text": "Comparar propuesta",
          "texton": "Comparar propuesta",
          "presentation": 1,
          "presentation_rect": [
            360,
            191,
            175,
            30
          ]
        }
      },
      {
        "box": {
          "id": "obj-11",
          "maxclass": "comment",
          "patching_rect": [
            20,
            238,
            850,
            25
          ],
          "text": "NO MODIFICA TUS ACORDES. Crea un clip MIDI vacío de al menos 3 compases. Pulsa Apply en Generar.",
          "fontsize": 12,
          "fontface": 1,
          "textcolor": [
            0.82,
            0.74,
            0.55,
            1
          ],
          "presentation": 1,
          "presentation_rect": [
            20,
            238,
            850,
            25
          ]
        }
      },
      {
        "box": {
          "id": "obj-12",
          "maxclass": "message",
          "patching_rect": [
            20,
            267,
            840,
            37
          ],
          "text": "Cinemático: elige tus acordes y tu camino.",
          "fontsize": 12,
          "presentation": 1,
          "presentation_rect": [
            20,
            267,
            840,
            37
          ]
        }
      },
      {
        "box": {
          "id": "obj-13",
          "maxclass": "comment",
          "patching_rect": [
            20,
            317,
            860,
            43
          ],
          "text": "Prototipo de Live: escribe cifrados (Am F C G); no lee aún el contenido MIDI ni crea melodía. Las propuestas vienen del motor web.",
          "fontsize": 11,
          "presentation": 1,
          "presentation_rect": [
            20,
            317,
            860,
            43
          ]
        }
      },
      {
        "box": {
          "id": "obj-14",
          "maxclass": "newobj",
          "patching_rect": [
            20,
            412,
            70,
            22
          ],
          "text": "loadbang"
        }
      },
      {
        "box": {
          "id": "obj-15",
          "maxclass": "message",
          "patching_rect": [
            110,
            412,
            150,
            22
          ],
          "text": "set Am F C G"
        }
      },
      {
        "box": {
          "id": "obj-16",
          "maxclass": "message",
          "patching_rect": [
            110,
            450,
            45,
            22
          ],
          "text": "1"
        }
      },
      {
        "box": {
          "id": "obj-17",
          "maxclass": "message",
          "patching_rect": [
            110,
            486,
            80,
            22
          ],
          "text": "set esperanza"
        }
      },
      {
        "box": {
          "id": "obj-18",
          "maxclass": "message",
          "patching_rect": [
            550,
            368,
            68,
            22
          ],
          "text": "preview"
        }
      },
      {
        "box": {
          "id": "obj-19",
          "maxclass": "newobj",
          "patching_rect": [
            265,
            450,
            120,
            22
          ],
          "text": "prepend variant"
        }
      },
      {
        "box": {
          "id": "obj-20",
          "maxclass": "newobj",
          "patching_rect": [
            270,
            488,
            120,
            22
          ],
          "text": "prepend mood"
        }
      },
      {
        "box": {
          "id": "obj-21",
          "maxclass": "newobj",
          "patching_rect": [
            450,
            455,
            252,
            23
          ],
          "text": "v8 cinematico-generator.js",
          "numinlets": 1,
          "numoutlets": 2,
          "outlettype": [
            "",
            ""
          ]
        }
      },
      {
        "box": {
          "id": "obj-22",
          "maxclass": "newobj",
          "patching_rect": [
            20,
            535,
            130,
            23
          ],
          "text": "live.miditool.in"
        }
      },
      {
        "box": {
          "id": "obj-23",
          "maxclass": "newobj",
          "patching_rect": [
            760,
            538,
            155,
            23
          ],
          "text": "live.miditool.out"
        }
      },
      {
        "box": {
          "id": "obj-24",
          "maxclass": "newobj",
          "patching_rect": [
            745,
            480,
            155,
            23
          ],
          "text": "print CinematicoLive"
        }
      }
    ],
    "lines": [
      {
        "patchline": {
          "source": [
            "obj-14",
            0
          ],
          "destination": [
            "obj-15",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-15",
            0
          ],
          "destination": [
            "obj-4",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-14",
            0
          ],
          "destination": [
            "obj-16",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-16",
            0
          ],
          "destination": [
            "obj-9",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-14",
            0
          ],
          "destination": [
            "obj-17",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-17",
            0
          ],
          "destination": [
            "obj-7",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-5",
            0
          ],
          "destination": [
            "obj-4",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-4",
            0
          ],
          "destination": [
            "obj-21",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-7",
            1
          ],
          "destination": [
            "obj-20",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-20",
            0
          ],
          "destination": [
            "obj-21",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-9",
            0
          ],
          "destination": [
            "obj-19",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-19",
            0
          ],
          "destination": [
            "obj-21",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-10",
            0
          ],
          "destination": [
            "obj-18",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-18",
            0
          ],
          "destination": [
            "obj-21",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-22",
            0
          ],
          "destination": [
            "obj-21",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-21",
            0
          ],
          "destination": [
            "obj-23",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-21",
            1
          ],
          "destination": [
            "obj-12",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-21",
            1
          ],
          "destination": [
            "obj-24",
            0
          ]
        }
      }
    ]
  }
}
