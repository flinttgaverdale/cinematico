# Actualización offline de la PWA

El service worker precarga el shell completo y mantiene juntas la versión
del HTML y la del motor. Si algún recurso falla, la versión activa conserva
su caché. La versión nueva se activa cuando se cierran las pestañas controladas
por la anterior. Al cambiar HTML, motor, iconos o manifiesto, incrementa el
identificador de caché y la versión del registro de worker en `index.html`.

La página `actualizar.html` forma parte del shell. Si se abre sin red,
Actualizar y abrir informa del fallo y vuelve a habilitar el botón. Abrir
el estudio recupera la versión activa desde la caché.
Si hay una versión completamente descargada y en espera, el botón puede
activarla sin conexión y sin cerrar otras pestañas.

La regresión instala una versión, simula un HTTP 503 durante el precache del
motor y verifica que Crear siga funcionando online y offline. Después restaura
la red, precarga la versión nueva y comprueba el cambio al abrir otra pestaña
tras cerrar la anterior.
