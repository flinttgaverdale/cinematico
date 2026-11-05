# Auditoría musical y de producto — 2026-11-05

## Principios verificables
- Un perfil de compositor no es una transcripción ni una predicción de autoría. Separar observaciones armónicas medibles, preferencias experimentales y afirmaciones documentadas.
- Una progresión diferente no demuestra un estilo diferente. Evaluar en contextos idénticos movimiento del bajo, conducción de voces, tensión, resolución y estructura de frase.
- La emoción no se deduce solo de una sucesión de acordes: tempo, dinámica, articulación, timbre, registro, memoria y contexto alteran la percepción.
- En la web no hay análisis MIDI; máximo cuatro voces y conservación de decisiones manuales.

## Hallazgos y correcciones
1. Varias alteraciones estaban duplicando el bemol ya implícito en eólico, frigio o mixolidio. Corregidos perfiles de Zimmer, Göransson, Shore y ejemplos emocionales. **Pendiente:** validar todas las etiquetas romanas y la realización tonal de cada modo.
2. La primera versión de auditoría de compositores calculaba intervalos como grado×2. Corregido para usar alturas modales reales. **Pendiente:** comparar secuencias con duraciones, inversiones, bajo y cadencias; la igualdad de firmas no basta.
3. La interfaz permite elegir tonalidad por círculo o selector directo y comienza con guía plegada. **Pendiente:** comprobar accesibilidad, tamaños táctiles y diseño móvil real.
4. Se añadieron pruebas de integridad y conducción expresiva. **Pendiente:** ejecutar la suite completa y validar despliegue; no se afirma que pasen.

## Diseño de experimento para los 11 compositores
Para cada perfil: fijar tonalidad, emoción, modo, acorde inicial y frase de 4–8 acordes. Obtener candidatos con el mismo conjunto de reglas base y medir diversidad entre perfiles: raíces, calidades, enlaces de voces, direcciones del bajo, cadencias y tensiones retenidas. Repetir con varias tonalidades y emociones. Registrar coincidencias y justificar cualquier preferencia estilística con análisis de partituras. Evitar introducir sesgos artificiales para forzar diferencias.

## Diseño de experimento para las 12 emociones
Fijar compositor y tonalidad; variar intención. Evaluar si el motor ofrece cambios explicables en estabilidad, cromatismo, densidad, dirección y resolución. Los resultados son hipótesis de expresión, no garantías de emoción percibida. Sin tempo/timbre/dinámica, la capacidad predictiva es limitada.

## Bibliografía de partida (revisar partituras y ampliar evidencia)
- Frank Lehman, *Hollywood Harmony* (2018), cap. 4, «Analyzing Chromaticism in Film». https://doi.org/10.1093/oso/9780190606398.003.0005
- Frank Lehman, «Hollywood Cadences: Music and the Structure of Cinematic Expectation», *Music Theory Online* 19.4 (2013). https://doi.org/10.30535/MTO.19.4.2
- Daniel Moreira, «Weird, Menacing, and Colorful: Bernard Herrmann's Harmonic Polytonality», *Music Theory Online* 31.4 (2025). https://doi.org/10.30535/mto.31.4.5
- Tuomas Eerola, Anders Friberg y Roberto Bresin, «Emotional expression in music: contribution, linearity, and additivity of primary musical cues», *Frontiers in Psychology* (2013). https://pmc.ncbi.nlm.nih.gov/articles/PMC3726864/
- Patrik N. Juslin y Daniel Västfjäll, «Emotional responses to music: The need to consider underlying mechanisms», *Behavioral and Brain Sciences* 31.5 (2008). https://doi.org/10.1017/S0140525X08005293

## Puertas de calidad antes de producción
1. Ejecutar y corregir tests de perfiles, modalidades, armonía y voces.
2. Comprobar al menos una matriz 11×12 de perfiles/emociones con tonalidades distintas.
3. Validar funcionamiento real en móvil y escritorio, teclado y lector de pantalla.
4. No publicar nuevos motores estilísticos sin pruebas comparativas y referencias documentales.
