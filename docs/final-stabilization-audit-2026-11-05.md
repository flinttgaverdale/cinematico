# Auditoría de estabilización — 5 noviembre 2026

## Alcance y método
Se revisó el código de `engine.js` y la estructura de `index.html` de la rama de desarrollo. Se ejecutó el motor JavaScript en un entorno aislado de evaluación y se probaron combinaciones generadas. **No equivale a ejecutar el navegador, las pruebas de Node de CI ni una audición musical humana.**

## Resultados observados
- Evaluación de 528 combinaciones (11 perfiles × 12 emociones × 4 tónicas), 1.036 alternativas generadas, sin fallos de los invariantes examinados: extremos conservados, exactamente un cambio interior y puntuación finita.
- Ejecución de 36 estudios de frase (3 perfiles × 12 emociones), sin fallos de invariantes: tres etapas, misma longitud armónica y sin mutación de perfiles.
- Cinco estilos de conducción de voces examinados con Am–F–C–G: cuatro disposiciones y tres transiciones en cada caso. Esta muestra no demuestra ausencia de errores contrapuntísticos.
- `engine.js` supera comprobación de sintaxis por compilación de función; el bloque de perfiles de `index.html` también.
- Controles esenciales comprobados por presencia de IDs; el desplegable de ayuda comienza cerrado y tiene manejador.
- Los once perfiles tienen firmas distintas según la huella simplificada actual. No equivale a validación de estilo ni autenticidad.
- El prototipo de frase y sustituciones no está conectado a la UI: **sin riesgo de alteración de la experiencia actual por ese camino**.

## Hallazgos que afectan a la recta final
1. **Crítico para validación musical:** las estrategias de frase son hipótesis descriptivas; todavía no generan melodías, duraciones, voicings ni articulaciones. No deben anunciarse como una imitación de compositor.
2. **Alto:** falta confirmar ejecución de la suite Node/GitHub Actions y pruebas visuales en navegadores reales. La comprobación de sintaxis no cubre errores DOM o interacción.
3. **Alto:** la puntuación de sustituciones combina criterios heurísticos sin calibración con ejemplos de partitura o juicio auditivo. Debe conservarse como herramienta exploratoria.
4. **Medio:** los perfiles que coinciden con la armonía de partida pueden producir cero sustituciones (caso Williams + nostalgia); esto es correcto, y el tratamiento de frase evita forzar novedades falsas.
5. **Medio:** falta un recorrido UX integral: móvil/escritorio, accesibilidad, densidad, contraste, ayudas, navegación y claridad de propuestas.
6. **Medio:** los modos sobrescritos manualmente en la UI no se pasan al prototipo de frase. Antes de conectarlo, habrá que respetar ese parámetro.
7. **Medio:** la fase de diseño debe priorizar jerarquía visual y revelar complejidad progresivamente, no añadir controles.

## Puertas de salida para versión final
- [ ] CI completa verde y verificada
- [ ] Pruebas de navegador de flujos principales
- [ ] Auditoría musical manual de casos de referencia, incluidos Williams/Zimmer/Newman
- [ ] Alineación del modo manual con cualquier integración
- [ ] Revisión UX móvil y escritorio
- [ ] Decisión explícita sobre qué prototipos entran en la versión estable
- [ ] Despliegue de vista previa verificado

## Decisión
Mantener los estudios de frase como API experimental no conectada. **No declarar finalizado ni estable el producto** hasta completar las puertas de salida.
