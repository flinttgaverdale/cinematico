# Validación de la evolución musicológica

Base auditada `af522c1`. Código integrado probado en `3daef14`. Las ramas de
auditoría, motor e interfaz, y revisión de #22 permiten leer cada cambio por
separado. La revisión integrada incluye las correcciones de MIDI de bajos,
extensiones y controles inválidos, y la de ancla menor extendida.

| Fase | Trabajo y evidencia | Pendiente |
|---|---|---|
| 1. Auditoría | Revisión de parser, fuentes, perfiles, arreglos y conducciones, PLR/S, laboratorio, cadencias, intención, audio, interfaz y paquetes. Pasaron 32 comandos sobre la base y se reprodujeron seis fallos MIDI. | Confirmación del comportamiento del clip y del host. |
| 2. Corpus | Cotejo del corpus local y de los grados de procedencia. Once fichas con fragmento, fuente, límite y aplicación documentada. | El proxy devolvió 403 al solicitar las fuentes externas. Ampliar y reexaminar el repertorio de la lista de contraste. |
| 3. Perfiles | Una familia de experimentos por lente, comprobada sobre Am–F–C–G. Información de estilo e intención separadas. | Contrastar estilos y recursos compartidos en fragmentos independientes. |
| 4. Arquitectura | 14 dimensiones, reglas discretas reutilizables y evidencia D en cada ejercicio. Sin dependencias nuevas. | Evaluación de pertinencia musical por compositores. |
| 5. Análisis | Modos compatibles, centros candidatos, notas comunes, bajos, vínculos y límites del cifrado. Contraste de material dórico, ambiguo, extendido y breve. | Métodos que necesiten melodía, pulso o registro requieren otra entrada. |
| 6. Propuestas | Comparaciones de intervención pequeña y procedimientos que conservan íntegra la armonía. A/B de igual duración cuando hay cifrado comparable. | Probar interpretación, ritmo, fraseo y textura con músicos. |
| 7. Simulaciones | 1.056 casos de los once perfiles con 12 raíces y corpus variado. Comparaciones reproducibles y 270 planes MIDI simulados. | Calidad estética y diferenciación percibida. |
| 8. Interfaz | Sin lente, tres caminos. Con lente, dos continuaciones y un experimento. Panel contextual de Estudio avanzado y audición desde Crear. Chromium comprobó 320 y 1280 px en el flujo nuevo y otras siete anchuras en la regresión general. | Accesibilidad con lector de pantalla y pruebas en móviles físicos. |
| 9. Audio y plataformas | Render Web Audio real a 44,1 y 48 kHz. PWA reproduce offline. APK de depuración compilado y firmado con paridad de cinco recursos. AMXD de 188.262 bytes verificado frente al constructor. | Escucha humana, instalación y actualización en Android físico y aplicación en Live 12 Suite sobre Windows. |
| 10. Auditoría final | 31 comandos del motor y empaquetado y cinco scripts Playwright en revisión combinada. Caché y registro PWA v51. Producción queda en la revisión auditada. | Revisión y autorización de cada entrega pública. |

Player y paquetes se verificaron con Node 22.23.5, Playwright 1.65.1 y
Chromium 156 del sistema. APK compilado con Temurin 17, Gradle 8.9 y SDK 35.
SHA-256 del binario de depuración probado:
`83894ed03ce84b34b5c971741cfe2c42009dd5f602607f823ac66bdcdcfda392`.

Para integrar los cambios en otro orden, vuelve a generar el núcleo y el
AMXD después de resolver los cambios de fuente, y actualiza la versión de
caché al combinar HTML y motor. Antes de distribuir un APK, usa el flujo de
firma estable revisado por separado. La selección temporal y el historial
de deshacer de Ableton requieren la prueba de aceptación del host.
