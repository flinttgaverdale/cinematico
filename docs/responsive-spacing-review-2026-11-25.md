# Cinemático Studio — auditoría responsive y márgenes (25 noviembre 2026)

## Problema y causa
Las capas antiguas de CSS reducían `.shell` a **12px** en pantallas de hasta 650px. Aunque algunas tarjetas tenían relleno interior, las superficies principales y los controles quedaban visualmente pegados al borde del teléfono. El CSS también permitía anchuras hasta 1520px en escritorio, que hacían los recorridos demasiado largos en pantallas panorámicas.

## Corrección
- Gutter fluido, mínimo **20px** por lado (más safe-area cuando hay notch o recorte), hasta **64px** en escritorio.
- Contenido con ancho máximo **1320px**, centrado. Pantallas grandes mantienen aire y legibilidad.
- Tarjetas móviles con entre **15px y 22px** de padding, mejora de separaciones y altura de botones táctiles.
- Cabecera móvil: oculta texto secundario redundante y permite al título ocupar el ancho real.
- Selector Crear / Estudio avanzado y las cuatro intenciones tienen espacio interior sin desbordar; hasta 360px, la navegación avanzada se convierte en una columna.
- La geometría de la sección de resultados y la explicación de las rutas no modifica ningún dato del motor musical.
- El registro del Service Worker y su caché avanzan conjuntamente a `v49`.

## Verificación técnica
La regresión de Chromium comprueba los márgenes y las tres rutas en
320, 360, 375, 390, 412, 430, 768, 1024, 1440 y 1920 px. Incluye dos ventanas
bajas (844×390 y 400×340). Los casos avanzados comprueban Enter, Espacio y
Tab en la rueda, los objetivos táctiles de ayuda y el desplazamiento interno
del gráfico con el teclado. La prueba manual en Android WebView y en teléfonos
con recorte sigue siendo necesaria.


## Comprobación visual en el teléfono
Abrir Cinemático, comparar separación lateral de cabecera, tarjeta Crear, introducción de acordes, las cuatro direcciones, resultados y Estudio avanzado. Verificar además teclado, navegador con barra inferior y orientación horizontal. La versión web/PWA se actualiza desde Pages; un APK ya instalado **no** recibe las actualizaciones web automáticamente.
