# Rediseño de Cinemático Studio

Comparación con `main` en `89753fd`. El rediseño abarca las superficies de Crear y Estudio avanzado, la presentación de los diagramas y la adaptación al teclado y al área útil de Android. El motor, los perfiles, la síntesis de piano, las muestras MIDI, el dispositivo de Ableton y las fuentes locales conservan sus archivos de origen.

## Auditoría visual

| Hallazgo | Evidencia | Decisión |
| --- | --- | --- |
| La progresión competía con la presentación de la aplicación | En la captura de 390 px, el encabezado editorial y el título de sección precedían al campo. El cifrado del campo medía 22 px. | Marca compacta, navegación con dos destinos y un único título encima del campo de progresión. Cifrado de entrada a 26 px en Inter Semibold. |
| Las explicaciones rompían la lectura de las propuestas | En escritorio, al desplegar una de las opciones, las superficies vecinas se alargaban. En móvil había que pasar por la explicación antes de encontrar la reproducción. | Acordes primero, transporte y selección a continuación, seguido por la explicación dentro del desplegable existente. Las propuestas se alinean por arriba. |
| La conducción de voces ocupaba demasiado alto antes de mostrar el diagrama | En 390 px, los tres selectores de una nota fija se apilaban y el gráfico mostraba dos acordes. Roles y leyendas quedaban en tamaños de 8–11 px en varios estados técnicos. | Plantilla y criterio a ancho completo, voz y nota en paralelo. El gráfico conserva un ancho mínimo para que se lean alturas y cifrado. Con el ejemplo de cuatro acordes se leen tres en el primer encuadre de 390 px. El resto se consulta con desplazamiento en el gráfico. |
| El círculo competía con su propia ornamentación | La geometría era vectorial y el estado seleccionado ya existía. La superficie real de interacción de cada nota era menor que la de los controles táctiles principales. | Retícula más silenciosa, centro destacado en arena y selección en salvia. El círculo visible conserva su proporción y su área táctil alcanza 44 px desde el ancho probado de 320 px. |
| Las reglas superpuestas dificultaban mantener tamaños y estados | La hoja pasó de 721 a 207 reglas CSS y de 56 a una declaración `!important`, reservada para el atributo `hidden`. El original pesaba 58.648 bytes y el nuevo 22.957. | Variables comunes para fuentes, contraste, espaciamiento, superficies y foco. Una retícula móvil con ampliaciones expresas para tablet y escritorio. |

