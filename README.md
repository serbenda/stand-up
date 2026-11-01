# stand-up

🔗 **Web:** [bendi.dev/stand-up](https://bendi.dev/stand-up/)

Inglés para el trabajo, de A1 a C1: reuniones, entrevistas, correos, temas técnicos y expresiones que se usan de verdad en la empresa. Lectura fácil, audio en cada frase y a tu ritmo, accesible también para personas con dislexia.

> *Stand-up* es la reunión corta diaria de los equipos ágiles: ayer, hoy y bloqueos. Aquí aprendes el inglés para esa reunión… y para todas las demás.

## Qué tiene

- **Frases por nivel (A1 → C1) y por tema**: día a día, reuniones, entrevistas, correos y chat, técnico y expresiones.
- **Audio en cada frase**, a velocidad normal o despacio, con voz británica o americana. Opcionalmente resalta cada palabra mientras suena.
- **Primero piensas, luego miras**: la traducción, el ejemplo y la nota de uso están ocultos hasta que los pides.
- **Practicar** con tarjetas, de inglés a español o al revés. Sin cronómetro y sin penalizar errores.
- **Jugar**:
  - 💬 **Simulador de Slack**: daily stand-up, incidencia P1 a las 3 a.m., entrevista técnica, café y 1:1 con tu manager. Eliges qué responder y cada opción explica por qué está bien o mal.
  - 🧩 **`git commit --fill`**: rellena la palabra que falta entre cuatro opciones del mismo nivel.
- **Carrera de dev**: XP, meta diaria, días seguidos (*uptime*) y rangos de *Intern* a *CTO*.
- **15 logros** con guiños geek: *Hello, World!*, *Five nines*, *sudo*… y alguno secreto.
- **Paleta de comandos** con <kbd>Ctrl</kbd>+<kbd>K</kbd>: `level b2`, `theme terminal`, `play slack`, `say hello`, `whoami`…
- **Frase del día** y **progreso** guardado solo en tu navegador.

El porqué de cada decisión está en el [estudio de webs de idiomas](docs/estudio.md).

## Pensada para leer fácil

- Letras Lexend y Atkinson Hyperlegible, a elegir (y monoespaciada para quien la prefiera).
- Cuatro tamaños de letra y tres niveles de espacio entre letras, palabras y líneas.
- Fondo crema, azul suave, oscuro o terminal; nunca blanco puro con negro puro.
- Sin vidas ni cronómetros: fallar solo da una explicación.
- Las celebraciones (confeti y avisos de XP) se pueden apagar y respetan «reducir movimiento».
- Sin cursivas, sin texto justificado y con líneas cortas.
- Regla de lectura opcional que sigue al ratón o al dedo.
- Botones grandes, navegación con teclado y el color de nivel siempre acompañado de su etiqueta.

## Usarla

Es una web estática: HTML, CSS y JavaScript sin dependencias ni build.

- **En local**: abre `index.html` en el navegador.
- **En GitHub Pages**: *Settings → Pages → Deploy from a branch → `main` / root*.

El audio usa las voces del propio navegador (Web Speech API). Funciona mejor en Chrome, Edge y Safari.

## Añadir frases

Todas las frases están en [`js/phrases.js`](js/phrases.js). Cada una es así:

```js
{ l: "B2", c: "meetings", en: "Let's take this offline.", es: "Lo hablamos aparte.", ex: "This is getting long. Let's take this offline.", tip: "Nota opcional." }
```

- `l`: nivel (`A1`, `A2`, `B1`, `B2`, `C1`)
- `c`: tema (`daily`, `meetings`, `interview`, `email`, `tech`, `idioms`)
- `en` / `es`: la frase y su traducción
- `ex`: ejemplo en inglés
- `tip`: nota de uso (opcional)

## Estructura

```
index.html
css/styles.css
docs/estudio.md ← estudio de referencias
js/phrases.js   ← frases
js/dialogs.js   ← conversaciones del simulador
js/app.js       ← lógica
```
