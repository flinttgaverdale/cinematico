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

El workflow `.github/workflows/android-apk.yml` copia los archivos web actuales dentro de `android/app/src/main/assets`, elimina referencias remotas a Google Fonts, compila con Android Gradle Plugin 8.7.3 / Gradle 8.9 y publica el APK como un activo de una versión de prueba. Se mantiene **el mismo motor armónico** de la web.

Para compilar localmente en Android Studio: abre la carpeta `android/` como proyecto, usa JDK 17, instala Android SDK 35 y ejecuta `assembleDebug`. Copia previamente desde la raíz `index.html`, `engine.js`, `manifest.json`, `icon-192.png`, `icon-512.png` a `android/app/src/main/assets`, como hace el workflow.

## Alcance de esta versión

- Misma experiencia web de Crear y Estudio avanzado, intenciones, ideas y explicaciones.
- Composición sin navegador externo y sin conexión, una vez instalado el APK.
- **No** es un editor MIDI nativo de Android ni se sincroniza con Ableton.
- Las actualizaciones de la web NO actualizan automáticamente el APK: necesita una versión nueva.
- Antes de un lanzamiento público hacen falta firma de distribución estable, validación en varios dispositivos, pruebas de audio y una política clara de actualizaciones.
