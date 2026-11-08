# Cinemático Studio — Microanálisis documentado de partituras (fase 1)
**Fecha:** 8 de noviembre de 2026. **Objeto:** comprobar procedimientos armónicos, melódicos y formales contra ejemplos notados publicados de Silvestri, Horner, Herrmann y Williams.

## 0. Método y umbral de prueba
El propósito de Cinemático es **estimular decisiones de composición**, no enseñar un temario teórico, identificar autores a partir de acordes ni transcribir automáticamente bandas sonoras. Se ha inspeccionado visualmente un pequeño conjunto de figuras en los PDF abiertos: páginas i–iii del estudio sobre *Back to the Future*; pp. 11–15 de Lehman (2013) y las figuras de Murphy (2022) con su comentario teórico. El capítulo abierto de Lehman (2026) permite comprobar el análisis escrito de *Binary Sunset*, pero **la figura I.1 no se ha inspeccionado visualmente** en esta intervención. No se han leído partituras originales de sesión completas, ni comparado todas las versiones fonográficas.

Por eso, cada caso distingue: (i) qué se ve en una figura y/o documenta explícitamente un análisis, (ii) qué interpretación musicológica propone su autor, (iii) qué puede demostrar realmente un motor que recibe solo cifras armónicas, y (iv) un experimento **original** que el compositor puede aceptar o descartar. Se reservan **sin afirmar** dinámica, tempo, gesto instrumental, melodía de la obra y límites de frase cuando no son datos del usuario.

No se reproducen páginas ni pasajes notados protegidos en este repositorio: solo abstracciones de classes de altura y referencias externas precisas. El archivo de datos acompañante es `research/score-microanalysis-phase1-2026-11-08.json`. Las pruebas automatizadas documentan **consistencia estructural**, no la calidad perceptiva de la música.

## 1. Alan Silvestri — *Back to the Future*

**Fuente:** *Back to the Future: An Analysis of the Score*, documento analítico alojado por Berklee. PDF: https://www.blogs.berklee.edu/wp-content/uploads/2017/09/BTTF-Analysis.pdf. Figuras 1a (p. i), 4 (p. ii), 6, 8a y 9 (p. iii).

### 1.1. Una nota del motivo tiene más poder explicativo que el acorde
La fuente identifica en el primer tema una cuarta elevada **Mi natural** respecto de **Si♭**, que pasa a **Fa**. En clases de altura, el centro Si♭ vale 10, el Mi natural vale 4 (distancia de 6 semitonos, cuarta aumentada) y el Fa vale 5 (distancia de 7 semitonos, quinta justa). El paso Mi→Fa es ascendente por semitono.

La figura 4 de la misma fuente documenta una variación que rebaja esa nota, sustituyendo el color de cuarta elevada por uno más diatónico. Se modifica la inflexión interna del motivo: el hecho no se reduce a un cambio de progresión. **Un acorde `Bbmaj7#11` contiene Mi, pero no demuestra que la melodía utilice Mi→Fa, ni el ritmo, ni la identidad del tema.**

**Experimento compositivo original, no transcripción:** mantener una célula breve y comparar su paso `#4→5` con `4→5` sobre la misma región armónica, sin cambiar más variables. La opción debe mostrarse como invitación («Prueba una inflexión lidia») y no como «Silvestri detectado».

### 1.2. Tritono entre tríadas y superposición no equivalen a «octatonismo»
Las figuras 6–8 muestran relación entre tríadas mayores de **Si♭** y **Mi**; sus fundamentales distan seis semitonos. Como conjuntos de notas son `{Bb,D,F}` y `{E,G#,B}`. Su unión tiene seis clases `{D,E,F,G#,Bb,B}`, y queda incluida en una de las tres colecciones octatónicas (de ocho clases), pero **faltan dos clases** para completar esa colección. La fuente examina un entorno octatónico y, además, describe superposición de estas tríadas y usos sucesivos de materiales relacionados.

