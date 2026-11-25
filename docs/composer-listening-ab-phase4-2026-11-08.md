# Cinemático Studio — Comparación sonora A/B y evaluación de resolución (8 noviembre 2026)

## Objetivo
Facilitar una **escucha exploratoria**, opcional y no automática, de los dos caminos originales de cada compositor sin simular un estilo orquestal ni alterar el material que escribe el usuario. Evitar que una regla de contrapunto se aplique con la misma severidad a un acorde clásico de tónica que a un color de séptima mayor contemporáneo.

## Investigación y decisión de diseño
- En el tratamiento tonal académico de séptimas de dominante, la séptima del V7 tiende a descender por grado y la sensible suele resolver ascendentemente, de forma muy destacada cuando aparece en soprano.
- En una tónica **maj7** contemporánea, la sensible de la tonalidad sigue siendo parte de la sonoridad de llegada; **mantener una nota común** en una voz puede ser una decisión válida de color, no siempre un error.
- Por eso `tendencyResolution` distingue ahora entre `classical` (alerta de sensible sin resolución) y estilos `cinematic`, `minimal` o `sustained` (si se mantiene exactamente el sonido de la séptima mayor del acorde de destino, no se penaliza ese enlace). **No se elimina la alerta** para `G7 → C` cuando la sensible no se resuelve.
- La advertencia de voces a tres partes `harmonicResolutionDiagnostics` ahora exige dominante **séptima explícita**, para no tratar un `I(add9) → IVmaj7` como una falsa dominante aplicada.
- No se convierte el destino `Cmaj7` en `C`, no se elimina su séptima, no se reescribe la progresión, ni se anuncia una cadencia auténtica perfecta que requiera un análisis de frase y melodía.

Fuentes:
- <https://musictheory.pugetsound.edu/mt21c/VoiceLeadingSeventhChordsIntro.html>
- <https://resources.lukecarlsonmusic.com/theory1-chapter10/>
- <https://online.berklee.edu/takenote/voice-leading-for-guitar/>

## Prototipo funcional de escucha A/B
En «Lenguaje de referencia» se incluyen dos botones **Escuchar** (uno por ruta) y **Detener**. La reproducción se activa **exclusivamente al pulsar**, nunca automáticamente.

`composerListeningPlan` usa el realizador de cuatro voces existente y construye datos de reproducción deterministas. El navegador usa **Web Audio** con ondas triangulares y el mismo contorno básico de ganancia en todos los ejemplos. No requiere librerías externas, subida de audio ni conexión MIDI.

### Controles deliberados
- Mismo sintetizador, misma forma de onda, mismo nivel programado por voz, misma duración total: **8 segundos**.
- Misma estrategia de disposición de voces (`cinematic`) y una realización real del cifrado de cada ruta.
- Mismo número de voces: cuatro. El usuario puede interrumpir, alternar A/B o cambiar de compositor/tonalidad, lo que detiene la reproducción anterior.
- Las rutas se distinguen por **acordes, colores y enlaces**; no se añade una instrumentación supuestamente «a la manera de» ningún autor.

### Limitaciones importantes
- Si A tiene 3 acordes y B tiene 5, **la duración total es la misma pero la duración individual de cada acorde cambia**. Por tanto, esto no es un estudio psicométrico que aísle exclusivamente el factor armónico.
- Las ondas triangulares y los cuatro registros elegidos por un optimizador no sustituyen una interpretación de cuerdas o piano real, y pueden afectar al juicio perceptivo. Volumen por voz idéntico tampoco implica igual sonoridad percibida.
- El usuario puede ver las etiquetas y progresiones; **no es una comparación ciega**, no recoge datos de participantes ni puntúa originalidad o calidad estética.
- El procedimiento es adecuado para **escuchar alternativas** en el flujo creativo; todavía no sirve para afirmar que una propuesta «suena a Horner» o que una vence a otra.
- No hay análisis MIDI en la web, coherente con la separación de objetivos web/Ableton.

## Cobertura técnica
- **264 planes**: 11 compositores × 2 caminos × 12 fundamentales.
- Cada plan confirma frecuencias positivas reales, duración total de 8 s, igual cantidad de voces, inmutabilidad de los acordes y falta de reproducción en entradas inválidas.
- Contraejemplos `G7 → Cmaj7` con Si mantenido en estilo cinematográfico frente a alerta académica clásica, `G7 → C` sin resolver y `Cadd9 → Fmaj7` no clasificado falsamente.
- Pruebas Playwright para arranque/parada A/B, liberación de recursos al cambiar de tonalidad y preservación de material, en escritorio y móvil.
- Se actualiza el caché PWA para evitar retener una versión anterior del motor.

## Protocolo de escucha con participantes

Estado: preparado para pilotaje. Usa las simulaciones como control de
integridad y los casos de `research/expressive-listening-pairs-v1.json` como
hipótesis. Registra antes de reclutar el commit, los casos elegidos, las
preguntas, el número previsto de participantes, los criterios de inclusión y
la regla para cerrar la recogida.

1. Pide consentimiento antes de cada sesión. Explica finalidad, duración,
   conservación de los datos y cómo retirarse. Recluta compositores
   voluntarios. Usa un código aleatorio por persona y guarda por separado
   cualquier dato necesario para el consentimiento.
2. Exporta una realización fija para cada caso. Usa la misma progresión
   inicial, instrumento, tempo, duración por acorde, política de registro y
   sonoridad comparable. Identifica los archivos por códigos neutrales y
   registra el commit y SHA-256 de cada estímulo. Añade un par idéntico como
   control negativo y analiza sus respuestas de forma separada.
3. Alterna los órdenes A/B y B/A entre participantes y baraja el orden de los
   casos. Usa auriculares a un volumen cómodo. Oculta compositor, cifrado y
   etiqueta expresiva. Incluye pausas y permite escuchar cada par de nuevo.
4. Pide utilidad para una escena o continuación concreta, con opciones
   «A», «B», «ambas por igual», «ninguna» y «omitir». Pregunta por la
   razón musical de la elección antes de mostrar etiquetas. En la segunda
   ronda, pregunta por la relación con la intención como valoración distinta
   de la preferencia.
5. Conserva los campos `participante_codigo`, `caso`, `orden`, `eleccion`,
   `utilidad`, `interpretacion` y `repeticiones`. Evita datos personales e
   información musical identificable en los comentarios. Publica resultados
   agregados, con denominadores, omisiones, control negativo y limitaciones.
   Distingue lo que una persona oyó de lo que elegiría para componer.

La prueba automatizada comprueba la estructura de los 15 diseños y sus
progresiones. La ejecución con participantes y sus resultados siguen pendientes.
