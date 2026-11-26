# Identidad visual de Cinemático Studio

La revisión parte de `09631ac`, en `feat/continuaciones-por-compositor`. El cambio se prepara en `design/cinematico-identidad-dark` para revisión local.

## Decisiones de diseño

- Crear y Estudio avanzado comparten márgenes, tipografía, superficies y estados de interacción. La vista Crear concentra los controles principales y deja más espacio a las propuestas.
- La paleta usa `#171A1C` para el fondo, `#202527` para paneles, `#2A3033` para controles y `#394244` para separadores. El salvia `#8FAFAA` indica acción o selección y la arena `#CDB38A` destaca acordes y referencias. El texto usa `#ECEEEA` y `#BBC4BE`. El contorno de los campos usa `#748181` para que sus límites superen 3:1 sobre el fondo del control.
- Manrope se usa en títulos e Inter en la interfaz y los acordes. Los acordes llevan peso 600. IBM Plex Mono se usa en alturas, intervalos y lecturas de análisis. Se incorporaron los subconjuntos latino y latino extendido de [Manrope](https://www.npmjs.com/package/@fontsource-variable/manrope/v/5.3.0), [Inter](https://www.npmjs.com/package/@fontsource-variable/inter/v/5.3.0) e [IBM Plex Mono](https://www.npmjs.com/package/@fontsource/ibm-plex-mono/v/5.3.0) de Fontsource 5.3.0. Cada fuente conserva su licencia SIL OFL 1.1 en `assets/fonts/`.
- Los desplegables siguen siendo controles nativos. En pantallas de hasta 480 px, las etiquetas de voz aparecen encima de sus selectores para dejar espacio al valor completo. El círculo distingue la selección rellena del anillo de foco. El gráfico de voces conserva leyenda, etiquetas y desplazamiento horizontal por teclado.
- Los estilos, las fuentes y sus licencias se incorporan al shell PWA v62 y a la APK. El tema del contenedor Android y el manifiesto usan el mismo fondo de la web.

## Evidencia y comprobaciones

- Capturas reales de Chromium 156 antes y después. Se cubrieron Crear, rutas, desplegables, círculo de quintas, voces de la progresión y gráfico de conducción. Tamaños de referencia de 390 × 844, 834 × 1112 y 1440 × 1000. Las capturas de móvil y tablet usan dimensiones y entrada táctil emuladas.
- Regresión geométrica en 12 tamaños desde 320 hasta 1920 px, con dos vistas bajas. Se comprobó el recorrido por teclado, el anillo del círculo, el desplazamiento del gráfico, el espacio de las etiquetas de los selectores de voces y la ausencia de desplazamiento horizontal del documento.
- axe-core 4.11.1 en 18 combinaciones de pantalla y tamaño, con reglas WCAG A/AA y buenas prácticas. Cero infracciones automáticas. Las lecturas que axe dejó pendientes se midieron con los colores calculados del navegador. Los mínimos fueron 7,39:1 en las notas del círculo, 6,98:1 en las etiquetas del gráfico, 9,79:1 en las flechas de las rutas, 7,39:1 en el texto de las acciones principales y 3,31:1 en el borde de los campos frente a su relleno.
- Se ejecutaron los seis scripts de navegador del workflow, incluidas la actualización atómica de la PWA y la carga sin conexión de las tres fuentes. Las pruebas de renderizado de piano pasaron a 44 100 y 48 000 Hz.
- La APK de depuración compiló con SDK 35. Se verificó su firma de depuración y la igualdad byte a byte de 15 recursos con el árbol web, incluidas las seis WOFF2 y las tres licencias.
- En Node 22 pasaron 31 de las 33 comprobaciones de motor, análisis estático y empaquetado. `tests/live-generator-regression.cjs` y `tests/live-package-regression.cjs` ya fallaban en `09631ac` porque el motor de desarrollo difiere del núcleo congelado distribuido con Live. La comprobación estructural del AMXD congelado y la reproducción de voces MIDI pasaron en ambas ramas.

La comparación con la base confirmó la integridad del motor, el AMXD y los paquetes distribuidos. Quedan pendientes las pruebas con lectores de pantalla y hardware físico, así como la publicación.
