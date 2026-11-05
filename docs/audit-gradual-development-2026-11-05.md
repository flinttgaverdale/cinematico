# Auditoría de desarrollo gradual — 2026-11-05

## Cambios auditados
El motor ofrece tres experimentos opcionales: eje de quinta, tercera alternativa y enlace de nota común o movimiento cercano. La interfaz los muestra en un desplegable y no modifica acordes.

## Verificaciones efectuadas
- Sintaxis del script de interfaz: válida.
- Seis progresiones y quince posiciones examinadas en ejecución aislada: salidas no vacías cuando procede y máximo tres propuestas.
- Detección de tritono mayor–mayor y partición en dos tríadas: resultados esperados en ejemplos controlados.
- Se ha creado un archivo de pruebas de regresión para Node en tests/gradual-development.test.js; no se ha ejecutado un pipeline CI.
- El acorde seleccionado se reinicia a cero al introducir nueva progresión.

## Límites musicales
- Conservar clases de altura no implica sostener físicamente notas en una voz ni un registro.
- Cambiar la tercera mayor por menor no prueba intercambio modal sin contexto tonal.
- Sin notas MIDI, duración, melodía o disposición de voces no se pueden inferir ritmo, pedal, fraseo o movimiento real.
- El análisis de Thomas Newman motiva la exploración gradual, pero ninguna sugerencia se atribuye como técnica exclusiva suya.
- La partición en tríadas no demuestra policordio audible; permanece fuera de la interfaz.

## Pendiente antes de publicación
Prueba end-to-end en navegador, contraste de grafías enarmónicas, comprobación móvil y accesibilidad, y ejecución de pruebas en CI. No se despliega la rama mientras continúa la prueba pública externa.
