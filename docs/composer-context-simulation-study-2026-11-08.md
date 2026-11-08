# Cinemático Studio — Simulaciones estructurales por contexto (8 noviembre 2026)

**Estado:** simulaciones ejecutadas, resultados guardados, pruebas CI superadas. **No hay escucha ni participación humana.** Los nombres de las situaciones son briefs ficticios; la evaluación corresponde a **requisitos armónicos declarados**, nunca a una estimación objetiva de emoción, «parecido al compositor» o calidad estética.

## Protocolo reproducible

- **11 perfiles** con **22 caminos originales** (dos por compositor).
- **2 controles genéricos** sin atribución: Do mayor `C – F – G7 – C` y Do menor `Cm – A♭ – B♭ – Cm`.
- **10 contextos** ficticios, cada uno con 3 condiciones musicales binarias: modo de partida, retorno de fundamental, presencia/ausencia de enlace V–I, notas comunes, cromatismo, ♭II, ♯11, economía de fundamentales, transformaciones PLR, etc.
- **12 transposiciones** por ruta, incluyendo enarmonías comunes.
- **2.880 comparaciones ruta × brief × tonalidad = 2.640 con rutas de perfiles + 240 con controles.** Son **240 combinaciones estructurales distintas por contexto/ruta** repetidas en doce tonalidades para probar invariancia; **no** equivalen a 2.880 participantes ni a 2.880 audiciones independientes.
- Resultado completo congelado en `research/composer-context-results-2026-11-08.json` y definiciones explícitas en `research/composer-context-briefs-2026-11-08.json`. Ejecución: `node tests/composer-context-simulations.cjs --json`.
- Tres características satisfechas = 3/3 (cobertura completa). Dos características = 2/3 (parcial). No equivale a preferencia musical humana.
- El conjunto de briefs fue diseñado a partir de preguntas musicales relevantes para esta versión: **no es un conjunto ciego, aleatorio ni independiente del diseño de la app.** Particularmente ♯11 y ♭II seleccionan rasgos deliberadamente específicos de Silvestri y Elfman; los resultados no deben venderse como «clasificador de estilo».

## Resultados por brief

| Escenario ficticio | Rutas 3/3 | Rutas 2/3 | Referencias que cumplen las tres | Controles: mayor, menor |
|---|---:|---:|---|---|
| Intimidad sin cierre impuesto | 3/22 | 6/22 | elfman#2, newman#1, newman#2 | 0/3, 1/3 |
| Pérdida sin regreso | 5/22 | 7/22 | herrmann#1, horner#1, horner#2, zimmer#1, zimmer#2 | 0/3, 2/3 |
| Maravilla con posibilidad lidia | 1/22 | 3/22 | silvestri#1 | 1/3, 0/3 |
| Peligro cromático | 3/22 | 11/22 | elfman#1, herrmann#1, morricone#2 | 0/3, 2/3 |
| Reencuentro con llegada explícita | 6/22 | 7/22 | elfman#1, giacchino#1, giacchino#2, shore#1, shore#2, williams#2 | 3/3, 2/3 |
| Transformación entre tríadas | 2/22 | 8/22 | horner#1, horner#2 | 1/3, 1/3 |
| Espera y economía de acordes | 2/22 | 11/22 | herrmann#2, zimmer#1 | 0/3, 2/3 |
| Afirmación tonal con ambigüedad | 3/22 | 4/22 | silvestri#1, silvestri#2, williams#1 | 1/3, 1/3 |
| Soledad con pocos acordes y salida abierta | 1/22 | 5/22 | zimmer#1 | 0/3, 1/3 |
| Extrañeza en torno a la tónica | 1/22 | 9/22 | elfman#1 | 1/3, 2/3 |