Debemos distinguir al menos **tres preguntas independientes**:
- ¿Dos acordes de la progresión tienen fundamentales a tritono? Es verificable a partir de cifras sucesivas.
- ¿Un mismo acorde o bloque sonoro contiene clases compatibles con dos tríadas superpuestas? Es una **partición posible** de clases de altura, no simultaneidad real conocida.
- ¿Se escucha o se escribe una colección octatónica gobernando un pasaje? Requiere sucesión, selección de alturas y contexto que no están determinados por dos cifras.

El motor ya separa `tritoneTriadRelations` de `triadicLayeringHypotheses`. La prueba añadida comprueba `Bb E` como relación sucesiva y el conjunto unido como partición compatible, **sin convertir ninguna de ambas salidas en una identificación de estilo ni en una prueba de octatonismo**.

### 1.3. El ritmo cambia aunque los acordes permanezcan
La figura 9 presenta un ostinato con alternancia notada de **2/4 y 3/8**. Al cambiar longitud de compás y posición del acento, el patrón puede mantener repetición de notas y producir una sensación de movimiento distinta. La fuente también sitúa otros materiales en registros/instrumentos determinados, pero la interfaz web actual no puede verificarlos solo con símbolos armónicos.

**Experimento sugerido:** alternar esas agrupaciones sobre una idea propia y comparar su impulso. No introducir por ello un falso analizador rítmico o MIDI en Cinemático Web.

**Resultado para Silvestri:** los perfiles diferencian ahora color melódico lidio de identidad armónica y ostinato de cambio métrico, manteniendo instrucciones de una frase.

## 2. James Horner — *A Beautiful Mind*

**Fuente:** Frank Lehman, «Transformational Analysis and the Representation of Genius in Film Music», *Music Theory Spectrum* 35/1 (2013). PDF: https://franklehman.com/wp-content/uploads/2020/02/MTS-Article.pdf. Figuras 7–12; en particular ejemplo 10 y pasaje de la segunda pasada, **compases 27–33**, y ejemplo 12 sobre la cuarta pasada, **compases 50–65**.

### 2.1. Transformación S: cambio sucesivo
Lehman analiza el movimiento de **La menor** a **La♭ mayor** como S (SLIDE): `Am = {A,C,E}`, `Ab = {Ab,C,Eb}`. El **Do** permanece, La→La♭ y Mi→Mi♭ bajan ambos un semitono. Esta relación opera dentro de una **red transformacional** junto a otras operaciones como L y R; no se agota en la cercanía de los conjuntos.

Nuestra versión del laboratorio ya implementa S y la prueba de investigación confirma el caso `Am→Ab`. El ejercicio previo P–L–R de Cinemático no debe atribuirse como transcripción del procedimiento publicado: incluso si se conservan notas comunes, la sucesión concreta y su posición dramática cambian.

### 2.2. SLIDEJOIN: dos tríadas presentes en un bloque sonoro
En los compases próximos a **60–65**, Lehman describe primero alternancia rápida y luego una **simultaneidad de cinco clases** que reúne las dos tríadas en oposición, y la llama *SLIDEJOIN*. La unión `{A,C,E} ∪ {Ab,C,Eb}` es `{Ab,A,C,Eb,E}` (cinco clases), **no** la transformación secuencial S que conserva solo un Do entre un acorde y el siguiente.

El motor posee dos mecanismos distintos: `neoTransform` para S y `triadicLayeringHypotheses` para particiones. Ninguno puede decidir que el intérprete realmente ejecutó las notas simultáneamente salvo que exista duración/posición de cada nota o lo indique explícitamente la partitura consultada. Tampoco puede calificar por ello «más tensión» como propiedad universal.

### 2.3. La dirección surge de una ruta, no de un paso
Las figuras 8, 10–12 modelan redes con recorrido, repetición y desvío. Su material puede retomar estados conocidos, salir hacia otros y conseguir un regreso transformado. El punto musical trasladable al producto es la **comparación de dos recorridos con distintas operaciones en orden**, manteniendo el control humano.

**Experimento original:** desde una tríada escrita por el usuario, contrastar rutas breves L–S–R y R–L–S, indicar nota común y movimiento por semitono en cada salto; no llamarlas «ruta de Horner» ni inventar probabilidades de semejanza. La comparación debe separar el orden de operaciones del diseño de timbre y frase.

