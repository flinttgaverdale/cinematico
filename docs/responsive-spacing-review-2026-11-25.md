# Cinemático Studio — auditoría responsive y márgenes (25 noviembre 2026)

## Problema y causa
Las capas antiguas de CSS reducían `.shell` a **12px** en pantallas de hasta 650px. Aunque algunas tarjetas tenían relleno interior, las superficies principales y los controles quedaban visualmente pegados al borde del teléfono. El CSS también permitía anchuras hasta 1520px en escritorio, que hacían los recorridos demasiado largos en pantallas panorámicas.

## Corrección
- Gutter fluido, mínimo **20px** por lado (más safe-area cuando hay notch o recorte), hasta **52px** en escritorio.
- Contenido con ancho máximo **1320px**, centrado. Pantallas grandes mantienen aire y legibilidad.
- Tarjetas móviles con entre **18px y 23px** de padding, mejora de separaciones y altura de botones táctiles.
- Cabecera móvil: oculta texto secundario redundante y permite al título ocupar el ancho real.
- Selector Crear / Estudio avanzado y las cuatro intenciones tienen espacio interior sin desbordar; hasta 360px, la navegación avanzada se convierte en una columna.
- La geometría de la sección de resultados y la explicación de las rutas no modifica ningún dato del motor musical.
- El registro del Service Worker y su caché avanzan conjuntamente a `v48`.

## Verificación técnica
`tests/responsive-layout.cjs` inspecciona la geometría real con Chromium en **320, 360, 390, 430, 768, 1024 y 1440px**; comprueba el margen exterior, la caja de progresión, las tarjetas de 3 rutas y las tres áreas avanzadas, más que no haya desbordamiento horizontal de documento. Se ejecuta en el workflow de regresión. Esto no reemplaza el control manual en Android WebView, teléfonos con recorte y modo landscape.

## Comprobación visual en el teléfono
Abrir Cinemático, comparar separación lateral de cabecera, tarjeta Crear, introducción de acordes, las cuatro direcciones, resultados y Estudio avanzado. Verificar además teclado, navegador con barra inferior y orientación horizontal. La versión web/PWA se actualiza desde Pages; un APK ya instalado **no** recibe las actualizaciones web automáticamente.
