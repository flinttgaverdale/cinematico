# Cinemático Studio — Experiencia centrada en el compositor
**8 de noviembre de 2026**. Revisión del producto tras auditoría de uso por un músico con conocimientos medios.

## Principio de diseño
Cinemático no es un secuenciador ni un cuaderno digital. Acompaña a una persona que compone con instrumento, guitarra, piano o un DAW externo. La herramienta debe permitir **descubrir** relaciones armónicas, no gestionar archivos o almacenar sesiones musicales.

## Se elimina «Guardar»
El cuaderno de ideas se ha retirado de la interfaz y de la lógica activa. No se borran entradas que usuarios pudieran haber almacenado antes en localStorage, porque quitar una función no autoriza destruir datos existentes. La versión actual deja de ofrecer gestión de ideas dentro de la app.

## «Profundizar» en tres objetivos, no en quince paneles simultáneos
- **Mis acordes**: editor propio y alternativas. El análisis de centros tonales, las observaciones de relaciones armónicas y la conducción de voces están cerrados de entrada y pueden desplegarse sin cambiar de pantalla.
- **Inspiración**: círculo de quintas, selección de modo, tonalidad, lenguaje de compositores y propuestas de referencia **independientes** de la progresión del usuario. El motor no mezcla de manera inadvertida ambas fuentes.
- **Herramientas**: tres desplegables técnicos, inicialmente cerrados: voces, transformaciones de tríadas y otros centros armónicos. Nada de MIDI en la web.

## Escucha directa y neutral
Las tarjetas de «Crear» permiten escuchar por separado la misma plantilla de hasta **dos acordes propios finales más tres propuestas nuevas**. Se conservan dos segundos por acorde en todas las rutas, cuatro voces de síntesis Web Audio con un volumen moderado. Esto no es una interpretación musical ni orquestal y no permite deducir calidad estética, emoción o estilo de compositor. Una nueva selección, cambio de pantalla o edición detiene la reproducción en curso. Si Web Audio no está disponible se muestra una aclaración; tocar con el instrumento sigue siendo el flujo recomendado.

## Corrección de lógica musical
La auditoría halló que el indicador `direction` clasificaba como `resolver` las 144 propuestas de 48 combinaciones, incluso las terminadas en cuarta suspendida, y que muchos recorridos acababan en la misma fundamental. Ahora:
- `sus4` final no se describe como resolución completa;
- las rutas «Sorprender» y «Contrastar» se reconocen como movimientos de color o región cromática;
- las recetas creativas principales incluyen finales y movimientos alternativos, no solo sustituciones del primer acorde con idéntica llegada;
- una progresión ambigua como `C G Am F` puede preferir **C mayor** al sugerir caminos si existen indicios cadenciales, sin afirmar un centro tonal confirmado.
- los casos en que la primera propuesta de tres acordes duplicaría el último del usuario disponen de una cuarta receta candidata, para seguir presentando tres opciones diferentes.

## Prueba y limitaciones
Regresiones automáticas: 12 fuentes x 15 intenciones = **180 situaciones**, 540 trayectorias musicales y sus preescuchas simbólicas. Pruebas de navegador en escritorio y móvil verifican que la navegación, la referencia independiente, el audio y los detalles desplegables siguen funcionando.

Estas pruebas son **técnicas y musicales simbólicas**: no reemplazan una audición con intérpretes reales. En la siguiente fase conviene comprobar si cada ruta genera ideas útiles, no cuánta teoría se ha añadido al programa.
