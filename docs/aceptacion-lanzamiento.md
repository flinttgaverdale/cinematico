# Revisión de lanzamiento de Cinemático

El candidato conserva la revisión integrada del motor y del piano preparado
en la PR #22. Esta rama añade las pruebas de aceptación y el flujo de
candidatos Android firmados. Los pushes de revisión generan comprobaciones
y los candidatos de Android se conservan como artefactos. El flujo de
candidatos no reemplaza el APK de la beta anterior.

| Control antes de publicar | Evidencia que debe quedar en la revisión |
|---|---|
| Ableton Live 12 Suite en Windows | Versión de Win/Live/Max y hash del AMXD. Resultado de Aplicar y Deshacer con clip vacío, clip poblado, selección desplazada y 3/4. Consola y estado del editor. |
| Android físico y firma | ID, huella, hashes y códigos de los APK de distribución. Instalación, actualización sobre la instalación y arranque sin red. Audio y espacio conservado. |
| Piloto y corpus | Número de respuestas por opción, omisiones y resultado del control idéntico. Intenciones y procedimientos interpretativos por separado. Fuentes abiertas con localizador y limitación. |
| Revisión | CI verde sobre el commit que se revisa y aceptación humana de los artefactos exactos. Anota cambios pendientes o el resultado de cada prueba. |

## Orden de revisión

1. Abre la comparación de esta rama con `main` y revisa las pruebas
   automatizadas. El APK de depuración se genera en PR.
2. Usa el diagnóstico de Live para obtener el diccionario de un clip
   sintético. Después valida el dispositivo de distribución sin diagnóstico.
   El adaptador de selección depende de lo que entregue el host.
3. Usa el par de aceptación para ensayar el recorrido en un teléfono.
   Configura aparte la clave estable en el entorno GitHub Actions
   `android-beta-release` con revisión requerida. Las claves y contraseñas
   se ingresan como secretos de ese entorno. Incluye la huella de la clave
   como variable de comparación. Repite la aceptación con dos candidatos
   firmados para distribución antes de sustituir ningún enlace público.
4. Comparte solo el material de participantes del piloto. Guarda la clave de
   coordinación por separado y agrega las respuestas consentidas.
5. Con la aceptación completada y la aprobación de publicación, distribuye
   el candidato exacto por una versión identificable asociada al commit.
   Conserva su SHA-256 y el APK anterior para trazabilidad. Si el APK anterior
   llevaba un certificado de depuración diferente, informa de la migración.

Guías específicas para [Live](../live/ACEPTACION.md),
[Android](../android/README.md) y [escucha](../research/listening-pilot/README.md).
