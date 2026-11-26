# Cinemático Generator — instalación directa en Ableton Live 12 Suite
Versión beta 0.2 — **archivo único** `Cinematico-Generator-Beta.amxd`.

## Cómo instalar
1. Descarga `Cinematico-Generator-Beta.amxd` desde https://flinttgaverdale.github.io/cinematico/downloads/Cinematico-Generator-Beta.amxd
2. Abre Ableton Live 12 Suite y crea una pista MIDI con instrumento y un clip vacío de **3 compases en 4/4**.
3. Entra en el editor del clip > pestaña **Generar**. Ubica el archivo `.amxd` desde **Lugares** en el navegador (si hace falta añade la carpeta a Lugares) y selecciónalo como herramienta de Generar. Alternativamente guarda el archivo en **Librería del usuario / MIDI Tools / Max Generators**.
4. En la interfaz compacta, escribe acordes como `Am F C G`, pulsa **Actualizar**, elige intención, camino 1–3, y pulsa **Ver camino**.
5. Para generar notas en el clip, pulsa **Aplicar (Apply)** en la pestaña Generar. Tres acordes quedan distribuidos en **tres compases (4/4)**.
6. Usa Ctrl+Z para deshacer y prueba los otros caminos **en otro clip vacío**. Los Generadores de Live pueden superponer o reemplazar notas existentes si coinciden en el tiempo.

**No lo arrastres a la cadena de efectos:** es una **herramienta MIDI Generator de Live 12**, no un efecto MIDI de pista. A diferencia del ZIP anterior, **el archivo está empaquetado como `.amxd` e incorpora los dos scripts JS**. No hace falta abrir Max para copiar su contenido.

**Validación:** formato de archivo, dependencias empaquetadas, lógica de 270 casos y geometría de controles probados por código. La carga final en Live/Max y el comportamiento de la interfaz **no están probados en un Windows real**, por lo que es una beta y debes usar un proyecto de prueba. Si al abrirlo sale error, envíame el texto exacto de la consola de Max, no tomaremos el archivo por estable hasta pasar esa prueba.

Requisitos: Live 12 Suite / Max for Live 8.6 o posterior.

### Comprobación del voicing

En una compilación de revisión, abre el dispositivo en Live 12 Suite en Windows,
elige una ruta y pulsa Aplicar en un clip vacío. Comprueba las alturas y el
registro de las novenas en el editor MIDI y verifica Deshacer. Los acordes slash
y las extensiones de cinco notas se comprueban también en el banco de pruebas
del generador, ya que las rutas de la beta no ofrecen todos esos acordes.
El empaquetado y las pruebas JavaScript se ejecutan fuera de Ableton.
