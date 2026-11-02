# stand-up

🔗 **Web:** [bendi.dev/stand-up](https://bendi.dev/stand-up/)

Tech English para hispanohablantes: el inglés que se habla en equipos técnicos. Frases cortas y reales para dailies, Slack, reuniones, entrevistas e incidencias, en lecciones de tres minutos con audio. Sin registro y pensada para leer con dislexia.

> *Stand-up* es la reunión corta diaria de los equipos ágiles: ayer, hoy y bloqueos.

## Cómo funciona

La portada pregunta **qué quieres conseguir** y te lleva a una ruta:

| Ruta | Unidades |
|---|---|
| 01 · Sobrevivir al día a día del equipo | Daily stand-up · Slack y correo · Reuniones · Números, fechas y siglas |
| 02 · Pasar entrevistas | Preséntate · Cuenta un proyecto · Preguntas difíciles y tus preguntas |
| 03 · Explicar ideas técnicas | próximamente |
| 04 · Incidencias y code review | próximamente |
| 05 · Errores que delatan al hispanohablante | Tiempos verbales · Suavizar el tono · Falsos amigos |

23 lecciones de nivel A2 a C1, con seis frases cortas cada una. Una lección mezcla estos ejercicios:

- **Frase nueva**: la escuchas, ves la traducción y una nota de uso.
- **Escucha**: eliges lo que has oído. Las opciones falsas cambian una sola palabra.
- **Completa**: eliges la palabra que falta.
- **Traduce**: construyes la frase tocando palabras, sin escribir.
- **Empareja**: cuatro frases con su traducción.
- **Repite en voz alta** (*shadowing*): escuchas, repites imitando el ritmo y, si quieres, te grabas para compararte. La grabación no sale de tu navegador.
- **Situación**: alguien te escribe y eliges la mejor respuesta.

Las opciones falsas son **errores típicos de hispanohablantes**: *actually*, *revision*, *resume*, *until* en lugar de *by*, *I'm agree*, *I have finished it yesterday*… Cada fallo explica el porqué y la frase vuelve al final de la lección.

**Repaso espaciado:** cada frase va a una caja. Si la aciertas, vuelve dentro de 3, 7, 14, 30 o 60 días; si la fallas, mañana. La portada te avisa de las que toca repasar.

## Herramientas para el día a día

- **Pronunciar** (`#/say`): 55 términos técnicos con audio, cómo suenan «a la española» y el error típico. *Cache* → «cash», *nginx* → «én-yin-ex», *deploy* → «di-PLÓI»…
- **Mi daily** (`#/daily`): eliges qué hiciste ayer, qué harás hoy, el plazo y tus bloqueos, rellenas los huecos y te monta el stand-up en inglés. Se puede escuchar y copiar, y se guarda para el día siguiente.
- **Chuletas** (`#/cheats`): frases para copiar en comentarios de PR, Slack, correos, reuniones e incidencias, más las siglas de sprint (ETA, OOO, PTAL, WIP…).

## Detalles

- **Audio grabado con voz neuronal** ([Kokoro](https://github.com/hexgrad/kokoro), Apache 2.0) en acento británico y americano, igual en todos los dispositivos. Hay velocidad normal y despacio, y cada palabra se resalta mientras suena. Los textos sin grabación, como tu daily, usan la voz del navegador. Para regenerarlo, mira [`tools/audio`](tools/audio/README.md).
- Todo con teclado: <kbd>1</kbd>–<kbd>4</kbd> elegir, <kbd>Enter</kbd> comprobar, <kbd>⌫</kbd> borrar ficha, <kbd>R</kbd> repetir audio y <kbd>Ctrl</kbd>+<kbd>K</kbd> paleta de comandos.
- Progreso, XP y días seguidos guardados solo en tu navegador.

## Pensada para leer fácil

- Letra Lexend o Atkinson Hyperlegible, cuatro tamaños y tres niveles de espaciado.
- Tema claro u oscuro, sin blanco ni negro puros.
- Sin cursivas, sin texto justificado y frases cortas.
- Sin vidas ni cronómetros. Botón «No lo sé» para ver la respuesta sin penalización extra.
- Regla de lectura opcional.

## Usarla

Web estática: HTML, CSS y JavaScript sin dependencias ni build. Abre `index.html` en local o publícala con GitHub Pages desde `main`.

## Añadir contenido

Todo está en [`js/content.js`](js/content.js): rutas → unidades → lecciones → frases.

```js
{ en: "The PR is ready for review.", es: "La PR está lista para revisión.",
  gap: "review", wrong: ["revision", "check", "revise"],
  note: "«Revision» es una versión corregida, no una revisión de código." }
```

- `gap`: palabra que se quita en «Completa» (tiene que aparecer tal cual en `en`).
- `wrong`: tres opciones falsas, mejor si son errores típicos.
- `note`: explicación corta (opcional).
- `say`: texto para el audio cuando se lee distinto de como se escribe, por ejemplo `"Uptime is ninety-nine point nine percent."` (opcional).

Cada lección puede tener una `scene` con un mensaje y varias respuestas `{ en, ok, why }`.

Para que una ruta «próximamente» pase a estar disponible, basta con rellenar su lista `units`.

## Estructura

```
index.html
css/styles.css
js/content.js     ← rutas, lecciones y frases
js/tools-data.js  ← pronunciación, plantillas de daily y chuletas
js/audio-manifest.js ← lista de textos con grabación
js/app.js         ← lógica
docs/estudio.md   ← estudio de referencias
audio/us, audio/gb ← grabaciones (mp3)
tools/audio/      ← scripts para generar las grabaciones
```
