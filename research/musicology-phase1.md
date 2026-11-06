# Cuaderno de investigación musicológica — fase 1

## Objetivo
Distinguir tres niveles que no deben confundirse: (1) sintaxis tonal y función, (2) relaciones transformacionales entre acordes, (3) interpretación narrativa y emocional. El usuario conserva el juicio artístico; el programa muestra hipótesis y evidencias.

## Hallazgos y reglas de diseño

1. **Cadencia y frase.** V–I es un gesto armónico; la etiqueta de cadencia formal exige información de frase, acento, melodía y posición. El motor no dispone de todos esos datos en la web. Referencia: Frank Lehman, *Hollywood Cadences* (2013), https://doi.org/10.30535/MTO.19.4.2.
2. **Cromatismo cinematográfico.** Los desplazamientos entre tríadas pueden describirse por transformación y proximidad de voces sin exigir una función tonal única. Referencia: Frank Lehman, *Film Music and Neo-Riemannian Theory* (2014), https://doi.org/10.1093/oxfordhb/9780199935321.013.002.
3. **Mediantes cromáticas.** Sus asociaciones narrativas son convenciones contextuales, no emociones universales. Referencia: Erik Heine, *Chromatic Mediants and Narrative Context in Film* (2018), https://doi.org/10.1111/musa.12106.
4. **Predominantes cromáticos.** Las sextas aumentadas dependen de ortografía y resolución contrapuntística (♭6 y ♯4 hacia 5); una mera clase de altura enharmónica no demuestra función de sexta aumentada. Referencia: *Music Composition & Theory*, capítulo 29, https://open.lib.umn.edu/musiccomposition/chapter/augmented-sixth-chords/.
5. **Pluralidad estilística.** La armonía cinematográfica también incorpora superposición de materiales tonales y poliacordes; no conviene reducir todos los compositores a mediantes cromáticas. Referencia: *Music Theory Online*, *Bernard Herrmann’s Harmonic Polytonality* (2025), https://mtosmt.org/issues/mto.25.31.4/mto.25.31.4.moreira.html.

## Experimentos implementados en rama aislada
- `harmonicEvidenceAudit`: grado tentativo de evidencia tonal, notas comunes y movimiento mínimo de clases de altura, con advertencias explícitas.
- `chromaticRelationAudit`: relaciones entre raíces, notas comunes y detección conservadora de mediantes cromáticas; no diagnostica emoción ni modulación.
- `appliedDominantAudit`: identifica relaciones de dominante hacia objetivo sin afirmar automáticamente que sean dominantes secundarias.

## Limitaciones conocidas y próximos ensayos
- La escritura enarmónica, las inversiones y la posición de las voces son necesarias para una identificación robusta de sexta aumentada, sensible y conducción real.
- La identificación de una dominante secundaria requiere hipótesis del centro global, calidad de acorde y contexto de resolución.
- Las relaciones transformacionales deben incorporar operaciones P, L y R con definición rigurosa y pruebas sobre tríadas, antes de afectar a recomendaciones.
- Cada compositor necesita perfiles basados en procedimientos verificables, con análisis de fragmentos de partituras y distinción entre observación, interpretación y extrapolación.
- Ninguno de estos experimentos modifica el motor público ni constituye un modelo entrenado.
