# Auditoría de interfaz creativa y revisión de cierre — 2026-11-05

## Cambios entregados
- Se consolidaron tres desplegables anteriores («Desarrollar la idea», «Comparar trayectorias» y «¿Y después?») en uno: «¿Y si…? Explora otros caminos».
- El nuevo apartado está cerrado por defecto, muestra como máximo tres preguntas y sus explicaciones solo al abrirlas.
- Los detalles interiores usan el atributo HTML `name="whatif-path"` para permitir un único camino abierto simultáneamente en navegadores compatibles.
- Se mantiene el análisis de acordes y las alternativas técnicas existentes fuera de esta sección; no se añade MIDI ni se cambia el material del usuario.

## Comprobaciones realizadas
- Sintaxis del JavaScript inline correcta después de los cambios.
- Confirmada la eliminación de los tres encabezados anteriores y presencia única del nuevo.
- Ejecución aislada del motor con C–G–Am–F, Am–F–C–G, Cm–Ab–Fm–G, Cmaj7–Dm7–G7–C, C–G y C. No hubo excepciones.
- Se comprobó que los once identificadores de compositores siguen presentes en el motor.
- No se ejecutó navegador real ni CI; falta validar accesibilidad del acordeón y estilos en móvil.

## Hallazgos y prioridades
1. **Alta:** las continuaciones todavía dependen del último acorde, no de la trayectoria global. Las preguntas se formulan como posibilidades creativas y no como inferencias emocionales. Para siguiente versión: ranking contextual con dos o más acordes.
2. **Media:** con menos de tres acordes se puede sugerir continuación, pero no sustitución intermedia; la UI lo maneja omitiendo esa pregunta.
3. **Media:** las grafías enarmónicas de las propuestas pueden ser poco idiomáticas. Requieren corrección según el centro tonal sugerido, sin imponer una tonalidad cuando sea ambigua.
4. **Media:** el motor puede proponer acordes repetidos; hay que distinguir prolongación deliberada de opción redundante.
5. **Media:** revisar las 33 técnicas de los once compositores frente a los dosieres de fuentes accesibles, diferenciando rasgos verificables de convenciones compartidas. No atribuir recursos genéricos exclusivamente a Elfman u otro autor.
6. **Baja:** los encabezados técnicos existentes fuera de «¿Y si…?» pueden seguir recargando la vista. La siguiente auditoría visual debe decidir qué se pliega, sin ocultar controles fundamentales.
7. **Alta antes de publicar:** ejecutar test suite Node, prueba de navegador y revisión móvil/teclado/lector de pantalla.

## Estado
Cambios guardados en la rama feature/cinematico-studio-v1. La preview pública no se ha actualizado.
