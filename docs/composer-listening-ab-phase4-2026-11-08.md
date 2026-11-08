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

## Siguiente evaluación humana real (pendiente)
1. Presentar dos rutas y un control a varios compositores sin atribuciones visibles, generando realizaciones con **igual duración por acorde, mismo registro, misma instrumentación y loudness** cuando se quiera aislar la armonía. Si cambia la longitud, seleccionar un subfragmento compatible o ajustar el diseño experimental sin sesgar la elección.
2. Hacer varias rondas con orden aleatorizado, descansos y una opción «ninguna».
3. Preguntar por utilidad para su escena, interés de continuación, sensación de dirección y posibilidad de desarrollo, dejando explícita la subjetividad del juicio.
4. Anotar contexto y tamaño muestral antes de inferir preferencias, y separar la evaluación de armonía de futuras pruebas de orquestación, ritmo y melodía.
5. No convertir puntuaciones humanas de un grupo pequeño en una etiqueta automática de autor o emoción.

**Esta fase entrega una herramienta de audición exploratoria y mejores diagnósticos. No se ha realizado el estudio perceptivo humano.**