## 3. Bernard Herrmann — *Vertigo*, «Prelude»

**Fuente:** Scott Murphy, «Three Audiovisual Correspondences in the Main Title for Vertigo», *Music Theory Online* 28/1 (2022). Artículo: https://mtosmt.org/issues/mto.22.28.1/mto.22.28.1.murphy.php. PDF de ejemplos: https://mtosmt.org/issues/mto.22.28.1/murphy_examples.pdf. Inspeccionados: ejemplo 1, reducción analítica, y ejemplo 2, **compases 1–2**.

### 3.1. Acorde estructural frente a vecino melódico
Murphy considera el material A del preludio en relación con el acorde menor con séptima mayor sobre **Mi♭**: `Eb–Gb–Bb–D`. La nota **Do5** aparece entre arpegios, pero el analista defiende tratarla como **vecina melódica** y no como quinta clase armónica estructural. Su argumento atiende a la trayectoria por grado conjunto y a relaciones entre arpegios, no a un test de pertenencia a las notas que suenan.

Este es un límite importante de la mayoría de analizadores basados en conjuntos: **agregar todas las notas de un intervalo temporal puede confundir notas ornamentales con acordes**. La app debe evitar afirmar que un Do presente convierte automáticamente `EbmMaj7` en una nueva sonoridad de cinco clases. Tampoco debe convertir el ejemplo de Murphy en prueba de que cualquier aparición de Do sobre Mi♭ menor sea no armónica: el análisis depende del pasaje.

### 3.2. Forma y composición audiovisual
El artículo presenta una reducción de forma **A–B** con retorno parcial y coda C, y propone correspondencias con los títulos animados de Saul Bass. Estas son interpretaciones documentadas de una obra específica, sujetas al soporte audiovisual. No son propiedades intrínsecas del acorde mMaj7, ni una forma que pueda deducirse del usuario escribiendo `EbmMaj7 Abm`.

**Experimento original:** sostener la misma sonoridad mMaj7 en dos tratamientos: arpegio sin nota externa y arpegio con un vecino melódico claramente marcado. El compositor puede decidir si añade o quita ornamentación. La web no fingirá haber reconstruido ritmos ni articulaciones del preludio.

### 3.3. Cuidado al elegir una «nota verdadera»
Murphy reconoce en sus notas que distintas reducciones musicológicas difieren incluso respecto a alturas sostenidas por instrumentos concretos. Por ello, incluso una reducción académica **no debe tratarse como ground truth del 100 %** para un motor que no dispone de todas las voces de la partitura. La procedencia y el grado de incertidumbre quedan registrados junto al caso.

## 4. John Williams — *Star Wars*, «Binary Sunset»

**Fuente:** Frank Lehman, *The Skywalker Symphonies* (2026), «Introduction: The Spark», figura I.1, **compases 1–19**, especialmente **compás 7**. Texto abierto: https://academic.oup.com/book/63100/chapter/567207145

Aquí el nivel de lectura es **B**: se ha verificado el comentario textual del autor, no la imagen íntegra de figura I.1 en esta intervención. Lehman describe como una **semicadencia** el final del primer módulo de «Binary Sunset», en el contexto tonal general de **Sol menor**, con una sonoridad de tríada de **Ré♭** sobre bajo **Sol**. La denominación cultural de esa sonoridad («Planets chord») es parte del comentario del investigador; no la tomamos como un algoritmo de atribución.

Una simple cifra `Db/G` demuestra, a lo sumo, que hay tres notas de una tríada mayor de Ré♭ sobre un bajo ajeno Sol. La lectura cadencial de Lehman depende de su posición al término de un módulo temático y de la frase. Un caso aislado no proporciona compases, melodía, pausa, acento o armonía previa.

**Experimento original:** contrastar una llegada con tónica clara frente a otra con bajo de dominante y tríada superior cromática, cuidando el contexto y comparando el resultado con la intención del compositor. No etiquetar la segunda como «cadencia de Williams» ni afirmarla como semicadencia formal.

