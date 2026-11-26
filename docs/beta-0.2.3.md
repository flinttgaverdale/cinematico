# Cinemático Studio · beta 0.2.0-beta.3

La web y la PWA incorporan los once lenguajes de referencia, la escucha con piano sintetizado y la identidad oscura con tipografía local. La caché web v65 instala el conjunto completo de recursos. Si sigues viendo el diseño anterior, abre la página de actualización y pulsa **Actualizar y abrir**. El estudio muestra `0.2.0-beta.3` al pie de la página. [Actualizar Cinemático](https://flinttgaverdale.github.io/cinematico/actualizar.html)

El Estudio avanzado abre directamente el selector de áreas. Las ayudas se consultan en los desplegables de cada herramienta.

## Descargas

- [APK firmado para Android 8.0 o posterior](../downloads/Cinematico-Android-Beta-0.2.3.apk)
- [AMXD para Ableton Live 12 Suite](../downloads/Cinematico-Generator-Beta-0.2.3.amxd)
- [ZIP con las fuentes de Max for Live](../downloads/Cinematico-Live-Preview-0.2.3.zip)
- [ZIP de la versión web](../downloads/Cinematico-Web-0.2.3.zip)
- [Sumas SHA-256](../downloads/SHA256SUMS-Cinematico-0.2.3.txt) y [procedencia](../downloads/Cinematico-Beta-0.2.3-build-info.json)

## Comprobaciones

Pasaron 33 comandos técnicos y seis pruebas de navegador, incluidas las vistas responsive, la actualización atómica de la PWA y el render de audio. El generador de Max for Live empaqueta el motor web y su adaptador CommonJS. El empaquetador actualiza también el ZIP de fuentes a partir de la misma revisión.

El APK beta firmado conserva el identificador `io.github.flinttgaverdale.cinematico.beta02` y el certificado de la beta 0.2 anterior. El código de versión pasa de 2 a 3. Los 15 recursos del APK coinciden byte a byte con los del commit de compilación. La instalación, la actualización y el audio en Android físico quedan pendientes. El AMXD pasó la inspección estructural y la simulación de 270 planes MIDI. Falta comprobarlo dentro de Ableton Live 12 Suite.

## Descargas anteriores y vuelta atrás

La beta anterior conserva sus archivos y su documentación. Para volver a la web anterior, restaura sus archivos desde `aa8538d` en un commit nuevo y aumenta el número de caché y el registro a v66. Esto conserva el historial y permite a las PWA instaladas detectar la restauración. [Beta 0.2 anterior](beta-0.2.md)
