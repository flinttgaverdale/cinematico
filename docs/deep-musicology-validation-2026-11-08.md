# Cinemático Studio — Validación musicológica profunda (8 noviembre 2026)

**Estado:** investigación de fuentes completada, corpus de falsación y corrección del analizador añadidos. Los resultados de integración deben verificarse en el flujo CI asociado a esta rama.  
**Propósito:** mejorar la fiabilidad de un asistente de composición, no producir una herramienta de identificación automática de autores ni atribuir emociones objetivas a secuencias de acordes.

## Resumen de hallazgos

1. **Defecto funcional comprobable:** el motor podía construir acordes como `maj7#11`, `m7b5`, `m9` y `maj9`, pero el campo de análisis no aceptaba todas estas mismas sonoridades. Se ha unificado el repertorio de intervalos mediante `extensionIntervals`, con comprobación de inversiones, grafía del usuario y entradas inválidas. Esto aumenta la coherencia entre «Lenguaje de referencia» y «Tu progresión».
2. **11 dossiers rastreables:** cuatro casos cuentan con investigación publicada que incluye ejemplos musicales notados o reducciones (Williams, Herrmann, Silvestri, Horner); los demás aportan sobre todo testimonios directos sobre proceso, timbre, desarrollo o narración. No se han examinado de principio a fin once partituras orquestales completas ni se han atribuido las rutas originales de la app a esas partituras.
3. **22 contraejemplos armónicos sintéticos:** están separados de los perfiles de compositor y se prueban en las 12 tónicas para detectar falsos positivos de dominantes aplicadas, sensible elevada, cadencias supuestas e intercambios ambiguos. Los 264 resultados son transposiciones de 22 hipótesis estructurales, no 264 fragmentos musicales independientes.
4. **Diferencia entre estilo y procedimiento:** la evidencia documental se presenta como punto de partida creativo. El encadenamiento de acordes no permite confirmar una forma A–B, un motivo, ritmo, instrumento, interpretación, montaje ni intención emocional.
5. **Límite científico:** pruebas de regresión y simulaciones no sustituyen una comparación auditiva ciega ni una anotación compás a compás de corpus independiente. Participantes humanos evaluados en esta fase: **0**.

## Método y criterios de evidencia

- **A:** ejemplo musical notado en un estudio verificable, indicando figura/compases cuando sea posible; no equivale a una transcripción nueva del score completo.
- **B:** análisis académico especializado, con sus inferencias teóricas; conviene distinguir el análisis de una observación directa del manuscrito.
- **C:** entrevista o testimonio de compositor/colaborador sobre un proceso, verificable como declaración, no como contenido armónico automático.
- **X:** ejercicio creativo original generado por Cinemático. No está extraído de una banda sonora.

**Restricción común:** cada perfil trabaja con acordes y algunas relaciones de clases de altura. Las afirmaciones sobre melodía, tempo, polifonía real, instrumentación, dinámica y forma requieren otros datos y no se validan desde la web.

## Auditoría crítica de los once compositores