Este caso también reafirma por qué Cinemático debe mantener distintos `root`, `notes` y `bass`: la superposición no equivale a una inversión.

## 5. Síntesis para el producto: una regla de interpretación más rigurosa
El cambio de enfoque tras este primer estudio es **separar hechos observables de hipótesis creativas y decisiones de interpretación**:

| Observación | Puede comprobarla la web desde cifras | Solo puede recomendarse o quedar sin confirmar |
|---|---|---|
| `Bb → E` a tritono | Sí, fundamental de ambos acordes | Que se superpongan, que haya colección octatónica y su efecto emocional |
| `Am → Ab` tipo S | Sí, notas compartidas y semitonos | Que tenga el papel dramático que estudia Lehman |
| `EbmMaj7` | Sí, clases del acorde | Si Do5 es vecino melódico o parte estructural de otro pasaje |
| `Db/G` | Sí, acorde sobre bajo ajeno | Que constituye una semicadencia de frase |
| `Bbmaj7#11` | Sí, sonoridad con #11 | Que la melodía haga realmente la inflexión lidia del tema |

El valor práctico de las pruebas adversariales es que el motor **rechace deducciones sin evidencia**, no que aprenda una tabla de clichés musicales. Por eso los cinco controles no incluyen texto ni eventos completos copiados de una partitura; usan casos breves para distinguir capacidades.

## 6. Cambios de producto en esta fase
Se han ajustado cinco tarjetas de exploración en `engine.js`, sin ampliar la interfaz ni cambiar el motor de generación automática:

1. **Williams:** punto de llegada y bajo de dominante; el acorde solo no demuestra cadencia.
2. **Herrmann:** mMaj7 separado de vecino ornamental; no se infiere melodía del cifrado.
3. **Silvestri:** experimento de cuarta elevada y cuarta justa sobre el mismo motivo, en vez de atribuir el resultado a un acorde maj7#11.
4. **Silvestri:** ostinato con acentos móviles, inspirando agrupaciones alternativas de 2/4 y 3/8 sin inventar análisis rítmico.
5. **Horner:** las rutas L/R/S y la distinción entre paso sucesivo S y superposición SLIDEJOIN.

Se mantiene el orden visual y el análisis armónico independiente de la progresión que introduce el usuario. No se incorpora MIDI a la web.

## 7. Validación y próxima investigación
- **Corpus en esta fase:** 4 fragmentos documentados, 13 observaciones separadas, 5 controles negativos; no son muestras estadísticas independientes.
- **Fuentes A:** Silvestri, Horner y Herrmann mediante lectura visual de ejemplos publicados, no scores de sesión completos.
- **Fuente B:** Williams mediante comentario académico y referencia exacta a compás/figura sin lectura visual completa de esa imagen.
- **Audición humana ciega realizada:** 0. **Partituras originales integrales leídas:** 0.
- **Pruebas nuevas:** `tests/score-microanalysis-phase1.cjs` comprueba diferencias de conjuntos, parentesco S/SLIDEJOIN, función de bajo y la insuficiencia de una cifra para certificar cadencia. CI de navegador debe confirmar que el resto de Cinemático no pierde estructura.

**Siguiente bloque de investigación de alto valor:** extender el análisis de Horner a dos tramos más de la red y comprobar casos de octatonismo en Silvestri con todas sus clases y evolución temporal. Después comparar dos reducciones independientes de Herrmann para documentar desacuerdos de anotación. Finalmente, localizar una reproducción accesible de la figura I.1 de Williams para elevarla de B a A, solo si puede inspeccionarse con fidelidad. La revisión independiente de otros compositores seguirá subordinada a conseguir fuentes reales, no ejemplos inventados.

---
**Bibliografía principal:** URLs citadas en cada sección. Referencia metodológica adicional sobre definición de cadencia y frase: Frank Lehman, «Hollywood Cadences: Music and the Structure of Cinematic Expectation», *Music Theory Online* 19/4 (2013): https://www.mtosmt.org/issues/mto.13.19.4/mto.13.19.4.lehman.html
