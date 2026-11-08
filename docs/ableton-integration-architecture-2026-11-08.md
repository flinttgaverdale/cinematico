# Cinemático Studio — estrategia de integración en Ableton Live 12 Suite / Windows
**Fecha:** 8 de noviembre de 2026. **Estado:** arquitectura técnica contrastada con documentación oficial; no se ha construido ni probado aún un .amxd ejecutable dentro de Live.

## Objetivo de producto
Convertir Cinemático en un **asistente de exploración armónica** mientras la persona compone en Live. Conservar su idea, mostrar tres posibilidades, permitir audición/elección y solamente insertar notas bajo acción explícita. Sin composición automática ni modificación silenciosa del clip. El modo web sigue sin edición MIDI.

## Vías técnicamente disponibles
1. **Max for Live MIDI Effect** (interfaz de composición): puede convivir en una pista MIDI, ofrecer controles de tonalidad, intención, referencia, sugerencias y escucha previa. El acceso al Live Object Model permitiría observar información del proyecto/clip cuando corresponda; cualquier edición se decide después de analizar permisos y semántica de selección. Necesita prototipo dentro de Live.
2. **Max for Live MIDI Tool Generator/Transformation** (edición de clip MIDI): Live 12 los incorpora en los paneles Generate/Transform del editor. `live.miditool.in` recibe un diccionario de notas y otro de contexto; `live.miditool.out` devuelve el resultado al clip. Son tipos de dispositivo propios: estos objetos **no funcionan** dentro de un MIDI Effect convencional. Un Generator serviría para insertar tres acordes seleccionados, una Transformation para reharmonizar una selección ya existente.
3. **Separación del motor**: portar la lógica musical pura de `engine.js` a un módulo sin DOM/Web Audio; usar la misma lógica para web y Max. Para la integración de JavaScript, `v8` / ES6+ de Max es más apropiado que el antiguo `js` (requiere prueba de compatibilidad real). Evitar `node.script` dentro de MIDI Tools, por el ciclo de aplicación síncrono.

## Fase recomendada (sin construir aún el plugin definitivo)
**Fase A — Instrumento de ideas.** Crear dispositivo de Max MIDI Effect de interfaz compacta para elegir tonalidad/centro de referencia, intención y tres caminos. Escucha simple opcional; no escribe en clips. Validación funcional: que la selección produzca las mismas tres propuestas que en la web para acordes textuales, sin conexión externa.

**Fase B — Clip Generator explícito.** Crear una herramienta de generación `.amxd` a partir de la plantilla oficial. Recibir contexto de clip con `live.miditool.in`, construir un dict `{notes:[{pitch,start_time,duration,velocity,...}]}`, transferirlo a `live.miditool.out`. Validar las unidades temporales, la región de clip y las selecciones **en Live**, no deducirlas del nombre de una propiedad. Probar con un clip de prueba antes de tocar un proyecto real.

**Fase C — Comprensión del material MIDI.** Leer acordes de un clip como hipótesis: segmentar notas simultáneas o solapadas, contemplar inversiones, acordes arpegiados, melodía y notas de paso; no confundir todas las notas de una pista con un acorde único. Exponer ambigüedad y permitir corrección manual. Evitar diagnosticar emoción a partir de MIDI.

**Fase D — Rearmonización reversible.** Transformation únicamente sobre una selección; comparar voz superior, bajo y voces intermedias; conservar melodía/bajo por defecto como restricciones, presentar antes y después. Trabajar con selección y Undo/Redo. El botón «Generar» debe ser una acción deliberada.

**Fase E — Repertorio instrumental.** Añadir realizaciones orientativas para piano, guitarra y cuerdas con control de registro y distancias, sin igualar cifrado con un voicing profesional. No incorporar automáticamente CC1/CC11, vibrato o legato: el proyecto específico de expresividad de cuerdas es un módulo complementario separado.

## Riesgos y mitigaciones
- **Sobrescribir notas:** las herramientas MIDI modifican contenido; usar material duplicado para las primeras pruebas, no activar escritura automática por defecto en los prototipos. Verificar el comportamiento concreto de Generate frente a Transform y aplicar explícitamente.
- **Confundir entrada con salida:** usar datos del clip solo si están disponibles y tienen sentido. Si no existe material, ofrecer entrada manual/tono de referencia, no inferir progresión.
- **Latencia y bloqueo:** MIDI Tools exige el ciclo de interacción de `live.miditool.in/out`; no usar procesos Node asíncronos como dependencia del resultado.
- **Compatibilidad:** validar Max v8 con el motor modularizado (las APIs web como `document`, localStorage y Web Audio deben quedarse en el anfitrión web).
- **Fidelidad armónica:** normalizar pitch classes, equivalencias enarmónicas, tempo, compás y posiciones rítmicas; mantener separado el cifrado simbólico de las notas concretas del piano roll.
- **Claridad de UX:** no pedir que se escriba una progresión para investigar las referencias o compositores. La acción musical del usuario decide la edición.

## Contrato preliminar (no es una API implementada)
Entrada al núcleo:
```json
{
  "source": {"type": "chords", "labels": ["Am","F","C","G"]},
  "intent": "esperanza",
  "constraints": {"preserveOriginal": true, "maxNewChords": 3},
  "host": "ableton-live-12"
}
```
Salida del núcleo: tres caminos con cifrados, explicación de enlace/giro/llegada, advertencias de ambigüedad y sin datos MIDI todavía. El adaptador MIDI convierte **solo el camino elegido** en notas/tiempos a partir del contexto del clip.

## Fuentes oficiales verificadas
- Ableton Live 12 — MIDI Tools: https://www.ableton.com/en/live-manual/12/midi-tools/
- Ableton Live 12 — Max for Live: https://www.ableton.com/en/live-manual/12/max-for-live/
- Cycling '74 — Max for Live MIDI Tools: https://docs.cycling74.com/userguide/m4l/live_miditools/
- Cycling '74 — live.miditool.in: https://docs.cycling74.com/reference/live.miditool.in
- Cycling '74 — live.miditool.out: https://docs.cycling74.com/reference/live.miditool.out
- Cycling '74 — JavaScript (Max): https://docs.cycling74.com/userguide/javascript/
- Cycling '74 — v8: https://docs.cycling74.com/reference/v8/
