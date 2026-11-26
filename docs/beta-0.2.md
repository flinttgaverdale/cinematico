# Cinemático Studio · beta 0.2

La versión web incorpora los procedimientos contextuales de los once
perfiles, el piano sintetizado y las correcciones de márgenes, foco de
teclado y controles en pantallas pequeñas. La PWA usa el shell v52, con
actualización atómica. Al actualizar una PWA instalada, cierra las
pestañas anteriores para que se active la nueva versión.

- **Android 0.2.0-beta.** El APK incluye el mismo motor y la interfaz de
  esta revisión, con los recursos web preparados para WebView offline.
  Se instala como edición separada de la beta 0.1. [APK firmado](../downloads/Cinematico-Android-Beta-0.2.apk)
- **Max for Live 0.2.** El AMXD contiene el motor compartido y el
  generador con correcciones de bajo slash, extensiones y entradas
  inválidas. Live reproduce las notas con el instrumento de la pista.
  [AMXD](../downloads/Cinematico-Generator-Beta.amxd)
- **Procedencia.** El manifiesto registra el commit de la fuente
  compilada, la firma pública y las huellas de los recursos.
  [Manifiesto](../downloads/Cinematico-Beta-0.2-build-info.json) · [SHA-256](../downloads/SHA256SUMS-beta-0.2.txt)

## Verificación

Pasaron 32 comandos de motor y empaquetado y seis scripts de navegador,
incluida la regresión de actualización PWA y 12 tamaños responsive.
Las pruebas incluyen 1.056 procedimientos de compositor, 270 planes
MIDI simulados y el render de piano a 44,1 y 48 kHz. Se verificaron la
firma del APK, la paridad de sus cinco recursos y su `versionCode` 2.
El par 2 → 3 comparte identificador y certificado. La clave dedicada
se conserva en almacenamiento local restringido fuera de Git.

La instalación, el audio y la actualización en un teléfono físico siguen
pendientes. En Live 12 Suite sobre Windows falta validar Aplicar, Deshacer
y el contexto de selección y compás. Para empezar, usa un clip MIDI vacío
de tres compases en 4/4.

## Vuelta atrás

`pre-beta-0.2` conserva la revisión pública anterior. La rama
`rollback/beta-0.2` se puede incorporar por avance rápido desde la
publicación inicial. Restaura el sitio y el AMXD anteriores, incrementa el
identificador de caché a v53 y deja el APK 0.1 en su release original.
Este procedimiento no sobrescribe la descarga anterior ni reescribe `main`.
Comprueba la base remota antes de usarlo si `main` avanzó.