**Lectura:** en el escenario de transformación entre tríadas, solamente las dos rutas diseñadas para el perfil Horner cumplieron simultáneamente los tres requisitos. Esto **demuestra adecuación a ese brief estructural**, no una imitación más fiel de Horner que la música de otros autores. En el escenario de reencuentro, **la progresión de control mayor obtuvo 3/3 también**: confirma que **un V–I convencional puede funcionar** para ese encargo y evita confundir cumplimiento con originalidad.

### Rutas que se diferencian o se repiten

Se compararon las dos rutas de un mismo compositor: en cuántos de los diez briefs **obtuvieron distinto número de requisitos satisfechos**.

| Perfil | Briefs que diferencian A/B | Empates | Mejora A | Mejora B |
|---|---:|---:|---:|---:|
| elfman | 8/10 | 2/10 | 4 | 4 |
| giacchino | 1/10 | 9/10 | 0 | 1 |
| goransson | 1/10 | 9/10 | 1 | 0 |
| herrmann | 6/10 | 4/10 | 3 | 3 |
| horner | 0/10 | 10/10 | 0 | 0 |
| morricone | 3/10 | 7/10 | 0 | 3 |
| newman | 5/10 | 5/10 | 3 | 2 |
| shore | 1/10 | 9/10 | 0 | 1 |
| silvestri | 5/10 | 5/10 | 4 | 1 |
| williams | 8/10 | 2/10 | 5 | 3 |
| zimmer | 5/10 | 5/10 | 4 | 1 |

**Hallazgos clave:**
1. **Horner:** ambas rutas empatan en 10/10 porque los tres criterios por brief son deliberadamente gruesos. Sin embargo, sus operaciones exactas son **P–L–R** y **R–L–P**: un empate en cobertura **no** implica que sean iguales. La interfaz debería mostrar la diferencia de recorrido.
2. **Giacchino:** 9/10 empates porque sus dos caminos comparten las mismas fundamentales y la segunda opción añade acordes extendidos; el diagnóstico actual pierde esta diferencia de **color**. No hay razón para inventar más raíces solo para lograr contraste.
3. **Göransson:** 9/10 empates y ninguna ruta cubre totalmente los briefs actuales. Es un **límite del material simbólico de acordes**, no prueba de debilidad artística: sus procesos documentados dependen de tempo, articulación y energía.
4. **Shore:** 9/10 empates. Ambas rutas regresan a menor mediante V7–i; una introduce **iv → IV** y otra una región diferente. Las pruebas futuras deben medir el **cambio de calidad sobre la misma fundamental** y el retorno de identidad musical si se dispone de motivo.
5. **Morricone:** 7/10 empates. La ruta modal `Cm – F – B♭ – Cm` cumple los criterios **formales** del escenario «peligro» (menor, acorde ajeno al modo e intersección nula), lo cual es un **contraejemplo** muy útil: ello no significa que esa música produzca miedo. No utilizar estos resultados como predictores emocionales.
6. **Newman:** solo 5/10 empates; los caminos **regreso a tónica** frente a **cierre abierto** resultan realmente diferenciables desde acordes.
7. **Williams y Elfman:** 2/10 empates cada uno; mezcla, tensión y llegada contrastan sustancialmente en los indicadores disponibles.
8. **Silvestri:** ♯11 sobre I y tritono facilitan dos laboratorios distintos; **no se afirma** que tales acordes sean únicos del autor.
9. **Zimmer:** la ruta `Cm – A♭ – Cm – A♭` cumple el brief de pocos acordes y salida abierta, pero el análisis **no ha inferido un ostinato real**.
10. **Herrmann:** las alternativas muestran buena diferencia entre fricción / apertura y economía cromática, pero sin duraciones no puede afirmarse suspensión dramática.

## Problemas metodológicos detectados y corregidos

**Solapamiento de briefs.** La primera ejecución utilizaba exactamente las mismas condiciones en «pérdida» y «soledad». Se corrigió: ahora **soledad** exige modo menor, no más de dos regiones armónicas y final en otra fundamental; «pérdida» exige modo menor, final en otra fundamental y ausencia de V–i. Se añadió una aserción que prohíbe briefs con conjuntos idénticos de criterios.

