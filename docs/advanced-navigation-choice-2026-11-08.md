# Cinemático Studio — entrada al estudio avanzado sin desvío a la progresión
**8 de noviembre de 2026.**

Al pulsar «Estudio avanzado» se seleccionaba «Mis acordes» y se enfocaba `userChords`. En móviles podía aparecer automáticamente el teclado, incluso cuando el objetivo era explorar tonalidades, compositores o herramientas.

## Cambio funcional
- «Estudio avanzado» y «Abrir estudio avanzado» abren un menú inicial con las tres áreas habituales: Mis acordes, Inspiración y Herramientas.
- No existe pestaña preseleccionada al entrar. Cada botón incorpora una breve descripción de su finalidad. No se añade un formulario ni se hace obligatorio escribir acordes.
- El foco se sitúa en el área de navegación (no en `userChords`) para que la pantalla muestre las opciones sin abrir el teclado.
- Solo «Elegir y analizar» en una propuesta seleccionada lleva directamente a «Mis acordes», porque esa acción expresa un interés explícito en el análisis.
- Se conserva cualquier texto escrito en Crear al pasar a avanzado, incluso si es una progresión en construcción, sin bloquear acceso a otras áreas; el campo de estudio puede mostrar el error si el usuario decide abrirlo.
- Las referencias de tonalidad y compositor siguen siendo independientes de la progresión del usuario.
- Se actualiza la caché PWA para instalaciones existentes y las pruebas de navegador cubren ambos tamaños de pantalla.
