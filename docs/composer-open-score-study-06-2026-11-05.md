# Estudio 06: tritono sucesivo, redes cromáticas y superposición armónica

## Corpus abierto verificable
1. Scott Murphy (2006), «The Major Tritone Progression in Recent Hollywood Science Fiction Films», *Music Theory Online* 12/2: https://www.mtosmt.org/issues/mto.06.12.2/mto.06.12.2.murphy.html . Ejemplos publicados: Williams *Star Wars*, Horner *Star Trek II*, Elfman *Men in Black* y *Planet of the Apes*, Silvestri *Flight of the Navigator* y *Lilo & Stitch*. El texto también discute *Back to the Future*. **Importante:** la relación mayor–mayor a tritono no es propiedad de un único autor ni posee un afecto único.
2. Frank Lehman (2013), «Transformational Analysis and the Representation of Genius in Film Music», PDF académico abierto: https://franklehman.com/wp-content/uploads/2020/02/MTS-Article.pdf . Estudia tres cues de Horner en *A Beautiful Mind* con operaciones L, R y S; **no** reducir el sistema a movimientos de bajo ni confundir transformaciones entre tríadas con modulación tonal funcional.
3. Daniel Moreira (2025), «Weird, Menacing, and Colorful: Bernard Herrmann’s Harmonic Polytonality», *Music Theory Online* 31/4: https://www.mtosmt.org/issues/mto.25.31.4/mto.25.31.4.moreira.html . Ejemplo 1a: superposición E♭ menor / D mayor en *Vertigo*; ejemplo 24: cue «The Window» con transcripción y espectrograma. El artículo analiza el papel conjunto de timbre, ataque, registro, textura y disonancia en los policordios.

## Conclusiones para Cinemático
- **Sucesión:** C mayor → F♯ mayor constituye dos tríadas sucesivas separadas por tritono; motor `tritoneTriadRelations` ya disponible y UI en rama de trabajo.
- **Transformación:** una relación cromática de Horner puede estudiarse con operaciones neorriemannianas; la mera sucesión de fundamentales no identifica su función narrativa.
- **Superposición:** E♭ menor y D mayor comparten una clase de altura (G♭/F♯). El conjunto de cinco clases de altura es compatible con **dos tríadas simultáneas**, pero el conjunto de notas por sí solo no demuestra que estén estratificadas ni que se perciban como policordio.

## Implementación aislada en el motor
`triadicLayeringHypotheses(chord)` encuentra particiones exactas de un conjunto de clases de altura en dos tríadas mayores/menores. Admite una nota compartida, necesaria para el ejemplo E♭m/D de Herrmann. No deduce textura, timbre, registro, simultaneidad ni identidad estilística. **No se expone aún en la UI** porque el formato de progresión del usuario no proporciona capas ni orquestación.

## Pruebas aisladas ejecutadas
- {E♭, G♭, B♭, D, A} → una partición E♭m + D.
- {C, E, G, D♭, F, A♭} → una partición C + D♭.
- {C, E, G} → ninguna.
- C → F♯ en la función de sucesión → una relación mayor–mayor.

## Próximas exigencias
- No etiquetar «policordio» sin capas explícitas.
- No trasladar asociaciones cinematográficas específicas a todas las obras de un autor.
- Revisar ejemplos accesibles para perfiles con evidencia incompleta.
- Realizar CI y prueba visual antes de desplegar la rama; la preview pública de la prueba externa permanece sin cambios.
