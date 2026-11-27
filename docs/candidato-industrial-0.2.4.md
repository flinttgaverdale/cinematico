# Cinemático Studio 0.2.0-beta.4 · candidato de revisión

Base `design/instrumento-industrial-v2` en `1f25e85`. Las correcciones visuales, la evaluación musical, la escucha, Max y el shell offline tienen ramas de revisión propias. La rama `review/studio-beta04` reúne los cambios para verificar los mismos archivos en la web y en la APK. Se conserva el motor armónico compartido.

## Registro de cambios

- **Industrial Studio.** El editor muestra varias líneas de cifrado, hay más espacio para selectores con texto ampliado y los destinos tonales conservan juntos su origen, enlace y destino. Controles ordinarios de 48 px o más y zonas de interacción ampliadas en el círculo. [Acabado industrial](acabado-industrial.md)
- **Investigación.** Comparación reproducible de los once perfiles con un grupo independiente. Las ponderaciones conservan la versión de referencia. [Evaluación comparativa](validacion-industrial-perfiles.md)
- **Escucha.** Parada gradual del piano y estado recuperable si se rechaza la activación de audio. La escucha neutra y la interpretada reutilizan el mismo instrumento. [Escucha pianística](escucha-piano-industrial.md)
- **Ableton.** Generador 0.2.4 de 350 × 318 con el motor web incrustado y la misma entrada de propuestas sin compositor. [Instalación y alcance](../live/INSTALACION-0.2.4.md)
- **PWA.** Caché v75 con página de actualización local y recuperación si se pierde la red. Un candidato completo en espera puede activarse sin conexión. [Actualización offline](pwa-actualizacion-offline.md)

## Instalación y aceptación

- **Web.** Descomprime el paquete web y sírvelo por HTTPS o localhost. `index.html` abre Crear y `actualizar.html` gestiona la actualización. El paquete se puede servir en GitHub Pages bajo `/cinematico/`. Verifica primera carga, actualización y arranque offline antes de aprobar el despliegue.
- **Android.** Confirma el identificador `io.github.flinttgaverdale.cinematico.beta02`, la huella SHA‑256 de la beta pública y el aumento del código de versión de 3 a 4. Instala el APK firmado sobre la beta anterior sin desinstalar. Comprueba primera carga, audio offline, conservación del espacio seleccionado, teclado y girado del dispositivo. `python3 android/verify_upgrade.py base.apk candidata.apk --sdk SDK` verifica identidad y firma. El parámetro `--serial SERIE --interactive` añade las comprobaciones en un equipo de prueba.
- **Max for Live.** Sitúa el AMXD en la librería de generadores MIDI y abre un clip vacío en Ableton Live 12 Suite. Aplica el recorrido de prueba, escucha con un instrumento virtual y deshazlo. Registra las versiones de Live, Max y Windows y la huella del archivo. Sigue el protocolo del repositorio para clips con notas, compases y selecciones. [Aceptación en el host](../live/ACEPTACION.md)

El paso a producción requiere la aprobación del usuario. Usa un tag nuevo y publica juntos binarios, registro de cambios y SHA‑256. Mantén disponibles los archivos de la beta anterior. [Beta pública anterior](beta-0.2.3.md)

## Vuelta atrás

- **GitHub Pages y PWA.** Recupera el shell de `89753fd` en un commit nuevo. Incrementa la caché a v76 o al número siguiente disponible y pon el mismo valor en el registro del worker. Comprueba que `index.html`, CSS y motor se actualicen juntos al abrir `actualizar.html`.
- **Android.** Si ya se distribuyó código 4, prepara la revisión anterior con código mayor que 4, el mismo identificador y certificado. Prueba instalación como actualización y conservación de datos. Los códigos de versión de Android impiden utilizar una APK anterior como actualización directa.
- **Ableton.** Recupera el AMXD de 0.2.3 desde su Release. Deshaz la aplicación de notas dentro del clip o conserva una copia del proyecto si quieres comparar los dos dispositivos.
