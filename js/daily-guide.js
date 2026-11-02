/*
  Guía del daily stand-up por fases.
  Cada fase: título, qué pasa, consejo y frases con audio.
  who: "facilitator" (quien dirige), "you" (tú) u "others" (otros).
*/
window.DAILY_GUIDE = [
  {
    id: "before", title: "Antes de empezar", time: "1 min antes",
    what: "Abre el tablero y piensa tres cosas: qué hiciste ayer, qué harás hoy y si algo te bloquea. Si lo preparas en Mi daily, solo tienes que leerlo.",
    tip: "Ten el ticket abierto: si te preguntan algo, lo tienes delante.",
    phrases: [
      { who: "you", en: "Morning! Give me a second, I'm joining.", es: "¡Buenos días! Un segundo, que entro." },
      { who: "you", en: "Can you hear me?", es: "¿Me oís?" },
      { who: "others", en: "Let's give it a minute for others to join.", es: "Esperemos un minuto a que entren los demás." }
    ]
  },
  {
    id: "start", title: "Arranque", time: "0:00",
    what: "Quien hace de facilitador (Scrum Master o quien toque) abre la reunión y decide el orden: por la lista, por el tablero o «quien quiera».",
    tip: "Si nadie empieza, ofrécete: queda bien y te quitas los nervios pronto.",
    phrases: [
      { who: "facilitator", en: "Morning, everyone! Let's get started.", es: "¡Buenos días a todos! Empecemos." },
      { who: "facilitator", en: "Who wants to go first?", es: "¿Quién quiere empezar?" },
      { who: "facilitator", en: "Let's go through the board.", es: "Vamos repasando el tablero." },
      { who: "facilitator", en: "Let's go in alphabetical order.", es: "Vamos por orden alfabético." },
      { who: "you", en: "I can go first.", es: "Puedo empezar yo." }
    ]
  },
  {
    id: "turn", title: "Tu turno: entrar", time: "≈ 30 s",
    what: "Cuando te toca, entra con una frase corta y ve directo a lo que hiciste ayer. Nada de introducciones largas.",
    tip: "Habla un poco más despacio de lo que crees. Se entiende mejor y suenas más seguro.",
    phrases: [
      { who: "facilitator", en: "Sergio, you're up.", es: "Sergio, te toca." },
      { who: "you", en: "Sure. Quick update from me.", es: "Claro. Una actualización rápida." },
      { who: "you", en: "Morning! So, yesterday…", es: "¡Buenos días! Pues ayer…" }
    ]
  },
  {
    id: "yesterday", title: "Ayer", time: "1 frase",
    what: "Qué terminaste o en qué avanzaste. Usa el pasado simple: «I finished», «I fixed», nunca «I have finished yesterday».",
    tip: "Di el resultado, no la lista de todo lo que tocaste.",
    phrases: [
      { who: "you", en: "Yesterday I finished the Terraform module.", es: "Ayer terminé el módulo de Terraform." },
      { who: "you", en: "Yesterday I fixed the login bug.", es: "Ayer arreglé el bug del login." },
      { who: "you", en: "Yesterday I reviewed Ana's PR and merged it.", es: "Ayer revisé la PR de Ana y la fusioné." },
      { who: "you", en: "Yesterday I had meetings most of the day.", es: "Ayer estuve casi todo el día en reuniones." },
      { who: "you", en: "I was out yesterday, so nothing new from me.", es: "Ayer no estuve, así que nada nuevo por mi parte." }
    ]
  },
  {
    id: "today", title: "Hoy", time: "1 frase",
    what: "Qué vas a hacer hoy. Con «I'll» o «I'm going to», o «I'm still on» si sigues con lo mismo.",
    tip: "Si es lo mismo que ayer, dilo: no pasa nada.",
    phrases: [
      { who: "you", en: "Today I'll continue with the migration.", es: "Hoy sigo con la migración." },
      { who: "you", en: "Today I'm still on the DNS issue.", es: "Hoy sigo con el problema de DNS." },
      { who: "you", en: "Today I'm going to test it in staging.", es: "Hoy lo voy a probar en preproducción." },
      { who: "you", en: "Today I'm on call, so mostly support.", es: "Hoy estoy de guardia, así que sobre todo soporte." }
    ]
  },
  {
    id: "eta", title: "Plazo (si aplica)", time: "opcional",
    what: "Si algo tiene fecha o va con retraso, dilo aquí. Para una fecha límite, siempre «by»: «by Friday».",
    tip: "Mejor avisar de un retraso en el daily que el último día.",
    phrases: [
      { who: "you", en: "It should be done by Thursday.", es: "Debería estar listo el jueves como tarde." },
      { who: "you", en: "It's taking longer than expected.", es: "Está llevando más de lo esperado." },
      { who: "you", en: "No ETA yet, I'll update you tomorrow.", es: "Aún no hay fecha, mañana os digo." }
    ]
  },
  {
    id: "blockers", title: "Bloqueos", time: "1 frase",
    what: "Lo que te impide avanzar y quién te puede ayudar. Es la parte más útil del daily: no la escondas.",
    tip: "Si tienes un bloqueo, di quién te puede desbloquear: así se resuelve antes.",
    phrases: [
      { who: "you", en: "No blockers.", es: "Sin bloqueos." },
      { who: "you", en: "I'm blocked by the network team.", es: "Estoy bloqueado por el equipo de red." },
      { who: "you", en: "I'm waiting on access to the prod account.", es: "Estoy esperando el acceso a la cuenta de producción." },
      { who: "you", en: "I could use some help with the pipeline.", es: "Me vendría bien ayuda con la pipeline." }
    ]
  },
  {
    id: "handover", title: "Pasar el turno", time: "1 frase",
    what: "Cierra tu turno de forma clara para que el siguiente sepa que le toca.",
    tip: "«That's it from me» es la fórmula más común. Si te toca elegir, nombra a alguien.",
    phrases: [
      { who: "you", en: "That's it from me.", es: "Eso es todo por mi parte." },
      { who: "you", en: "That's all. Over to you, Ana.", es: "Eso es todo. Te paso, Ana." },
      { who: "you", en: "Mike, do you want to go next?", es: "Mike, ¿quieres seguir tú?" }
    ]
  },
  {
    id: "others", title: "Durante los turnos de otros", time: "escucha",
    what: "Escucha y apunta lo que te afecte. Si algo necesita conversación, no la abras ahí: propón hablarlo después.",
    tip: "El daily dura 15 minutos. Discutir un tema largo ahí es el error más común.",
    phrases: [
      { who: "you", en: "I can help with that after the stand-up.", es: "Te puedo ayudar con eso después del daily." },
      { who: "you", en: "Let's take it offline.", es: "Lo hablamos aparte." },
      { who: "you", en: "Quick question, but it can wait.", es: "Una pregunta rápida, pero puede esperar." },
      { who: "facilitator", en: "Let's keep it short, we're running over.", es: "Seamos breves, que nos estamos pasando de tiempo." }
    ]
  },
  {
    id: "parking", title: "Temas pendientes (parking lot)", time: "al final",
    what: "Los temas que alguien propuso «hablar aparte» se tratan al final, solo con las personas implicadas. El resto se puede ir.",
    tip: "Si el tema no va contigo, puedes salir sin problema.",
    phrases: [
      { who: "facilitator", en: "Anything for the parking lot?", es: "¿Algún tema para tratar aparte?" },
      { who: "you", en: "Can Mike and I stay on for five minutes?", es: "¿Nos quedamos Mike y yo cinco minutos?" },
      { who: "facilitator", en: "Everyone else can drop off.", es: "Los demás os podéis ir." }
    ]
  },
  {
    id: "close", title: "Cierre", time: "15:00",
    what: "Quien facilita cierra y cada uno vuelve a lo suyo. Un saludo corto basta.",
    tip: "Si te comprometiste a algo, apúntalo ahora.",
    phrases: [
      { who: "facilitator", en: "Thanks, everyone. Have a good day!", es: "Gracias a todos. ¡Buen día!" },
      { who: "you", en: "Thanks, see you later!", es: "¡Gracias, hasta luego!" },
      { who: "you", en: "I'll ping you after this.", es: "Te escribo luego." }
    ]
  },
  {
    id: "special", title: "Situaciones especiales", time: "por si acaso",
    what: "Llegar tarde, no tener nada nuevo, problemas de conexión o no entender algo. Una frase hecha para cada caso.",
    tip: "Pedir que repitan no es un fallo: lo hacen también los nativos.",
    phrases: [
      { who: "you", en: "Sorry I'm late. I'll go last.", es: "Perdón por llegar tarde. Voy el último." },
      { who: "you", en: "Not much to report, still on the same task.", es: "Poco que contar: sigo con la misma tarea." },
      { who: "you", en: "Sorry, my connection is bad. I'll write my update in the chat.", es: "Perdón, mi conexión va mal. Pongo mi actualización en el chat." },
      { who: "you", en: "Sorry, could you repeat the last part?", es: "Perdona, ¿puedes repetir lo último?" },
      { who: "you", en: "I have to drop early, can I go first?", es: "Me tengo que ir antes, ¿puedo empezar yo?" },
      { who: "you", en: "I'll be out tomorrow, so no update from me.", es: "Mañana no estaré, así que no habrá actualización mía." }
    ]
  }
];
