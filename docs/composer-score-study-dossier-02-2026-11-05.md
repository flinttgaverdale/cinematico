# Dossier 02 — lectura comparada de pasajes documentados (2026-11-05)

## 1. James Horner, A Beautiful Mind (2001)

**Fuente principal leída:** Frank Lehman, «Transformational Analysis and the Representation of Genius in Film Music», *Music Theory Spectrum* 35/1 (2013), pp. 1–22, https://franklehman.com/wp-content/uploads/2020/02/MTS-Article.pdf . Incluye reducciones musicales y redes analíticas, especialmente ejemplos 11–17. Es una **lectura del análisis publicado**, no una transcripción propia de los manuscritos.

- «The Kaleidoscope of Mathematics»: Lehman modela la recurrencia de un espacio de tríadas mediante L, R y S, con la célula LRLS y trayectorias cromáticas asociadas al pensamiento matemático de Nash.
- «Playing a Game of Go»: el análisis identifica un recorrido cercano a completar un ciclo que se interrumpe mediante una relación de polo hexatónico, volviendo a re menor; la interrupción se relaciona con la derrota del personaje. Lehman sitúa el fragmento en el DVD 11:17–12:20.
- «Breaking Russian Codes»: la secuencia culmina en una trayectoria cíclica más completa y una llegada a fa mayor, asociada a un descubrimiento. Lehman sitúa el fragmento en el DVD 28:35–29:37.
- **Conclusión comparativa:** no basta con clasificar «acordes cromáticos»; importa la dirección y si un patrón se completa, se interrumpe o se desvía. El significado dramático específico es una interpretación de Lehman, no una propiedad automática de las notas.

**Cambio implementado:** se sustituyó la técnica genérica «Quintas abiertas y espacio» del perfil Horner por «Trayectoria de tríadas cromáticas». La nueva propuesta invita a comparar P/L/R en el laboratorio, y explica expresamente que no detecta una secuencia de Horner. **Precaución:** P/L/R es un subconjunto simplificado del vocabulario de Lehman, que también utiliza S y transformaciones compuestas; no atribuir equivalencia con LRLS.

## 2. Bernard Herrmann, Vertigo (1958)

**Fuente principal leída:** Scott Murphy, «Three Audiovisual Correspondences in the Main Title for Vertigo», *Music Theory Online* 28/1 (2022), https://mtosmt.org/issues/mto.22.28.1/mto.22.28.1.murphy.php . Contiene reducción formal-armónica en ejemplo 1 y notación de compases 1–2 en ejemplo 2, basadas en el manuscrito según Murphy.

- El preludio alterna áreas A y B, con repetición truncada y material de coda C. Murphy identifica un acorde menor con séptima mayor recurrente en A (denominado por algunos estudiosos «Hitchcock chord»).
- La progresión de cinco acordes y su disposición en Tonnetz guardan correspondencias interpretativas con los movimientos visuales de Saul Bass. No es una simple secuencia tonal funcional.
- Murphy explica que la última escena retoma el material B1–B4 y termina suprimiendo la séptima del acorde B4, dando una tríada de do mayor. La omisión de una nota altera la relación con el ciclo anterior.
- **Conclusión:** el papel de una nota común, una séptima retenida o eliminada y la recurrencia formal pueden importar más que el número de acordes disonantes. No equiparar «más cromatismo» con «más suspense».

**Cambio pendiente, no implementado:** un diagnóstico de «nota persistente/retirada» entre progresiones que identifique únicamente la evidencia de clases de altura y evite inferir dinámica o suspense audiovisual.

## 3. Próximos contrastes necesarios
- Williams y Shore: análisis temático de motivos con pasajes identificados.
- Zimmer: comparar al menos dos obras de lenguajes distintos para evitar perfil monocorde.
- Morricone y Newman: estudiar silencio, instrumentación y articulación sin atribuirlos a acordes.
- Elfman, Silvestri, Giacchino y Göransson: identificar escenas, fragmentos y decisiones armónicas frente a tímbricas.

## Estado de validación
- Motor JavaScript cargado en ejecución aislada; 11/11 bibliotecas conservan tres técnicas.
- Nuevo recurso Horner comprobado con progresión Am–F–C–G, sin mutación de acordes.
- Se amplió test Node de regresión, pero **no se ha ejecutado el conjunto CI**.
- **No se ha desplegado** esta actualización al preview; pendiente de despliegue y verificación.
