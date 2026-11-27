# Acabado de Industrial Studio

Base de revisión `1f25e85`. Se mantienen grafito, pantalla casi negra, cifrado marfil, naranja de acción, salvia de relación y cobre de contraste. Manrope, Inter e IBM Plex Mono se incluyen localmente.

En la rama aprobada, el editor de una sola línea ocultaba parte de `Cmaj7#11 F#m/C# DmMaj7 G7/B` a 320 px. El editor ahora crece con el cifrado en navegadores compatibles, con dos líneas iniciales en los demás. La acción de retorno de Crear conserva su significado. El ajuste también reduce el recorte de selectores en 320 px con texto al 150 %. Los nombres cortos conservan el significado de modo automático, SATB, notas comunes y soprano. Los iconos de intención cambian de posición cuando el espacio disponible se reduce y las dos acciones de escucha pasan a una columna cuando es necesario.

Los destinos armónicos muestran origen y destino en un solo display, incluso cuando sus nombres ocupan varias líneas. La trama de voces conserva su información y escala de lectura con el texto, con desplazamiento dentro del gráfico. El círculo mantiene una tónica activa en naranja y amplía sus hitboxes. El tamaño mínimo medido fue 49,33 px en la matriz de capturas. Los controles ordinarios visibles conservan el mínimo de 48 px. Los márgenes van de 20 a 40 px y recuperan 24 px a 390 px, el criterio que fallaba antes en `browser-smoke.cjs`.

La prueba de disposición cubre 15 configuraciones, incluido texto al 125 % y 150 %. Comprueba la progresión completa, el orden de teclado, las áreas táctiles y la anchura de los selectores. La caché de esta rama pasa a v72.
