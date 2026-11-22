# Cinemático Studio — instrucciones de proyecto para agentes de código (incluido Codex)

## Filosofía
Cinemático es un asistente de composición, no un generador automático de canciones ni un clasificador científico de emociones. El compositor conserva siempre el control. UX austera, fácil de leer, sin guardado obligatorio ni MIDI en la web. Cinco familias expresivas, quince matices y cuatro direcciones rápidas. Debe mantenerse separada la inspiración de compositor de la progresión del usuario.

## Superficies
- `engine.js`: motor armónico compartido por la web y Max for Live.
- `index.html`: interfaz web/PWA. `service-worker.js` caché offline.
- `android/`: APK WebView autónoma; `.github/workflows/android-apk.yml` compila y publica una beta.
- `live/`: generador MIDI de Max for Live 12 y empaquetador `.amxd`. `downloads/` contiene las entregas.
- `research/`, `docs/`: fuentes, límites musicológicos y decisiones documentadas.
- `tests/`: regresiones de motor, navegación, PWA, MIDI y empaquetado.

## Antes de cambios
1. Lee `docs/auditoria-tecnica-codex-2026-11-22.md` y ejecuta `node audit/repro-live-voicings.cjs` para comprobar los problemas de bajo y extensiones (actualmente deben FALLAR).
2. Reproduce el último workflow verde de `.github/workflows/reliability.yml` en Node 22. Los tests de navegador requieren Playwright/Chromium y servidor HTTP local. Si no puedes ejecutar Windows, Android físico o Ableton, declara explícitamente la limitación; no simules una prueba de usuario real.
3. Crea una rama/PR separada para cada corrección de P0/P1. No sobreescribas la versión pública ni publiques APK o .amxd estable sin validación.

## Invariantes de calidad
- No cambiar silenciosamente los acordes originales, inversiones slash ni notas características de tensiones.
- Cada propuesta debe ser explicable y musicalmente interpretable; métricas simbólicas no miden calidad emocional ni preferencia auditiva.
- La salida MIDI debe respetar el bajo especificado y la identidad del acorde. No perder tercera, séptima, novena o alteración definitoria sin una decisión explícita de voicing.
- `live.miditool.out` es aditivo para Generator. Crear de forma deliberada, reversible, sin autoinsertar al cambiar controles. Validar compás, posición y selección del clip.
- Android debe soportar instalación **y actualización**: firma estable y `versionCode` creciente. El enlace y checksum de la versión publicada deben representar exactamente el código probado.
- Mantener accesibilidad de teclado, móvil y contraste; no introducir ruido visual ni formularios grandes.

## Definition of done
Cada cambio entrega: causa raíz, test de regresión que fallaba antes, pruebas verdes después, capturas o pasos manuales para componentes que requieren GUI, actualización de documentación y una PR revisable. Empezar por seguridad de la salida musical, no por nuevas emociones o estética.
