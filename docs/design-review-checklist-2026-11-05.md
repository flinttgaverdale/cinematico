# Revisión de diseño previa a la versión candidata — 2026-11-05

## Principio
La profundidad musical debe existir sin imponerse al usuario. Evitar ampliar la navegación hasta terminar validación funcional.

## Inventario verificado en código
- Página con encabezado principal, círculo de quintas y panel de resultados.
- Selector directo de tonalidad, emoción, compositor y modo; guía desplegable inicialmente cerrada.
- Laboratorio de voces, material armónico propio, alternativas, técnicas de compositor y secciones de análisis.
- Existen viewport móvil, reglas responsive, estilos de foco visible y soporte de movimiento reducido.
- El estudio experimental de frase permanece fuera de la interfaz.

## Prioridades de revisión visual con el usuario
1. **Jerarquía inicial:** el círculo y las decisiones musicales esenciales deben ser reconocibles sin desplazamientos innecesarios.
2. **Flujo de composición:** tonalidad → emoción → compositor → resultado; las herramientas avanzadas deben abrirse cuando se soliciten.
3. **Lectura de acordes:** tipografía, grados romanos, notas comunes, cromatismo y explicaciones deben poder distinguirse.
4. **Laboratorio de voces:** máximo cuatro voces; claridad de bloqueos manuales, alternativas y mensajes de advertencia.
5. **Móvil:** navegación, áreas táctiles, legibilidad de círculo y tarjetas, scroll horizontal y accesibilidad.
6. **Lenguaje visual:** coherencia de espaciado, contraste, estados de selección, botones y ayudas; evitar sobrecargar la pantalla.

## Comprobaciones todavía necesarias
- Capturas y recorrido interactivo real en escritorio y móvil.
- Navegación por teclado, lector de pantalla, contraste y zoom.
- Confirmar que ningún componente oculta una función musical esencial.
- Validar visualmente el estado de errores y propuestas vacías.

## Decisión de producto
No conectar las propuestas experimentales de frase al diseño estable antes de la revisión artística y las pruebas de navegador. Mantener diseño de una sola página, con complejidad progresiva.
