# Investigación musicológica para Cinemático — fase 1 (2026-11-05)

## Propósito
Separar **evidencia documentada**, **hipótesis de estilo** y **operaciones calculables**. El compositor elige siempre si utiliza una propuesta. No inferir melodía, ritmo, articulación o instrumentación a partir de una sucesión de acordes.

## Estudios contrastados con fuentes

| Perfil | Evidencia y alcance | Implicación musical para la app |
|---|---|---|
| Williams | El compositor describe el leitmotiv como identificación dramática y la orquestación como subordinada al diálogo; IRCAM examina conexiones cromáticas y desarrollo de motivos. | Proponer variación y preparación de llegada **solo si hay motivo disponible**; en web, explicar como ejercicio, no como diagnóstico de melodía. |
| Herrmann | IRCAM describe células brevísimas y retraso o ausencia de resolución como recurso de suspense. | No penalizar por defecto un acorde sin resolución; permitir intención «suspender». |
| Giacchino | En entrevistas explica que parte de la emoción y de los personajes y crea suites temáticas; el mismo tema cambia de sentido con el arreglo. | Separar cambio armónico de cambio de instrumentación; sin audio, recomendar experimento de color sin afirmar resultado. |
| Silvestri | Explica que buscó un tema identificable para el grupo de Avengers y evitó uno para cada personaje. | Favorecer identidad temática y economía de motivos, no fanfarrias indiscriminadas. |
| Elfman | En entrevista describe la necesidad de adaptar la música al tiempo de escena y sostener la continuidad dramática. | La excentricidad cromática y el vals son opciones, no condiciones necesarias de cada escena. |
| Shore | Describe una extensa red documentada de motivos y su relación con culturas, orquestación y narración. | Distinguir desarrollo leitmotívico de mera sustitución de acordes; pedir material temático para evaluar transformación real. |
| Morricone | Explica su control de la instrumentación y el empleo de sonidos no musicales como parte del discurso. | La economía de medios y el timbre importan tanto como el cambio de raíz; no reducir su estilo a un modo. |
| Thomas Newman | Explica la colocación de la música en el tiempo y la experimentación con entradas tardías o tempranas. | Incluir el espacio y la omisión como alternativas compositivas, aunque no haya nueva armonía. |
| Göransson | Explica la función expresiva del violín, la modificación de vibrato y glissando, y aceleraciones métricas en Oppenheimer. | Distinguir transformación interpretativa, rítmica y armónica. No calcular expresión desde acordes. |

## Perfiles con investigación aún insuficiente
- **Zimmer**: precisar con entrevistas y análisis de cues concretos cuándo ostinato, pedal, acumulación y ciclo modal son pertinentes. Evitar equiparar «Zimmer» con cuatro acordes menores.
- **Horner**: contrastar partituras identificadas antes de presentar un motivo de peligro, giros modales o quintas abiertas como característicos.
- Para **todos los once**: falta una muestra de pasajes de partitura identificados, con compases, función narrativa y contexto tonal. Esta fase **no** constituye una auditoría de partituras.

## Principios que deben guiar el motor
1. **Función frente a color**: identificar cuándo hay evidencia suficiente de dominante, intercambio modal o región tonal; no atribuir función solo por coincidencia de notas.
2. **Resolución frente a suspensión**: una conducción fluida no equivale necesariamente a una buena decisión dramática.
3. **Contraste frente a continuidad**: una alternativa con más movimiento cromático no es automáticamente más expresiva.
4. **Armonía frente a motivo, textura y ejecución**: cuando faltan melodía, duración, registro o articulación, declararlo; no fingir que el motor los ha analizado.
5. **Procedimiento compartido frente a sello exclusivo**: ningún ostinato, acorde add9, pedal o fanfarria identifica por sí solo a un compositor.
6. **No destructivo**: el motor compara, explica y deja decidir.

## Hipótesis para una siguiente fase de implementación (NO implementadas aquí)
- Añadir metadatos a cada recurso: `evidenceLevel`, `requiresMelody`, `requiresTiming`, `harmonicOnly`.
- Incorporar etiquetas de propósito «continuidad», «contraste», «suspensión» y «llegada», manteniendo las elecciones manuales.
- Generar tests que detecten afirmaciones de análisis motívico cuando la entrada solo contiene acordes.
- Auditar los once perfiles con ejemplos y contraejemplos de obras específicas antes de cambiar ponderaciones algorítmicas.

## Referencias iniciales
- Williams, entrevista National Endowment for the Arts: https://www.arts.gov/stories/podcast/john-williams
- Williams, análisis IRCAM: https://ressources.ircam.fr/en/composer/john-williams/workcourse
- Herrmann, análisis IRCAM: https://brahms.ircam.fr/en/composer/bernard-herrmann/workcourse
- Giacchino, entrevista sobre tema y emoción: https://discussingfilm.net/2022/10/12/michael-giacchino-on-balancing-homage-and-the-unique-in-werewolf-by-night-exclusive-interview/
- Silvestri, entrevista sobre Avengers: https://www.alansilvestri.com/news-film-music-magazine-silvestri-5.htm
- Elfman, entrevista: https://planning.lacity.gov/StaffRpt/CHC/2018/9-20-2018/Item%2009%20CHC-2018-5071.pdf
- Shore, entrevista: https://filmmusic.com/content/article/?id=111
- Morricone, entrevista BFI: https://www.bfi.org.uk/sight-and-sound/interviews/if-you-want-call-yourself-composer-you-follow-every-step-instrumentation-ennio-morricone-interviewed-2006
- Thomas Newman, entrevista BFI: https://www.bfi.org.uk/interviews/scoring-mr-banks-composers-life-hollywood
- Göransson, entrevista: https://www.slashfilm.com/1448770/composer-ludwig-goransson-oppenheimer-score-exclusive-interview/
- Göransson, tempo: https://www.nme.com/features/film-interviews/oppenheimer-score-soundtrack-ludwig-goransson-christopher-nolan-3471661

**Estado:** investigación preliminar documentada; sin cambios en el motor ni publicación en esta fase. No afirmar verificación de partituras ni audición comparada.
