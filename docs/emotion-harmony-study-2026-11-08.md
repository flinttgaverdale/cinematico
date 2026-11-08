# Cinemático Studio — Investigación de armonía y emociones, fase I
**Fecha: 8 de noviembre de 2026 · Investigación documental y diseño musical aplicados.**

## 1. Decisión de producto
El compositor define una **intención creativa** (por ejemplo, «suspense»). El motor propone **gestos armónicos observables** (suspensión, dominante, cromatismo, notas comunes, desvío y posible llegada), y presenta opciones para escuchar. **No calcula cuánto suspense ni qué emoción sentirá una persona.**

El motor conserva las cuatro intenciones rápidas de «Crear» y los quince matices opcionales. No añade selectores, clases o paneles para cada nuevo libro leído. Tampoco convierte la app en una clase de psicología musical.

## 2. Fuentes y nivel de lectura comprobado
Las fichas, URLs, nivel de acceso, tesis y controles negativos están en `research/emotion-harmony-evidence-2026-11-08.json`. Distinguimos: (A) artículo académico accesible o su resumen primario verificado, (B) **descripción o resumen editorial del libro/capítulo, no libro completo**, y (C) hipótesis compositiva propia que aún requiere validación de oyentes.

### 2.1 La emoción no está en un único acorde
- **L. B. Meyer, *Emotion and Meaning in Music* (1956)**. Sumario editorial: expectativas aprendidas, continuidad, completitud y desviación de patrones. Consultado: índice/descripción editorial; no se ha estudiado íntegramente el volumen. https://press.uchicago.edu/ucp/books/book/chicago/E/bo28551887.html
- **David Huron, *Sweet Anticipation* (2006)**. Descripción editorial: cinco familias de respuestas a la expectativa (imaginación, tensión, predicción, reacción y valoración). Respuesta de expectativa ≠ emoción total experimentada. https://mitpress.mit.edu/9780262582780/sweet-anticipation/
- **Juslin y Västfjäll (2008)**: además de la expectativa existen mecanismos de memoria autobiográfica, condicionamiento, contagio emocional, imágenes y respuestas del sistema nervioso, entre otros. Resumen primario: https://pubmed.ncbi.nlm.nih.gov/18826699/
- **Zentner, Grandjean y Scherer (2008)**: cuatro estudios fundamentan las nueve dimensiones de la **Geneva Emotional Music Scale**. Son respuestas evocadas por audición, no una gramática armónica que predice emociones. https://pubmed.ncbi.nlm.nih.gov/18729581/
- **EMMA (2024)**: corpus de fragmentos puntuados por oyentes utilizando GEMS. Muestra por qué no debemos tratar una medición de escucha como regla de cifrado. Artículo completo: https://pmc.ncbi.nlm.nih.gov/articles/PMC11133078/

### 2.2 La tensión armónica depende de contexto y otros parámetros
- **Bigand, Parncutt y Lerdahl (1996)** estudian tensión en secuencias breves e identifican influencias de jerarquía tonal, consonancia sensorial, movimiento horizontal y educación musical. https://pubmed.ncbi.nlm.nih.gov/8668513/
- **Lerdahl, *Tonal Pitch Space* (edición Oxford, 2005)** describe un espacio tonal y modelos de tensión/atracción. Consultado: descripción editorial, no sus ejemplos completos. https://academic.oup.com/book/32497
- **Lerdahl y Krumhansl (2007)** prueban modelos de tensión frente a anotaciones de oyentes; el modelo incluye estructura prolongacional, espacio tonal, superficie y atracción. Consultado: resumen primario. https://doi.org/10.1525/mp.2007.24.4.329
- **Farbood (2006)** incluye parámetros que nuestro cifrado web **no** conoce: dinámica, altura, intensidad de ataques, tempo y regularidad. Consultado: resumen de la tesis. https://www-prod.media.mit.edu/publications/a-quantitative-parametric-model-of-musical-tension/
- **Zhang et al. (2025)** distinguen el efecto del modo mayor/menor bajo **terminaciones estables e inestables**. Evitar «mayor=alegre» sin considerar la progresión es una consecuencia prudente del estudio. Consultado: resumen primario. https://www.sciencedirect.com/science/article/pii/S0001691825000034
- **Carraturo et al. (2025)** revisan factores culturales, experiencia y variabilidad en la percepción de los modos mayor/menor. Consultado: resumen de revisión sistemática. https://pubmed.ncbi.nlm.nih.gov/39721138/
- **Daikoku, Tanaka y Yamawaki (2024)** investigan en 527 oyentes incertidumbre y sorpresa de progresiones con respuestas interoceptivas; no valida una traducción determinista de cualquier progresión a emoción. Artículo abierto: https://pmc.ncbi.nlm.nih.gov/articles/PMC11075058/

