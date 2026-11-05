# Dossier 08 — cierre de brechas de fuentes abiertas (2026-11-05)

## Hallazgo: ya hay fuentes abiertas para los tres perfiles pendientes

### Ludwig Göransson — Black Panther
Ntombi Ngubane, «Killmonger: scoring modes and representation in Black Panther», *Image & Text* 36 (2022), texto abierto y PDF: https://scielo.org.za/scielo.php?pid=S1021-14972022000100006&script=sci_arttext ; https://scielo.org.za/pdf/it/n36/06.pdf .
- El artículo confirma **transcripciones parciales y reducciones para piano** de escenas con Killmonger; estudia instrumentación, melodía y representación narrativa.
- No es una partitura original completa. Su argumentación sobre autoría compartida, colaboración y representación cultural exige evitar simplificar toda la música en un «estilo africano».
- No se han leído aún visualmente todas las notas de cada reducción.

### Thomas Newman — tres estudios universitarios abiertos
Chelsea Oden, *Reflection and Introspection in the Film Scores of Thomas Newman* (U. Oregon, 2016): https://scholarsbank.uoregon.edu/items/601fa4a4-5002-4eb7-b0d9-c80d7d22e792 ; PDF https://scholarsbank.uoregon.edu/bitstreams/2d390217-0b95-4b22-99dd-f26ac78d5668/download . Casos: *Little Women*, *The Shawshank Redemption*, *American Beauty*. Emplea análisis generativo de Agawu; fuente prioritaria para estudiar armonía y temporalidad de Newman.
Iran Garcia, *The Sound of Thomas Newman: Planned or Accidental?* (Berklee, 2017): https://remix.berklee.edu/graduate-studies-scoring/68/ . Hay enlaces separados a estudio, partitura y audio; **verificar la autoría de la partitura descargable antes de considerarla partitura de Newman**.
João Bruno Soeiro, *The Shawshank Redemption: The Birth of an Underscore Language* (Berklee, 2014): https://remix.berklee.edu/graduate-studies-scoring/294/ . Estudio en PDF abierto.
Shane Stever, *Trash Planet and the Sounds of Dancing in Space* (Berklee, 2016): https://remix.berklee.edu/graduate-studies-scoring/53/ . Análisis de *WALL•E*; la partitura descargable no se debe atribuir automáticamente a Newman.

### Howard Shore — LOTR y Cronenberg
Matthew David Young, *Projecting Tolkien's Musical Worlds: A Study of Musical Affect in Howard Shore's Soundtrack to Lord of the Rings* (Bowling Green State University, 2007), tesis abierta de 84 páginas: https://etd.ohiolink.edu/acprod/odb_etd/r/etd/search/10?clear=10&p10_accession_num=bgsu1179760402 .
Melinda Eschenfelder, *Musical Narratives: Thematic Combination and Alignment in Fantasy and Superhero Films* (U. Oregon, 2019): https://scholarsbank.uoregon.edu/items/dac2c32e-eef2-4316-be20-1df5f2128efc . Estudia *The Edge of Night* y el tema de Anakin en términos de combinación temática.
Vikram A. Shankar, *Symphonies of Horror: Musical Experimentation in Howard Shore's Work with David Cronenberg* (Oberlin, 2017): https://digitalcommons.oberlin.edu/honors/219/ . Casos: *The Brood*, *Videodrome*, *The Fly*, *Naked Lunch*. Sirve para evitar reducir a Shore únicamente al lenguaje de *Lord of the Rings*.
- Las páginas de repositorio confirman acceso al texto completo; **aún falta inspeccionar las figuras para verificar qué pentagramas concretos contienen**.

## Revisión de cobertura
Los once compositores cuentan ya con **al menos una fuente académica o transcripción parcial abierta identificada**, pero el nivel de evidencia no es homogéneo. Para Göransson el artículo declara expresamente reducciones parciales. Para Shore y Newman se han localizado tesis de acceso abierto y aún hay que verificar cuáles incluyen notación legible, compases y alturas. Por tanto, **no afirmar 11/11 partituras analizadas**.

## Implicaciones de diseño
- La app web no puede inferir melodía, instrumentación, leitmotivs ni sincronía audiovisual a partir de acordes solos.
- Newman: explorar continuidad armónica y duración percibida como preguntas compositivas, no como análisis temporal medido sin duraciones.
- Shore: diferenciar transformación temática (requiere melodía) de cambio de armonización (detectable parcialmente con acordes).
- Göransson: evitar etiquetar recursos por identidad cultural a partir de armonía aislada.
- Mantener preview pública estable mientras el usuario realiza pruebas externas.

## Próxima auditoría
Descargar y examinar visualmente figuras específicas de las tesis de Oden, Young y Ngubane, anotando página, compases, notas y grado de inferencia; después redactar experimentos por compositor sin sobreinterpretar.