**Empates mal interpretados.** Las operaciones musicales pueden diferir aunque las cifras agregadas empaten; no se aconseja optimizar el motor para maximizar esta cifra. Necesitamos indicadores cualitativos adicionales y eventualmente escucha.

**Control positivo.** El control mayor cumple 3/3 en «reencuentro». Esto refuta cualquier conclusión fácil de que las rutas ligadas a nombres propios sean superiores por cumplir requisitos, lo cual es deseable.

**Falsos positivos semánticos.** Un camino de Morricone puede satisfacer el brief «peligro» por acordes, pero no se ha probado que provoque miedo. Las pruebas son controles sintácticos y de estructura, no un modelo de emoción.

**Invariancia.** Los indicadores se mantienen al transponer el mismo recorrido a 12 tónicas, pero esa propiedad no asegura que cada transposición tenga la misma comodidad instrumental o realización de voces.

## Tres cambios justificables antes de añadir nuevos acordes

1. **Mostrar contrastes que los criterios actuales ocultan.** Si las dos rutas usan las mismas fundamentales y solo cambian extensiones, decirlo (caso Giacchino). Si mantienen dos notas con series distintas de transformaciones, nombrar el orden (caso Horner). No crear acordes nuevos artificialmente para forzar divergencia.
2. **Separar necesidades fuera del cifrado.** En Göransson, Morricone, Shore y parcialmente Zimmer, reconocer que el rasgo compositivo central demanda ritmo, timbre, desarrollo motívico o contexto. Estos aspectos son ejercicios propuestos al usuario, **no inferencias** del motor.
3. **Evaluación humana ciega antes de cuantificar utilidad estética.** Mantener símbolos, armonía, duraciones, registro y dinámica constantes cuando corresponda; anonimizar el perfil; evaluar preferencia, utilidad para componer, creatividad de la alternativa y nivel de cliché. Varios oyentes y varios encargos por persona, con opción «ninguna».

## Siguiente estudio humano propuesto (aún NO realizado)

Para cada contexto, construir un pequeño fragmento original (sin reproducir música comercial), y comparar A/B con un control sin nombres de autores. Mantener constante tempo, instrumentación, duración y registro **si el objetivo es aislar la armonía**. Si el objetivo es evaluar un estilo con textura y articulación, esos factores deberán variarse experimentalmente de forma controlada. Registrar una puntuación de 0–5 para **utilidad compositiva**, **interés** y **coherencia**, más comentario libre, **nunca** como «probabilidad de parecerse a Zimmer». Reportar cantidad de participantes e incertidumbre antes de afirmar cualquier efecto.

## Fuentes metodológicas

- Lerch et al., «Survey on the Evaluation of Generative Models in Music», *ACM Computing Surveys* (2025), DOI https://doi.org/10.1145/3769106: propone combinar evaluación objetiva, subjetiva, cualitativa y cuantitativa, sin equiparar métricas a creatividad.
- «Recent advances in music generation: methods, evaluation, and challenges», *Artificial Intelligence Review* (2026), DOI https://doi.org/10.1007/s10462-026-11582-x: la evaluación debe ser multidimensional, particularmente separando propiedades simbólicas de audio, timbre y percepción.
- Zhang et al., «Moderating effects of chord progressions on the emotional experience of major and minor chords», *Acta Psychologica* 253 (2025), https://pubmed.ncbi.nlm.nih.gov/39793277/: los juicios de valencia, estabilidad y tensión dependen del contexto de progresión; no se pueden deducir como etiquetas absolutas de un acorde.

## Garantías de producto

No se ha aplicado una clasificación automática «es propio de X compositor» ni se ha cambiado la progresión del usuario. El corpus de experimentos y el script son archivos de investigación, no una nueva pantalla didáctica ni nuevas promesas estéticas. La versión web sigue sin análisis MIDI.
