# Continuaciones por compositor: revisión de criterios

La búsqueda de tres acordes usa el último acorde y el historial, no una plantilla fija. Las preferencias son hipótesis compositivas D, no una identificación estadística del estilo ni una reconstrucción de partitura. Se mantienen independientes la intención emocional y la lente de referencia.

## Revisión de ranking

- Proporción de notas comunes en lugar del recuento bruto, para no favorecer automáticamente acordes extendidos.
- Distancia mínima de clases de altura y penalización de notas no emparejadas; no es una realización contrapuntística de voces.
- Penalización de extensiones repetidas y mMaj7 reiteradas; no se prohíben sus usos pertinentes.
- Contraste principalmente al inicio y recuperación de continuidad después; no se presupone modulación.
- Alternativas de final: libre, búsqueda de un centro candidato o final abierto. Las llegadas dominante y plagal se etiquetan como posibles, sin confirmar una cadencia formal. Para material insuficiente no se impone centro.
- Preferencias de estilo, especialmente conservación de material para Zimmer/Göransson, transformación triádica para Horner y bajo separado para Morricone/Newman, son reglas de diseño a contrastar por escucha.

## Evidencia de esta revisión

Se ejecutaron 363 casos del motor en JS: 132 combinaciones de transposición y perfil, 165 de cinco progresiones y tres intenciones, y 66 de final abierto/llegada. Se comprobó la validez del cifrado, tres alternativas distintas, preservación del original, perfiles distintos en las doce transposiciones y restricciones del destino. Sin fallos en esos criterios. La prueba de navegador se ha actualizado pero no ejecutado en esta sesión.

No se ha demostrado preferencia estética ni autenticidad estilística. Falta validar el resultado con audio y músicos; revisar los perfiles sobre repertorio independiente; ejecutar CI completa, actualizar núcleo Max y regenerar los paquetes Live, generar APK y comprobarla en dispositivo. La rama no debe publicarse hasta resolver esas condiciones.
