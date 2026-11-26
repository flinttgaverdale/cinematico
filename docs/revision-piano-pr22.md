# Revisión de piano offline · PR #22

La PR #22 comparte un sintetizador aditivo entre Crear y la escucha de
Inspiración. Sus seis parciales, envolvente de ataque y decaimiento dependiente
del registro, ganancia común y compresión se ejecutan en Web Audio. Se conservó
esa implementación y su caché versionada. No requiere muestras ni descargas.
La interfaz indica «piano sintetizado».

La prueba de navegador anterior fallaba con el código de la PR porque su
adaptador simulado no modelaba el compresor, la rampa exponencial ni la
frecuencia de muestreo. Se actualizó para comprobar inicio, alternancia y cierre
de las sesiones con seis parciales por voz.

La prueba `tests/piano-audio-render.cjs` renderiza el sonido a 44,1 y 48 kHz
en un OfflineAudioContext real. Comprueba silencio antes del ataque, descenso
de nivel, cola audible, silencio posterior y comparaciones de ocho segundos.
Los picos de las tres secuencias medidas se mantuvieron aproximadamente entre
0,264 y 0,270 a escala completa, incluidos acordes con bajo slash. Para dos
secuencias similares el nivel RMS quedó dentro de 6 dB. Son controles de señal
y tiempo. La semejanza con un piano acústico y la preferencia por el timbre
requieren escucha humana. No se incorporaron muestras de licencia sin revisar.
