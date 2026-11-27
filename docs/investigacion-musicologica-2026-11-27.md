# Cinemático Studio — investigación del motor por compositor (27-11-2026)

Estado: investigación documentada; **no aprobada para activar cambios del motor en producción**.
Base evaluada: commit `8b02134503b512184dc8c117c1f0fa160752f427`, blob de engine.js `a0f350a958be01ae5d3963d87e1327b1e9ea0ae6`. Beta de referencia: 0.2.0-beta.3. Sin cambios de interfaz, audio, motor, paquetes ni infraestructura en este documento.

## Objetivo y evidencia

Cinemático ayuda al compositor a explorar continuaciones de su material, no predice la autoría ni escribe automáticamente su música. Separar observaciones de cifrado, hipótesis de estilo y evaluación auditiva. Las propuestas originales no son transcripciones de obras.

Referencias bibliográficas comprobadas:
- Frank Lehman (2013), *Hollywood Cadences: Music and the Structure of Cinematic Expectation*, Music Theory Online 19(4), https://doi.org/10.30535/mto.19.4.2. La organización de expectativas y llegadas cromáticas es un punto de partida para Williams, no una firma exclusiva.
- Bradley Spiers, *“Adventure is out there!”: Pastiche and Postmodernism in the Music of Up*, Nota Bene, https://ojs.lib.uwo.ca/index.php/notabene/article/view/6583. El estudio trata el desarrollo de temas en diferentes estilos. La recontextualización de una célula de acordes es una hipótesis de aplicación, no una demostración de identidad temática.

No se han inspeccionado todas las partituras originales, ni se han realizado pruebas auditivas a ciegas. Las demás referencias de investigación anteriores deben contrastarse individualmente antes de elevar su grado de evidencia.

## Diagnóstico de los once perfiles

Corpus de diagnóstico: 12 materiales × 11 perfiles × 3 recorridos = 396 propuestas por versión; corpus de evaluación separado: 10 materiales × 11 × 3 = 330. Simulación del JavaScript real en un entorno aislado; no es una ejecución de la suite completa del repositorio.

| Indicador | Motor actual (diagnóstico) | Actual (evaluación) | Experimental (evaluación) |
|---|---:|---:|---:|
| Göransson: recorridos con acordes consecutivos idénticos | 31/36 | 28/30 | 9/30 |
| Newman: recorridos con fundamental constante desde el último acorde original | 17/36 | 16/30 | 6/30 |
| Herrmann: número de acordes mMaj7 | 20 | 20 | 4 |
| Herrmann: recorridos con fundamental constante | 11/36 | 13/30 | 4/30 |
| Zimmer: pedal con cambio de fundamental | 27/36 | 24/30 | 24/30 |
| Horner: acordes de más de tres clases de altura | 0 | 0 | 0 |
| Giacchino: acordes de más de tres clases de altura | 75 | 66 | 66 |

Se comprobaron tres salidas únicas, conservación de la entrada, reconocimiento de acordes y restricciones de final abierto/cerrado según las categorías internas del motor. Cero fallos de esos criterios en estos corpora; no implica excelencia musical.

Experimento: menor incentivo a repetición literal en Göransson, penalización de fundamental fija fuera de continuidad en tres perfiles, moderación de mMaj7 en Herrmann y acumulación de color en Newman, menor preferencia absoluta por tríadas de Horner y ajuste de recuperación en Giacchino. Rechazado como paquete: coincidencias exactas entre perfiles (excluida la resolución directa compartida) aumentan de 22 a 32 en diagnóstico (1870 comparaciones) y de 14 a 15 en evaluación (1595); coincidencias cercanas 42 a 53 y 32 a 32. En evaluación Zimmer/Göransson pasa de 2 a 4 cercanas de 29. En una prueba adicional aislada de Herrmann con 12 materiales (36 recorridos), mMaj7 baja de 21 a 10 pero disminuidos suben de 43 a 56. No trasladar el automatismo de una familia de acordes a otra.

## Fase 1: Williams y Giacchino

Hipótesis Williams: cuando el usuario solicita expansión, apertura o contraste y final automático, explorar la desviación de una expectativa dominante contextual hacia otra región por tercera, con notas comunes; jamás sustituir un cierre explícito. Hipótesis Giacchino: recuperar el patrón de intervalos entre fundamentales de una célula de tres acordes, variando uno o dos tipos/inversiones; no equivale a recuperar un tema melódico.

Prueba experimental separada: 12 materiales de diagnóstico y 10 de evaluación, dos perfiles y tres alternativas por contexto = 132 por versión, 264 entre versiones. Se mantuvo el motor original intacto. En la evaluación:

