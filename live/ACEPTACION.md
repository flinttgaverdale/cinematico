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

Genera el dispositivo de diagnóstico con
`python3 live/build_amxd.py --diagnostic DIRECTORIO`. El archivo
`Cinematico-Generator-Diagnostico.amxd` conserva la salida del generador
y añade una línea `CINEMATICO_DIAGNOSTIC` por mensaje recibido. Ábrelo en
un proyecto de prueba con notas sintéticas. El registro incluye el contenido
del diccionario entregado por el host cuando está disponible.

Para cada caso anterior, adjunta la línea de la consola, el hash del archivo,
las versiones de Windows, Live y Max, y el estado del editor MIDI antes y
después de Aplicar y de un único Deshacer. Señala explícitamente si el clip
era de 4/4 o 3/4. Anota el inicio y fin de la selección. Evita incluir
progresiones privadas, nombres de proyectos y pistas de trabajo.

El dispositivo de diagnóstico permite comprobar qué campos, unidades y
límites entrega la versión real de Live. El dispositivo de distribución
conserva el comportamiento actual en 4/4 y se genera sin diagnóstico. La
aceptación de la selección y la adaptación a otros compases quedan abiertas
hasta disponer de esos mensajes y del resultado observado en el clip.
