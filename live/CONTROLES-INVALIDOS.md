# Controles inválidos al aplicar MIDI

La aplicación se bloquea si un mensaje establece un camino fuera de 1–3 o un
matiz desconocido. Seleccionar un valor válido restablece la aplicación. La
regresión envía los mensajes directamente a JavaScript y comprueba las notas
emitidas. En Max, envía los mismos mensajes a una copia del dispositivo y
comprueba el aviso y la ausencia de notas nuevas al pulsar Aplicar.
