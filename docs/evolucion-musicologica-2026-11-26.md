# Evolución musicológica y compositiva · 26 de noviembre de 2026

## Fase 1 · Auditoría de la revisión af522c1

| Superficie | Conservar | Hallazgo y decisión |
|---|---|---|
| Parseo y paquetes | Cifrado original, notas de extensión, tipos de bajo y alias de suspensión. | La web distingue inversión y bajo externo. El generador de main los pierde y trunca extensiones. El reproductor reproduce los seis casos. Se mantiene la corrección MIDI en su rama de revisión. |
| Centros, modos y cadencias | Hipótesis en mayor/menor, dominantes aplicadas y advertencia de que hace falta frase para hablar de cadencia formal. | La lista de centros no es un catálogo modal. Añadir compatibilidad de colecciones alrededor de los centros candidatos, sin convertir coincidencia en un modo afirmado. Las heurísticas previas son indicadores simbólicos. |
| Laboratorio y voces | Movimiento mínimo por clases de altura, realizaciones de tres/cuatro voces y diagnósticos de resolución dependientes del criterio. | La distancia entre clases de altura prescinde de octavas y de orden real de las voces. Una coincidencia vertical admite un experimento de sostén. El material de entrada no contiene información para confirmar pedal, métrica o suspensión ejecutada. |
| PLR y SLIDE | Implementación y pruebas de involución, número de notas comunes y dirección. | Los perfiles ofrecen transformaciones de referencia en rutas fijas. Aplicar PLR/S solo sobre tríadas compatibles, con notas comunes y desplazamientos declarados. Evitar despojar acordes extendidos de sus tensiones. |
| Perfiles | Once lentes con fuentes, ejercicios transponibles, contraejemplos y avisos de alcance. | Las 22 rutas de referencia se construyen desde el centro elegido. El texto de Asistencia se contextualiza en algunos casos, pero rara vez produce una comparación sobre el material ingresado. La simulación de rutas fijas no demuestra que once lentes reaccionen de modo distinto a la misma progresión. |
| Intención y Crear | Cuatro direcciones, 15 matices y tres continuaciones distintas. | Las recetas de emoción forman un eje separado. Al añadir una lente opcional, conservar los tres caminos habituales en su ausencia y reservar una opción para un procedimiento específico cuando se seleccione. |
| Audio y Estudio | A/B, fuentes separadas de la progresión y tiempo por acorde ajustable en la referencia. | La PR #22 conserva la síntesis local y aplica un piano aditivo común a ambos reproductores. Sus simulaciones de navegador esperan osciladores triangulares y no modelan el compresor. Revisar la PR en una rama propia y medir el audio con un render real de Web Audio. |
| Web, PWA y Android | Motor compartido, APK con recursos locales y caché PWA versionada. | Cualquier cambio web debe incrementar el registro y la caché concordantes. Mantener el motor de Max generado a partir de la misma fuente. La compilación y firma no acreditan instalación en hardware. |

## Fases 2–3 · Fuentes y revisión de los perfiles

Se cotejaron los catálogos de evidencia y contraejemplos del repositorio, en
particular `research/score-evidence-corpus-2026-11-08.json`,
`research/score-microanalysis-phase1-2026-11-08.json` y
`research/musicological-negative-controls-2026-11-08.json`. Los accesos de esta
sesión a las fuentes externas devolvieron 403 en el proxy. Las referencias
siguientes identifican material registrado anteriormente. Su grado describe
el **tipo de fuente**. Esta sesión no hizo una nueva lectura directa de las
páginas ni certificó fuentes ajenas al corpus. Cada traducción a lo que
hace el motor es un ejercicio **D** pendiente de escucha.

A = ejemplo musical consultable en material abierto. B = análisis secundario.
C = testimonio del proceso. D = hipótesis de trabajo. Una referencia musical
puede ser una reducción del analista. Si una ficha anterior usa otra
clasificación, conserva su valor original en su catálogo y usa esta escala
solo para las filas de esta revisión.

