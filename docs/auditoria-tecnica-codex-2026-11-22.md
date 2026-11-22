# Cinemático Studio — auditoría técnica integral para Codex
**Corte:** 22 de noviembre de 2026 · `main` en `2a74cc22aaa2510941be392e1b8d06f922c068a0`.  
**Método:** lectura directa del repositorio GitHub, inspección de los workflows y sus resultados, reproducción en JS del algoritmo de voicing, contraste con manuales de Cycling '74/Ableton. **No se ha ejecutado Codex desde esta conversación, ni se ha iniciado una sesión real en Ableton o Android físico.**

## 1. Resumen ejecutivo
La última ejecución de **Cinematico reliability checks** `45002664015` y de **pages build and deployment** `45002663990` terminó en verde. El conjunto de regresiones es considerable y merece preservarse. Sin embargo, **la versión distribuible no está lista para una beta pública de confianza**: las reglas MIDI pierden información armónica, el formato AMXD no ha sido probado en el host real y el flujo APK no ofrece todavía actualizaciones firmadas de manera estable. La ingeniería web y el cuidado de las distinciones musicológicas constituyen una buena base.

Este documento es una **auditoría basada en evidencia**, no un veredicto sobre la calidad subjetiva de las composiciones. No confundir CI verde con aceptación musical.

## 2. Hallazgos: orden estricto

### P0 — Bloqueantes antes de llamar estable al plugin/Android

**AUD-01 — El generador MIDI ignora el bajo independiente (confirmado).**  
`live/cinematico-generator.js:43-50` usa `ch.root` como primer pitch, sin consultar `ch.bass`. El motor sí reconoce bajos de inversión o externos. Reproducción:
- `C/E`: esperado bajo Mi (pc 4), generado Do (48 = pc 0).
- `G7/B`: esperado Si (pc 11), generado Sol (55 = pc 7).
- `C/Bb`: esperado Si bemol (pc 10), generado Do (pc 0), y Si♭ ni siquiera aparece.
**Impacto:** la salida puede cambiar la función sonora del acorde; la app no avisa.
**Solución deseada:** bajo obligatorio separado, inversión real, soporte de bajo que no pertenezca a la tríada, registro y transposición. Añadir regresión en distintos centros.

**AUD-02 — Se pierde la identidad de extensiones de 5 notas (confirmado).**  
`live/cinematico-generator.js:48-50` trunca a `intervals.slice(0,4)` **ordenados por intervalo cromático**. Ejemplo `Cmaj7#11`: genera pitch classes C E F♯ G y **elimina B**, la séptima mayor; `Bbmaj7#11` elimina A. **Solución:** voicing consciente de funciones: priorizar 3ª, 7ª y alteración, o escribir 5 notas cuando el instrumento lo permita. Debe ser reproducible y explicado. Reproducción ejecutable: `node audit/repro-live-voicings.cjs`.

**AUD-03 — La carga y aplicación del `.amxd` no ha sido validada en Live 12 (riesgo de release, no fallo probado).**  
`live/build_amxd.py` ensambla un contenedor de tipo `nagg` con scripts embebidos y `tests/live-generator-regression.cjs` simula la lógica JavaScript. Esto **no confirma** que Max resuelva las dependencias, que el texto y menús se muestren completos en Windows o que `live.miditool.in/out` funcionen realmente en un clip. La única afirmación válida hoy es **«estructura y lógica verificadas fuera del host»**. Crear una **prueba de aceptación en Ableton Live 12 Suite, Windows**, con grabación o captura, log de Max, clip vacío, tres caminos, acorde slash, 4/4 y compás distinto, Undo y rechazo de entradas inválidas. Verificar el formato `nagg` y los archivos incrustados *dentro* del dispositivo real.

**AUD-04 — El instalador Android no tiene ruta segura de actualización estable (confirmado por configuración).**  
`android/app/build.gradle`: `versionCode 1`, `versionName '0.1.0-beta'` constantes. `.github/workflows/android-apk.yml`: `assembleDebug` con clave de depuración local del runner y sobreescritura de un mismo asset/tag `android-beta-0.1`. Una nueva compilación puede llevar una **firma distinta** a la instalada y hacer inviable actualizarla sin desinstalación. **Solución:** keystore de distribución en secretos protegidos, `versionCode` monótono, release inmutable por versión, comprobación de firmas y actualización real entre versiones en al menos un teléfono. No publicar credenciales.

### P1 — Prioridad alta para próximas pruebas

