# Cinemático Studio — Fase de resoluciones contextualizadas
**Fecha:** 8 de noviembre de 2026 · **Alcance:** motor armónico y laboratorio de voces, sin análisis MIDI.

## Problema encontrado en las simulaciones previas
En el recorrido original de Giacchino `Cmaj7 – Am7 – Fmaj7 – G7 – Cmaj7`, una disposición automatizada mantenía `Si` en la misma voz durante `G7 → Cmaj7`. Hasta entonces el motor la marcaba como «sensible sin resolución ascendente» y aplicaba una penalización —incluso cuando el usuario había elegido el carácter cinematográfico, donde mantener esa nota como séptima mayor constituye un **enlace armónico razonable**.

Esto no era un defecto de los acordes sino una **regla de evaluación demasiado rígida**: pretendía aplicar una expectativa de escritura clásica a un enlace que contiene una tónica con séptima mayor.

## Contraste musicológico
- **Modelo tonal clásico / SATB:** en `V7 → I` la sensible de la dominante tiende hacia la tónica; la séptima de V7 suele bajar por grado conjunto. Pueden existir excepciones, especialmente para voces interiores, y no equivalen a reglas físicas.
- **Modelo moderno, jazz y algunas realizaciones cinematográficas:** al enlazar `V7 → Imaj7`, la tercera de la dominante puede **mantenerse exactamente en la misma altura** como séptima mayor de la tónica. La séptima de la dominante todavía suele resolver por semitono a la tercera del acorde final.

Ejemplo original con `G7 → Cmaj7`:
- Bajo: G → C.
- Nota de color: B → B, se conserva y pasa de tercera de G7 a séptima mayor de Cmaj7.
- Séptima de dominante: F → E.
- Otra voz: D → G (disposición a cuatro voces posible).

La versión anterior atribuía a B → B una falta por «sensible sin resolver». En **modo cinematográfico/minimalista** ahora se ofrece como **continuidad expresiva válida**; en **modo clásico** se mantiene explícitamente la advertencia de que contradice la resolución estricta preferida.

### El conflicto real que no debemos ocultar
Cuando se exigen **cuatro notas distintas** en `Cmaj7` y una **dominante G7 completa** en solo cuatro voces, satisfacer simultáneamente la resolución ascendente de B → C, el descenso F → E y la realización completa de las cuatro clases del acorde de llegada puede entrar en conflicto con la restricción del bajo en la fundamental. Esto no implica que `Cmaj7` sea incorrecto: significa que un estilo coral clásico estricto y una **tónica de cuatro sonidos** no tienen por qué compartir la misma distribución de voces.

Por eso el sistema **no modifica Cmaj7 a C**, ni oculta notas, ni convierte cualquier retención en «resolución clásica perfecta» para subir artificialmente la puntuación. Deja visible la diferencia entre criterio clásico y criterio cinematográfico.

## Cambios de programación
1. Una sola función de verdad (`tendencyResolution`) determina la relación entre acordes para las realizaciones de **tres y cuatro voces**. `harmonicResolutionDiagnostics` reutiliza sus resultados; se evita que un laboratorio contradiga al otro.
2. La excepción de mantenimiento de la sensible solo se aplica si:
   - El acorde anterior es una **dominante séptima explícita**.
   - Existe movimiento de fundamental por quinta descendente.
   - El acorde de destino contiene una **séptima mayor real** y está cifrado `maj7`, `maj9` o `maj7#11`.
   - La misma voz mantiene **la misma nota y octava** sin desplazamiento; no basta con repetir la clase de altura otra octava.
   - El carácter seleccionado **no es el clásico**.
3. Se mantienen las advertencias cuando la sensible salta a otro grado (por ejemplo, B → G en `G7 → C`), cuando la séptima no baja como se espera en un V7 explícito, y cuando una realización clásica estricta no satisface la preferencia de resolución.
4. La información «sensible conservada como séptima mayor» tiene un nivel **informativo**, no de error contrapuntístico. Aparece en el laboratorio y en la visualización de cuatro voces, sin confundirla con un fallo.
5. Se corrigen los nombres de las voces superiores de tres voces: «Superior», «Intermedia», no una soprano/alto inventados cuando solo hay tres partes.

## Evaluación reproducible
- **12 tonalidades** verificadas con `V7 → Imaj7`: conservar la sensible es aceptado en carácter cinematográfico y señalado como tensión frente al criterio clásico.
- **22/22 rutas originales** del catálogo disponen de realizaciones de cuatro voces en Do. Tras contextualizar el análisis, **ninguna de las 22 presenta penalizaciones pendientes de resolución de sensible/séptima bajo el criterio cinematográfico** seleccionado. Se mantiene una advertencia relevante para el mismo enlace de Giacchino cuando se exige criterio clásico.
- **Tres y cuatro voces**: las etiquetas informativas se transmiten al usuario sin convertirlas en advertencias automáticas.
- **Contraejemplos**: `Cadd9 → Fmaj7` no se interpreta como dominante secundaria y `G7 → C` no permite descartar sin más una sensible que salta a G.
- **Prueba de interfaz** en Chromium a 1280 × 900 y 390 × 844, junto con regresiones del guardado, referencia independiente y exploraciones de compositor.
- El script `tests/contextual-voice-resolution.cjs` documenta y comprueba todas las condiciones. **No existe evaluación de escucha humana** en esta fase.

## Qué significa para el compositor
Cinemático ya no debe decir «incorrecta» una continuidad que es musicalmente coherente con el acorde y con el carácter elegido. Tampoco debe forzar una resolución clásica en un diseño cinematográfico solo para mejorar una métrica numérica. El usuario puede elegir «Cinematográfica», «Clásica» o «Minimalista», escuchar la realización con sus instrumentos si lo desea y fijar notas manualmente.

El cambio **no** demuestra ni garantiza «estilo Giacchino», ni emoción, ni calidad de orquestación. Las cuatro líneas del gráfico son voces genéricas, no una sección real de cuerdas.

## Fuentes consultadas
- Brigham Young University–Idaho, *Chapter 3: Resolutions* (apartado sobre retener la tercera de dominante como séptima de Imaj7): https://content.byui.edu/file/c34fadd4-a15c-41e5-8a31-36c7763012d0/1/Chapter%203-Resolutions.pdf
- Berklee Online, *Voice-Leading for Guitar* (resolución de tercera y séptima de dominante hacia séptima y tercera de tónica): https://online.berklee.edu/takenote/voice-leading-for-guitar/
- Macalester College, *SATB part writing* (modelo histórico para la sensible y la séptima en dominantes): https://pressbooks.macalester.digital/multimodalmusicianship/chapter/satb-part-writing/
- Geneseo, *Guide to SATB part-writing* (prioridades de duplicación y excepciones de la sensible): https://milnepublishing.geneseo.edu/fundamentals-function-form-workbook/front-matter/guide-to-satb-part-writing/

## Próxima investigación
La siguiente cuestión será **contrastar realizaciones alternativas con audición controlada**, sin asumir que una puntuación baja de saltos y paralelismos produce automáticamente una textura más expresiva. En la web no se añadirá análisis MIDI; ese trabajo permanece reservado para una futura versión Max for Live.