| Lente | Obra y fragmento de referencia | Recurso y escala de evidencia | Aplicación en Cinemático y límite |
|---|---|---|---|
| John Williams | *Star Wars*, «Binary Sunset», c. 7, fig. I.1. | B. Lehman describe articulación de semicadencia en contexto de frase y un bajo independiente. [Introducción de Lehman](https://academic.oup.com/book/63100/chapter/567207145) | Comparar dos preparaciones para una llegada local. La melodía, la métrica y la frase siguen abiertas. |
| James Horner | *A Beautiful Mind*, «The Kaleidoscope of Mathematics», segunda pasada, cc. 27–33. | A registrada. En la red del analista, Am→A♭ ejemplifica S: una nota común y dos desplazamientos por semitono. [Lehman, ejemplos 7–10](https://franklehman.com/wp-content/uploads/2020/02/MTS-Article.pdf) | Comparar una transformación sobre una tríada introducida por el usuario y atender al enlace siguiente. La audición usa una disposición propia. |
| Bernard Herrmann | *Vertigo*, «Prelude», cc. 1–2 y reducción, ejemplos 1–2. | A registrada. Murphy distingue el menor con séptima mayor del vecino melódico en la arpegiación. [Murphy](https://mtosmt.org/issues/mto.22.28.1/mto.22.28.1.murphy.html) | Comparar la tensión de séptima dentro de una sonoridad menor con la fundamental fija. La nota vecina requiere melodía. |
| Danny Elfman | *Edward Scissorhands*, referencia al carácter de la partitura en entrevista. | C. Elfman describe influencias y color orquestal. La entrevista carece de reducción por compases. [Entrevista](https://www.avclub.com/danny-elfman-on-oingo-boingo-film-scores-and-the-beat-1798274010) | D. Probar ida y vuelta por una sonoridad vecina o contraste de articulación. La sonoridad disminuida no se atribuye al fragmento como hallazgo. |
| Hans Zimmer | *Interstellar*, proceso de trabajo y recursos de capas registrados en el estudio previo. | C. Contexto de producción y perspectiva del director. [Conversación BAFTA](https://www.bafta.org/media-centre/press-releases/a-life-in-pictures-christopher-nolan/) | D. Prolongar un bajo candidato en un tramo que contenga esa nota y elegir aparte densidad o acentuación. La música efectivamente ejecutada queda fuera del cifrado. |
| Michael Giacchino | *Up*, «Married Life», notas de proyecto. | C. Contexto temático y expresivo. [Ficha del compositor](https://michaelgiacchino.com/projects/up/) | D. Cambiar el color de una tríada manteniendo su bajo y comprobar qué rasgo del motivo sigue reconocible. El cifrado por sí solo no aporta el motivo. |
| Alan Silvestri | *Back to the Future*, tema principal (figs. 1a y 4) y ostinato (fig. 9). | A registrada. La cuarta elevada es melódica en el ejemplo. El contraste de tríadas y el ostinato métrico son observaciones independientes. [Análisis alojado por Berklee](https://www.blogs.berklee.edu/wp-content/uploads/2017/09/BTTF-Analysis.pdf) | D. Probar cuarta justa y elevada con el acorde fijo. Hace falta escribir o tocar la línea. |
| Howard Shore | *The Lord of the Rings*, referencia a familias temáticas y su transformación. | B, referencia catalogada. Sin inspección nueva del material notado del libro. [Ficha de la obra de Doug Adams](https://books.google.com/books/about/The_Music_of_the_Lord_of_the_Rings_Films.html?id=-nOzcQAACAAJ) | D. Comparar tercera paralela manteniendo fundamental y quinta. Explicar qué permanece, sin decir que se detectó un leitmotiv. |
| Ennio Morricone | *The Mission*, «Gabriel's Oboe», análisis abierto de §4.5 registrado. | B, trabajo estudiantil con el alcance identificado en el corpus. El arreglo editorial localizado es de Mancini. [Repositorio UVic](https://premisrecerca.uvic.cat/sites/default/files/webform/5287989f111bbf7383ce2dc1c44c939cf926325f_The%20Mission_Premi%20EUMOGRAFIC.pdf) | D. Reubicar el bajo de un acorde en una audición aparte y mantener la armonía superior. Una inversión cercana no prueba contrapunto independiente. |
| Thomas Newman | *American Beauty*, título, Hexel pp. 150–151, fig. 4. | B. El trabajo registra color dórico, pedal y capas. La inspección visual independiente de la figura está pendiente. [Tesis de Hexel](https://researchonline.rcm.ac.uk/382/1/Hexel%252C%20Vasco%20%20-%20PhD.pdf) | D. Conservar una nota común como voz y probar rearticulación frente a resonancia. Una quinta abierta propuesta puede cambiar la percepción sin sumar extensiones. |
| Ludwig Göransson | *Oppenheimer*, «Can You Hear the Music». | C, explicación del proceso con referencia analítica secundaria en el catálogo. [Entrevista](https://www.nme.com/features/film-interviews/oppenheimer-score-soundtrack-ludwig-goransson-christopher-nolan-3471661) | D. Mantener la armonía y variar ataque, subdivisión o acento sobre los mismos acordes. El ritmo de origen no es observable en la entrada. |

### Cobertura por ampliar

Segundas obras propuestas para contrastar y limitar estas lentes. Se registran
como cola de investigación, sin atribuirles compases ni acordes:

- **Williams:** *E.T.*, *Jurassic Park*, *Superman*.
- **Horner:** *Braveheart*, *Titanic*, *Apollo 13*.
- **Herrmann:** *Psycho*, *Taxi Driver*.
- **Elfman:** *Batman*, *The Nightmare Before Christmas*.
- **Zimmer:** *Inception*, *The Dark Knight*, *Dune*.
- **Giacchino:** *Lost*, *Ratatouille*, *The Incredibles*.
- **Silvestri:** *The Avengers*, *Forrest Gump*, *Predator*.
- **Shore:** *The Hobbit*, *The Silence of the Lambs*.
- **Morricone:** *Cinema Paradiso*, *Once Upon a Time in the West*.
- **Newman:** *The Shawshank Redemption*, *Road to Perdition*, *WALL-E*.
- **Göransson:** *Tenet*, *Black Panther*, *The Mandalorian*.

### Historial de verificaciones

La auditoría previa del 25/11 reprodujo la suite y los seis fallos MIDI sobre
el mismo commit. En esta fase se volvió a ejecutar el reproductor y se
inició una ejecución limpia de CI antes de cambios en el motor. Los
catálogos auditados distinguen evidencia musical, declaraciones y ejercicios.
La revisión humana debe evaluar cada hipótesis bajo un encargo musical
concreto. El protocolo de escucha con participantes vive aparte.
