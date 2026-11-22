# Actualización offline de la PWA

El service worker exige que todos los recursos del shell se guarden antes de
activar una nueva versión. Si falla la instalación, la versión activa conserva
su caché. Asigna un identificador de caché nuevo a cada versión del shell.

La regresión automatizada instala una versión, devuelve HTTP 503 al solicitar
el motor durante la siguiente actualización y prueba Crear en modo offline.
Para comprobarlo manualmente, abre la PWA instalada sin conexión después de
una actualización fallida y genera tres caminos a partir de `Am F C G`.
