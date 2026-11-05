# Compositores: estudio comparativo y límites de inferencia — fase 2 (2026-11-05)

## Hallazgo central
La semejanza superficial entre dos progresiones no prueba semejanza de estilo. Para un asistente que recibe **solo acordes**, se pueden verificar notas comunes, cromatismo y desplazamiento de fundamentales; **no** pueden verificarse desarrollo motívico, tempo, orquestación, dinámica o relación con la escena.

## Estudios de caso con referencias identificables

### James Horner — *A Beautiful Mind* (2001)
Frank Lehman, «Transformational Analysis and the Representation of Genius in Film Music», *Music Theory Spectrum* 35/1 (2013), pp. 1–22, DOI 10.1525/mts.2013.35.1.1. Estudia **tres cues** de la película y sus transformaciones triádicas mediante operadores neo-riemannianos. Esta evidencia contradice la reducción del perfil de Horner a «modal / celta / quintas abiertas»: sus recursos pueden incluir **cromatismo triádico estructural con significado narrativo**. La app ya posee transformaciones P/L/R, pero no debe atribuirlas a una obra concreta sin analizar el pasaje.

### Hans Zimmer — diversidad frente al estereotipo del ostinato
Entrevista de MusicTech, «Hans Zimmer Interview — The Art of Film Scoring» (2018): Zimmer subraya la necesidad narrativa de la música, la reducción de medios y la integración entre síntesis, diseño sonoro y orquesta. Su propio ejemplo de *Interstellar* contrasta con el perfil exclusivamente «ostinato/ciclo modal»; en la entrevista de MasterClass sobre Batman describe el tratamiento espacial de metales y ostinatos separados. **Consecuencia:** el ostinato es una opción entre varias; no una condición obligatoria.

### Howard Shore — *The Lord of the Rings*
Doug Adams, notas publicadas en el sitio de Howard Shore sobre *The Two Towers*, describe transformaciones, cruces y relaciones entre temas de la Comarca, Ents, Anillo y Rohan. Las notas de *Fellowship of the Ring* explican cómo el tema de la Comunidad se completa progresivamente y cambia de orquestación. **Consecuencia:** no se debe llamar «transformación de leitmotiv» a un simple cambio de acorde. Sin entrada melódica solo puede proponerse un ejercicio.

## Auditoría de los once perfiles: preguntas musicales antes de recomendar

| Perfil | Pregunta diferenciadora | Dato que falta para afirmación fuerte |
|---|---|---|
| Giacchino | ¿Cambia el significado de un motivo al variar el contexto? | Melodía y contexto narrativo |
| Williams | ¿La secuencia desarrolla una idea o solo repite acordes? | Motivo, ritmo y frase |
| Zimmer | ¿El interés reside en armonía, timbre o acumulación? | Textura, duración y dinámica |
| Elfman | ¿El cromatismo cumple una función teatral concreta? | Melodía, ritmo y escena |
| Silvestri | ¿Hay una identidad temática que sostener? | Tema y frase |
| Horner | ¿La transformación triádica crea una trayectoria narrativa? | Secuencia de acordes contextualizada y escena |
| Herrmann | ¿La suspensión de resolución es deliberada? | Duración y expectativas creadas |
| Shore | ¿Se transforma un motivo reconocible? | Motivo y sus variantes |
| Morricone | ¿El timbre o el silencio son el material principal? | Instrumentación y duración |
| Newman | ¿Conviene añadir armonía o dejar respirar la idea? | Tiempo, ataques y silencios |
| Göransson | ¿El efecto nace de contrarritmos o articulación? | Patrón rítmico y ejecución |

## Cambios efectivamente implementados en el motor
- Cada recurso devuelve `evidenceLevel:"orientative"`, `requiresMelody`, `requiresTiming`, `harmonicOnly` y `changesOriginal:false`.
- La observación de contramelodía ahora **cuenta** notas compartidas entre los primeros dos acordes, en vez de presuponerlas.
- Los recursos sobre leitmotiv/motivo indican que **no se ha detectado ninguna melodía**.
- Los recursos rítmicos indican que **no se han analizado duraciones ni acentos**.
- Las propuestas sobre espacio y timbre aclaran que los acordes no aportan esa información.
- Se amplió la prueba de regresión de las once bibliotecas.

## Pendientes importantes
1. Comprobar las pruebas Node en CI y navegador real; esta fase no acredita ninguna de las dos verificaciones.
2. Contrastar compases y ediciones de partituras de los once compositores. Las fuentes citadas aportan estudios académicos, entrevistas y notas oficiales, **no una inspección propia de todas las partituras**.
3. Rediseñar las ponderaciones de propuestas únicamente después de reunir ejemplos y contraejemplos; no confundir la asociación de estilo con causalidad musical.
4. Los metadatos de evidencia son **internos**; la interfaz sigue mostrando las explicaciones existentes, ahora con observaciones más precisas.

## Fuentes
- Lehman, *Music Theory Spectrum* (2013): https://academic.oup.com/mts/article-abstract/35/1/1/1056464
- Zimmer, entrevista MusicTech: https://musictech.com/features/hans-zimmer-interview/
- Zimmer, MasterClass Batman: https://do6eyjibs3jse.cloudfront.net/classes/hans-zimmer-teaches-film-scoring/chapters/character-theme-batman
- Doug Adams, notas *The Two Towers* en HowardShore.com: https://howardshore.com/works/concert/the-two-towers-live-to-projection/
- Doug Adams, *The Fellowship of the Ring* themes: https://www.lordoftheringsinconcert.com/fotr

**Advertencia:** los ejemplos están documentados a nivel de obra y técnica; no se ha efectuado una lectura propia, compás a compás, de partituras protegidas ni un análisis auditivo sincronizado.
