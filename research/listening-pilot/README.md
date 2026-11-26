# Piloto de escucha

El kit contiene ocho comparaciones concretas sobre Am–F–C–G y un control con
WAV idénticos. Cada par mantiene el número de acordes, pulso, instrumento y
nivel RMS objetivo. La disposición se realiza con las mismas reglas de
cuatro voces. No se iguala perceptualmente la sonoridad ni se evalúa imitación.

Para generar el kit, inicia la revisión integrada en un servidor local,
apunta `CINEMATICO_TEST_URL` a la app y ejecuta
`node research/listening-pilot/render.cjs SALIDA SHA_DE_LA_APP` con Playwright
y Chromium. El render reutiliza el piano y el motor del producto. El
directorio `participante` se comparte por separado de
`clave-coordinacion.json`. El fichero `index.html` abre el formulario y no
transmite respuestas a un servidor. Si el navegador restringe archivos locales,
se puede servir la carpeta con `python3 -m http.server 4173`.

Antes de iniciar la sesión, explica objetivo, duración, conservación de datos
y retirada. Registra el consentimiento aparte de las respuestas. Conserva
solo el CSV con código aleatorio. El orden de pares se baraja y A/B se
intercambian entre grupos. Presenta una misma tarea compositiva y comparte
solo resultados agregados con el número de respuestas por opción,
omisiones y control. La clave del coordinador identifica si la opción elegida
fue el original o la variante. Interpreta el grupo 0 en el orden de
`sides` y el grupo 1 en el orden inverso.

Tras el bloque ciego, para Silvestri, Newman y Göransson propone ejecutar la
nota melódica, la resonancia y el cambio de acento en el instrumento. Recoge
si esa tarea resulta útil por separado del bloque comparativo, ya que los
acordes de esos casos no describen por sí solos la intervención. No se han
recogido datos de participantes en esta revisión.

Tras recoger los CSV, ejecuta
`python3 research/listening-pilot/aggregate.py clave-coordinacion.json RESPUESTAS/*.csv`.
El resultado valida la revisión y los grupos, separa el control y emite
recuentos agregados sin códigos de participante ni comentarios.
