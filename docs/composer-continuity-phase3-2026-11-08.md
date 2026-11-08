# Cinemático Studio — Continuidad armónica observable (fase 3)
Fecha: 8 de noviembre de 2026.

## Objetivo
Hacer que las 22 rutas inspiradas en perfiles de 11 compositores sean **evaluables** y **útiles** para componer, sin pedir formación armónica avanzada ni inventar información melódica que una cifra de acorde no posee.

## Mejora incorporada
Cada camino del panel «Lenguaje de referencia» incluye:
- Acuerdos y enlaces por la tonalidad escogida, siempre independientes de «Tu progresión».
- Recuento verificable de enlaces entre acordes que **comparten al menos dos clases de altura**, sin llamarlos conexiones de voz reales.
- Indicación descriptiva de si el último acorde vuelve a la fundamental de partida (sin afirmar que hay cadencia) o acaba sobre otra fundamental (sin concluir modulación).
- Desplegable «Qué cambia entre los acordes» con la conservación exacta de notas y, cuando existe una transformación de tríadas válida, marca **P, L o R** en la propia transición.
- Bloque «Para elegir» que compara los dos caminos a partir de criterios **descriptivos**, sin valoraciones de calidad, rankings o parecidos a autor.

### Horner: verificación de PLR
En Do como raíz de la referencia menor:
- **P**: `Cm → C`, `E♭ → E`, las otras dos notas permanecen.
- **L**: `C → Em`, `C → B`, las otras dos notas permanecen.
- **R**: `Em → G`, `E → D`, las otras dos notas permanecen.

La segunda ruta ofrece **R–L–P**, también contrastada. No se afirma reproducir la red L/R/S de un cue específico de *A Beautiful Mind*; es una herramienta de exploración inspirada en la existencia de redes de transformaciones en el análisis publicado por Frank Lehman.

## Diagnóstico técnicamente limitado
La función `composerRouteInsights` usa conjuntos de clases de altura (0–11), no un reparto entre violines, violas, violonchelos o voces. Si detecta una variación única de nota, no indica octava, duración, articulación, inversión ejecutada, melodía ni dirección real de una voz. Una «nota común» puede no mantenerse entre registros en la interpretación concreta.

La identificación P/L/R solo se devuelve cuando:
1. Los dos acordes son estrictamente tríadas mayores o menores de tres clases.
2. La relación de raíces y calidad coincide con la transformación calculada por el motor.
3. Las clases de altura de la tríada de destino coinciden exactamente.

Los acordes extendidos y los enlaces cromáticos genéricos **no se etiquetan** P/L/R por semejanza superficial.

## Pruebas y resultados
- `tests/composer-continuity-regression.cjs`: 11 perfiles × 2 rutas × 12 transposiciones = **264 rutas** con **816 enlaces**, de los que **228** cumplen operaciones P/L/R verificadas. Estos números describen tests computacionales sobre ejemplos preestablecidos, no un corpus representativo de obras.
- También comprueba que la conservación de notas coincide con la intersección de clases; que no se editan los perfiles originales; que Horner identifica P–L–R y R–L–P; que un acorde extendido no recibe falsamente la etiqueta P/L/R y que el final Newman alterna regreso al centro y terminación sobre otra fundamental.
- `tests/browser-smoke.cjs` valida el panel y la expansión de detalles de Horner, preservación de los acordes del usuario, pruebas de compositor/tonalidad y la interfaz en **1280 px** y **390 px**.
- GitHub Actions completó con éxito los tests de rama antes de fusionar.

## Evaluación artística pendiente (no sustituible por pruebas)
No se ha realizado evaluación auditiva ciega con compositores humanos. Las mediciones «notas comunes», «fuera del modo» y «regreso a la raíz» describen **hechos armónicos parciales**, no belleza, interés artístico, semejanza de estilo ni idoneidad para una escena. La fase siguiente debería recabar juicios humanos en contextos ficticios definidos y registrar ejemplos rechazados, antes de ajustar la prioridad de las recomendaciones.

## Compatibilidad
No cambia el sistema de guardar las progresiones del usuario, ni introduce MIDI en la web. La visualización complementa el área de lenguaje independiente y usa un detalle desplegable para evitar sobrecarga didáctica. Se incrementó versión de PWA de v30 a v31.