| Referencia | Soporte localizado | Procedimiento defendible | Lo que Cinemático no puede certificar |
|---|---|---|---|
| **John Williams** | Lehman, *The Skywalker Symphonies* (2026), introd., fig. I.1, *Binary Sunset* cc. 1–19 | Articulación de semicadencias, semicadencia plagal y llegada auténtica en sol menor, atravesadas por frase y textura | Que I–iv–I sea una transcripción, un estilo exclusivo o una cadencia formal aislada |
| **Bernard Herrmann** | Murphy, *Music Theory Online* 28/1 (2022), ejemplos 1–2 sobre *Vertigo* | Reducción A–B, retorno truncado/coda y enlaces transformacionales vinculados a imagen | Forma, ostinato o tensión audiovisual a partir de tres acordes |
| **Hans Zimmer** | Nolan en BAFTA sobre el germen de *Interstellar* | Material íntimo antes del conocimiento del género; expansión expresiva posterior | Un supuesto conjunto de acordes «de Zimmer», pedal o construcción por capas realmente ejecutada |
| **Michael Giacchino** | Comentario oficial del compositor sobre *Up* | El tema de Ellie como identidad narrativa, con tratamiento expresivo ajustado a escena | Un leitmotiv detectado en un cifrado sin notas melódicas |
| **Danny Elfman** | Entrevista directa en *The A.V. Club* sobre *Edward Scissorhands* | Influencias rusas, coro, fragilidad y reaparición de material | Que ♭II equivalga siempre a un vals, fragilidad, coro o un carácter grotesco |
| **Alan Silvestri** | *Back to the Future: An Analysis of the Score* (documento alojado en Berklee), figs. 1a, 6, 8a, 9 | Nota ♯4 lidia en un tema; tríadas a tritono dentro de material octatónico; variación motívica y ostinato de métrica cambiante | Inferir la colección octatónica de un acorde o que un maj7♯11 reproduzca el tema |
| **James Horner** | Lehman, *Music Theory Spectrum* 35/1 (2013), *A Beautiful Mind* | Redes de transformaciones triádicas L/R/S en tres cues y su función narrativa | Equivalencia entre la célula publicada L/R/L/S y los ejercicios P–L–R de la aplicación |
| **Howard Shore** | Entrevista directa sobre *The Lord of the Rings* | Desarrollo temático prolongado y cambios de significado asociados al relato | La existencia de un leitmotiv solo por cambiar iv por IV |
| **Ennio Morricone** | Entrevista en *Sight and Sound* sobre *The Mission* | Articulación de tres estratos: oboe, escritura litúrgica y materiales creados para la película | Timbres, identidad cultural o veracidad etnomusicológica derivados de cifras |
| **Thomas Newman** | Entrevista BFI sobre *Saving Mr. Banks* | Finales de cue sin resolución dramática tajante, silencios y texturas reducidas | Que terminar en otra fundamental sea necesariamente un final narrativamente abierto |
| **Ludwig Göransson** | Entrevista *Sound on Sound* sobre *Oppenheimer* | 21 cambios de tempo y articulación/interpretación de las cuerdas en un cue concreto | Deducir tempo, 21 cambios, métricas o gesto instrumental de una progresión menor |

### Matices especialmente importantes

**Horner.** La fuente de Lehman trabaja con una red de transformaciones L, R y **S**, vinculada a varios cues; Cinemático utiliza ejercicios **P–L–R / R–L–P** que comparten dos notas entre tríadas. Son exploraciones compositivas originales, **no** la reconstrucción de la red de *A Beautiful Mind*. No conviene presentar P como sustituto de S.

**Silvestri.** El análisis publicado relaciona una cuarta elevada melódica, un tema concreto y una colección octatónica en otros fragmentos. Estas tres capas deben mantenerse diferenciadas: `Cmaj7#11` solo caracteriza una sonoridad, no demuestra por sí solo un discurso lidio ni una escala octatónica. El documento alojado en Berklee no se toma automáticamente como edición crítica completa.

**Williams.** El comentario musicológico sobre *Binary Sunset* incluye función formal de compases concretos. Una secuencia V–I computable sin melodía, bajo realizado y fin de frase no da derecho a afirmar una **cadencia auténtica perfecta**; solo indica potencial de llegada armónica.

**Morricone.** El propio compositor explica que los materiales asociados a indígenas en *The Mission* fueron construidos para la ficción. La herramienta no debe presentarlos como una transcripción fiel de una tradición local.

**Zimmer / Göransson.** Es posible compartir un ciclo i–♭VI–♭VII y tomar decisiones radicalmente distintas sobre crescendo, pulsación, registro y articulación. Añadir acordes artificialmente para fabricar una «huella» única sería musicológicamente engañoso.

**Giacchino / Newman.** Las extensiones maj7/add9 no separan de manera fiable ambos autores: la identidad temática frente al espacio y al control del cierre depende de motivos, fraseo y puesta en escena.

## Corpus sintético adversarial

Archivo: `research/musicological-negative-controls-2026-11-08.json`.  
Prueba: `tests/deep-musicology-validation.cjs`.

- Controles positivos: `Dm G7 C` como llegada armónica; `C D7 G C` como V7/V; `C C7 F C` como posibilidad V7/IV; `Am Dm E7 Am` como dominante mayor en menor.
- Controles negativos: `C F C` no es por defecto V7/IV; `C F#7 Bm` no justifica una dominante secundaria en el contexto de Do; `C G7 C` no evidencia sensible cromáticamente elevada de do menor; `Cadd9 Fmaj7` no exige una resolución de séptima dominante.
- Casos con incertidumbre: `C Fm C` admite hipótesis de mezcla modal; `Cm F Cm` puede analizarse como color modal sin confirmar modulación; `C F G7` permite una semicadencia **posible**, no una frase musical analizada.
- Contrapunto contextual: `G7 → Cmaj7` puede conservar Si como séptima mayor de llegada en un lenguaje contemporáneo. Esto no invalida que la escritura clásica más estricta prefiera Si→Do en ciertos contextos.
- Invariancia: las comprobaciones se repiten por transposición cromática; no se extrapola igual facilidad instrumental ni percepción en todos los registros.

