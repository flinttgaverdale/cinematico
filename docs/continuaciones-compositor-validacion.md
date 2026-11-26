# Continuaciones por compositor: revisión de criterios

La búsqueda de tres acordes usa el último acorde y el historial, no una plantilla fija. Las preferencias son hipótesis compositivas D, no una identificación estadística del estilo ni una reconstrucción de partitura. Se mantienen independientes la intención emocional y la lente de referencia.

## Revisión de ranking

- Proporción de notas comunes en lugar del recuento bruto, para no favorecer automáticamente acordes extendidos.
- Distancia mínima de clases de altura y penalización de notas no emparejadas; no es una realización contrapuntística de voces.
- Penalización de extensiones repetidas y mMaj7 reiteradas; no se prohíben sus usos pertinentes.
- Contraste principalmente al inicio y recuperación de continuidad después; no se presupone modulación.
- Alternativas de final: libre, búsqueda de un centro candidato o final abierto. Las llegadas dominante y plagal se etiquetan como posibles, sin confirmar una cadencia formal. Para material insuficiente no se impone centro.
- Preferencias de estilo, especialmente conservación de material para Zimmer/Göransson, transformación triádica para Horner y bajo separado para Morricone/Newman, son reglas de diseño a contrastar por escucha.

## Evidencia de esta revisión

Se ejecutaron 363 casos del motor en JS: 132 combinaciones de transposición y perfil, 165 de cinco progresiones y tres intenciones, y 66 de final abierto/llegada. Se comprobó la validez del cifrado, tres alternativas distintas, preservación del original, perfiles distintos en las doce transposiciones y restricciones del destino. Sin fallos en esos criterios. La prueba de navegador se ha actualizado pero no ejecutado en esta sesión.

No se ha demostrado preferencia estética ni autenticidad estilística. Falta validar el resultado con audio y músicos; revisar los perfiles sobre repertorio independiente; ejecutar CI completa, actualizar núcleo Max y regenerar los paquetes Live, generar APK y comprobarla en dispositivo. La rama no debe publicarse hasta resolver esas condiciones.

## Segunda revisión: expectativa y memoria armónica

Fuentes abiertas consultadas: Frank Lehman, Hollywood Cadences (2013), https://www.mtosmt.org/issues/mto.13.19.4/mto.13.19.4.lehman.html ; The Impact of Voice Leading and Harmony on Musical Expectancy (2020), https://doi.org/10.1038/s41598-020-61645-4 ; Perceived Emotions of Harmonic Cadences (2020), https://doi.org/10.1177/2059204320938635 ; Expectation adaptation for rare cadences (2023), https://pmc.ncbi.nlm.nih.gov/articles/PMC10501749/ . Los estudios orientan la distinción entre contexto, expectativas, función y llegada; no proporcionan los pesos numéricos del algoritmo ni validan estos once perfiles.

- La función continuationExpectation distingue una séptima de dominante con tritono de una séptima menor, y sus posibles destinos: resolución, suspensión, desviación diatónica, prolongación o salida. Los movimientos de voces son posibilidades de clases de altura, no resoluciones observadas.
- continuationCenters conserva una relativa próxima con cobertura comparable cuando no hay llegada dominante-tónica final que distinga la hipótesis principal. Am F C G admite Do mayor y La menor. Umbrales heurísticos, no probabilidades.
- Se favorece la recuperación de fundamentales y materiales originales, y se muestra la recuperación o transformación de una fundamental previa en la explicación. No equivale a memoria psicológica ni desarrollo motívico confirmado.
- Una llegada solicitada a un centro candidato exige bajo de tónica y evita mMaj7 final. Dominante o plagal con otro bajo ya no se rotulan como llegada conclusiva. Una cadencia formal exige frase y melodía.
- Si una séptima de dominante final prepara claramente una tónica candidata y se pide llegada, el camino de continuidad puede tener un solo acorde (p. ej. Am Dm E7 → Am). No se fuerza diferenciación artificial en este caso. Los dos caminos restantes siguen explorando el estilo.
- En el mismo corpus de cinco progresiones × once perfiles × tres caminos con llegada, las extensiones examinadas (maj7/add9/m7/mMaj7, incluyendo madd9) pasan de 251/495 acordes a 119/473; los 165 finales nuevos cumplen el requisito de bajo de tónica. Son métricas de diseño, no de calidad estética. Las 363 combinaciones de regresión y los nuevos casos específicos se ejecutaron en JS. Pendiente CI real, navegador, escucha y paquetes Max/Android.

## Tercera revisión: cuatro tareas de frase

Referencias abiertas verificadas: Mark Richards, Film Music Themes: Analysis and Corpus Study (2016), https://mtosmt.org/issues/mto.16.22.1/mto.16.22.1.richards.html ; Frank Lehman, Hollywood Cadences (2013), https://www.mtosmt.org/issues/mto.13.19.4/mto.13.19.4.lehman.html . Richards distingue estructuras temáticas y destaca la relevancia de relaciones melódicas y temporales; Lehman estudia convergencia de parámetros para la articulación y las llegadas. No justifican una división universal en cuatro fases. Se adoptan cuatro tareas de exploración, no una identificación formal: presentación, desarrollo, culminación y resolución.

La función harmonicPhraseEvidence observa recurrencia de acordes y enlaces, transformación P/L/R/S entre tríadas, conservación de bajo escrito (no pedal ejecutado), preparación de posibles llegadas, y destino final con distinción de bajo y suspensión. Una preparación no prueba culminación perceptiva. phraseArchScore reordena el conjunto acotado de rutas completas con pesos de diseño específicos de perfil y un máximo de cinco puntos; no mide emociones ni autoría. El compositor puede seguir construyendo sobre el material original, y una resolución directa de un acorde sigue admitida. Se conserva la interfaz Crear y se añaden explicaciones únicamente dentro del desplegable existente. Cache v56.

Se ejecutaron en JS los 363 escenarios previos con las nuevas comprobaciones de datos de frase, más casos específicos de retorno, recurrencia de enlace, R, bajo mantenido, preparación, llegada invertida, suspensión y respuesta corta. No se ejecutó navegador físico, Max ni empaquetado. El análisis trabaja con clases de altura, sin duración ni melodía, por lo que no determina forma temática, clímax ni resolución vocal real. Los pesos se mantienen como hipótesis D pendientes de escucha y comparación con repertorio independiente.
