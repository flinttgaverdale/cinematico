# Estudio abierto 05 — diagnóstico de tritono implementado (2026-11-05)

## Evidencia
Scott Murphy, «The Major Tritone Progression in Recent Hollywood Science Fiction Films», *Music Theory Online* 12/2 (2006): https://mtosmt.org/issues/mto.06.12.2/mto.06.12.2.murphy.html . El artículo incluye ejemplos notados de *Star Wars* y *Star Trek II* y estudia la relación entre tríadas cuyas fundamentales están separadas por seis semitonos. **No** establece que cualquier tritono implique ciencia ficción, suspense ni influencia de un autor específico.

## Resultado de ingeniería
Añadida al motor `tritoneTriadRelations(chords)`, una función independiente que:
- Detecta solo **tríadas puras** mayores o menores consecutivas (no séptimas ni acordes extendidos).
- Exige distancia de seis semitonos entre fundamentales.
- Devuelve índices, etiquetas, calidades, si el par es mayor–mayor, notas comunes y advertencia epistemológica.
- No modifica los acordes originales ni atribuye significado dramático.
- Permanece en la API del motor; **todavía no se ha incorporado a la interfaz**.

## Pruebas aisladas ejecutadas
- C–F♯: detecta mayor–mayor.
- Cm–F♯m: detecta menor–menor.
- C–G: no detecta.
- C7–F♯: no detecta (séptima excluida).
- C–F♯–C: dos relaciones detectadas.

## Límites
Pruebas JavaScript aisladas superadas; sin prueba navegador/CI de esta modificación. La investigación de partituras accesibles para los once compositores sigue abierta. No desplegar ni confundir motor con interfaz hasta completar la integración.
