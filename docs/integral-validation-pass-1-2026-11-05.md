# Validación integral — primera pasada (2026-11-05)

## Pruebas ejecutadas
- `analyze()`: 4 tónicas × 12 emociones × 11 compositores = **528** escenarios, 0 errores estructurales.
- `laboratoryVoices()`: tres y cuatro voces en los 528 escenarios = **1.056** realizaciones, 0 errores estructurales; número de acordes y transiciones consistente.
- Entrada de usuario: progresiones válidas, acordes no reconocidos, bajos ajenos al acorde y límite de 16 acordes.
- Bloqueos de voz: nota válida respetada y nota imposible rechazada con advertencia en tres y cuatro voces.
- Tests incorporados: `tests/full-analysis-voice-matrix.test.js` y `tests/input-and-voice-locks.test.js`.

## Alcance y limitaciones
Las ejecuciones de matriz se realizaron en un intérprete JavaScript aislado, no mediante clics en un navegador. Verifican la forma y estabilidad de las respuestas, no que cada decisión armónica sea estéticamente apropiada. La ejecución completa de los tests Node mediante GitHub Actions **no está confirmada**; la consulta de ejecuciones asociadas al commit no devolvió resultados (el conector solo consulta ejecuciones de pull requests).

## Próximas puertas de aceptación
1. Verificar CI Node completo con resultados de GitHub Actions.
2. Navegación real en escritorio y móvil, con teclado y zoom.
3. Comprobar guardado, recuperación y eliminación de ideas desde la interfaz.
4. Auditoría musical humana de funciones, modos, cadencias y perfiles con ejemplos contrastados.
5. Mantener las propuestas experimentales fuera de la interfaz hasta que pasen el control artístico.
