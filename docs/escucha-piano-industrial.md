# Escucha pianística en Industrial Studio

Se conserva el piano aditivo local de ocho parciales por nota. La escucha neutra usa la misma disposición, ganancia y envolvente, con 2 s por acorde en Crear y 8 s por frase o 2 s por acorde en Inspiración. La escucha interpretada usa las mismas armonías y duración total. Cambia registro, ataques, articulación y dinámica según el ejercicio, con ligadura de notas idénticas en la misma voz donde procede. Son realizaciones orientativas.

Antes, Detener cerraba el contexto al instante y podía cortar una muestra durante su ataque o caída. La salida ahora cae a cero durante 40 ms y después se libera el contexto. Los botones responden en el momento. Si el navegador rechaza la activación de audio, se restablece el botón y se informa del fallo. Una promesa vencida de otra escucha no modifica el estado de la escucha vigente.

`tests/piano-audio-render.cjs` usa Web Audio a 44,1 y 48 kHz. Verifica ataque, envolvente, cola, silencio, parada durante una nota, nivel y duración de las once realizaciones interpretadas, además de las comparaciones neutras. `tests/contextual-composer-browser.cjs` verifica alternar y detener, y reproduce un rechazo del host. Son comprobaciones de señal y estados. La naturalidad tímbrica y el balance percibido requieren escuchar los WAV y hacer pruebas con músicos.
