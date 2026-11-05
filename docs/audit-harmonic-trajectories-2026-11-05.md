# Auditoría de trayectorias equilibradas — 2026-11-05

## Implementación
Motor `harmonicTrajectories(chords,start)` y desplegable «Comparar trayectorias armónicas · libertad equilibrada». Parte de tres o cuatro acordes de la progresión del usuario, conserva el primero y el último, modifica un único acorde interior y propone hasta tres recorridos: continuidad, contraste y dirección. Usa alternativas existentes y estimación de movimiento entre clases de altura; no genera melodía ni cambia la progresión original.

## Verificaciones ejecutadas
- Sintaxis de JavaScript incrustado: correcta.
- Ocho progresiones probadas en ejecución aislada, incluidos mayores, menores, acordes con séptima, cromatismo, repetición y casos insuficientes.
- Se comprobaron conservación de extremos, límite de un cambio, diferencia máxima de cuatro clases de altura, máximo tres recorridos, no mutación y resultado determinista.
- Caso de dos acordes: cero resultados. Caso con Cmaj7–Dm7–G7–C: solo una trayectoria.
- Se añadió `tests/harmonic-trajectories.test.js` para ejecución posterior con Node. **No se ejecutó un runner CI ni prueba end-to-end en navegador.**

## Problemas identificados y resueltos
- El rótulo inicial «Dirección hacia la llegada» sugería preparar el acorde final, aunque el algoritmo puede preparar únicamente el siguiente acorde: cambiado a «Dirección armónica».
- Duplicados enarmónicos de propuestas en la misma posición: ahora se comparan conjuntos de clases de altura.

## Limitaciones y riesgos abiertos
1. Los tres criterios son heurísticas descriptivas, no predictores de calidad estética ni de emoción.
2. El algoritmo no garantiza tres trayectorias: el número depende de las alternativas disponibles.
3. La libertad equilibrada conserva los extremos y altera como máximo un acorde interior. Esta es una primera versión deliberadamente conservadora dentro de la preferencia del usuario.
4. La grafía enarmónica de algunos acordes puede ser confusa: por ejemplo, G♯ frente a A♭. Es una prioridad de pulido.
5. Pueden aparecer acordes consecutivos repetidos. No necesariamente son un error musical, pero deben explicarse como posibilidad de prolongación, no presentarse siempre como mejora.
6. La comparación de clases de altura omite registro, disposición de voces, ritmo, duración y melodía; la «dirección» no demuestra cadencia funcional.
7. La UI inserta contenido escapado con la función existente `esc`, y mantiene los recorridos ocultos en un desplegable opcional. Falta evaluación de accesibilidad con lector de pantalla y prueba visual móvil.
8. El archivo de pruebas Node usa `assert.deepEqual` con arrays de otro contexto VM; conviene validar compatibilidad del runner y ajustar si fuese necesario.

## Estado de publicación
Cambios solo en rama `feature/cinematico-studio-v1`; la preview pública externa no se actualizó. Antes de publicar: ejecutar tests en Node/CI, test de navegador y revisión de grafía enarmónica.
