# Dirección industrial v2 — candidato de revisión

Base: `design/identidad-cinematico`. Rama independiente, no desplegada. La intención es acercar Cinemático al lenguaje de instrumento de precisión: contrastes fuertes, retícula compacta, cifrado dominante y naranja de señal, inspirados en los principios de OP-XY y TX-6 sin copiar su interfaz.

- Fondo grafito conservado; pantalla de cifrado #101313 con texto #ECEEEA. Naranja #FFA361 para acción principal, reproducción activa, tónica seleccionada y detalle de marca. Salvia para relaciones y foco, cobre para contraste. Radio de esquinas 3 px; matriz de intenciones con separadores de 1 px y estado activo invertido. Cifrado Inter 600, tamaño adaptable, pantalla de entrada de al menos 78 px. Numeración técnica delimitada y signos de ruta más visibles.
- Se editan reglas existentes en lugar de sumar una segunda capa de CSS. No se añaden controles, indicadores, imágenes, fuentes ni dependencias. El círculo conserva geometría y área táctil, su selección cambia de aspecto. La conducción de voces conserva datos y marcadores.
- Caché de candidato v68, registro coherente. Motor armónico sin cambios (blob a0f350a958be01ae5d3963d87e1327b1e9ea0ae6); núcleo Max conserva el prefijo exacto del motor. Ejemplo de Horner ejecutado: Em C Am / Bm G Em / G#m E C#m.
- Contrastes nominales calculados: naranja sobre fondo de pantalla 9.48:1, texto claro sobre pantalla 15.99:1. Estos valores no sustituyen auditoría completa. Comprobación básica de llaves CSS y coherencia de versión: correcta.

Pendiente: ejecutar Chromium y regresión completa, capturas reales a 320/390/430 px y DPR 2–3, texto 125 %, contraste de todas las combinaciones y foco, Android WebView y aprobación artística. No se ha generado APK ni se ha publicado en Pages. Si otra rama utiliza v68, ajustar el número de caché al integrar. No fusionar hasta validar.