La dirección artística usa el transporte compacto asociado con herramientas de Ableton, la separación entre gráfico y controles propia de interfaces de análisis como FabFilter y la economía de formas de Teenage Engineering como referencias de criterio. La reducción de superficies y la alineación de campos y textos se apoyan en los principios de Rams y la retícula de Müller-Brockmann. Las páginas oficiales de las referencias devolvieron un error de acceso desde este entorno. La evaluación visual se realizó con capturas de Cinemático. [Ableton Note](https://www.ableton.com/en/note/) · [Ableton Live](https://www.ableton.com/en/live/) · [FabFilter Pro-Q](https://www.fabfilter.com/products/pro-q-4-equalizer-plug-in) · [Teenage Engineering OP-1](https://teenage.engineering/products/op-1) · [Principios de Dieter Rams](https://www.vitsoe.com/us/about/good-design)

## Nitidez y densidad

En Chromium, el original y el rediseño registraron escala inicial `1`, tanto con DPR 2 como con DPR 3. La imagen original para el móvil de 390 px tenía 1170 píxeles físicos de ancho a DPR 3 y el círculo de quintas ya era vectorial. Tampoco había gráficos `canvas` en las pantallas medidas. Las deficiencias constatadas en el navegador procedían sobre todo de la tipografía pequeña, el recorte inicial del gráfico y la jerarquía visual. Esas mediciones se limitan al navegador y a sus configuraciones de captura.

Manrope, Inter e IBM Plex Mono se sirven localmente con sus licencias. En la muestra tipográfica `F♯m7 · B♭7/F · Cmaj7#11 · Dø7 · F°`, la inspección del renderizado confirmó Inter como fuente principal con sustitución puntual de glifos por fuentes locales del sistema. El círculo y las voces usan SVG. El símbolo de marca usa SVG en la página y un recurso vectorial en Android. Los PNG de 192 y 512 px se reservan para el icono instalable de la PWA.

Android usa el viewport del documento y reserva el espacio de las barras del sistema, los recortes de pantalla y el teclado virtual. Se conserva la posibilidad de ampliar el texto y el zoom que ofrezca el entorno. La aplicación incluye los recursos localmente y el manifiesto carece de permiso de Internet. La caché web pasa de `v65` a `v66` para actualizar juntos HTML, estilos y recursos.

## Verificación en navegador

- 67 capturas por versión en Chromium. Anchos móviles de 320, 360, 390, 412 y 430 px, tablet de 834 px y escritorio de 1440 px. También hay 844 × 390 en horizontal y 390 px con texto al 125 %. Se probaron DPR 2 y 3 y se conservaron los PNG a su resolución original.
- Las capturas cubren Crear, propuestas, inicio del Estudio, círculo de quintas, análisis de acordes, conducción de voces y transformaciones. Se usaron `Am F C G` y `Dbmaj7#11 Ab7/Gb Dbadd9 Bb7` para comparar ambos diseños con el mismo material.
- Las 67 mediciones posteriores carecen de desbordamiento horizontal del documento. El gráfico puede desplazarse de forma independiente. El menor `font-size` CSS medido tras el cambio fue de 13 px. La medida de la tipografía en un SVG también depende de su escala de dibujo.
- Axe no detectó infracciones automáticas en 18 estados de móvil, tablet y escritorio. Se verificaron los contrastes que requirieron revisión adicional en flechas y SVG. Mínimos calculados de 3,31:1 para el borde del campo, 7,39:1 para el botón principal y las notas del círculo, 6,98:1 para las etiquetas del gráfico y 6,55:1 para las flechas. Se comprobó foco visible, orden de tabulación, selección del círculo mediante teclado y área de activación mediante puntero.
- Pasaron las 33 comprobaciones de regresión del repositorio y las seis suites de Chromium con Node 22. Cubren el motor, MIDI, empaquetado, reproducción de piano, actualización y arranque sin conexión, navegación, conservación de la progresión y 13 configuraciones responsivas. La regresión del tamaño del cifrado falla contra `main` y pasa con este cambio.

## Verificación en Android

La APK de depuración se compiló con Gradle y SDK 35 y pasó la verificación de firma de depuración. Se comprobaron los 15 archivos web incluidos, byte a byte. La inspección del paquete confirmó el fondo oscuro de arranque de Android 12 y posteriores. Este ajuste se hizo al observar un destello blanco durante el arranque de una compilación intermedia.

El emulador API 35 de 1080 × 2400 y 420 dpi arrancó sin aceleración por hardware e instaló una compilación del rediseño. Se comprobó su integridad en el dispositivo. Android bloqueó la pantalla con un aviso de que System UI no respondía y el marco de la actividad quedó sin contenido tras reiniciar el servicio. Como consecuencia, la matriz de capturas comparativas corresponde a Chromium. Quedan pendientes el renderizado del WebView, su DPR efectivo, el comportamiento del teclado y la prueba en un teléfono físico.

## Revisión y publicación

La entrega queda en una rama de revisión. La publicación web y el alojamiento del APK en GitHub Releases quedan sujetos a la aprobación del diseño. El flujo de firma existente exige el identificador `io.github.flinttgaverdale.cinematico.beta02`, un `versionCode` creciente y el certificado de la beta publicada. Antes de distribuir la siguiente beta, se debe instalar sobre la versión firmada anterior y probar el teclado, las áreas seguras, el texto ampliado y la ejecución offline en un teléfono físico. La APK temporal de depuración sirve para verificar el empaquetado y las pruebas internas.