### 2.3 Armonía expresiva cinematográfica
- **Frank Lehman, *Hollywood Harmony* (2018), capítulo 5 «Pantriadic Wonder»**: propone un vínculo teórico contextual entre cromatismo pantriádico, asombro, frisson y expectativas en música de cine. Consultado: resumen de capítulo; no acceso a todos sus ejemplos. https://academic.oup.com/book/3654/chapter-abstract/144996319
- **Lehman, «Hollywood Cadences» (2019)**: la función narrativa de la cadencia exige considerar frase, colocación y expectativas, no basta identificar un acorde final. https://doi.org/10.30535/MTO.19.4.2
- **Gabrielsson, «The Relationship between Musical Structure and Perceived Expression» (2015)**: la expresión percibida depende de factores estructurales interactivos; no queda determinada por una variable aislada. Consultado: resumen de capítulo, no todo el volumen. https://academic.oup.com/edited-volume/34489/chapter-abstract/292614599

## 3. Taxonomía interna sin sobreinterpretar GEMS
GEMS utiliza tres meta-factores: *sublimidad* (asombro, trascendencia, ternura, nostalgia, serenidad), *vitalidad* (poder y alegría activa) y *malestar* (tensión y tristeza). Esta taxonomía fue desarrollada para audición. **No está científicamente validado inferir una de estas dimensiones desde una progresión simbólica sin audio.**

Cinemático utiliza una tabla **interna, interpretativa y explícitamente no validada** que conecta intenciones con gestos compositivos:

| Intención en la app | Gesto principal que podemos comprobar | Qué no inferimos |
| --- | --- | --- |
| Misterio | Incertidumbre de la llegada y desviación | Miedo o asombro real |
| Melancolía | Continuidad con color armónico | Tristeza inevitable |
| Tensión | Aplazamiento de la llegada | Tensión fisiológica |
| Esperanza | Apertura / color de la llegada | Optimismo objetivamente medible |
| Nostalgia | Notas comunes + cambio parcial | Recuerdos personales |
| Épica | Movimiento expansivo entre fundamentales | Poder sin ritmo, registro u orquesta |
| Tristeza | Sonoridad menor o color recogido | Tristeza por sí sola |
| Alegría | Posible llegada estructural | Alegría percibida |
| Ternura | Cercanía entre enlaces | Ternura por novenas |
| Asombro | Desvío cromático / cambio de región | Frisson garantizado |
| Inquietud | Incertidumbre y cromatismo | Ansiedad individual |
| Suspense | Cuarta suspendida o dominante pendiente | Suspense cinematográfico sin escena |
| Oscuridad | Sonoridad menor y cromatismo | Asociación universal con oscuridad |
| Calma | Notas comunes y movimiento contenido | Tempo y dinámica calmados |
| Contraste | Cambio entre modo o regiones | Una emoción GEMS específica |

**Contraste no es una emoción:** es una operación compositiva. *Suspense* y *épica* son también objetivos narrativos y estilísticos, no dimensiones validadas de la GEMS. La tabla incorpora afinidades de diseño, no categorías científicas adjudicadas por autores.

## 4. Lo que ahora puede calcular el motor
Sin inventar fraseo ni espectro, usamos indicadores reproducibles:
1. **Notas comunes** entre acordes consecutivos (clases de altura, no voces reales).
2. **Colección cromática exterior** al centro tonal de referencia hipotético.
3. **Enlaces de fundamentales** de cinco a siete semitonos como gesto amplio aproximado, no medida acústica de expansión.
4. **Final suspendido**, posible dominante, posible llegada a tónica y cambio de modo de una sonoridad.
5. **Séptima mayor / novena añadida** como colores armónicos, nunca equivalencias de ternura o esperanza.
6. **Confianza tonal contextual** de las funciones existentes, evitando consolidar centros ambiguos como un hecho.

La nueva selección parte de una puntuación estructural preexistente (notas comunes, movimiento aproximado y compatibilidad de contexto) y añade una **pequeña ponderación creativa**, variable según intención, ligada a gestos observables. No son probabilidades, porcentajes de emoción, ni entrenamiento estadístico. La originalidad y el interés artístico se juzgan de oído.

## 5. Controles negativos obligatorios
- `Am` aislado: no confirmar La menor ni prometer tristeza.
- `Am F Dm` ambiguo: una llegada en Re mayor es contraste de color, no «esperanza demostrada».
- `Dm G7 C`: cadencia simbólica potencial, no certeza de alegría.
- `Am F C G` → `Csus4`: la cuarta suspendida mantiene una resolución pendiente; no es un cierre terminado.
- `C G Am F`: un desenlace diferente puede apoyarse en el centro anterior y no simplemente en la fundamental del último acorde.
- `Cmaj7 Fmaj7 G7 C`: la séptima mayor no produce nostalgia por definición.

## 6. Evaluación musical que aún falta
**Investigación documental no equivale a experimento perceptivo.** Necesitamos una evaluación musical de usuarios con nociones de armonía y distintos instrumentos, comparando:
- tres alternativas de igual sonido y tiempo de acorde;
- una selección con/sin la nueva ponderación de gestos;
- coherencia musical de cada alternativa y grado de diferenciación;
- si la intención creativa del usuario se percibe en el fraseo **una vez interpretado**;
- qué proporción de propuestas resulta útil y tocable, sin confundir el juicio con una validación clínica o psicométrica.

Cinemático Web continúa sin análisis MIDI, sin la obligación de guardar ideas, y sin nuevas pantallas para esta taxonomía. El músico manda; la teoría permanece detrás del motor.
