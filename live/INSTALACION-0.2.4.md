# Cinemático Generator 0.2.0-beta.4

Usa `Cinematico-Generator-Beta-0.2.4.amxd` en Ableton Live 12 Suite con Max for Live. El archivo incluye el motor y el adaptador MIDI.

1. Configura una pista MIDI con un instrumento virtual y crea un clip vacío de tres compases en 4/4.
2. Añade la carpeta del AMXD a **Lugares** y selecciona el generador desde el panel **Generar** del editor MIDI. También puedes guardarlo en `User Library/MIDI Tools/Max Generators`.
3. Escribe `Am F C G`, pulsa **Actualizar** y selecciona la intención y el recorrido. **Ver camino** muestra el cifrado. **Aplicar**, en el panel de Live, escribe las notas en el clip.
4. Reproduce el clip con el instrumento de la pista y comprueba que las notas terminan antes del siguiente compás. Usa Ctrl+Z para volver al clip vacío.

Se verificaron el contenedor, el motor compartido, la geometría de 350 × 318 y la salida MIDI mediante simulación. La carga en Live, el funcionamiento en Windows, el comportamiento con un clip que ya contiene notas y la interacción con instrumentos virtuales requieren aceptación en el host. El cálculo actual utiliza 4/4 desde el inicio del clip. Usa un proyecto de prueba y registra la versión de Live y Max con el SHA-256 del dispositivo. [Protocolo de aceptación](https://github.com/flinttgaverdale/cinematico/blob/design/instrumento-industrial-v2/live/ACEPTACION.md)
