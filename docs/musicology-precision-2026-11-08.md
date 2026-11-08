# Cinemático Studio — Correcciones musicológicas verificables
Fecha: 2026-11-08. Rama de trabajo: `research/musicology-precision-2026-11-08`.

## Propósito
Cinemático es una herramienta para sugerir ideas de composición, **no** un clasificador infalible de tonalidad, emoción o estilo. Las observaciones contrastables deben mantenerse separadas de las hipótesis creativas. La web no analiza melodía, ritmo, métrica ni articulación: por ello no puede identificar con seguridad cadencias formales, leitmotivs ni efectos afectivos.

## Incidencias resueltas

1. **Dominante mayor en contexto menor.** Antes se marcaba `C G7 C` como evidencia de sensible cromáticamente elevada en Do menor. Ahora se exige evidencia explícita de tónica menor: `Cm G7 Cm` la proporciona y `C G7 C` no. `Am Dm E7 Am` reconoce la sensible de La menor y no penaliza esa nota cromática como ajena a la práctica tonal menor. La API mantiene `menor natural` como etiqueta interna de compatibilidad de escala; la interfaz muestra `menor` como lectura tonal.
2. **Dominantes secundarias.** `C D7 G C` reconoce `D7 → G` como indicio de tonicización de G dentro de Do mayor; ya no se asigna indiscriminadamente un V7 secundario a un destino con calidad incompatible, por ejemplo `C F#7 Bm` en un análisis de Do mayor.
3. **Llegada armónica frente a cadencia formal.** La secuencia V–I permanece como indicio simbólico, no como cadencia auténtica perfecta confirmada. Las inversiones reducen su peso. Un final `C F G7` aporta evidencia para Do mayor y solo una *semicadencia posible*, no comprobada: faltan melodía, ritmo y articulación formal.
4. **Centro tonal probable y trayectorias.** Las continuaciones por emoción ya no dependen necesariamente de la raíz del último acorde. `C F G7`, intención alegría, puede generar `Dm G7 C`, `F G7 C` y `Am G7 C`, con retorno a la tónica probable. `Am F C G` utiliza el contexto de Do mayor si hay suficiente evidencia; en caso ambiguo se ofrece una referencia provisional.
5. **Respeto del modo menor en intenciones íntimas.** En un contexto de Do menor, `calma`, `ternura` y `nostalgia` ya no conducen automáticamente a Do mayor. Ejemplos: `Abmaj7 → Fm7 → Cmadd9` o `Fm7 → Bb → Cm7`. Otras intenciones pueden proponer cambio modal deliberado.
6. **Enarmonía de los acordes escritos.** El motor conserva `C#` cuando el compositor lo ha escrito así; si la progresión está en `Db`, mantiene `Db`. En ausencia de grafía de usuario, emplea nombres convencionales para lecturas orientativas. Sigue pendiente una notación teórica completa con dobles sostenidos o bemoles.

## Protocolo de validación

Pruebas automatizadas en Node y navegador (escritorio y móvil), integradas en el flujo `reliability.yml`:
- 4.320 continuaciones válidas, 15 intenciones, 12 raíces y ocho calidades de acorde, verificando análisis, unicidad y conservación.
- Casos musicales de referencia sobre menor tonal, cadencias, dominantes aplicadas, ambigüedad tonal y transposición a 12 tonalidades.
- Comprobaciones del catálogo de compositores: técnicas orientativas y no destructivas.
- Regresión de la interfaz completa, guardado de progresiones y conmutación entre modo simplificado/avanzado.

Estos tests validan **consistencia formal y casos esperados**. No miden todavía si una sugerencia emociona, resulta original o suena convincentemente cinematográfica.

## Qué estudiar y calibrar después

**Prioridad 1 — Corpus musical de referencia.** Reunir fragmentos con fuentes verificables; anotar compases, edición, tonalidad inicial/temporal, inversiones, conducción real de voces, dominantes aplicadas, notas comunes y función de frase. Separar cada observación en (a) verificable en partitura, (b) recurso estilístico compartido, (c) hipótesis compositiva inspirada.

**Prioridad 2 — Compositores.** No basta con asociar tres acordes estereotipados a un nombre. Comparar perfiles por patrones de frase, transformación motívica, relaciones de tercera, pedales, cromatismo, modalismo y repetición. No deducir leitmotivs, orquestación o pulso solo a partir de acordes; algunas sugerencias exigirán material melódico, reservado a futuras integraciones de Ableton.

**Prioridad 3 — Evaluación de ideas.** Crear una batería ciega: introducción de 4–8 acordes, emoción seleccionada, tres propuestas y votación por utilidad, diversidad, coherencia con el contexto y ausencia de clichés. Comprobar resultados en mayor/menor y con diferentes niveles de incertidumbre. Las calificaciones humanas sirven para calibrar reglas y pesos; no equivalen por sí mismas a «entrenar» un modelo neuronal.

**Prioridad 4 — Límites editoriales.** La interfaz debe presentar primero acordes, dirección y cambio de color, con teoría explicativa optativa. Mostrar «centro probable» y «cadencia posible» donde correspondan. Mantener intacta la progresión original y la independencia entre referencia de compositor y material propio.

## Referencias de teoría tonal
- Open Music Theory, *Classical cadence types*: https://openmusictheory.github.io/cadenceTypes.html
- University of Puget Sound, *Tonicization*: https://musictheory.pugetsound.edu/mt21c/Tonicization.html
- Texas A&M University, *Minor Scales and Keys*: https://odp.library.tamu.edu/stepstomusictheory/chapter/minor-scales-keys/