El objetivo de estas pruebas es **falsar afirmaciones específicas** (falso positivo/falso negativo), no cuantificar «acierto emocional», autoría, calidad artística ni originalidad. Los contraejemplos están diseñados con conocimiento de las reglas, por lo que **no** constituyen un conjunto independiente ciego de partituras.

## Integridad del motor y entrada de acordes

`tests/extended-chord-input-validation.cjs` contrasta **21 tipos de acorde × 12 fundamentales = 252 casos de sintaxis** contra el catálogo `extensionIntervals`, además de inversiones y alteraciones Unicode. Entra el mismo símbolo, se conserva su grafía, se obtiene el mismo conjunto de clases de altura y no se aceptan inversiones imposibles. No se ha ampliado el máximo de ocho acordes ni se ha introducido MIDI en la web.

Se ha añadido al campo de entrada una ayuda compacta para que el compositor pueda escribir las extensiones ya propuestas por el motor. Los detalles de evidencia en los perfiles aparecen en el desplegable existente, sin añadir otra pantalla didáctica.

## Diseño de evaluación auditiva futura (aún no realizado)

Para calibrar **utilidad compositiva** y no solo sintaxis, serían necesarios ensayos con varios compositores u oyentes competentes y audición real:

1. Definir encargos de 4–8 acordes y producir variantes originales anonimizadas, con control sin nombre de autor.
2. Para aislar el efecto armónico, fijar instrumento, registro, tempo, número/duración de eventos y nivel sonoro; cuando las rutas tengan longitudes diferentes, diseñar pares comparables sin ocultar la alteración de ritmo armónico.
3. Aleatorizar orden y permitir «ninguna me ayuda». Preguntar por utilidad para componer, dirección percibida, interés y repetición/cliché; recoger comentario libre.
4. Evaluar separadamente tareas de ritmo, articulación y timbre; nunca inferirlas del cifrado. Registrar participantes, distribución y desacuerdos; no reportar probabilidades de «parecerse» a un autor.
5. Mantener un conjunto de referencia independiente de los ejercicios con los que se ajusten las reglas para evitar circularidad.

**Estado de este punto:** protocolo preparado; no hay participantes ni resultados humanos.

## Fuentes externas consultadas

- Frank Lehman, *The Skywalker Symphonies* (2026), introducción: https://academic.oup.com/book/63100/chapter/567207145
- Scott Murphy, *Music Theory Online* 28/1 (2022): https://mtosmt.org/issues/mto.22.28.1/mto.22.28.1.murphy.html
- Frank Lehman, *Music Theory Spectrum* 35/1 (2013): https://franklehman.com/wp-content/uploads/2020/02/MTS-Article.pdf
- *Back to the Future: An Analysis of the Score*: https://www.blogs.berklee.edu/wp-content/uploads/2017/09/BTTF-Analysis.pdf
- BAFTA, Christopher Nolan sobre *Interstellar*: https://www.bafta.org/media-centre/press-releases/a-life-in-pictures-christopher-nolan/
- Michael Giacchino, *Up*: https://michaelgiacchino.com/projects/up/
- Danny Elfman, entrevista: https://www.avclub.com/danny-elfman-on-oingo-boingo-film-scores-and-the-beat-1798274010
- Howard Shore, entrevista: https://soundtrackworld.com/2020/01/interview-howard-shore/
- Ennio Morricone, entrevista: https://www.bfi.org.uk/sight-and-sound/interviews/if-you-want-call-yourself-composer-you-follow-every-step-instrumentation-ennio-morricone-interviewed-2006
- Thomas Newman, entrevista BFI: https://www.bfi.org.uk/interviews/scoring-mr-banks-composers-life-hollywood
- Ludwig Göransson, entrevista técnica: https://www.soundonsound.com/people/ludwig-goransson
- *Open Music Theory*, análisis de frase y cadencia: https://openmusictheory.github.io/harmonicAnalysis.html
- Frank Lehman, «Hollywood Cadences»: https://www.mtosmt.org/issues/mto.13.19.4/mto.13.19.4.lehman.pdf

## Siguiente fase recomendada

Construir y anotar un corpus externo pequeño de **fragmentos de partitura realmente accesibles**, con compases y material melódico identificados por un analista humano. Marcar qué aspectos comprueba el motor, registrar falsos positivos y exigir que nuevos ajustes mejoren casos retenidos fuera del entrenamiento de reglas. La integración de MIDI para obtener melodía, duración y articulación sigue reservada a Ableton Live, como se acordó para el producto.
