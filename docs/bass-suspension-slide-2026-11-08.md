# Cinemático Studio — Bajos independientes, gesto 4–3 y SLIDE
**Fecha:** 8 de noviembre de 2026. **Alcance:** asistente para composición; no análisis MIDI ni atribución automática de estilo.

## Problemas resueltos
1. **C/B♭ y otras cifras con bajo independiente.** Antes solo se admitía una barra cuando el bajo pertenecía al acorde. Ahora el motor distingue `root`, `notes`, `bass` y `bassKind` sin añadir la nota del bajo a la tríada. Los generadores a tres y cuatro voces respetan esa línea. Una cifra con más notas que voces disponibles requiere omitir algún componente: su representación es orientativa, no la transcripción exacta de un arreglo.
2. **Gestos de cuarta a tercera.** Se admiten `sus4` y `7sus4` y se comprueba, en notas y registros concretos, si la cuarta desciende a la tercera del acorde de la misma fundamental. Se informa de un «gesto 4–3 compatible con suspensión» y, bajo criterio clásico, se advierte cuando la cuarta no realiza ese descenso. No puede afirmarse una suspensión preparada o acentuada porque en la web no se conocen ritmo, métrica, ligadura ni ataque.
3. **Transformación SLIDE (S).** Tríada mayor → tríada menor una semitono arriba, conservando la tercera y desplazando fundamental y quinta; el proceso inverso devuelve a la mayor. Disponible como operación independiente junto a P, L y R, sin identificar una partitura ni un compositor.
4. **madd9.** Corrección de catálogo: la novena añadida a una tríada menor deja de recibir por omisión los intervalos de una tríada mayor.

## Integridad del producto
El usuario mantiene control creativo sobre la progresión propia. El cuadro de Lenguaje de referencia conserva su independencia, y no se añaden pantallas didácticas ni análisis MIDI. Las advertencias de conducción de voces son observaciones contextualizadas, no juicios universales.

## Comprobación
La regresión `tests/independent-bass-suspension-slide.cjs` cubre bajos ajenos y bajos de inversión, coherencia de 3 y 4 voces, gesto 4–3 correcto y no realizado, y reversibilidad de S en las doce clases de tónica, sin alterar P/L/R. Los controles negativos del analizador se corrigen para no tratar un bajo cromático válido como error de sintaxis. La suite de GitHub Actions debe pasar antes de integrar los cambios en `main`.

## Fuentes
- Music21, documentación de `analysis.neoRiemannian.S`: https://music21.org/music21docs/moduleReference/moduleAnalysisNeoRiemannian.html
- Open Music Theory, transformaciones neo-riemannianas: https://pressbooks.nebraska.edu/openmusictheory/chapter/neo-riemannian-triadic-progressions/
- University of Puget Sound, definición y requisitos de suspensión: https://musictheory.pugetsound.edu/mt21c/Suspension.html

**Límite de validación:** no se ha realizado en esta fase una escucha humana ciega ni se ha revisado un corpus completo de partituras con las nuevas reglas.
