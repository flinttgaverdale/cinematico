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
    "classnamespace": "box",
    "rect": [
      40,
      40,
      720,
      590
    ],
    "openrect": [
      0,
      0,
      350,
      318
    ],
    "openinpresentation": 1,
    "default_fontsize": 11,
    "default_fontface": 0,
    "default_fontname": "Arial",
    "gridsize": [
      8,
      8
    ],
    "devicewidth": 350,
    "description": "Cinemático Studio: explora tres caminos armónicos y genera en el clip la opción elegida.",
    "digest": "Tres rutas armónicas basadas en acordes propios e intención musical; inserción explícita.",
    "tags": "Cinemático Generator Harmonia Emotion",
    "style": "",
    "latency": 0,
    "is_mpe": 0,
    "minimum_live_version": "12.0",
    "minimum_max_version": "8.6",
    "platform_compatibility": 0,
    "project": {
      "version": 1,
      "creationdate": 3860000000,
      "modificationdate": 3860000000,
      "viewrect": [
        0,
        0,
        350,
        320
      ],
      "autoorganize": 1,
      "hideprojectwindow": 1,
      "showdependencies": 1,
      "autolocalize": 0,
      "contents": {
        "patchers": {},
        "media": {},
        "code": {}
      },
      "layout": {},
      "searchpath": {},
      "detailsvisible": 0,
      "amxdtype": 1851877223,
      "readonly": 0,
      "devpathtype": 0,
      "devpath": ".",
      "sortmode": 0,
      "viewmode": 0
    },
    "boxes": [
      {
        "box": {
          "id": "obj-1",
          "maxclass": "comment",
          "patching_rect": [
            10,
            7,
            325,
            27
          ],
          "text": "CINEMÁTICO  /  GENERADOR MIDI",
          "fontsize": 15,
          "fontface": 1,
          "textcolor": [
            0.925,
            0.933,
            0.918,
            1
          ],
          "presentation": 1,
          "presentation_rect": [
            10,
            7,
            325,
            27
          ]
        }
      },
      {
        "box": {
          "id": "obj-2",
          "maxclass": "comment",
          "patching_rect": [
            10,
            37,
            325,
            20
          ],
          "text": "Compara caminos y elige cuál llevar al clip.",
          "fontsize": 10,
          "textcolor": [
            0.733,
            0.769,
            0.745,
            1
          ],
          "presentation": 1,
          "presentation_rect": [
            10,
            37,
            325,
            20
          ]
        }
      },
      {
        "box": {
          "id": "obj-3",
          "maxclass": "comment",
          "patching_rect": [
            10,
            63,
            325,
            17
          ],
          "text": "TU PROGRESIÓN  ·  Ej.: Am F C G",
          "fontsize": 11,
          "fontface": 1,
          "presentation": 1,
          "presentation_rect": [
            10,
            63,
            325,
            17
          ],
          "textcolor": [
            0.733,
            0.769,
            0.745,
            1
          ]
        }
      },
      {
        "box": {
          "id": "obj-4",
          "maxclass": "textedit",
          "patching_rect": [
            10,
            83,
            323,
            36
          ],
          "keymode": 1,
          "outputmode": 1,
          "lines": 1,
          "wordwrap": 0,
          "fontsize": 12,
          "text": "Am F C G",
          "presentation": 1,
          "presentation_rect": [
            10,
            83,
            323,
            36
          ],
          "bgcolor": [
            0.063,
            0.075,
            0.075,
            1
          ],
          "textcolor": [
            0.925,
            0.933,
            0.918,
            1
          ]
        }
      },
      {
        "box": {
          "id": "obj-5",
          "maxclass": "textbutton",
          "patching_rect": [
            10,
            126,
            111,
            26
          ],
          "text": "Actualizar",
          "texton": "Actualizar",
          "presentation": 1,
          "presentation_rect": [
            10,
            126,
            111,
            26
          ],
          "bgcolor": [
            1,
            0.639,
            0.38,
            1
          ],
          "textcolor": [
            0.063,
            0.075,
            0.075,
            1
          ]
        }
      },
      {
        "box": {
          "id": "obj-6",
          "maxclass": "comment",
          "patching_rect": [
            10,
            158,
            185,
            18
          ],
          "text": "INTENCIÓN",
          "fontface": 1,
          "fontsize": 10,
          "presentation": 1,
          "presentation_rect": [
            10,
            158,
            185,
            18
          ],
          "textcolor": [
            0.733,
            0.769,
            0.745,
            1
          ]
        }
      },
      {
        "box": {
          "id": "obj-7",
          "maxclass": "umenu",
          "patching_rect": [
            10,
            179,
            210,
            26
          ],
          "items": [
            "esperanza",
            "suspense",
            "asombro",
            "contraste",
            "calma",
            "nostalgia",
            "melancolia",
            "ternura",
            "tristeza",
            "alegria",
            "epica",
            "tension",
            "inquietud",
            "misterio",
            "oscuridad"
          ],
          "fontsize": 12,
          "presentation": 1,
          "presentation_rect": [
            10,
            179,
            210,
            26
          ]
        }
      },
      {
        "box": {
          "id": "obj-8",
          "maxclass": "comment",
          "patching_rect": [
            231,
            158,
            102,
            18
          ],
          "text": "CAMINO 1–3",
          "fontface": 1,
          "fontsize": 10,
          "presentation": 1,
          "presentation_rect": [
            231,
            158,
            102,
            18
          ],
          "textcolor": [
            0.733,
            0.769,
            0.745,
            1
          ]
        }
      },
      {
        "box": {
          "id": "obj-9",
          "maxclass": "number",
          "patching_rect": [
            231,
            179,
            53,
            26
          ],
          "minimum": 1,
          "maximum": 3,
          "fontsize": 13,
          "presentation": 1,
          "presentation_rect": [
            231,
            179,
            53,
            26
          ]
        }
      },
      {
        "box": {
          "id": "obj-10",
          "maxclass": "textbutton",
          "patching_rect": [
            231,
            215,
            102,
            25
          ],
          "text": "Ver camino",
          "texton": "Ver camino",
          "presentation": 1,
          "presentation_rect": [
            231,
            215,
            102,
            25
          ],
          "bgcolor": [
            0.165,
            0.188,
            0.2,
            1
          ],
          "textcolor": [
            0.925,
            0.933,
            0.918,
            1
          ]
        }
      },
      {
        "box": {
          "id": "obj-11",
          "maxclass": "message",
          "patching_rect": [
            10,
            245,
            323,
            37
          ],
          "text": "Cinemático: actualiza tus acordes.",
          "fontsize": 10,
          "presentation": 1,
          "presentation_rect": [
            10,
            245,
            323,
            37
          ],
          "bgcolor": [
            0.063,
            0.075,
            0.075,
            1
          ],
          "textcolor": [
            0.561,
            0.686,
            0.667,
            1
          ]
        }
      },
      {
        "box": {
          "id": "obj-12",
          "maxclass": "comment",
          "patching_rect": [
            10,
            286,
            323,
            29
          ],
          "text": "Aplicar añade tres acordes en 4/4. Prueba en un clip vacío.",
          "fontsize": 10,
          "textcolor": [
            0.733,
            0.769,
            0.745,
            1
          ],
          "presentation": 1,
          "presentation_rect": [
            10,
            286,
            323,
            29
          ]
        }
      },
      {
        "box": {
          "id": "obj-13",
          "maxclass": "newobj",
          "patching_rect": [
            410,
            350,
            80,
            22
          ],
          "text": "loadbang",
          "numinlets": 1,
          "numoutlets": 1
        }
      },
      {
        "box": {
          "id": "obj-14",
          "maxclass": "message",
          "patching_rect": [
            500,
            350,
            110,
            22
          ],
          "text": "set Am F C G"
        }
      },
      {
        "box": {
          "id": "obj-15",
          "maxclass": "message",
          "patching_rect": [
            500,
            380,
            45,
            22
          ],
          "text": "1"
        }
      },
      {
        "box": {
          "id": "obj-16",
          "maxclass": "message",
          "patching_rect": [
            500,
            410,
            90,
            22
          ],
          "text": "set esperanza"
        }
      },
      {
        "box": {
          "id": "obj-17",
          "maxclass": "newobj",
          "patching_rect": [
            320,
            380,
            100,
            22
          ],
          "text": "prepend variant",
          "numinlets": 2,
          "numoutlets": 1
        }
      },
      {
        "box": {
          "id": "obj-18",
          "maxclass": "newobj",
          "patching_rect": [
            320,
            410,
            100,
            22
          ],
          "text": "prepend mood",
          "numinlets": 2,
          "numoutlets": 1
        }
      },
      {
        "box": {
          "id": "obj-19",
          "maxclass": "message",
          "patching_rect": [
            320,
            350,
            70,
            22
          ],
          "text": "preview"
        }
      },
      {
        "box": {
          "id": "obj-20",
          "maxclass": "newobj",
          "patching_rect": [
            10,
            350,
            130,
            22
          ],
          "text": "live.miditool.in",
          "numinlets": 1,
          "numoutlets": 3,
          "outlettype": [
            "",
            "",
            ""
          ]
        }
      },
      {
        "box": {
          "id": "obj-21",
          "maxclass": "newobj",
          "patching_rect": [
            120,
            468,
            230,
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
            120,
            515,
            145,
            23
          ],
          "text": "live.miditool.out",
          "numinlets": 1,
          "numoutlets": 0
        }
      },
      {
        "box": {
          "id": "obj-23",
          "maxclass": "newobj",
          "patching_rect": [
            10,
            385,
            123,
            22
          ],
          "text": "live.thisdevice",
          "numinlets": 1,
          "numoutlets": 3,
          "outlettype": [
            "bang",
            "bang",
            ""
          ]
        }
      },
      {
        "box": {
          "id": "obj-24",
          "maxclass": "newobj",
          "patching_rect": [
            352,
            490,
            180,
            23
          ],
          "text": "print CinematicoLive",
          "numinlets": 1,
          "numoutlets": 0
        }
      }
    ],
    "lines": [
      {
        "patchline": {
          "source": [
            "obj-13",
            0
          ],
          "destination": [
            "obj-14",
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
            "obj-4",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-13",
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
            "obj-9",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "obj-13",
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
            "obj-9",
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
            "obj-21",
            0
          ],
          "destination": [
            "obj-22",
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
            "obj-11",
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
    ],
    "dependency_cache": [],
    "autosave": 0,
    "bgcolor": [
      0.09,
      0.102,
      0.11,
      1
    ]
  }
}