| Medida | Actual | Experimental |
|---|---:|---:|
| Transformación de célula de Giacchino (3 acordes, mismo patrón de fundamentales salvo transposición, 1–2 cambios de tipo/bajo) | 0/10 | 5/10 |
| Acordes extendidos de Giacchino | 67/88 | 58/88 |
| Desviación cromática candidata de Williams en casos elegibles | 0/4 | 1/4 |
| Coincidencias exactas Williams/Giacchino | 3/29 | 6/29 |
| Coincidencias cercanas (mismas fundamentales, hasta 1 cambio de tipo/bajo) | 9/29 | 11/29 |
| Incumplimientos de invariantes comprobados | 0 | 0 |

Diagnóstico: coincidencias exactas 4 a 9 de 35; cercanas 10 a 15. La variante **no supera la aceptación**. No integrar sus ponderaciones.

### Corpus fase 1 (cifrado, intención, final)

Diagnóstico:
- C F Dm G7 | asombro | auto
- D G Em A7 | esperanza | auto
- Am F C G | nostalgia | auto
- Bm E Bm A | calma | auto
- Gm Eb Bb D7 | epica | auto
- A C#m F#m E7 | esperanza | closed
- Ebmaj7 Cm7 Abmaj7 Bb7 | ternura | auto
- F#m D A E | contraste | open
- C G/B Am F | melancolia | auto
- C Eb Ab Fm | misterio | auto
- Dmaj9 Bm7 G A7 | asombro | auto
- F G F Am | contraste | auto

Evaluación:
- Bb Eb Cm F7 | asombro | auto
- E A F#m B7 | epica | auto
- Cm Ab Eb G7 | esperanza | auto
- C#m A E B | melancolia | auto
- Dm G Dm C | nostalgia | auto
- F C/E Dm Bb | calma | auto
- Ab Fm Bbm Eb7 | alegria | closed
- Gmaj7 Em7 Cmaj7 D7 | ternura | auto
- A C Eb Gb | contraste | auto
- F#m/C# D/C# Bm/C# C#7 | tension | open

Ejemplos originales: C–F–Dm–G7 permite explorar E mayor como alternativa a C, conservando Si; C–F–Am puede recontextualizarse como Cmaj7–F–Am7. En la prueba, Giacchino cambia Bb Eb Cm F7 / asombro / transformación de Bbm7 Eb7 Abmadd9 a Bbm7 Eb Cm. Estas son propuestas para escuchar, no evidencia de fidelidad al autor.

### Problema de búsqueda

La búsqueda retiene 18 caminos por profundidad antes del reordenamiento global. Una trayectoria estructuralmente interesante podría perderse antes de evaluarse. Es una hipótesis que requiere medir cobertura de candidatos y coste, no una causa ya demostrada. Probar familias de semillas contextualizadas y comparar coste, calidad y diversidad con la búsqueda actual; no aumentar controles visibles.

## Escucha pianística

Se comprobó una realización a cuatro voces que omite quinta justa en Cmaj9, Am9, Fmaj7#11 y Cmaj9/E, y conserva las cuatro notas de Cadd9/E. No generalizar a extensiones con quinta alterada o bajos independientes; preservar notas de identidad y bajo explícito. Audición neutra separada de la interpretada; solo piano. Falta evaluación física/auditiva.

## Orden de trabajo y aceptación

1. Williams/Giacchino: distinguir preparación y destino de recuperación y recontextualización.
2. Horner/Shore: transformación triádica frente a retorno y memoria de centros; admitir saltos justificados.
3. Herrmann/Elfman: disonancia organizada, simetrías, romper patrones sin premiar indiscriminadamente disminuidos.
4. Zimmer/Göransson: distinguir pedal y transformación rítmica, que el cifrado solo no describe.
5. Newman/Morricone: economía, resonancia y líneas de bajo con propósito.
6. Silvestri: continuidad de ciclos interválicos y ruptura justificada.
7. Evaluación global: conservar propuestas válidas, comparar grupos de casos sin contaminación, probar transposiciones, penalizar complejidad solo si no aporta, escuchar a ciegas.
8. Codex: sincronizar motor web y Max, reconstruir artefactos, comprobar CI y navegadores, probar Android y Ableton físicos antes de publicar una nueva beta.

No publicar modificaciones del motor hasta superar criterios técnicos y musicales. No añadir funcionalidades ni instrumentos. Este registro preserva resultados tanto positivos como negativos; las cifras son observaciones de pruebas de desarrollo, no estadísticas representativas de la obra de los compositores.
