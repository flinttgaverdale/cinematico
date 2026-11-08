# Cinemático — auditoría de precisión musical y criterios de investigación
Fecha: 2026-11-06 · Rama experimental, no publicación.

## Objetivo
Generar ideas útiles para componer, no impartir un curso de armonía. La precisión pertenece al motor; la interfaz presenta primero acordes, dirección y carácter probable, con justificación técnica opcional. Los modos simplificado y avanzado difieren en control creativo, no en cantidad obligatoria de teoría.

## Auditoría técnica efectuada
- La página pública usa `index.html` y un motor separado `engine.js`.
- Existen pruebas de regresión, cadencias, integridad estática y navegador móvil/escritorio, integradas en `.github/workflows/reliability.yml`.
- Las pruebas actuales de cadencias reconocen indicios armónicos, pero no pueden confirmar cadencia formal sin melodía, métrica, inversiones precisas y articulación de frase.
- Los perfiles de compositores devuelven sugerencias orientativas, no destructivas; no pueden inferir ritmo, instrumentación o leitmotiv a partir de acordes.
- Esta rama añade evidencia específica de dominante mayor con sensible elevada en tonalidad menor, sin alterar la clasificación histórica de tonalidad ni la selección de propuestas.
- Las nuevas pruebas verifican esa evidencia y preservan las cautelas de cadencia y perfil.

## Hallazgos musicales prioritarios
1. **Tonalidad frente a escala:** `Am Dm E7 Am` puede tener centro en la menor aunque el G♯ de E7 sea ajeno a la colección menor natural. La etiqueta interna `menor natural` es un modelo de compatibilidad, no una descripción exhaustiva del lenguaje menor tonal. Se añade `minorDominantEvidence` para registrar la excepción; queda pendiente revisar la etiqueta de interfaz y el ranking tonal.
2. **Cadencia frente a sucesión:** `Dm G7 C` ofrece evidencia ii–V–I, pero no basta para afirmar cadencia auténtica perfecta. `C F G` solo permite una semicadencia *posible*. No confundir el final del campo de texto con el final de frase.
3. **Dominantes aplicadas:** exigir objetivo plausible y distinguir tonicización local de modulación establecida.
4. **Conducción de voces:** las distancias entre clases de altura son aproximaciones, nunca movimiento real de voces con registro.
5. **Afecto y estilo:** emoción y compositor son lentes para generar alternativas, no propiedades deducibles objetivamente de símbolos armónicos.
6. **Contexto:** el último acorde de una progresión no equivale necesariamente a la tónica; puntuar varias hipótesis y admitir ambigüedad.

## Investigación de perfiles: protocolo
Para cada compositor, elegir obras y fragmentos concretos, documentar compases/edición, describir el gesto observable y separar tres categorías:
- **Demostrado en una partitura:** relación armónica o formal verificable.
- **Recurso compartido:** útil como inspiración, pero no exclusivo del autor.
- **Hipótesis creativa:** experimento inspirado en un rasgo; no atribuir a una obra.

Comparar al menos: tipo de movimiento de fundamentales, relaciones de tercera, uso de dominantes, modalismo, notas comunes, cromatismo, pedal, periodicidad y contexto formal. Evitar inferir orquestación o fraseo si el usuario solo introduce acordes.

### Diferenciación a contrastar
- Bach / escritura contrapuntística: progresión funcional y movimiento de voces; no inferir contrapunto desde acordes.
- Mozart / claridad clásica: articulación formal y preparación cadencial; sin métrica no afirmar períodos.
- Chopin / cromatismo y predominantes: distinguir alteración lineal de modulación.
- Debussy / color modal y planing: no asumir que toda sucesión paralela es funcional.
- John Williams / transformación temática: no detectar motivos sin melodía.
- Zimmer / pedal y capas: no afirmar textura desde un cifrado.
- Giacchino / motivo y cambio de color: distinguir armonía de instrumentación.
- Elfman / cromatismo y danza: no deducir pulso de los acordes.
- Silvestri / gesto temático y llegada tonal: evitar etiquetar heroísmo por un V–I.
- Horner / transformaciones triádicas: comprobar relaciones P/L/R concretas.
- Shore / leitmotiv y modo: requiere información temática.
- Morricone / economía y timbre: no atribuir timbres desde progresión.

La lista es un **mapa de hipótesis para estudio**, no afirmaciones de haber auditado partituras. El catálogo real de la aplicación determina qué perfiles se prueban; no agregar autores sin necesidad.

## Pruebas musicales de aceptación
- `Am Dm E7 Am`: detectar sensible elevada, sin declarar que la colección es exclusivamente menor natural.
- `Am Dm Em Am`: no inventar dominante mayor.
- `Dm G7 C`: evidencia de dirección predominante–dominante–tónica, sin certeza formal.
- `C G7 Am`: resolución interrumpida posible, no «cadencia rota» confirmada.
- `C F G`: semicadencia posible, no confirmada.
- Progresiones breves: ofrecer hipótesis, no certeza de centro tonal.
- Todas las propuestas de compositor: conservar el material original; las operaciones que requieren melodía, ritmo o instrumentación deben señalar esa limitación.

## Próximas tareas antes de integrar en main
- Ejecutar CI y pruebas de navegador en esta rama; corregir fallos.
- Revisar presentación de `menor natural` para no confundir modelo de escala con centro tonal.
- Evaluar ejemplos reales con fuentes primarias (partituras) y registrar evidencia por perfil.
- Someter sugerencias a una evaluación de utilidad compositiva, diversidad y no repetición.
- Integrar solo después de comprobar que no desaparecen paneles ni cambian progresiones guardadas.