**AUD-05 — Ritmo y contexto MIDI excesivamente rígidos (confirmado por código).**  
`live/cinematico-generator.js:52-62` fija `start_time:bar*4`, `duration:3.75` y `velocity:90`, con tres acordes a partir del pulso 0. Funciona como prototipo **4/4**, pero **ignora** inicio de selección, métrica diferente, compases menores, origen del clip, fraseo y restricciones del usuario. Tampoco analiza realmente su clip: la fuente es texto introducido manualmente. Añadir un adaptador de contexto: selección temporal, compás, datos originales, validación de extensión y seguridad de generación. Evitar tocar clips reales hasta tener pruebas de reversibilidad. La especificación de Cycling '74 confirma el carácter aditivo de `live.miditool.out` para un Generator: https://docs.cycling74.com/reference/live.miditool.out .

**AUD-06 — Release Android no rastreable como entrega actual (confirmado).**  
GitHub Release `android-beta-0.1` tiene asset `Cinematico-Android-Beta.apk` modificado el **8 de noviembre de 2026**, mientras `main` está en el **22 de noviembre de 2026**. No demuestra por sí solo que el motor web dentro del APK sea diferente —gran parte de los commits recientes son de Max—, pero **no existe una prueba de igualdad SHA entre APK publicado y árbol de trabajo actual** ni una matriz por versión para el usuario. Incluir un `build-info.json` con SHA/tag/fecha y test de paridad de assets, publicar enlace estable por versión y evitar reusar tag.

**AUD-07 — Carencia de escucha y evaluación humana formal (limitación epistemológica).**  
Las cinco familias, quince intenciones y variaciones armónicas tienen fundamentación bibliográfica, pero los tests de `research/expressive-listening-pairs-v1.json` describen **experimentos diseñados, no resultados de músicos**. Las 480 situaciones simuladas cuantifican diversidad simbólica, no calidad, funcionalidad narrativa o emoción vivida. Mantener ese límite en UI y marketing; pasar a escucha A/B con fragmentos equiparados en timbre/tempo y entrevistas breves.

**AUD-08 — Gran HTML de terceros incorporado al repositorio público (requiere revisión y saneamiento).**  
`Investigación Armónica Cinematográfica _ Use AI.html` ocupa ~1 MB y es un HTML guardado de `use.ai` con **49 etiquetas `<script>`**, enlaces a scripts y analítica externos. No es parte del motor y puede quedar servido públicamente por GitHub Pages si se navega a su ruta. **No se ha demostrado fuga de secretos** con la inspección efectuada. Antes de retirarlo, auditar licencia, datos personales y dependencia documental; reemplazar si procede por una ficha bibliográfica o documento sin scripts en `research/`. No ejecutar sus scripts como parte de la app.

### P2 — Mantenibilidad, QA y gobernanza

**AUD-09 — Código de UI monolítico y definiciones duplicadas.**  
`index.html` ~119 KB mezcla estructura HTML, estilo y lógica JS; `engine.js` ~155 KB; `live/cinematico-core.js` copia el motor completo. Existen catálogos de acordes/modos en UI y motor con representaciones separadas. Hoy la copia Max se comprueba con `startsWith` en CI; conviene una generación determinista única y pruebas semánticas de paridad, sin refactorizar en exceso durante las pruebas de usuario.

**AUD-10 — Pruebas web buenas, pero integración externa simulada.**  
En GitHub Actions se prueban parseo, armonía, compositor, PWA offline y navegadores de tamaños escritorio/móvil. El generador se prueba con mocks; falta Live real. El APK pasa una comprobación estructural ZIP/DEX, **no instrumentación o test de audio en Android**. Añadir smoke manual documentado, release checklist, e idealmente Android Instrumentation/Emulator para pantallas y reproducción.

**AUD-11 — Entrega y documentación de Live con rutas incompatibles.**  
`downloads/Cinematico-Live-Preview.zip` (vieja fuente) y `downloads/Cinematico-Generator-Beta.amxd` (archivo más reciente) coexisten; `live/INSTRUCCIONES.md` explica convertir manualmente una plantilla y `live/INSTALACION-DIRECTA.md` explica el archivo único. Consolidar un solo instalador/documento principal con versión, requisitos, limitaciones y compatibilidad clara.

**AUD-12 — Protecciones de GitHub y reproducibilidad del pipeline.**  
La API de GitHub informa que **`main` no está protegida**. Los deployments de Pages salen tras push a `main`; las pruebas de navegador instalan Playwright con `npm install --no-save` y no hay lockfile de proyecto visible. Proponer PR obligatoria para releases, checks requeridos, bloqueo de push directo cuando se entre en beta compartida, dependencias pinneadas, caché controlada y entornos con aprobación para distribuir APK.

**AUD-13 — Instrucciones visuales que deben probar usuarios reales.**  
La pantalla web avanzada se abre en selector neutro y las cuatro intenciones están explicadas, conforme a la intención de producto. Aun así, múltiples textos de 10–12 px y paneles de herramientas no se han auditado mediante lectores de pantalla, pruebas de fatiga o uso a la luz natural. Prioridad a móvil real y en pantalla compacta de Live antes de rediseñar.

