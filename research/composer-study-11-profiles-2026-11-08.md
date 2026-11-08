# Cinemático Studio — Estudio comparativo de 11 compositores
**Fecha:** 8 de noviembre de 2026. **Estado:** investigación contrastada, no sustitución de partituras completas ni transcripción autónoma de once scores. **Rama:** investigación; no modifica la aplicación publicada.

## Pregunta del estudio
¿Cómo diferenciar **decisiones compositivas útiles** de once autores, sin confundir «estilo» con una progresión de tres acordes, ni atribuir un motivo, una textura o una emoción al simple texto de acordes?

La versión actual ofrece una firma armónica por compositor en \`index.html\` y tres recursos no destructivos en \`engine.js\`. Las firmas se generan como **ejemplos originales**, no como transcripciones de cues. La evidencia más fuerte no consiste en que un autor «prefiera un acorde», sino en cómo combina **conducción de voces, ritmo armónico, transformación temática, cromatismo, cadencia, timbre y contexto dramático**.

### Escala de fiabilidad
- **A — Ejemplo musical notado en un estudio verificable**, indicando fuente/figura/compases cuando están disponibles. No equivale a consulta del score completo original.
- **B — Análisis académico especializado** sin acceso propio a todas las páginas del score.
- **C — Testimonio directo del compositor**, relevante para la intención y el proceso, pero no prueba por sí solo los intervalos o acordes de cada pasaje.
- **D — Reseña, descripción periodística o inferencia comparativa**. No autoriza una atribución precisa.
- **X — Hipótesis creativa propuesta por Cinemático**, nunca presentada como transcripción ni como rasgo exclusivo.

### Material del repositorio revisado
- Archivo \`index.html\`: los once perfiles, firmas \`signature\`, etiquetas \`sigLabel\`, modos y modulaciones sugeridas.
- Archivo \`engine.js\`: 3 técnicas por compositor y sus límites (\`requiresMelody\`, \`requiresTiming\`, \`harmonicOnly\`, \`evidenceLevel="orientative"\`), con ejemplos adaptados a acordes introducidos.
- Investigaciones previas de la rama \`feature/cinematico-studio-v1\`: dossier de once obras, inventario de partituras y análisis comparativos. Sus propias advertencias impiden tratarlos como lectura original exhaustiva de las once partituras.

---

## Dossier individual y corrección de la propuesta de producto

### 1. John Williams — dramaturgia tonal, preparación, transformación temática
**Evidencia A/B.** Frank Lehman, *The Skywalker Symphonies* (Oxford UP, 2026), introducción, fig. I.1: los primeros 19 compases del episodio «Binary Sunset» se analizan en torno a sol menor, con hitos formales en los compases **7** (semicadencia), **13** (semicadencia plagal sobre IV mayor) y **17–19** (proceso de cadencia auténtica con debilitamiento expresivo de la clausura). El análisis conecta armonía, identidad temática y narración. No se deduce tal proceso de tres cifras romanas aisladas.

**Auditoría de Cinemático:** hoy muestra como «firma» I – iv6 – I, asociada sin cautela a *Princess Leia*. Es una **idea válida de mezcla modal** (también estudiada en el tema), pero «iv6» resulta ambiguo: puede significar una primera inversión o un acorde menor con sexta añadida. Si se propone Fm6, escribir **iv(m6)** y aclarar que el cifrado no reproduce la disposición ni la línea de bajo de la obra.

**Diferencial armónico:** conducción hacia cierre y suspensión del cierre; IV mayor en contexto menor; préstamo modal, dominante expresiva, cromatismo de función dramática. **Diferencial no inferible de acordes:** memoria temática, contramelodía, frases prolongadas.

**Idea ORIGINAL de prueba (no transcripción):** C – Fm – Ab – G7 – C. Mostrar dos lecturas: mezcla modal/llegada clara y alternativa que evita G7; pedir al compositor decidir cuánta clausura necesita. No etiquetar automáticamente «tema heroico».

**Fuentes:** https://academic.oup.com/book/63100/chapter/567207145 ; https://www.hooktheory.com/blog/cinematic-chord-progressions/ (fuente secundaria para iv con sexta).

### 2. Bernard Herrmann — concentración interválica, simetría y resolución diferida
**Evidencia A/B.** Scott Murphy, *Music Theory Online* 28/1 (2022), ejemplos 1–2: reducción de **Vertigo**, Main Title, con forma A–B y reaparición truncada/coda; tratamiento particular de arpegios y notas extrañas al acorde. Frank Lehman, *MTO* 19/4 (2013), ejemplo 6: en «Scene d’amour», el pedal de dominante prolongado y el gesto de evasión cadencial contribuyen a una liberación retardada. En **Psycho**, el recurso pedagógico de Royal Holloway explica la restricción a cuerdas y la importancia de clústeres y articulaciones específicas.

**Auditoría:** firma actual i – v – ♭II – i es un experimento cromático plausible, **no identifica por sí mismo el discurso de Vertigo**. El recurso «mover una nota por semitono» es compartido y debe contextualizarse mediante repetición, invariantes y expectativa de resolución.

**Diferencial armónico:** alta recurrencia de pocas clases de altura, fricción semitonal, regiones de simetría, ambigüedad estructurada; tensión por duración/pedal (esta última no observable en cifrado). **No deducible:** glissandi, gesto de arco, registro o sincronía.

**Idea ORIGINAL:** Cm – Bmaj7 – Cm – Db – Cm; tres variantes que conservan una célula por nota común o proximidad. Etiqueta «fricción cromática controlada», no «acorde de Vertigo».

**Fuentes:** https://mtosmt.org/issues/mto.22.28.1/mto.22.28.1.murphy.php ; https://mtosmt.org/issues/mto.13.19.4/mto.13.19.4.lehman.html ; https://www.royalholloway.ac.uk/research-and-education/subjects/music/about-us/teacherhubmusic/bernard-herrmanns-film-music-psycho-and-others/

### 3. Hans Zimmer — expansión de una identidad mínima, diseño sonoro y escala
**Evidencia C.** Christopher Nolan (BAFTA) relata que el núcleo de *Interstellar* fue compuesto a partir de la relación afectiva padre–hija **antes** de que Zimmer conociese la premisa de ciencia ficción. Zimmer, en *MusicTech*, diferencia ese proceso de la intensificación y del trabajo con diseño sonoro en *Dunkirk*. El tema permanece reconocible mientras cambian el registro, la densidad, el órgano y el contexto.

**Auditoría:** i – ♭VI – ♭III – ♭VII es una progresión menor modal compartida por numerosos autores. No funciona como huella suficientemente diferencial. «Coro masculino», «power chords» y «ostinato catártico» son recursos posibles, no obligatorios.

**Diferencial implementable con solo acordes:** prolongar el mismo centro, pedal propuesto como ejercicio, reducir el ritmo armónico (sin inventar duraciones), mantener notas comunes y proponer una variante por adición gradual de acordes. **Requiere parámetros adicionales:** capas, registro, dinámica, instrumentación, diseño de sonido.

**Idea ORIGINAL:** Am – F – C – G como armonía neutra; tres guiones creativos sobre **la misma progresión**: sostener A como pedal; retrasar G; añadir un segundo color armónico únicamente en el clímax. La diferencia no es el patrón de acordes, sino el proceso.

**Fuentes:** https://www.bafta.org/media-centre/press-releases/a-life-in-pictures-christopher-nolan/ ; https://musictech.com/features/hans-zimmer-interview/ ; https://www.latimes.com/entertainment/la-et-mn-en-other-composers-20141209-story.html

### 4. Michael Giacchino — identidad temática y variación de escala emocional
**Evidencia C directa.** Giacchino explica en su página de *Up* cómo creó el tema de Ellie y cómo decidió **no** sobredimensionar momentos tristes: buscó intimidad expresiva, pasando por violín, metales y piano según la necesidad narrativa. En una entrevista sobre *Ratatouille* declara que orquestación y mezcla de tradiciones deben responder a la historia y no al cliché geográfico.

**Auditoría:** la firma Imaj7 – ♭III – Imaj7 de Cinemático es una **medianta cromática creativa**, no evidencia suficiente de que sea una marca histórica de Giacchino. El perfil debe liderarse por «tema reconocible con variación y contención», no por un único salto cromático.

**Diferencial armónico web:** mantener identidad de llegada mientras se compara cambio de armonización o colores sin garantizar una emoción. **Requiere melodía o contexto:** leitmotiv y decisión de cuándo «hacer grande» un pasaje.

**Idea ORIGINAL:** C – Am – F – G versus Cmaj7 – Am7 – Fmaj7 – G7 bajo un mismo tema hipotético. La segunda es un ejercicio genérico de color, **no** una cita de *Up*.

**Fuentes:** https://michaelgiacchino.com/projects/up/ ; https://www.denofgeek.com/movies/michael-giacchino-interview-ratatouille-mission-impossible/

### 5. Danny Elfman — teatro orquestal, contraste entre lo frágil y lo grotesco
**Evidencia C directa.** En entrevista a *The A.V. Club*, Elfman identifica influencias de Chaikovski y Prokófiev para *Edward Scissorhands*, así como su interés en coro, timbres invernales y música de una fragilidad distinta del empuje de *Batman*. Reducirlo a «vals siniestro» es engañoso.

**Auditoría:** i – ♭II – i es un giro napolitano/cromático disponible en muchas tradiciones, no un identificador de autor. Debe coexistir con el contraste de carácter y con la posibilidad de **no añadir cromatismo**.

**Diferencial web:** semitono de vecindad, contraste por cambio de modo y separación de regiones armónicas; **sin afirmación de ritmo de danza** salvo que se introduzca métrica.

**Idea ORIGINAL:** Cm – Db – G7 – Cm (fricción) frente a Cm – Abmaj7 – Eb – Cm (fragilidad); comparar qué intensidad conviene al compositor. Ninguna es transcripción.

**Fuente:** https://www.avclub.com/danny-elfman-on-oingo-boingo-film-scores-and-the-beat-1798274010

### 6. Alan Silvestri — célula memorable, lirismo lidio y energía octatónica
**Evidencia A/B/C.** *Back to the Future: An Analysis of the Score* (PDF en repositorio de Berklee), figuras 1a–2, documenta el contorno del tema principal, aparición conjunta/separada de dos temas, un gesto **lidio** y variaciones por truncamiento. Las figuras 6–12 tratan materiales de escala octatónica, tritono, ostinatos y cambios de compás, en particular en *Clock Tower Pt2*. Silvestri explica a *Montages* que el gran tema no pertenece exclusivamente a Marty, y comenta un gesto asociado al pensamiento de Doc.

**Auditoría:** I – IV – V – I («fanfarria») es demasiado genérico. La app tiene modo lidio y análisis de tritono, pero la firma actual no los aprovecha. Tampoco puede detectar la célula de tres notas o su empleo por escenas sin melodía.

**Diferencial web:** propuesta lidia con II mayor, relación de tritono, ruta de tensión/descarga. **Requiere** material motívico para hablar de heroísmo temático.

**Idea ORIGINAL:** C – D – G7 – C (II mayor como color), o C – Gb – F – C como experimento de choque interválico; no citar una escena concreta.

**Fuentes:** https://www.blogs.berklee.edu/wp-content/uploads/2017/09/BTTF-Analysis.pdf ; https://montagesmagazine.com/2015/10/im-still-a-rhythm-guy-a-conversation-with-back-to-the-future-composer-alan-silvestri/

### 7. James Horner — redes de transformación triádica, no solo «celtismo»
**Evidencia A/B.** Frank Lehman, «Transformational Analysis and the Representation of Genius in Film Music», *Music Theory Spectrum* 35/1 (2013), pp. 1–22, analiza tres cues de *A Beautiful Mind*: «The Kaleidoscope of Mathematics», «Playing a Game of Go» y «Breaking the Russian Codes». Estudia relaciones L, R y S, redes transformacionales y su lectura narrativa. Un estudio de esta obra **no generaliza automáticamente a toda la filmografía**.

**Auditoría:** i – ♭VII – i no distingue adecuadamente el perfil y puede confundirse con Zimmer o Göransson. La app sí tiene laboratorio P/L/R, una base lista para aportar mejores ideas (sin pretender reproducir la estructura LRLS).

**Diferencial web:** itinerarios de tríadas cromáticas con invariantes auditables y variantes de retorno o pérdida de centro tonal. **No deducible:** percepción de «genio», leitmotiv, arco emocional sin contexto.

**Idea ORIGINAL:** Cm → C → Em → G como demostración de **P–L–R** (no de la secuencia específica del artículo). La plataforma debe etiquetarlo «ejercicio transformacional», no «progresión de Horner».

**Fuentes:** https://academic.oup.com/mts/article-abstract/35/1/1/1056464 ; https://franklehman.com/wp-content/uploads/2020/02/MTS-Article.pdf

### 8. Howard Shore — cartografía temática y evolución narrativa prolongada
**Evidencia B/C.** Doug Adams, *The Music of The Lord of the Rings Films* (Alfred Music, 2010), documenta ejemplos musicales y los temas de la trilogía. Shore, en entrevistas (2001 y 2020), explica que los temas de la Comunidad y la Comarca se compusieron temprano, se adaptaron y adquirieron distintos significados; el tema de la Comunidad se transforma de folk a más solemne. Esta documentación no autoriza atribuir un cambio de acorde al desarrollo del leitmotiv sin notas melódicas.

**Auditoría:** i – iv – IV – V – i es un ejercicio de mezcla modal, no una «firma» reconocible de Shore. Puede aportar **variantes del mismo centro** como soporte para una melodía, pero la evolución temática exige datos adicionales.

**Diferencial web:** retorno de un centro transformado, alternancia de color modal, tensión latente frente a cierre coral hipotético. **No deducible:** historia de los pueblos de la Tierra Media, asociación leitmotívica o instrumentación.

**Idea ORIGINAL:** Em – C – E – Am – B7 – Em (intercambio y retorno); mostrar variaciones como soporte para un motivo del usuario, no como tema de la saga.

**Fuentes:** https://books.google.com/books/about/The_Music_of_the_Lord_of_the_Rings_Films.html?id=-nOzcQAACAAJ ; https://soundtrackworld.com/2020/01/interview-howard-shore/ ; https://www.latimes.com/archives/la-xpm-2001-dec-18-et-burl18-story.html

### 9. Ennio Morricone — economía, identidades tímbricas y ensamblaje modular
**Evidencia C directa.** Morricone explica que la armónica de *Once Upon a Time in the West* se transforma en signo narrativo de venganza. Sobre *The Mission* describe tres materiales o tradiciones que debía articular: oboe de Gabriel, polifonía litúrgica histórica y materiales creados para representar a la población indígena. El interés está tanto en **la superposición/contraste** como en acordes aislados. Evitar convertir esas referencias en caricaturas de culturas musicales.

**Auditoría:** i – IV – ♭VII – i como firma es un ciclo modal compartido. El perfil mejora si propone **restar materiales**, sostener una nota común y contrastar líneas, indicando que el cifrado no revela instrumentación.

**Diferencial web:** módulos independientes, permanencia de una nota/pedal, combinación gradual y retorno. **Requiere:** timbre, orquestación y escena para simbolismo.

**Idea ORIGINAL:** Am – G – F – Am, explorado con dos capas independientes: sostener A en grave y derivar un motivo corto arriba (no inferidos de acordes).

**Fuentes:** https://blog.oup.com/2019/03/maestro-speaks-ennio-morricone-life-music/ ; https://www.bfi.org.uk/sight-and-sound/interviews/if-you-want-call-yourself-composer-you-follow-every-step-instrumentation-ennio-morricone-interviewed-2006 ; https://bfidatadigipres.github.io/morricone/2021/08/08/mission/

### 10. Thomas Newman — armonía abierta, aire, texturas pequeñas y salida sin clausura
**Evidencia C directa.** En entrevista al BFI sobre *Saving Mr. Banks*, Newman habla de **finales de cue sin resolución expresa**, de la función dramática del silencio y de cómo una instrumentación pequeña puede dejar respirar la escena. También menciona exploración con intérpretes y materiales electrónicos. La reseña de *American Beauty* puede aportar contexto de carácter, pero no sustituye a una reducción de acordes.

**Auditoría:** I(add9) – IV – I(add9) es una hipótesis genérica; «espartano» no es un tipo de acorde. La novena añadida no produce por sí sola el espacio percibido. El perfil debe permitir **opción de no resolver** y comparación con/sin cambio armónico.

**Diferencial web:** notas comunes, extensiones, sonoridades suspendidas y cierres abiertos posibles. **Requiere:** silencio, ataques, duración y voicing.

**Idea ORIGINAL:** Cadd9 – Gsus4 – Am7 – Fmaj7; alternativa con parada en Am7, sin obligación de cadencia. Explicar que la contención es intención, no propiedad objetiva de las cifras.

**Fuente:** https://www.bfi.org.uk/interviews/scoring-mr-banks-composers-life-hollywood

### 11. Ludwig Göransson — transformación de la energía rítmica y identidad instrumental
**Evidencia C directa.** En *Oppenheimer*, Göransson relata una línea hexatónica y **21 cambios de tempo** en «Can You Hear the Music», grabados por músicos reales de continuo; el violín pasa de vibrato lírico a articulaciones de gran fricción. Para *Black Panther*, Marvel documenta su investigación con músicos senegaleses y el uso del **talking drum** en el tema de T'Challa. Ninguna característica se reduce al cliché «percusión africana» ni equivale a una progresión menor.

**Auditoría:** i – ♭VI – ♭VII – i es una estructura demasiado próxima a la firma modal de Zimmer. Distinción principal: **variación de energía, instrumentación y articulación dentro del material**, no una serie fija de acordes.

**Diferencial web:** control de tensión armónica y comparación de rutas constantes/cambiantes; **ritmo y articulación no inferibles** sin datos adicionales. No es aceptable etiquetar un patrón genérico como «tradicional africano» sin contexto cultural.

**Idea ORIGINAL:** Dm – Bb – C – Dm con tres disposiciones rítmicas hipotéticas, sin generar MIDI en la web. La aplicación ofrece las decisiones para desarrollar en DAW, no asegura el resultado.

**Fuentes:** https://www.nme.com/features/film-interviews/oppenheimer-score-soundtrack-ludwig-goransson-christopher-nolan-3471661 ; https://www.soundonsound.com/people/ludwig-goransson ; https://www.marvel.com/articles/movies/marvel-music-and-hollywood-records-present-marvel-studios-black-panther-original-motion-picture-score-soundtrack

---

## Hallazgos transversales que requieren intervención

**H1 — Las firmas armónicas son ejemplos, no huellas digitales.** La selección de un compositor debe describirse como «lente de referencia». Las firmas actuales son útiles como ejercicios, pero no se han certificado como transcripciones de obras concretas. Prioridad alta: rotular «ejercicio inspirado» y retirar las atribuciones categóricas.

**H2 — Colisión Zimmer/Göransson/Morricone/Horner.** La repetición de i–♭VI/♭VII o i–♭VII–i hace que los perfiles converjan si solo se ofrecen cifras romanas. La distinción verdadera procede, según los casos, de forma, textura, articulación, estructura transformacional o narrativa. Por tanto, **no debe forzarse artificialmente una «firma de acordes exclusiva»** cuando la evidencia principal es no armónica.

**H3 — Colisión Williams/Silvestri.** Ambos pueden usar sinfonismo y cierre tonal, pero los materiales contrastados de Williams señalan arquitectura cadencial y desarrollo narrativo, y los de Silvestri evidencian también modalismo lidio, recursos octatónicos y células rítmicas. La app debe generar **decisiones musicales diferentes**, no «épica = mayor».

**H4 — Colisión Giacchino/Newman.** Ambos pueden escribir material íntimo; Giacchino diferencia con conservación y variación del tema según el arco de una escena, Newman con economía textural, espacio y finales a menudo abiertos. Ninguno se identifica por la mera presencia de maj7/add9.

**H5 — Separación entre observación e inferencia.** Los acordes escritos permiten examinar raíz, calidad, clases de altura, notas comunes, préstamos modales posibles, relaciones por quinta/tercera y ciertas evidencias de dominante. No permiten **confirmar** leitmotiv, pulso, ostinato, tempo, registros reales, articulación, pedal sostenido, clúster ejecutado, encadenamiento de voces real o «emoción garantizada».

**H6 — Error en el clasificador armónico compartido.** En una progresión de referencia de Do mayor, \`C → F\` se etiqueta actualmente como \`secondaryDominant\` por una comprobación local de fundamental y sensible, pese a que el acorde de Do es diatónico y el paso puede leerse simplemente **I → IV**. Ejemplos reproducidos: firmas de Silvestri y Newman. Hace falta priorizar la lectura diatónica y considerar dominante aplicada **solo cuando hay evidencia cromática/contextual suficiente**; separar «podría funcionar localmente como V/IV» de la afirmación «es V/IV». Una corrección debería someterse a pruebas de no regresión antes de publicarse.

**H7 — Ambigüedad notacional.** \`iv6\` puede significar inversión (cifrado clásico) o sexta añadida (cifrado moderno, iv(add6)/ivm6). No confundir ambas. No asociar automáticamente una disposición de voces al símbolo.

## Modelo conceptual recomendado para la próxima versión

Para cada perfil guardar separadamente:
1. **Principio central**: proceso compositivo, formulado sin asegurar exclusividad.
2. **Gestos armónicos comprobables**: 2–4 operaciones y sus condiciones.
3. **Rasgos no observables desde cifrado**: melodía, ritmo, textura, orquestación, sincronía.
4. **Ejercicios originales válidos**: varias rutas con contraste y continuidad, etiquetadas como inspiraciones, nunca como citas.
5. **Obras/fuentes y nivel de evidencia**: A/B/C/D por afirmación, no por compositor.
6. **Advertencia antiestereotipo**: aquello que no debe inferirse ni prometerse.
7. **Dependencia de información**: solo acordes vs melodía vs ritmo vs registro vs contexto de escena.

### Orden de integración propuesto
**P1** Corregir el clasificador \`secondaryDominant\` y la ambigüedad \`iv6\`, con regresión por tonalidades y acordes alterados.  
**P2** Revisar nombres y descripciones de 11 perfiles para separar evidencia, ejercicio y atribución.  
**P3** Añadir propuestas originales diferenciadas por recursos *armónicos reales* (Williams: mezcla/retardo; Herrmann: invariantes/cromatismo; Horner: P–L–R; Silvestri: lidio/octatonismo, etc.).  
**P4** Mover recursos que necesitan melodía/ritmo/textura a sugerencias opcionales para desarrollar fuera del campo de acordes; **sin introducir MIDI en la versión web**.  
**P5** Corpus de evaluación ciega con progresiones y contraejemplos: coherencia con contexto, diversidad entre perfiles, no repetición, utilidad para componer y corrección musicológica. No ajustar pesos de estilo usando solo la intuición del desarrollador.

### Pruebas de aceptación
- En Do mayor \`C → F\` no puede presentarse **sin matices** como dominante secundaria; \`C7 → F\` puede sugerir V7/IV cuando la evidencia lo justifique.
- No confundir \`iv(m6)\` con la primera inversión de \`iv\`.
- Cada compositor ofrece al menos un recurso armónico que no sea una copia nominal de otro; cuando el contraste real es melódico/rítmico/textural, la interfaz **lo declara** en vez de fabricar acordes supuestamente exclusivos.
- Generar rutas no destructivas, con etiquetas «posible», «inspirado», «depende de melodía/ritmo».
- Separar referencia tonal/compositor de la progresión propia, tal como exige el diseño.
- Testar cambios de tonalidad en las 12 clases de altura, ortografía enarmónica, notación de menores y parser de acordes.
- No usar puntuaciones de «parecido a compositor» como probabilidad objetiva si no existe corpus etiquetado y validación humana ciega.

## Límites honestos del estudio
- Se han cotejado análisis publicados y **dos PDFs académicos con ejemplos musicales visibles** (Lehman sobre Horner y el informe de *Back to the Future*). Se ha consultado un texto académico sobre Herrmann con reducciones notadas descritas y el capítulo de Oxford sobre Williams con compases y análisis. Para los demás se han utilizado principalmente **testimonios directos** y fuentes secundarias.
- No se ha realizado una **lectura propia integral, compás a compás, de las partituras originales completas de las once bandas sonoras**, ni una escucha sincronizada original de todos sus cues. No se afirma haber hecho tal cosa.
- No se copia ni redistribuye ninguna partitura protegida; todas las progresiones de demostración son ejercicios nuevos.
- Las conclusiones musicales se traducirán a una herramienta de **sugerencia de ideas**, nunca a aprendizaje obligatorio ni generación automática destructiva.
