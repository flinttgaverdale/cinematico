# Auditoría de continuación armónica — 2026-11-05

## Objetivo y entrega
Separar reinterpretación de los acordes existentes de continuación después del último acorde. Se implementó harmonicContinuations(chords), se exportó en el motor y se añadió un desplegable opcional «¿Y después? Continuar tu progresión» en la interfaz. Cada propuesta añade tres acordes sin modificar el material de entrada. Caminos: región menor, cambio de tercera paralela y región cromática.

## Pruebas realizadas
- Seis progresiones de prueba: C–G–Am–F; Am–F–C–G; Cm–Ab–Fm–G; Cmaj7–Dm7–G7–C; C; C–F#–C–G.
- Tres propuestas por entrada, cada una de tres acordes; todas con tres medidas de distancia entre clases de altura y tres listas de notas comunes; sin mutación del original.
- Entrada vacía: cero propuestas.
- Sintaxis JavaScript de la página: válida.
- Archivo reproducible: tests/harmonic-continuations.test.js.
- No se han ejecutado pruebas end-to-end en navegador ni el runner CI.

## Hallazgos musicales críticos
1. La etiqueta «melancolía» es una **intención de exploración**, no resultado emocional demostrable; el motor no conoce melodía, tempo, textura, registro ni acentos.
2. «Centro menor relativo» solo es una relación relativa inequívoca para un acorde mayor de referencia: se corrigió el texto para no afirmar parentesco relativo cuando el último acorde es menor.
3. Las trayectorias se construyen a partir del último acorde, no de una inferencia de tonalidad global. Dos progresiones que terminan en G obtienen las mismas continuaciones. **Esta es la principal limitación musical pendiente**: para mejorar, el sistema debe considerar los últimos 2–4 acordes, la posible tonalidad, notas comunes y conducción.
4. La tercera trayectoria puede sonar abrupta: debe presentarse como alternativa experimental, no como solución garantizada ni como rasgo exclusivo de Elfman.
5. La ortografía enarmónica todavía es simplificada (p. ej. Dbm, Gbm). No asumir que los nombres de acorde son la grafía teórica óptima.
6. La trayectoria de «cambio de color» repite un acorde de llegada, lo que puede producir una prolongación útil o una propuesta trivial según el contexto.
7. Las métricas de movimiento son clases de altura, no voces reales.
8. No se modela duración, modulación funcional confirmada, ni cambios de tema/melodía; no hay MIDI en web.

## Auditoría técnica
- El motor devuelve objetos sin mutar el array de entrada y la UI escapa los textos antes de renderizarlos.
- El desplegable evita sobrecargar la pantalla principal.
- No se verificó accesibilidad con lector de pantalla, diseño móvil ni rendimiento con 16 acordes en navegador.
- La función no se ha publicado en la preview de pruebas externa.

## Próximo criterio de aceptación
Puntuar y filtrar continuaciones usando al menos los últimos dos acordes, detectar repeticiones poco informativas, mejorar grafía enarmónica y permitir elegir intención sin confundir emoción con función tonal. Después ejecutar CI y pruebas visuales antes de publicar.