**AUD-14 — Registro de Service Worker y caché desincronizados nominalmente (deuda menor).**  
`index.html` registra `service-worker.js?v=43` mientras `service-worker.js` declara caché `cinematico-studio-v47`. `updateViaCache:"none"` y la actualización explícita evitan por ahora concluir un fallo, pero el versionado manual separado resulta frágil. Unificar el ID de build y probar la actualización instalada.

## 3. Qué funciona y merece conservarse
- CI actual y Pages pasan en la revisión auditada.
- Parseo avanzado, slash bass en el motor web, análisis tonal contextual y 15 intenciones con familias porosas.
- Explicaciones musicales con cautelas metodológicas; no se atribuyen porcentajes emocionales.
- Entrada Crear simple con 4 direcciones + matices opcionales; Estudio avanzado con acceso independiente.
- PWA cacheada, prueba automática offline y Android autónomo empaquetado con el motor.
- Max Generator `.amxd` con estructura embebida y simulaciones de 270 planes armónicos, aunque **no host test**.

## 4. Matriz de aceptación antes de compartir una beta estable

| Superficie | Test obligatorio | Estado |
|---|---|---|
| Web escritorio y móvil | Navegación, 3 caminos, errores, sin sobrescritura | Automatizado, verde |
| PWA offline | Carga + motor offline | Automatizado, verde |
| Android APK | Primera instalación en Android real, sin Chrome, audio, offline | **Pendiente prueba física** |
| Android APK | Actualización vN→vN+1 conservando app y datos | **No cubierto** |
| Ableton Live 12 Suite | Abrir `.amxd`, cargar JS, ver todos controles, usar Apply, comprobar 3 acordes | **Pendiente host real** |
| Ableton Live 12 Suite | Slash bass, `maj7#11`, tiempos, deshacer y clip ya poblado | **Bloqueado por AUD-01/02** |
| Musicología | Ensayo A/B con 15–25 compositores, contraejemplos y tareas reales | **No realizado** |
| GitHub CI | Los tests existentes pasan | Verde |
| Seguridad/privacidad | Inventario de HTML de terceros, secretos y permisos de publicación | **Parcial** |

## 5. Hojas de ruta concretas para Codex

**PR 1: Seguridad semántica MIDI (P0).** Corregir AUD-01/02, añadir tests de `C/E`, `C/Bb`, `G7/B`, `Cmaj7#11` y posiciones en varias tonalidades. No cambiar la armonía del motor para esconder el problema. Ejecutar `node audit/repro-live-voicings.cjs` antes y después, más suite de Live y CI completa.

**PR 2: Entrega Android actualizable (P0).** Keystore seguro, versiones inmutables, `versionCode` incremental, metadatos SHA, test de instalación y actualización, beta interna primero. No mezclar con refactor web.

**PR 3: Validación del plugin dentro del host (P0).** Live 12 Suite Windows + Max real, API de dictionaries, clic Apply y UI a 350 px. Corregir únicamente problemas reproducidos. No afirmar éxito por mocks.

**PR 4: MIDI contextual (P1).** Recibir contexto de selección, tiempo, compás, notas del clip; detectar acordes y permitir corrección; preservar fuente, deshacer. Añadir controles mínimos y pruebas.

**PR 5: Higiene del repositorio y del lanzamiento (P2).** Resolver docs duplicadas, contenido de terceros, lockfile, branch protection y reglas de PR. No tocar contenido musical sin tests.

**PR 6: Evaluación compositiva (P1).** Implementar protocolo ciego, sin presentar las emociones como hechos. Guardar solo resultados consentidos y agregados.

## 6. Prompt de tarea para Codex

> Audita el repositorio `flinttgaverdale/cinematico` (rama main) como ingeniero principal de calidad, programador de Max for Live 12 Suite y experto en pruebas de aplicaciones web/Android. Lee `AGENTS.md` y `docs/auditoria-tecnica-codex-2026-11-22.md`. Ejecuta la suite de CI, reproduce `node audit/repro-live-voicings.cjs`, valida cada P0/P1 y busca contraejemplos nuevos. Prioriza preservar bajos reales, tensiones características, origen de notas MIDI y reversibilidad; comprueba la integridad del `.amxd`. No confundas prueba simulada con Live real. Devuelve una tabla de hallazgos con archivo/línea, caso reproducible, severidad y propuesta; corrige en PRs independientes con tests antes/después. No publiques a main ni alteres el APK firmado sin revisión. Conserva la sencillez de la UI y la cautela musicológica.
