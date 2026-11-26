# Cinemático Studio · Android independiente · beta 0.2

La aplicación usa Android WebView y lleva el motor, la interfaz y el piano
sintetizado dentro del APK. Requiere Android 8.0 o posterior.

## Instalar la beta 0.2

Descarga el APK y ábrelo desde Archivos o Descargas. Aparecerá como
**Cinemático Beta 0.2**. El identificador de esta edición termina en
`.beta02` y permite instalarla junto a la beta 0.1 y la PWA. La beta 0.1
conserva su enlace y sus datos. [APK beta 0.2](../downloads/Cinematico-Android-Beta-0.2.apk) · [Beta 0.1](https://github.com/flinttgaverdale/cinematico/releases/tag/android-beta-0.1)

La beta 0.2 usa el código de versión **2** y un certificado dedicado. Antes
de distribuir una actualización de esta edición, aumenta su código de
versión y firma con esa misma clave. Se verificaron la firma, el contenido
y un par de APK de códigos 2 y 3. La instalación y el audio en un teléfono
físico quedan pendientes. [Identidad y huellas](../downloads/Cinematico-Beta-0.2-build-info.json)

## Cómo se genera

Para compilar la edición aislada, pasa `-PcinematicoBeta02=true` a Gradle.
El workflow `.github/workflows/android-apk.yml` comprueba el APK de
depuración en las PR que afectan a Android o a la web empaquetada. La ejecución
manual desde `main` genera un candidato firmado para revisión, con el commit,
el certificado esperado y el checksum. Utiliza el número de ejecución más tres
como `versionCode` para superar los códigos de las betas anteriores.

Configura el entorno de GitHub Actions `android-beta-release` con revisión
obligatoria. Guarda `ANDROID_KEYSTORE_BASE64`, `ANDROID_STORE_PASSWORD` y
`ANDROID_KEY_PASSWORD` como secretos del entorno. Configura `ANDROID_KEY_ALIAS`
y `ANDROID_CERT_SHA256` como variables del entorno. Reutiliza la misma clave de
distribución y verifica el certificado en cada ejecución.

Antes de publicar, verifica `SHA256SUMS` y prueba en un teléfono la instalación,
el audio offline y la actualización desde un candidato anterior firmado con el
mismo certificado. La beta antigua de depuración puede requerir una
reinstalación si su certificado difiere. Publica el artefacto aprobado con los
metadatos y checksum en una versión nueva asociada al commit indicado en
`build-info.json`. Usa un tag distinto por versión y conserva los activos
previos.

En Android Studio, abre `android/`, usa JDK 17 e instala Android SDK 35. Antes de ejecutar `assembleDebug`, copia `index.html`, `engine.js`, `studio.css`, `manifest.json`, `icon-192.png` e `icon-512.png` a `android/app/src/main/assets/`. Copia también `assets/fonts/` a `android/app/src/main/assets/assets/fonts/` para incluir las fuentes y sus licencias en el paquete local.

## Prueba de instalación y actualización

Comprueba primero que los dos APK tienen el mismo identificador y certificado
y que el segundo aumenta el código de versión. Con SDK 35 y Java en tu equipo,
usa `python3 android/verify_upgrade.py base.apk nueva.apk --sdk SDK`.
Añade `--serial SERIE --interactive` para instalar ambos en un teléfono de
prueba conectado por ADB y comprobar versión, arranque, audio sin conexión y
conservación del espacio seleccionado. El script comprueba el estado al
principio y se detiene si la aplicación ya está instalada.

Para repetir la prueba de marcha en un equipo sin ADB, instala el primer APK
desde Descargas. Prueba Crear y el audio en modo avión, selecciona Estudio
avanzado y cierra la app. Instala el segundo APK como actualización y confirma
que conserva Estudio avanzado, que Crear funciona y que se reproduce audio
en modo avión.

Los binarios de un paquete de aceptación con identificador separado prueban
el recorrido de actualización. La firma de distribución debe pasar las mismas
pruebas con su propio par de candidatos antes de publicar.

## Alcance de esta versión

- Misma experiencia web de Crear y Estudio avanzado, intenciones, ideas y explicaciones.
- Composición sin navegador externo y sin conexión, una vez instalado el APK.
- **No** es un editor MIDI nativo de Android ni se sincroniza con Ableton.
- Las actualizaciones de la web NO actualizan automáticamente el APK: necesita una versión nueva.
- La siguiente publicación estable requiere la aceptación física del audio y de la actualización con el certificado de su canal.
