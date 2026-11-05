# Estudio abierto 04 — análisis verificable de ejemplos musicales (2026-11-05)

## Fuente principal
Mark Richards, «Film Music Themes: Analysis and Corpus Study», *Music Theory Online* 22/1 (2016), texto íntegro y ejemplos con notación/audio: https://www.mtosmt.org/issues/mto.16.22.1/mto.16.22.1.richards.html . Corpus de **482 temas**, no 482 partituras completas. Las etiquetas de Richards son **formas de temas concretos**, no atributos permanentes de compositores.

### Williams: tres mecanismos, no un único «estilo heroico»
- *E.T.* tema principal, **ejemplo 30**: segunda idea conserva ritmo y altera levemente contorno/intervalos, pero acelera ritmo armónico a un acorde por compás; en la tercera idea cambia hacia armonías del lado bemol, configurando una cláusula de desarrollo. La **dirección de la variación** es parte del resultado.
- *Star Wars* tema principal, **ejemplo 33**: Richards explica el tratamiento de ideas enlazadas mediante «hinge» y la ambigüedad que produce la notación respecto de su período desarrollado.
- *Raiders of the Lost Ark*, **ejemplo 24**: ejemplo de período sentencial.
**Implicación:** una misma autoría ofrece distintas formas. En web con acordes podemos detectar ritmo armónico solo si hay duraciones explícitas; actualmente no las hay.

### Morricone: divergencia armónica manteniendo motivo
- *The Good, the Bad and the Ugly*, **ejemplo 16**: presentación armónica **i–IV / i–♭VII**; tercera idea inicia en **♭VI**, rompiendo el patrón mientras conserva motivos melódicos. La idea final cierra con una cadencia plagal coloreada por el dórico. El artículo también identifica una ligadura de re hacia el compás siguiente en vez del retorno a la; es un cambio melódico concreto.
- *The Mission*, «Gabriel's Oboe», **ejemplo 34**: material en re mayor; descenso de grado 1 a 5 en el compás 2 que reaparece en el inicio de A2 con ornamentación y desplazamiento métrico; fragmentación en compases 6–8 y cierre en 9–12. Richards clasifica el conjunto como sentencia desarrollada excepcionalmente libre.
**Implicación:** una divergencia armonizada es diferente de un contraste de timbre. La app puede sugerir reharmonización manteniendo notas comunes, pero no afirmar que retiene el motivo sin melodía.

### Herrmann, Zimmer y Shore: ejemplos de «motto»
Richards, **párrafo 4**, clasifica como temas motto el motivo de *Citizen Kane* de Herrmann, la Rebel Fanfare de Williams, el ostinato armónico de cuatro acordes de *Inception* de Zimmer y el tema de Mordor de Shore. La ausencia de segunda mitad de respuesta es una propiedad de esos **pasajes**; no implica que toda la música de estos compositores sea reiterativa.

### Otras observaciones
Richards **párrafo 68** advierte que la forma temática cinematográfica depende frecuentemente de relaciones melódicas más que de cadencias clásicas. Por tanto, no es válido generar una etiqueta de período, sentencia o cláusula usando únicamente la secuencia de acordes.

## Fuente secundaria
Scott Murphy, «The Major Tritone Progression in Recent Hollywood Science Fiction Films», *Music Theory Online* 12/2 (2006): https://www.mtosmt.org/issues/mto.06.12.2/mto.06.12.2.murphy.html .
Define la relación de tritono entre raíces de dos tríadas mayores o menores, y el subtipo mayor–mayor. Los ejemplos de cine son **evidencia de un recurso compartido**, no de un «acorde propio» de Williams.

## Matriz de evidencia de los once
| Perfil | Ejemplo con notación abierta consultada | Estado |
|---|---|---|
| Williams | Richards 24, 30, 33 | SÍ |
| Zimmer | Richards, análisis textual *Inception* | PARCIAL (no transcripción de cue completo) |
| Herrmann | Murphy *Vertigo* ejemplos 1–2; Richards *Citizen Kane* | SÍ |
| Horner | Lehman *A Beautiful Mind*, reducciones y redes | SÍ |
| Shore | Richards, *Mordor* y análisis textual | PARCIAL |
| Morricone | Richards 16 y 34 | SÍ |
| Giacchino | *Up*, partitura comercial sin acceso completo | NO |
| Elfman | *Edward Scissorhands*, partitura comercial sin acceso completo | NO |
| Silvestri | *Back to the Future*, partitura comercial sin acceso completo | NO |
| Newman | Richards, referencias temáticas y fuentes secundarias | PARCIAL |
| Göransson | *Oppenheimer*, entrevistas y reducciones comerciales | NO |

**Conclusión honesta:** los once cuentan con dossier documental; el examen de **notación abierta** no está completo para los once. No llamar al proyecto «estudio exhaustivo terminado» hasta resolver los NO/PARCIAL o delimitar explícitamente el corpus.

## Experimentos futuros seguros (no implementados)
1. Detección de mayor–mayor con raíces a tritono en pares de acordes introducidos por el usuario, con nota de neutralidad emocional.
2. Sugerencia de divergencia en tercer acorde conservando una nota común; distinguir hipótesis de continuidad armónica de continuidad melódica.
3. Al incorporar duraciones en futura integración Ableton, análisis de aceleración del ritmo armónico y articulación de frase. Sin MIDI en web.
