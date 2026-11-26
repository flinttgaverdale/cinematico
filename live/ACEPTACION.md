# Aceptación de Cinemático en Live 12 Suite

Estado inicial: pendiente de ejecución en Windows. Registra versión exacta de
Live y Max, versión de Windows y SHA-256 del AMXD. Usa un proyecto de prueba y
conserva capturas del editor MIDI y del registro de Max.

1. Copia el AMXD a User Library, ábrelo en el panel de generadores MIDI y
   verifica que los controles y textos quepan en el panel a 350 px. Confirma
   que la consola de Max esté libre de errores al cargar el JavaScript.
2. Crea un clip vacío en 4/4. Para cada camino de `Am F C G`, comprueba que
   editar el texto o el selector no escriba notas. Pulsa Aplicar y registra
   alturas, inicios, duración y velocidad. Deshaz cada aplicación.
3. Repite con un clip que ya tenga notas. Registra las notas existentes antes,
   después de Aplicar y después de Deshacer. Repite con entrada `H` y
   comprueba que esa entrada no añada notas.
4. Repite con 3/4 y una selección que empiece en el pulso 8. Registra el
   diccionario que entrega el host y el efecto de aplicar dos veces. Si se
   producen notas fuera de la selección, registra el caso como fallo.
5. Contrasta novenas de rutas reales con el editor MIDI. Si el generador
   auditado aún no ofrece bajos slash y extensiones de cinco notas en sus
   rutas, usa una compilación de prueba temporal que emita esos casos y
   registra su hash por separado.
6. Adjunta resultados y capturas por caso. Mantén pendiente todo caso que no
   se haya ejecutado en el host.

Usa estas observaciones como contrato para el PR de compás, selección y
reversibilidad. La simulación JavaScript permite comprobar las notas generadas
pero no determina cómo Live procesa el diccionario ni el historial de Undo.

## Evidencia necesaria para el adaptador de selección

En una copia local de revisión, registra en la consola qué mensaje llega de
`live.miditool.in` cada vez que se pulsa Aplicar. Si llega a
`msg_dictionary(payload)`, añade temporalmente antes de `applyToClip()` la
línea siguiente en `cinematico-generator.js` y vuelve a empaquetar esa copia:

```js
post(JSON.stringify(payload, null, 2) + "\\n");
```

Usa notas sintéticas y comparte una muestra por caso. Si el host llama a
`dictionary(name)` o `bang()`, indica la ruta que observaste. En Max también
puedes añadir un `print` en paralelo a la salida de `live.miditool.in` para
identificar el mensaje. Conserva los nombres, unidades y valores originales de
los campos de tiempo, compás, selección y límites del clip que entregue el
host. Registra cuáles faltan. Anota el número de notas y sus posiciones después
de Aplicar y después de una sola operación Deshacer, tanto con selección vacía
como con notas existentes.

Retira el registro temporal antes de generar un AMXD para revisión final.
