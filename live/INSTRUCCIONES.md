# CINEMÁTICO LIVE · Beta 0.1 (Windows / Ableton Live 12 Suite)

**Estado real:** código preparado y verificado en pruebas automáticas. El host Ableton/Max NO se puede ejecutar en nuestro entorno; el resultado es un **proyecto fuente de MIDI Tool Generator**, no un `.amxd` precompilado, probado o firmado. Para instalarlo definitivamente hay que guardarlo como `.amxd` desde la plantilla oficial de Live.

## Qué funciona en el prototipo
- Introducir una progresión de 1 a 8 acordes en cifrado (ejemplo: `Am F C G`).
- Elegir una de las 15 intenciones armónicas de Cinemático.
- Elegir camino 1, 2 o 3. Se usa el MISMO motor `emotionalContinuations` de la aplicación web.
- Ver los cifrados de la propuesta seleccionada.
- Al pulsar **Apply** desde la sección Generar del editor MIDI de Live, añadir tres acordes en tres compases (sin sobreescribir las notas anteriores).
- MIDI con 3–4 notas por acorde, ritmo fijo, voicing provisional; no intenta crear una composición ni controlar expresividad/orquestación.

## Pasos para obtener y guardar la herramienta `.amxd`
1. Descomprime los cuatro archivos del paquete en una carpeta de Windows, conservando juntos `Cinematico-Generator.maxpat`, `cinematico-generator.js` y `cinematico-core.js`.
2. Abre **Ableton Live 12 Suite** y crea una pista MIDI con un instrumento, por ejemplo Piano.
3. Crea un **clip MIDI vacío de al menos 3 compases**. Abre la vista de clip y su pestaña **Generar**.
4. En el selector de generadores, abre **MIDI Generator Template** y selecciona **Editar en Max**. El procedimiento está documentado por Ableton: https://www.ableton.com/en/live-manual/12/max-for-live/
5. Abre `Cinematico-Generator.maxpat` con Max (Archivo > Abrir), desbloquea con **Ctrl+E**, selecciona su contenido con **Ctrl+A** y copia con **Ctrl+C**.
6. Vuelve a la ventana de Max que pertenece a la **plantilla MIDI Generator** de Live. Desbloquéala (Ctrl+E), selecciona el contenido de la plantilla y sustitúyelo por el que acabas de copiar (Ctrl+A, Supr, Ctrl+V). *Trabaja sobre una copia de la plantilla, no sobre el original*.
7. Guarda mediante **Archivo > Guardar como...** con nombre `Cinematico Generator.amxd`. En Windows usa la carpeta dentro de tu **Librería del usuario**:
   `Documentos\\Ableton\\User Library\\MIDI Tools\\Max Generators`
   (en algunas instalaciones la sección puede llamarse `Generators`; la carpeta real es la que aparece en el navegador de Live).
8. **Copia junto al archivo `.amxd` los dos JS** `cinematico-generator.js` y `cinematico-core.js`. Max debe poder encontrarlos desde la carpeta del dispositivo. Comprueba que no haya avisos «can't find file» en la consola de Max.
9. Guarda y vuelve a Live. En la pestaña **Generar**, busca `Cinematico Generator` bajo **Usuario**. Si no aparece, añade la carpeta del dispositivo a **Lugares** en el navegador de Live y reinicia el escaneo.
10. Abre el generador. Escribe los acordes y pulsa Enter o **Actualizar acordes**; selecciona intención y camino 1–3; pulsa **Apply** para generar las notas. Usa **Ctrl+Z** para deshacer la inserción si no te convence.
11. Si lo vas a distribuir, usa **Freeze Device** desde el editor Max tras verificar que funcione: así podrás consolidar dependencias en el `.amxd`.

## Importante
- **No renombres `.maxpat` a `.amxd`**: son formatos distintos, y el dispositivo debe guardarlo Max.
- Es una **herramienta de Generar** del editor MIDI, NO un efecto que se arrastre a la cadena de efectos.
- La escucha se hace con tu instrumento de la pista de Live. Este prototipo no extrae todavía progresiones del clip automáticamente.
- No modifica la web ni importa MIDI en la versión móvil. Se usa con una pista MIDI en Ableton.
- Si no se ven las opciones, activa la vista Presentación de Max (el patcher se ha configurado para abrir en ese modo).
- Si tu Live está en español: Clip > Herramientas MIDI > **Generar**. No uses la pestaña Transformar para este primer prototipo.
- Solo para prueba con clips duplicados o vacíos. El comportamiento real de Live, el tipo de herramienta, la UI y la carga de JS deben validarse dentro de tu Windows antes de llamarlo versión estable.

## Prueba de aceptación manual
- En un clip de 3 compases, fuente `Am F C G`, `esperanza`, camino 1: deberías ver **tres bloques de acordes**, con 3–4 notas cada uno. Los cifrados indicados deben coincidir con los de la web usando la misma fuente e intención.
- Cambia a camino 2 y realiza la prueba en otro clip vacío. Debes obtener un recorrido diferente.
- Cambia el matiz a `suspense` y confirma que las descripciones y el final no prometen una resolución cerrada.
- Un texto inválido (p. ej. `H`) no debe escribir notas ni bloquear el Apply; el estado debe indicar el error.
- Pulsa Ctrl+Z para comprobar que la edición puede deshacerse.

## Próxima fase después de validar la carga en Max
1. Leer el material MIDI del clip (detección de simultaneidades, inversiones, arpegios y ambigüedades).
2. Respetar melodía, bajo, compás y registro; editar solo después de elegir una opción.
3. Mejorar la preescucha, la edición manual y las articulaciones.
4. Separadamente integrar el módulo de expresividad orquestal CC1/CC11/CC de vibrato, sin mezclar ambos objetivos.

## Referencias
- https://docs.cycling74.com/userguide/m4l/live_miditools/
- https://docs.cycling74.com/reference/live.miditool.in
- https://docs.cycling74.com/reference/live.miditool.out
- https://docs.cycling74.com/reference/v8/
- https://docs.cycling74.com/apiref/js/jsthis/
- https://help.ableton.com/hc/en-us/articles/14462716734876-Using-third-party-MIDI-Tools
