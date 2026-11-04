# Cinemático Studio — arquitectura y criterios de validación

## Estado y límites
Esta aplicación es una herramienta exploratoria para el compositor, no un compositor automático ni un corrector definitivo de contrapunto. La progresión original no se modifica. Las recomendaciones estilísticas son heurísticas y **no** constituyen un modelo contrastado con un corpus de partituras.

## Estructura actual
- `index.html`: datos musicales de referencia, interfaz, estilos y controladores. La separación de responsabilidades es todavía una deuda técnica.
- `engine.js`: análisis de alturas y armonía, realizaciones de tres y cuatro voces, diagnósticos y asistencia.
- `tests/harmony.test.cjs`: pruebas de regresión del motor y comprobaciones estáticas de interfaz.
- `service-worker.js`: caché de la aplicación.

El cálculo de caminos óptimos para tres y cuatro voces comparte `optimizeVoiceLayers`; cada plantilla mantiene sus propias disposiciones y reglas de puntuación. No se ofrece quinta voz.

## Interpretación musical
1. Los paralelismos perfectos son advertencias según el criterio clásico; en música cinematográfica se presentan como observaciones.
2. La sensible y la séptima se evalúan en una relación dominante–tónica identificada mediante raíces y estructura interválica. No se afirma que ese detector reconozca todas las dominantes secundarias, reinterpretaciones o funciones contextuales.
3. Tres voces priorizan bajo, tercera y séptima cuando un acorde contiene cuatro notas distintas. Puede omitirse la quinta, pero esto no equivale a una orquestación terminada.
4. El motor trabaja con alturas MIDI y clases de altura. No incorpora todavía ritmo, articulación, instrumentación, dinámica, melodía aportada como MIDI, suspensiones temporizadas ni análisis de partituras reales.
5. Los nombres de compositores sirven como referencias de exploración, no como atribuciones musicológicas demostradas.

## Rendimiento y fiabilidad
El algoritmo de programación dinámica evalúa transiciones entre disposiciones adyacentes. El coste crece aproximadamente con la suma de los productos de tamaños de capas sucesivas. El motor de cuatro voces limita actualmente la generación de candidatos a 650 y devuelve hasta 300, lo que introduce un sesgo por orden de enumeración. Es una limitación conocida: no garantiza encontrar la mejor disposición entre **todas** las posibles.

Las pruebas de 12 acordes muestran tiempos de ejecución en GitHub Actions; no equivalen a mediciones de rendimiento de navegador o teléfono. Antes de optimizar, hay que medir en dispositivos reales, especialmente progresiones de 16 acordes.

## Próxima validación
- Comparar los diagnósticos con ejemplos concretos y documentados de partituras; separar observación verificable, interpretación y sugerencia.
- Probar navegación con teclado, lector de pantalla, móvil y escritorio, incluyendo cambios de plantilla y modo.
- Medir latencia y consumo de memoria en navegador; evaluar cálculos diferidos si bloquean la interfaz.
- Separar progresivamente datos, lógica de presentación y motor sin cambiar la experiencia visual.
- Añadir pruebas de inversión, conducción de voces, resoluciones contextuales, entradas inválidas y actualización de caché.

Los cambios deben permanecer en `feature/cinematico-studio-v1` hasta aprobación expresa para integrarlos en la rama principal.
