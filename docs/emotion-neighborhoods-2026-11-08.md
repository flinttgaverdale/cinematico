# Cinemático Studio — afinidad emocional, fase II
**8 de noviembre de 2026 · Agrupación flexible para compositores que trabajan con un instrumento**

## Decisión
No debemos fingir una frontera precisa entre «melancolía», «nostalgia» y «tristeza», ni entre «misterio», «suspense», «inquietud» y «tensión». Están próximos en el lenguaje cotidiano, pero pueden requerir recursos musicales distintos según el contexto. Los nombres se conservarán como *matices opcionales*, no como predicciones del motor.

### Cinco familias expresivas de producto
| Familia | Matices que aparecen juntos | Gesto compositivo compartido, tentativo |
|---|---|---|
| Luz y expansión | Esperanza, alegría, épica | Apertura, ampliación, llegada |
| Calma y cercanía | Calma, ternura, nostalgia | Continuidad, notas comunes, color |
| Melancolía y sombra | Melancolía, tristeza, oscuridad | Recogimiento, sonoridad menor, cromatismo |
| Tensión e incertidumbre | Tensión, suspense, inquietud, misterio | Retener expectativas, suspensión, desvío |
| Cambio y asombro | Contraste, asombro | Desvío de región, transformación inesperada |

**No son cinco clases científicamente medidas.** Son vecinos funcionales para componer sin convertir la interfaz en un test emocional.

La pertenencia en el menú es única por facilidad de navegación, pero en el motor las relaciones son *porosas*:
- Nostalgia ↔ melancolía (además de su cercanía con ternura).
- Misterio ↔ asombro, oscuridad.
- Oscuridad ↔ inquietud.
- Asombro ↔ esperanza.
- Contraste ↔ inquietud.
- Épica ↔ tensión.
- Alegría ↔ ternura.

Se trata de **vecindades compositivas sugeridas**: son hipótesis de diseño que deberán validarse por escucha, no relaciones descubiertas mediante un modelo estadístico. Además, «contraste», «épica» y «suspense» pueden ser *gestos o objetivos narrativos* antes que sentimientos del oyente.

## Estudios contrastados
1. **Eerola y Vuoskoski (2011), «A comparison of the discrete and dimensional models of emotion in music»** — resumen editorial del estudio con 116 no músicos, 110 fragmentos de música de cine. Las dimensiones de valencia y activación ofrecen buena correspondencia con categorías discretas; las etiquetas discretas son menos precisas ante ejemplos ambiguos. https://doi.org/10.1177/0305735610362821
2. **Vuoskoski y Eerola (2011), «Measuring music-induced emotion»** — resumen editorial de 148 participantes y 16 fragmentos cinematográficos. La escala dimensional fue más consistente en esas condiciones; la experiencia individual y el humor modificaron las respuestas. https://doi.org/10.1177/1029864911403367
3. **Eerola y Saari (2025), «What emotions does music express?»** — artículo completo abierto, tres experimentos. Identifica estructuras de 7 y 4 factores para emoción expresada, que *no equivalen* a categorías de emoción inducida. La propia cantidad de factores depende del método y del fenómeno que se mide. https://pmc.ncbi.nlm.nih.gov/articles/PMC11753638/
4. **Juslin (2013), «What does music express? Basic emotions and beyond»** — artículo completo abierto. Distingue capas básicas, intrínsecas y asociativas de expresión que permiten ambigüedad y dependencia cultural, individual y contextual. https://pmc.ncbi.nlm.nih.gov/articles/PMC3764399/
5. **Zentner, Grandjean y Scherer (2008), GEMS** — resumen primario. Nueve dimensiones de emoción *evocada* agrupadas en tres metadimensiones. Esta investigación no justifica asignar «un acorde a cada emoción». https://pubmed.ncbi.nlm.nih.gov/18729581/
6. **EMMA (2024)** — artículo completo abierto; corpus de fragmentos y respuestas de oyentes basado en GEMS. Buena guía para validaciones perceptivas futuras, no para clasificar progresiones simbólicas sin audio. https://pmc.ncbi.nlm.nih.gov/articles/PMC11133078/

La investigación previa sobre expectativas, armonía de cine, tensión y contextos armónicos sigue referenciada en `research/emotion-harmony-evidence-2026-11-08.json` y `docs/emotion-harmony-study-2026-11-08.md`.

## Qué cambia y qué no
**Cambia:** el menú opcional de matices se ordena en cinco grupos con `optgroup`; la lógica interna expone `emotionNeighborhood(id)` con vecinos de cada intención y afinidades secundarias, sin dibujar pantallas nuevas.

**No cambia:** las cuatro intenciones rápidas; las 15 opciones disponibles; la toma de decisiones del músico; la independencia de «Lenguaje de referencia» respecto de «Mis acordes»; el modelo de escucha; la ausencia de MIDI en web y de guardado; la puntuación contextual del motor.

**De forma deliberada, no reentrenamos ni forzamos la puntuación armónica según estas familias.** No hay datos experimentales suficientes para afirmar que una determinada serie de acordes «suena» a una familia. Unificar las puntuaciones haría las propuestas más repetitivas, justo lo contrario de la exploración creativa. Las familias sirven para facilitar decisiones y guiar un estudio de escucha, no para homogenizar automáticamente las armonías.

## Evaluación pendiente
Hacer escucha A/B con compositores de nivel medio, con el mismo sonido y duración, y preguntar no «¿qué emoción exacta has sentido?», sino:
- ¿Cuál de los tres caminos te da ganas de probarlo con tu instrumento?
- ¿Se perciben como opciones distintas?
- ¿Te ayuda el nombre general de la familia o prefieres otro matiz?
- ¿La continuidad con los acordes iniciales tiene sentido musical?

No transformar estos resultados en puntuaciones científicas sin muestra, protocolo y control de variables.
