# Bibliotecas de recursos compositivos — ampliación de perfiles (2026-11-05)

## Problema identificado
La sección «Recursos para avanzar tu idea» tenía bibliotecas de tres técnicas para Williams, Herrmann y Zimmer; los otros ocho perfiles devolvían una lista vacía y mostraban texto provisional.

## Implementación
Se han incorporado tres propuestas para cada perfil ausente:
- **Giacchino**: motivo con variación, cambio de color instrumental, contraste narrativo.
- **Elfman**: vecindad cromática, pulso de danza, contraste de registros.
- **Silvestri**: fanfarria, cadencia dirigida, impulso rítmico.
- **Horner**: giro modal, quintas abiertas, arco lírico.
- **Shore**: transformación temática, intercambio modal, capas corales.
- **Morricone**: economía de materiales, identidad tímbrica, pedal modal.
- **Newman**: espacio y silencio, acordes con novena, pulso ligero.
- **Göransson**: contrarritmos, aceleración perceptiva, transformación expresiva del solista.

Cada propuesta incluye dominio, fundamento, acción concreta, procedencia estilística y observación contextual. No edita los acordes. La asociación a un compositor es una orientación para explorar, no una atribución exclusiva ni una transcripción verificada.

## Fuentes consultadas y alcance
- Michael Giacchino, entrevistas sobre orquestación y color narrativo: https://www.denofgeek.com/movies/michael-giacchino-interview-ratatouille-mission-impossible/
- Michael Giacchino, tema y construcción de motivos: https://d23.com/composer-michael-giacchino-looks-back-on-tomorrowland-10-years-later/
- Thomas Newman, entrevista BFI sobre instrumentación y finales no resueltos: https://www.bfi.org.uk/interviews/scoring-mr-banks-composers-life-hollywood
- Danny Elfman, entrevista sobre orquesta como motor rítmico: https://www.thefader.com/2022/08/15/danny-elfman-doesnt-need-an-invitation
- Ludwig Göransson, entrevista sobre Oppenheimer y violín expresivo: https://www.slashfilm.com/1448770/composer-ludwig-goransson-oppenheimer-score-exclusive-interview/
- Ludwig Göransson, contrarritmos en Black Panther: https://www.awardsdaily.com/2019/02/13/interview-ludwig-goransson-on-finding-the-musical-score-of-wakanda-in-black-panther/
- Ludwig Göransson, cambios de tempo y articulación: https://www.nme.com/features/film-interviews/oppenheimer-score-soundtrack-ludwig-goransson-christopher-nolan-3471661

**Límite musicológico:** los recursos de Silvestri, Horner, Shore y Morricone son hipótesis estilísticas orientativas basadas en procedimientos generales; no se han contrastado todavía con un corpus identificado de partituras. Tampoco se han cotejado pasajes concretos para las restantes bibliotecas. No deben presentarse como análisis de partituras verificadas.

## Verificación
El motor compiló en intérprete JS aislado y devolvió tres recursos para cada uno de los once compositores. Se añadió una prueba de regresión en `tests/composer-technique-coverage.test.js`. Pendiente: confirmar CI Node y prueba real de interfaz.
