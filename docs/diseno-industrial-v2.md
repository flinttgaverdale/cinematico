# Dirección industrial v2 — candidato de revisión

Base: `design/identidad-cinematico`. Rama independiente, no desplegada. La intención es acercar Cinemático al lenguaje de instrumento de precisión: contrastes fuertes, retícula compacta, cifrado dominante y naranja de señal, inspirados en los principios de OP-XY y TX-6 sin copiar su interfaz.

- Fondo grafito conservado; pantalla de cifrado #101313 con texto #ECEEEA. Naranja #FFA361 para acción principal, reproducción activa, tónica seleccionada y detalle de marca. Salvia para relaciones y foco, cobre para contraste. Radio de esquinas 3 px; matriz de intenciones con separadores de 1 px y estado activo invertido. Cifrado Inter 600, tamaño adaptable, pantalla de entrada de al menos 78 px. Numeración técnica delimitada y signos de ruta más visibles.
- Se editan reglas existentes en lugar de sumar una segunda capa de CSS. No se añaden controles, indicadores, imágenes, fuentes ni dependencias. El círculo conserva geometría y área táctil, su selección cambia de aspecto. La conducción de voces conserva datos y marcadores.
- Caché de candidato v68, registro coherente. Motor armónico sin cambios (blob a0f350a958be01ae5d3963d87e1327b1e9ea0ae6); núcleo Max conserva el prefijo exacto del motor. Ejemplo de Horner ejecutado: Em C Am / Bm G Em / G#m E C#m.
- Contrastes nominales calculados: naranja sobre fondo de pantalla 9.48:1, texto claro sobre pantalla 15.99:1. Estos valores no sustituyen auditoría completa. Comprobación básica de llaves CSS y coherencia de versión: correcta.

Pendiente: ejecutar Chromium y regresión completa, capturas reales a 320/390/430 px y DPR 2–3, texto 125 %, contraste de todas las combinaciones y foco, Android WebView y aprobación artística. No se ha generado APK ni se ha publicado en Pages. Si otra rama utiliza v68, ajustar el número de caché al integrar. No fusionar hasta validar.

## Segunda iteración: estudio avanzado

Se extiende la identidad industrial a los tres módulos de estudio: navegación 01/02/03 con número no leído por tecnologías de asistencia, selección con borde naranja, retícula continua; cifrado de acordes en marfil sobre display oscuro; guías de voces más definidas y leyenda con color y forma; transformación cromática con notas comunes destacadas en salvia; numeración de destinos tonales ya calculada por el motor. Se mantienen los controles y sus identificadores. Caché del candidato v69.

Comprobaciones de esta iteración: sintaxis del JavaScript inline y service worker correcta, paridad del motor web/Max y SHA de motor original correctos, módulos 01, 02, 03. La prueba simbólica SLIDE de C mayor conserva E y produce Dbm. No se ha ejecutado Chromium ni un WebView en esta iteración; las pruebas de navegador, las capturas reales, la geometría táctil y la aprobación visual permanecen pendientes. Sin publicación ni APK nuevo.

## Tercera y cuarta iteraciones: escala y pulido

Caché candidata v71. Márgenes fluidos de 16–40 px, display de al menos 72 px, objetivo táctil mínimo de 48 px para botones ordinarios, intención 60 px y acción principal 56 px. Navegación avanzada mínimo 64 px, separación modular fluida, iconos de transporte 12 px, leyenda de voces 16 px. Las flechas de los caminos y la progresión original se agrupan con el acorde siguiente mediante flex, con salida de emergencia para palabras excepcionalmente largas; no se alteran los símbolos ni se truncan las extensiones. Se separan la etiqueta y la tónica del círculo y se mantiene la geometría de interacción. El gráfico de voces conserva al menos su ancho intrínseco, con desplazamiento interno cuando es necesario. Se mantiene el WebView existente: no se fuerza densidad ni se desactiva el escalado accesible.

Verificado por lectura posterior: JavaScript inline, service worker y archivo de pruebas compilan sintácticamente; llaves CSS equilibradas; caché coherente; motor SHA a0f350a958be01ae5d3963d87e1327b1e9ea0ae6, núcleo Max con prefijo exacto. Caso largo Cmaj7#11 F#m/C# DmMaj7 G7/B parseado sin errores y tres continuaciones Horner: G Em C / Gm D# Cm / Em G Bm. Contrastes nominales {"textOnDisplay":"15.99","mutedOnPanel":"8.67","signalOnDisplay":"9.48","sageOnPanel":"6.55","copperOnPanel":"6.76"}. No equivalen a una auditoría visual completa.

Prueba responsive actualizada para 13 configuraciones ya previstas, con márgenes fluidos, altura mínima de controles, agrupación de flechas y acordes largos y separación de la etiqueta central del círculo. No se ha ejecutado Chromium con el repositorio completo: el entorno local no puede resolver github.com para clonar el código. Pendiente ejecución de la suite, capturas y Android real antes de fusionar o empaquetar. No se publica ni se modifica el motor.
