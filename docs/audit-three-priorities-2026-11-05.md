# Auditoría de cierre: contexto, compositores e interfaz — 2026-11-05

## Alcance
Rama `feature/cinematico-studio-v1`. Se completaron tres líneas de trabajo: continuaciones sensibles al contexto, revisión de evidencia de los 33 recursos de once compositores, y pulido del único desplegable «¿Y si…?».

## 1. Continuaciones contextuales
- `harmonicContinuations` examina hasta los últimos cuatro acordes. Genera candidatos por intención, calcula coincidencias de clases de altura con el contexto, notas compartidas en enlaces, movimiento mínimo estimado y penalización por retorno idéntico a un acorde anterior.
- Mantiene tres intenciones: melancolía, cambio de color y misterio. Los acordes originales no se alteran. Se descartan candidatos con repeticiones inmediatas del mismo conjunto de clases de altura.
- Caso de control: `C G Am F` da continuación menor `Dm E7 Am`; `Dm G C F` da `Em F#7 Bm`. Antes, ambos contextos producían el mismo camino por terminar en F.
- Se mejoró la grafía de varios acordes menores/dominantes cromáticos; la ortografía todavía no se determina mediante una tonalidad global confirmada.
- **Limitación crítica:** el sistema compara contexto mediante heurísticas de clases de altura, no identifica automáticamente una tonalidad ni demuestra modulación. Una secuencia puede ser formalmente válida y musicalmente menos convincente que otra. La etiqueta emocional sigue siendo una invitación creativa, no una predicción.

## 2. Compositores
- Se verificó en ejecución la presencia de once perfiles y 33 técnicas (tres por perfil).
- Se revisaron textos de evidencia de Herrmann, Elfman, Horner, Shore y Newman: referencias académicas abiertas cuando están identificadas, y distinción explícita entre recurso compartido, ejercicio orientativo y procedimiento documentado.
- Referencias relevantes de investigación anterior: Daniel Moreira, MTO 31/4 (2025), Herrmann/Vertigo; Frank Lehman, Music Theory Spectrum 35/1 (2013), Horner/A Beautiful Mind; Chelsea Oden (2016), Thomas Newman; Mark Richards, MTO 22/1 (2016), estudio de temas.
- **No se realizó nueva lectura integral de partituras en esta fase.** Los 33 recursos no constituyen una taxonomía exclusiva ni una transcripción literal de cada autor. Persisten superposiciones de técnicas entre perfiles y no sería correcto prometer estilos identificables solo a partir de acordes.

## 3. Interfaz
- Un único desplegable «¿Y si…?» cerrado por defecto, con hasta tres preguntas y un solo detalle interior abierto a la vez mediante `name`.
- Estilos de baja prominencia visual, tamaño y espaciado móvil, foco visible para navegación con teclado.
- No se añadió un chatbot, modal ni panel flotante.
- **Pendiente:** comprobar visualmente en móvil y escritorio, y validar lectores de pantalla. No se ha ejecutado un navegador real.

## Pruebas realizadas
- Nueve progresiones, incluidas inversiones cromáticas y acordes de séptima, ejecutadas en motor aislado sin errores.
- Verificación de invariantes: tres continuaciones de tres acordes, contexto de máximo cuatro acordes, métricas finitas, no mutación de entrada, máximo tres trayectorias alternativas.
- Dos progresiones que terminan en F producen caminos diferentes.
- JavaScript inline compila sin errores; un único encabezado «¿Y si…?» en HTML.
- Actualizado `tests/harmonic-continuations.test.js` con regresión contextual.
- **No se ejecutó CI ni el archivo de test Node en un runner real.** La validación es parcial y debe completarse antes de publicación.

## Riesgos detectados
1. La función genera siempre tres categorías con material válido, pero su calidad estética no está garantizada.
2. La grafía enarmónica es local, no contextualizada por tonalidad.
3. Los perfiles de compositores son recursos para pensar, no modelos estadísticos entrenados con sus partituras.
4. El acordeón interior con atributo `name` depende del soporte del navegador para exclusividad de details.
5. Se requiere auditoría de accesibilidad y prueba visual real antes de publicar.

## Publicación
La preview pública y producción no se han modificado. Esta fase permanece exclusivamente en la rama de desarrollo.
