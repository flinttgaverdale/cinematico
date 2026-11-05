# Dossier de obras — los once compositores (5 noviembre 2026)

## Método y grado de evidencia
**A** = partitura/reducción notada en publicación consultable; **B** = análisis especializado con ejemplos de obra; **C** = declaraciones del compositor/director o documentación de producción; **D** = reseña descriptiva. No se ha hecho escucha sincronizada ni transcripción original de partituras completas. Un procedimiento observado en una obra no es una regla exclusiva de un compositor.

| Compositor | Obra y fragmento | Evidencia | Observación verificable y límite | Consecuencia para Cinemático |
|---|---|---|---|---|
| **Williams** | *Star Wars: A New Hope*, «Binary Sunset» | A/B | Frank Lehman, *The Skywalker Symphonies* (OUP, 2026), introducción, figura I.1: reducción de los primeros 19 compases, etiquetas de Luke, Force y Rebel Fanfare, armonía y contexto. La cadencia puede tener papel narrativo. | No reducir a «fanfarria»: separar cadencia, leitmotiv y recontextualización; la app web sin melodía solo sugiere ejercicios. |
| **Herrmann** | *Vertigo*, Main Title/Prelude | A/B | Scott Murphy, *Music Theory Online* 28/1 (2022), ejemplos 1–2: reducción y compases iniciales; acorde menor con séptima mayor y organización formal A/B/C. | Diferenciar suspensión, recurrencia, alteración de una nota y golpe orquestal. |
| **Zimmer** | *Interstellar*, tema inicial / uso posterior del órgano | C | Zimmer y Nolan explican que la célula inicial era íntima, escrita antes de conocer la ciencia ficción del argumento; el órgano se incorporó después por su respiración y escala. | Evitar equiparar su estilo con ostinato menor; comparar mismo núcleo en distintas densidades. |
| **Giacchino** | *Up*, «Married Life» | C | En la página oficial del compositor, Giacchino explica el tema de Ellie, la sucesión violín-metales-piano y la contención deliberada en momentos dolorosos. | Proponer intimidad frente a grandilocuencia, preservando el tema. |
| **Elfman** | *Edward Scissorhands*, «Grand Finale» / «Ice Dance» | C | Elfman describe sus influencias rusas, Tchaikovsky/Prokofiev y el protagonismo coral. No se ha comprobado compás a compás un vals específico. | Evitar que «Elfman» implique siempre disonancia/vals; permitir delicadeza coral y danza. |
| **Silvestri** | *Back to the Future*, tema central y secuencia del reloj | A/B/C | Análisis publicado en Berklee describe dos temas principales que aparecen juntos o separados; Silvestri afirma que el tema central expresa heroísmo compartido y no exclusivamente a Marty. | Distinguir identidad temática de acordes heroicos genéricos. |
| **Horner** | *A Beautiful Mind*, «The Kaleidoscope of Mathematics», «Playing a Game of Go», «Breaking the Russian Codes» | A/B | Lehman, *Music Theory Spectrum* 35/1 (2013): operaciones triádicas L/R/S, recorridos y su interrupción/cierre narrativo. | Ejercicio cromático P/L/R simplificado, sin afirmar que reproduce LRLS. |
| **Shore** | *The Fellowship of the Ring*, motivo de la Comunidad y sus transformaciones | B/C | Notas temáticas de Doug Adams y materiales de Shore describen desarrollo temático y cambios de instrumentación asociados al relato. No se han extraído compases específicos en este dossier. | No confundir cambio de acordes con transformación de leitmotiv. |
| **Morricone** | *Once Upon a Time in the West*, tema de la armónica | B/C | En conversación recogida por Oxford University Press, Morricone explica cómo el instrumento pasa de objeto físico a símbolo de venganza; BFI describe asignación de timbres a personajes. | Tratar timbre como elemento narrativo independiente de la armonía. |
| **Newman** | *American Beauty*, «Dead Already» y «Any Other Name» | D | AllMusic documenta el contraste de carácter percusivo y lírico entre pistas; falta reducción de partitura para identificar acordes concretos. | Probar espacio/ataques frente a acompañamiento sostenido, sin inventar armonía. |
| **Göransson** | *Oppenheimer*, «Can You Hear the Music» y «Fission» | C/B | Göransson explica cambios de tempo cada cuatro compases y articulaciones extremas del violín; University of Sydney describe el papel de la tensión tímbrica y el silencio. | Distinguir tempo, articulación y armonía; no inferir ejecución a partir de acordes. |

## Resultados del código
- El motor conserva tres recursos para cada uno de los once compositores.
- Se han afinado **seis** recursos (Giacchino, Silvestri, Elfman, Newman, Zimmer y Morricone) a partir de ejemplos identificables; Horner ya se había revisado.
- Los recursos devuelven `evidenceLevel:"orientative"`, `requiresMelody`, `requiresTiming`, `harmonicOnly`, `changesOriginal:false`.
- No se han introducido recomendaciones de cambios automáticos, MIDI web ni quinta voz.
- La prueba Node `tests/composer-technique-coverage.test.js` sigue pendiente de ejecución CI; comprobación aislada adicional en curso.

## Qué significa «completo» y qué no
**Cobertura de investigación preliminar completa:** los once compositores cuentan con al menos una obra o fragmento identificado, una fuente trazable y una consecuencia concreta de diseño.
**Estudio de partituras completas NO realizado:** no hay once análisis propios de compases, escucha sincronizada y validación auditiva. Las categorías A solo indican que una publicación consultada contiene ejemplos notados. No confundir esto con exhaustividad musicológica.

## Fuentes
- Williams: https://academic.oup.com/book/63100/chapter/567207145
- Herrmann: https://mtosmt.org/issues/mto.22.28.1/mto.22.28.1.murphy.html
- Zimmer: https://www.bafta.org/media-centre/press-releases/a-life-in-pictures-christopher-nolan/ ; https://www.classicfm.com/composers/zimmer/how-wrote-interstellar-music/
- Giacchino: https://michaelgiacchino.com/projects/up/
- Elfman: https://www.avclub.com/danny-elfman-on-oingo-boingo-film-scores-and-the-beat-1798274010
- Silvestri: https://www.blogs.berklee.edu/wp-content/uploads/2017/09/BTTF-Analysis.pdf ; https://montagesmagazine.com/2015/10/im-still-a-rhythm-guy-a-conversation-with-back-to-the-future-composer-alan-silvestri/
- Horner: https://franklehman.com/wp-content/uploads/2020/02/MTS-Article.pdf
- Shore: https://howardshore.com/works/concert/the-two-towers-live-to-projection/
- Morricone: https://blog.oup.com/2019/03/maestro-speaks-ennio-morricone-life-music/ ; https://www.bfi.org.uk/lists/ennio-morricone-10-scores
- Newman: https://www.allmusic.com/album/american-beauty-original-motion-picture-score--mw0000051897
- Göransson: https://www.nme.com/features/film-interviews/oppenheimer-score-soundtrack-ludwig-goransson-christopher-nolan-3471661 ; https://www.sydney.edu.au/news-opinion/news/2023/08/10/oppenheimer-film-soundtrack-music-expert-power-is-in-the-silence.html
