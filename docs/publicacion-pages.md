# Archivos publicados en GitHub Pages

GitHub Pages genera el sitio con Jekyll. `_config.yml` conserva el shell de
Cinemático y sus descargas. Excluye de Pages la vista previa histórica con el
motor divergente y el HTML externo guardado para investigación. El enlace
estable de la aplicación es https://flinttgaverdale.github.io/cinematico/.

Los archivos excluidos siguen en Git. La licencia y la conservación del HTML
externo requieren revisión del material y de sus fuentes. Para validar el
cambio, genera el sitio en un directorio temporal y comprueba que se incluyan
`index.html`, `engine.js`, `service-worker.js`, `manifest.json` y
`downloads/Cinematico-Generator-Beta.amxd`, y que se omitan ambas rutas de
`exclude`. Tras aprobar el PR, comprueba la salida del workflow de Pages.

La administración del repositorio puede exigir PR aprobado y el workflow de
fiabilidad en `main`. La publicación de Android requiere revisar su candidato
firmado y la evidencia de instalación y actualización.
