# Cinemático Studio — Fase UX: componer primero, teoría después
**Fecha:** 8 noviembre 2026 · **Ámbito:** primera simplificación funcional, no pérdida de precisión musical.

## Problema detectado
El código tenía dos áreas separadas —«Crear» y «Estudio avanzado»— pero forzaba el inicio en el estudio y presentaba numerosas explicaciones y controles a pesar de existir un flujo de creación simple. Además, las tres tarjetas del modo Crear repetían la progresión completa y el mismo texto emocional. Eran redundancias visuales, no necesidades creativas.

## Cambios aplicados
1. **Crear como primera experiencia de un usuario nuevo.** Una preferencia explícita posterior de abrir el Estudio avanzado se recuerda con una clave nueva (`cinematico-workspace-v2`), sin heredar la antigua preferencia escrita por la versión que forzaba el modo avanzado.
2. **Una progresión, una intención, tres caminos.** La entrada comienza vacía, con ejemplo en el placeholder, y ofrece cuatro direcciones principales: Abrir (esperanza), Mantener tensión (suspense), Sorprender (asombro) y Contrastar (contraste).
3. **Quince matices originales conservados, pero desplegables.** «Otros matices musicales» conserva el catálogo completo; las cuatro direcciones principales son accesos rápidos, no un segundo algoritmo incompatible.
4. **El punto de partida aparece una vez.** Las tres tarjetas muestran solamente los acordes propuestos, con una breve dirección de llegada. El porqué detallado permanece bajo «¿Por qué esta opción?».
5. **Estudio avanzado intacto.** Sigue conservando círculo de quintas, tonalidad y modos, lenguaje independiente de referencia, comparación de compositores, técnicas, acordes diatónicos, modulaciones, análisis propio, voz SATB y transformación P/L/R/S. Los cambios visuales no sustituyen sus cálculos.
6. **Sin sobrescritura implícita de la progresión.** Solo «Elegir y analizar» incorpora una propuesta al editor avanzado. Cambiar de dirección borra resultados obsoletos, pero nunca los acordes introducidos.
7. **Ideas guardadas con contexto propio.** En «Crear», los registros del cuaderno identifican la idea del usuario y su matiz, no atribuyen automáticamente la progresión a la tonalidad o compositor de referencia.
8. **Movilidad y accesibilidad.** Cuatro controles claros con estado `aria-pressed`; panel de matices nativo `details`; tarjetas y botones adaptados a anchuras pequeñas. No hay controles decorativos.

## Lo que NO cambia
- La investigación de partituras permanece en el corpus y en el motor, sin añadirse a la interfaz simplificada.
- La progresión propia y la referencia musical del compositor continúan independientes.
- No hay MIDI en la web, ni generación automática destructiva, ni afirmaciones de emoción o semejanza objetiva a compositores.
- Las tres continuaciones siguen siendo **hipótesis musicales originales**, basadas en heurísticas y no validadas por un panel humano de escucha.

## Criterios automáticos de aceptación
- Entrar por primera vez muestra «Crear» y oculta el estudio.
- Cuatro direcciones, una seleccionada. Cambiarla actualiza el matiz y elimina propuestas anteriores; acceder a «Otros matices» permite cualquiera de los 15 valores previos.
- Una progresión de cuatro acordes produce hasta tres tarjetas originales y los acordes iniciales se muestran una sola vez. El detalle teórico está cerrado por defecto.
- «Elegir y analizar» conserva íntegramente la progresión inicial al pasar al estudio.
- El análisis completo conserva sus paneles y las 11 referencias, y se puede volver a él desde Crear.
- En móvil (390 px) no se produce desplazamiento horizontal; el botón de guardar y la recuperación de ideas siguen funcionando.
- La compilación JavaScript, las pruebas armónicas y Playwright escritorio/móvil deben pasar sin pérdida de funciones.

## Límite de la fase
Esta es una **reducción de fricción en la interfaz**, no una evidencia de mejora perceptiva del motor: todavía falta una evaluación de usuarios reales. La siguiente decisión debe basarse en pruebas concretas de tiempo hasta primera alternativa útil, tasa de exploración de las tres opciones, comprensión y utilidad percibida, en lugar de añadir nuevos controles por cada hallazgo musicológico.
