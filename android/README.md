# Cinemático Studio · Android independiente (beta 0.1)

Esta aplicación **NO necesita Chrome como navegador**. Lleva una copia de `index.html`, `engine.js`, el manifiesto y los iconos dentro de un APK. Android ejecuta la interfaz mediante su componente de sistema **WebView**, que no es un navegador Chrome abierto. El acceso a internet no está solicitado por el APK.

**Disponible para Android 8.0 o posterior.** Probado automáticamente: compilación APK, manifiesto, integridad del ZIP y lógica web. **No se ha confirmado aún una prueba manual de interpretación musical ni de audio en un teléfono físico.**

## Instalar en Android

1. Descarga el APK desde la [página de versiones beta](https://github.com/flinttgaverdale/cinematico/releases/tag/android-beta-0.1), nombre **Cinematico-Android-Beta.apk**.
2. En el teléfono, abre **Archivos / Descargas** y pulsa el APK.
3. Si Android bloquea el instalador, habilita temporalmente **Permitir desde esta fuente** para la app de Archivos que estás utilizando. No desactives Play Protect.
4. Pulsa **Instalar**. Aparecerá el icono Cinemático, que se abre sin Chrome y sin conexión.
5. Si ya instalaste la PWA de Chrome, puedes conservar ambas; son instalaciones separadas.
6. Para obtener versiones nuevas de esta **beta de prueba firmada temporalmente**, quizá necesites desinstalar la beta previa antes de instalar la siguiente: la firma de depuración de GitHub Actions no es permanente. Esta beta no está preparada para Play Store ni distribución comercial.

## Cómo se genera

El workflow `.github/workflows/android-apk.yml` comprueba el APK de
depuración en las PR que afectan a Android o a la web empaquetada. La ejecución
manual desde `main` genera un candidato firmado para revisión, con el commit,
el certificado esperado y el checksum. Utiliza el número de ejecución más uno
como `versionCode` para superar el 1 de la beta anterior.

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

Para compilar localmente en Android Studio: abre la carpeta `android/` como proyecto, usa JDK 17, instala Android SDK 35 y ejecuta `assembleDebug`. Copia previamente desde la raíz `index.html`, `engine.js`, `manifest.json`, `icon-192.png`, `icon-512.png` a `android/app/src/main/assets`, como hace el workflow.

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
- Antes de un lanzamiento público hacen falta firma de distribución estable, validación en varios dispositivos, pruebas de audio y una política clara de actualizaciones.
