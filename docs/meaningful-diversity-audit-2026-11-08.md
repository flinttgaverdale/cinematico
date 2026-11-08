# Cinemático Studio — auditoría de diversidad musical real
**Fecha:** 8 de noviembre de 2026. **Alcance:** motor de continuación para Crear; no MIDI ni composiciones automáticas.

## Problema detectado (antes de la corrección)
Las alternativas podían tener tres cifrados diferentes y, aun así, comunicar la misma conclusión armónica. Es especialmente frecuente en las intenciones que originalmente tenían tres recetas con el mismo acorde de destino: melancolía, épica, tristeza, alegría, inquietud y oscuridad. Contar textos de acordes distintos no equivale a contar propuestas expresivamente útiles.

## Protocolo reproducible, sin audio ni validación perceptiva
32 progresiones de entrada diferentes (cadenciales, circulares, mayores, menores, ambiguas, cromáticas, con inversiones, con acordes aislados), multiplicadas por 15 matices = **480 decisiones**. Cada una devuelve **3 caminos** de tres acordes: **1.440 continuaciones**. Se verifica:
- No reescribir la idea original.
- Propuestas aceptadas por el mismo analizador que usa la aplicación.
- Diversidad en acorde final **y en fundamental final** (evita que cambiar solo un sufijo cuente como nuevo destino).
- Diversidad de desenlace estructural: posible regreso, dirección nueva o expectativa pendiente.
- Final suspendido nunca anunciado como resolución; suspense no debe cerrarse como resolución; asombro y contraste siguen descritos como cambios de dirección.
- Conservación de la primera opción anterior, la más familiar, incluso después de ampliar candidatos.

| Indicador de variedad simbólica (480 decisiones) | Antes | Después |
|---|---:|---:|
| Tres alternativas con al menos dos acordes finales distintos | 249 | 472 |
| Tres alternativas con al menos dos fundamentales finales distintas | 183 | 443 |
| Tres alternativas con más de una dirección de desenlace | 87 | 286 |
| Primera propuesta original conservada | — | 480/480 |
| Total de caminos analizados | 1.440 | 1.440 |

**Esto mide diversidad *simbólica*, no cuánto difieren las propuestas al oído ni su calidad estética.** Un acorde diferente puede resultar idéntico en textura/registro, y un mismo destino puede ofrecer un cambio compositivo relevante al usar otra melodía.

## Corrección implementada
1. Se conserva la mejor propuesta del repertorio anterior como primera opción.
2. Para nueve intenciones con destino demasiado repetido, se añaden salidas **planificadas**: región cercana, expectativa abierta, giro a una región de color, regreso modificado. Se evitan alternativas aleatorias.
3. Calma, ternura y nostalgia en contexto menor tienen alternativas específicas; no se obliga un final mayor sin que el usuario lo haya pedido.
4. El selector para segundo y tercer camino sopesa notas y acordes distintos, fundamental final, dirección y trayectoria armónica. Un umbral de 14 puntos **internos no calibrados** evita escoger rutas muy alejadas de la opción inicial cuando hay suficientes alternativas cercanas. El umbral es una preferencia de producto, no validación estadística.
5. La explicación opcional distingue «otra fundamental» de «conservar fundamental final». No se agregan nuevos elementos visuales.

## Controles negativos e interpretación responsable
- Un acorde aislado C **no confirma Do mayor** ni la emoción del oyente.
- Dm G7 C puede sugerir un regreso tonal, pero sin melodía y posición métrica no se declara cadencia perfecta.
- Gsus4 como último acorde deja una suspensión; no es cierre tonal aunque comparta raíz con una hipotética tónica.
- En 'alegría' o 'calma' se permite que el motor prefiera finales semejantes si los alternativas cromáticas obtienen menor coherencia contextual. La variedad no debe forzarse para mejorar una métrica.
- Notas comunes en clases de altura no son conducción de voces real ni garantizan buena escritura instrumental.
- El compositor elige entre propuestas: no hay atribución de probabilidades de tristeza, alegría o tensión.

## Referencias utilizadas para delimitar las afirmaciones
- Bigand, Parncutt y Lerdahl (1996), influencia de la función tonal, disonancia, movimiento horizontal y formación en tensión percibida: https://pubmed.ncbi.nlm.nih.gov/8668513/
- Bigand y Parncutt (1999), relevancia de las cadencias locales en secuencias largas: https://pubmed.ncbi.nlm.nih.gov/10652864/
- Sears, Verbeten y Percival (2023), la ordenación temporal y coherencia de progresiones afecta al procesamiento armónico: https://pubmed.ncbi.nlm.nih.gov/37227858/
- Open Music Theory, «Performing a harmonic analysis»: no confundir análisis de acordes con frase/cadencia completa: https://openmusictheory.github.io/harmonicAnalysis.html
- Open Music Theory, «Keyboard-style voice-leading schemata», resolución deceptiva V–VI: https://openmusictheory.github.io/KBVLschemata.html
- Estudio de co-creación musical CHAMELEON (2021), explica que una métrica universal de similitud para progresiones sigue abierta: https://pmc.ncbi.nlm.nih.gov/articles/PMC7983946/

## Escucha con intérpretes pendiente
Comparar con orden aleatorio las tres propuestas, usando iguales pulsos de dos segundos, las mismas voces neutras y los dos últimos acordes originales. Preguntar: «¿Cuál probarías?», «¿Son destinos distintos?», «¿Mantienen relación útil con la idea original?». Contrastar también tocándolas en piano/guitarra. No preguntar por grados exactos de emoción. Separar evaluación con músicos reales de las pruebas simbólicas documentadas aquí.

## Compatibilidad con validación tonal previa
La regresión antigua exigía que **todas** las rutas de calma, ternura y nostalgia terminaran en la misma tónica. Era apropiado cuando el motor únicamente ofrecía variaciones del mismo destino, pero incompatible con el nuevo propósito de explorar regiones vecinas. La comprobación reforzada conserva el **primer destino tónico** y prohíbe convertir inadvertidamente C menor en C mayor o viceversa; para las opciones exploratorias permite grados relacionados (por ejemplo, Abmaj7, Fm7 o Eb en C menor). Se amplían controles negativos en ambas pruebas. El cambio se documenta explícitamente; no se silencian fallos.
