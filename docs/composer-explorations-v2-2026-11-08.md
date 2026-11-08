# Fase de integración: perfiles de compositor — 8 de noviembre de 2026

## Objetivo
Transformar el dossier de once compositores en ayudas musicales **no destructivas** para una persona que está componiendo. No enseñar música paso a paso, no imitar partituras protegidas, no atribuir un estilo a una entrada de acordes, y no generar MIDI en la web.

## Resultado técnico
- **Once lentes de referencia** en \`engine.js\`, cada una con una hipótesis de trabajo distinta, fuente musical verificable, límite de inferencia y dos ejercicios de progresión **originales**.
- **Veintidós rutas** únicas en Do de referencia, transpuestas y cifradas automáticamente a la tonalidad escogida; se mantienen separadas de la progresión del usuario.
- La interfaz añade «**Dos caminos para explorar**» debajo del giro de referencia. Muestra nombre, acordes, gesto compositivo y un desplegable «Fundamento y límites» con enlace a la fuente.
- Los apartados existentes «Idea emocional», «Lenguaje de referencia», «Tu progresión» y laboratorio de voces permanecen. No se cambia automáticamente ningún acorde del compositor.
- Se sustituyen etiquetas que pretendían identificar a compositores por fórmulas demasiado genéricas, como «Silvestri = I–IV–V–I» y «Horner = i–♭VII–i». El término «firma» deja de presentarse como una afirmación musicológica fuerte.
- Se desambigua \`iv6\`: la propuesta de Williams usa sexta **añadida** \`iv(m6)\`, no un acorde en primera inversión.
- Se evita llamar «dominante secundaria» a un I–IV diatónico solo por la dirección de la fundamental; se mantienen escenarios como I7–IV y II7–V con alteración cromática pertinente.

## Tres casos contrastados con evidencia más específica

**Silvestri.** El estudio *Back To The Future: An Analysis Of The Score* (documento en Berklee, pp. i–iii, figuras 1, 6–9) evidencia el uso del grado cuarto alterado del modo lidio, derivaciones del tema, relaciones tritonales y una célula de escala octatónica. En la aplicación:
- Un ejercicio expone el **sonido lidio potencial** mediante \`Imaj7#11 – II – I\`.
- Otro expone una **relación de tritono** en \`I – ♭V – IV – I\`.
- **Límite:** un acorde por tritono no prueba por sí mismo que se utilice una colección octatónica, ni reproduce el tema ni el ostinato de la película.
Fuente: https://www.blogs.berklee.edu/wp-content/uploads/2017/09/BTTF-Analysis.pdf

**Horner.** Frank Lehman, *Music Theory Spectrum* 35/1 (2013), pp. 1–22, estudia los procesos de grupo generado por L, R y S en tres cues de *A Beautiful Mind*. La aplicación propone ejercicios sencillos **P–L–R** y **R–L–P**, en lugar de reutilizar el cliché «color celta». **Límite:** se valida que cada transformación conserva dos clases de altura, pero el ejercicio **no reproduce** la red L/R/S de Lehman, el significado dramático ni su realización temporal.
Fuente: https://franklehman.com/wp-content/uploads/2020/02/MTS-Article.pdf

**Newman y Göransson.** En el BFI, Newman explica cómo evitar cierres musicales excesivos; se propone una ruta que termina en IVmaj7 y **no garantiza** que el sonido resulte íntimo. Göransson documenta la articulación extrema del violín y numerosos cambios de tempo en *Oppenheimer*, recursos **no deducibles del cifrado**. Por eso sus rutas son contenedores armónicos para contrastar energía, y el texto declara que el trabajo sobre tempo es externo a los acordes.
Fuentes: https://www.bfi.org.uk/interviews/scoring-mr-banks-composers-life-hollywood ; https://www.nme.com/features/film-interviews/oppenheimer-score-soundtrack-ludwig-goransson-christopher-nolan-3471661

## Métodos de control y evaluación

### Validación implementada
- \`tests/composer-research-regression.cjs\`: once perfiles respaldados y clasificador de dominante aplicada.
- \`tests/composer-lenses-integration.cjs\`: cobertura de los once, 22 rutas sin duplicados exactos en Do, **264 rutas transpuestas** (11 perfiles × 2 rutas × 12 clases de altura), validación de grados y notas, tonalidades enarmónicas comunes, operaciones triádicas exactas, acorde napolitano correcto, no-mutación y presencia de declaraciones de alcance.
- \`tests/browser-smoke.cjs\`: navegación en escritorio y móvil, once selectores, conmutación a otra tonalidad y recomputación, conservación de la progresión propia y regresiones previas de guardar/cargar e ideas simples.
- \`.github/workflows/reliability.yml\`: integra estas pruebas con las de armonía/cadencias/precisión previas.

### Contraejemplos que han cambiado el diseño
| Simplificación fallida | Contraejemplo | Solución |
|---|---|---|
| «Horner = modalismo celta» | *A Beautiful Mind* con transformaciones L/R/S | Rutas de transformación P/L/R **originales** |
| «Silvestri = I–IV–V–I» | Estudio del modo lidio y escala octatónica de *Back to the Future* | Dos gestos armónicos específicos y explicación de límites |
| «Zimmer = cualquier bucle menor» | Núcleo inicial íntimo en *Interstellar* | Mantener núcleo con distinta densidad como acción sugerida, no inventar instrumentación |
| «Elfman = siempre carnaval oscuro» | Delicadeza coral de *Edward Scissorhands* | Contraste de fricción cromática y fragilidad |
| «Göransson = i–♭VI–♭VII–i» | *Oppenheimer* con cambios de tempo y ejecución instrumental | Rutas con advertencia de que el criterio principal no está en cifras |
| «Newman = add9» | Finales no resueltos y espacio como elección narrativa | Comparar cierre abierto y color sin asegurar emoción |
| «C → F es V/IV» | Lectura diatónica I → IV perfectamente posible | Clasificar como diatónico en ausencia de cromatismo adicional |
| «iv6 es primera inversión» | \`Fm6\` denota sexta añadida | Explicitar \`iv(m6)\` |

### Lo que todavía NO hemos verificado
No existe una evaluación auditiva humana ciega sobre una muestra representativa; no se ha comparado la experiencia de varios compositores reales en distintas escenas y no se ha desarrollado un reconocedor estilístico estadístico. **Que las 22 rutas sean diferentes y las pruebas pasen demuestra coherencia estructural y no destructividad, no semejanza perceptiva a un compositor.** La mejora futura debe medir utilidad compositiva humana, diversidad sin forzar rareza, expresividad, parsimonia y grado de intrusión.

## Protocolo para la siguiente fase de calidad artística
1. Preparar 10 contextos sintéticos de composición **sin copiar música existente**: intimidad, pérdida, maravilla, peligro, reencuentro, transformación, espera, heroicidad ambigua, soledad y humor inquietante.
2. Para cada contexto, presentar las dos rutas de un perfil y una ruta control sin etiqueta de compositor, en orden aleatorio.
3. Pedir a varios músicos compositores, a ciegas, puntuar **utilidad para su composición** (0–5), **coherencia armónica** (0–5), **posibilidad de transformación** (0–5), **cliché perceptible** (0–5, menor mejor) y **dependencia de recursos no introducidos** (0–5, menor mejor).
4. Registrar comentarios, rechazos y motivos; **no inferir parecido estilístico** de un mismo juicio de utilidad. Repetir por tonalidad mayor/menor y por modo.
5. Solo tras esa evaluación, cambiar ponderaciones del motor. La revisión humana y control artístico siguen siendo centrales.

## Seguridad musical, derechos y compatibilidad
No se redistribuye partitura protegida. Los ejemplos de acordes son **nuevas progresiones propuestas** y no citas. Fuentes documentales enlazadas bajo consulta del usuario. El estado persistente, selector de intención, lenguaje, tonalidad y progresión propia no cambia en el guardado. El sitio web no implementa análisis MIDI; se reserva para la futura integración con Ableton.

## Operación
Lanzamiento preparado mediante PR #3 en GitHub. Actualización de caché PWA de v29 a v30 para no mantener un motor anterior. Desplegar únicamente después del resultado favorable del conjunto CI (Node + Playwright escritorio y móvil).
