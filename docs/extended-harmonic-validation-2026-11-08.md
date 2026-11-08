# Continuación de la validación musicológica — 8 noviembre 2026

## Estado recuperado

La base `0b969c3` supera las 17 suites de motor, investigación y comprobación estática existentes. Esto reproduce la validación automatizada anterior; no constituye escucha humana ni análisis nuevo de partituras completas. Siguen pendientes el corpus externo anotado y la evaluación auditiva independiente.

## Defectos encontrados fuera de los casos anteriores

1. El analizador admite novenas y sextas, pero la detección de funciones usaba listas antiguas. `Dm9–G9–Cmaj9` no recibía el indicio predominante–dominante–tónica. Las tónicas `m9`, `m6` y `mMaj7` tampoco establecían contexto menor para comprobar su dominante.
2. `C–F#7–Bm7` producía una dominante secundaria diatónica de Si en Do porque Bm7 tiene tres notas de Do mayor (Si, Re y La). Sin embargo, su tríada contiene Fa sostenido. Se exigía una cantidad de notas coincidentes en vez de comprobar la tríada destino. Esta corrección no niega que F#7–Bm7 pueda tonicizar Si en otro contexto: impide clasificarlo como objetivo diatónico de Do.
3. `C–D7–G7–C` omitía la tonicización de V porque el destino llevaba séptima dominante.
4. La prueba previa de transposición comprobaba cualquier etiqueta `V7/`. Ahora compara todos los eventos, destino exacto por clase de altura, posición, peso y descripción. Un destino equivocado ya no basta para pasar.

## Criterio aplicado

Las extensiones preservan una identidad triádica posible; su función sigue dependiendo del contexto. Se amplían las familias explícitas de tónica y predominante, y se reconoce la novena dominante. Para las dominantes secundarias se comprueba que fundamental, tercera y quinta justa del destino pertenezcan a la escala de referencia. Una séptima o novena no sustituye una nota estructural ausente.

La etiqueta existente `V7/` representa el núcleo funcional de séptima dominante, incluso cuando el cifrado incluye novena; no se altera el símbolo introducido. No se extiende esta revisión a todas las dominantes sin séptima, a tonicizaciones cromáticas ni a la conducción de voces de novenas. Esas áreas requieren comprobación propia.

## Verificación

- 20 nuevos escenarios sintéticos × 12 transposiciones = 240 comprobaciones: funciones con extensiones, destinos exactos, contexto menor y controles negativos.
- Conservación de la progresión original y de cada entrada transpuesta.
- Repetición de los 22 escenarios anteriores × 12 = 264, ahora con comparación completa de eventos.
- El nuevo archivo `tests/extended-harmonic-functions.cjs` se incorpora al flujo de integración continua.

Las cifras cuentan pruebas estructurales relacionadas por transposición, no obras independientes, juicios estéticos ni participantes humanos. La interfaz y el control artístico del usuario se mantienen. Sin MIDI en la web.

## Fundamentación consultada

- Cser y Wanner, *Harmony and Musicianship with Solfège*, capítulo 30: extensiones de dominante, predominante y tónica. Texto consultado; no se presenta como transcripción propia de los ejemplos insertados: https://pressbooks.pub/harmonyandmusicianshipwithsolfege/chapter/the-development-of-9th-11th-and-13th-chords/
- *Open Music Theory*, Tonicization: tríadas mayores y menores como objetivos. El buscador permitió recuperar el contenido pertinente; la apertura directa devolvió 403: https://viva.pressbooks.pub/openmusictheory/chapter/tonicization/

## Pendiente real

La validación documental y computacional sigue sin demostrar semejanza estilística ni utilidad perceptiva. El próximo corpus de partituras debe registrar edición, compases y transcripción verificable; no debe confundirse con estas pruebas sintéticas. Los 17 avisos de paralelismos de la simulación anterior siguen siendo advertencias estilísticas para revisar, no fallos eliminados en esta fase.
