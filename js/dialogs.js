/*
  Simulador de conversaciones estilo Slack.
  Cada escenario tiene varios turnos. En cada turno alguien te escribe
  y eliges la respuesta. "ok: true" marca las buenas (puede haber más de una).
  "why" explica por qué, en castellano.
*/
window.DIALOGS = [
  {
    id: "daily",
    title: "Daily stand-up",
    channel: "#team-platform",
    icon: "🧍",
    level: "B1",
    intro: "Son las 9:30. Empieza la reunión diaria del equipo.",
    who: { name: "Emma", role: "Scrum Master", avatar: "EM" },
    turns: [
      {
        text: "Morning, everyone! Sergio, do you want to go first?",
        es: "¡Buenos días a todos! Sergio, ¿quieres empezar tú?",
        options: [
          { en: "Sure. Yesterday I finished the Terraform module. Today I'll review Ana's PR. No blockers.", ok: true, why: "Estructura perfecta de daily: ayer, hoy y bloqueos." },
          { en: "Yes, I go first. Yesterday I finish the module.", ok: false, why: "Cuidado con los tiempos: «I'll go first» y «I finished»." },
          { en: "I don't want.", ok: false, why: "Suena muy brusco. Y además falta el «to»: «I don't want to»." }
        ]
      },
      {
        text: "Great. Any blockers on the network side?",
        es: "Genial. ¿Algún bloqueo por la parte de red?",
        options: [
          { en: "Actually, yes. I'm blocked by a firewall rule. I need someone from networking.", ok: true, why: "«I'm blocked by…» = estoy bloqueado por… Claro y con lo que necesitas." },
          { en: "Yes, I am blocking.", ok: false, why: "«I'm blocking» significa que tú bloqueas a otros. Lo correcto es «I'm blocked»." },
          { en: "The network is boring.", ok: false, why: "Gracioso, pero no responde a la pregunta 😅" }
        ]
      },
      {
        text: "OK, let's take that offline after the stand-up.",
        es: "Vale, lo hablamos aparte después del daily.",
        options: [
          { en: "Sounds good. I'll ping you afterwards.", ok: true, why: "«Ping someone» = escribirle o avisarle. Muy de equipo técnico." },
          { en: "Why offline? My internet works fine.", ok: false, why: "«Take it offline» no tiene nada que ver con internet: es hablarlo fuera de la reunión." },
          { en: "OK, I disconnect now.", ok: false, why: "No te vayas todavía, que el daily sigue 😄" }
        ]
      }
    ],
    outro: "Daily terminado en 12 minutos. Récord del equipo. 🏁"
  },
  {
    id: "incident",
    title: "Incidencia P1 a las 3 a.m.",
    channel: "#incident-payments",
    icon: "🚨",
    level: "B2",
    intro: "Estás de guardia. Suena el busca. Algo se ha roto en producción.",
    who: { name: "Mike", role: "Incident Commander", avatar: "MK" },
    turns: [
      {
        text: "@sergio the payments API is returning 500s. Are you on it?",
        es: "@sergio la API de pagos está devolviendo errores 500. ¿Te encargas?",
        options: [
          { en: "On it. Checking the logs now. I'll post an update in 10 minutes.", ok: true, why: "«On it» = me pongo. Y dar un plazo para la siguiente actualización tranquiliza a todos." },
          { en: "Yes, I am on the API.", ok: false, why: "Traducción literal: suena a que estás «encima» de la API." },
          { en: "Not my problem, it's 3 a.m.", ok: false, why: "Técnicamente honesto. Profesionalmente… no 😬" }
        ]
      },
      {
        text: "Any idea what's causing it?",
        es: "¿Alguna idea de qué lo está provocando?",
        options: [
          { en: "It looks like the last deployment. I suggest we roll back.", ok: true, why: "Hipótesis + propuesta de acción. Justo lo que necesita un incidente." },
          { en: "I think the server is sad.", ok: false, why: "Puede que lo esté, pero eso no va en el canal del incidente 🥲" },
          { en: "Maybe yes, maybe no.", ok: false, why: "Demasiado vago. En un incidente hay que concretar." }
        ]
      },
      {
        text: "Rollback done, errors are gone. Thanks!",
        es: "Rollback hecho, ya no hay errores. ¡Gracias!",
        options: [
          { en: "Great. I'll write up the post-mortem tomorrow so we can find the root cause.", ok: true, why: "Cerrar con el post-mortem y la causa raíz es de SRE de manual." },
          { en: "You're welcome. Good night forever.", ok: false, why: "«Forever» suena a que dimites 😂 Basta con «Good night»." },
          { en: "Let's never talk about this again.", ok: false, why: "Al revés: hay que hablarlo, sin culpables, para que no se repita." }
        ]
      }
    ],
    outro: "Servicio restaurado. MTTR: 23 minutos. A dormir. 😴"
  },
  {
    id: "interview",
    title: "Entrevista técnica",
    channel: "Videollamada",
    icon: "🤝",
    level: "B2",
    intro: "Entrevista con una empresa internacional para un puesto de Cloud Engineer.",
    who: { name: "Sarah", role: "Engineering Manager", avatar: "SA" },
    turns: [
      {
        text: "So, tell me about yourself.",
        es: "Bueno, háblame de ti.",
        options: [
          { en: "I'm a cloud engineer with over ten years in systems. Right now I work on infrastructure as code with Terraform.", ok: true, why: "Corto, profesional y conectado con el puesto." },
          { en: "I was born in 1985 and I like football.", ok: false, why: "No buscan tu biografía: habla de tu perfil profesional." },
          { en: "What do you want to know?", ok: false, why: "Devolver la pregunta suena a que no te has preparado." }
        ]
      },
      {
        text: "Can you give me an example of a time you handled a difficult situation?",
        es: "¿Me das un ejemplo de una situación difícil que hayas gestionado?",
        options: [
          { en: "Sure. During a major outage, I coordinated three teams. We restored the service in an hour and then fixed the root cause.", ok: true, why: "Método STAR: situación, tarea, acción y resultado." },
          { en: "I never have problems.", ok: false, why: "Nadie se lo cree, y pierdes la ocasión de lucirte." },
          { en: "Yes, I can.", ok: false, why: "Literalmente responde a la pregunta… pero esperan el ejemplo 😄" }
        ]
      },
      {
        text: "Do you have any questions for us?",
        es: "¿Tienes alguna pregunta para nosotros?",
        options: [
          { en: "Yes. What would success look like in the first 90 days?", ok: true, why: "Demuestra interés real por hacerlo bien desde el principio." },
          { en: "No, nothing.", ok: false, why: "Siempre conviene preguntar algo: muestra interés." },
          { en: "How many holidays do I get?", ok: false, why: "Pregunta válida, pero mejor dejarla para la fase de oferta." }
        ]
      }
    ],
    outro: "«We'll be in touch soon.» Buena señal. 🤞"
  },
  {
    id: "coffee",
    title: "Café en la oficina",
    channel: "Cocina, planta 3",
    icon: "☕",
    level: "A2",
    intro: "Lunes por la mañana. Te cruzas con un compañero en la máquina de café.",
    who: { name: "Tom", role: "Backend Developer", avatar: "TO" },
    turns: [
      {
        text: "Hi! How was your weekend?",
        es: "¡Hola! ¿Qué tal el fin de semana?",
        options: [
          { en: "It was great, thanks! I went to the mountains with my family. And you?", ok: true, why: "Respondes, das un detalle y devuelves la pregunta. Small talk perfecto." },
          { en: "Yes, thank you.", ok: false, why: "La pregunta es «¿qué tal?», no «¿sí o no?»." },
          { en: "My weekend is Saturday and Sunday.", ok: false, why: "Correcto… pero no era eso 😂" }
        ]
      },
      {
        text: "Nice! Do you want a coffee?",
        es: "¡Qué bien! ¿Quieres un café?",
        options: [
          { en: "Yes, please. With a little milk.", ok: true, why: "Educado y concreto." },
          { en: "No, I'm more of a tea person, but thanks!", ok: true, why: "«I'm more of a … person» = soy más de… Muy natural." },
          { en: "I want coffee. Give me.", ok: false, why: "Suena a orden. Usa «please» o «I'd love one»." }
        ]
      },
      {
        text: "Anyway, I've got a meeting. See you later!",
        es: "Bueno, tengo una reunión. ¡Luego nos vemos!",
        options: [
          { en: "See you! Good luck with the meeting.", ok: true, why: "Cierre amable y natural." },
          { en: "Goodbye forever.", ok: false, why: "Muy dramático para un lunes 😅" },
          { en: "Why?", ok: false, why: "Suena raro y algo cotilla." }
        ]
      }
    ],
    outro: "Café hecho. Relaciones sociales: +1. ☕"
  },
  {
    id: "one-to-one",
    title: "1:1 con tu manager",
    channel: "Reunión privada",
    icon: "🗣️",
    level: "C1",
    intro: "Reunión semanal con tu manager para hablar de cómo va todo.",
    who: { name: "Laura", role: "Head of Platform", avatar: "LA" },
    turns: [
      {
        text: "How are you finding the new project?",
        es: "¿Qué te está pareciendo el proyecto nuevo?",
        options: [
          { en: "It's challenging, but I'm enjoying it. I'm still getting my head around the legacy code.", ok: true, why: "«Get your head around» = asimilar algo complejo. Honesto y positivo." },
          { en: "I find it on GitHub.", ok: false, why: "«How are you finding…?» significa «¿qué te parece?», no «¿dónde lo encuentras?» 😄" },
          { en: "It's fine.", ok: false, why: "No es incorrecto, pero en un 1:1 conviene dar contexto." }
        ]
      },
      {
        text: "Is there anything I can do to help?",
        es: "¿Hay algo en lo que pueda ayudarte?",
        options: [
          { en: "Actually, yes. The scope keeps changing. Could we agree on priorities with the product team?", ok: true, why: "Expones el problema y propones una solución concreta." },
          { en: "They keep moving the goalposts and honestly, I'm fed up.", ok: false, why: "La expresión es buena, pero el tono es solo queja. Propón algo." },
          { en: "No, everything is always perfect.", ok: false, why: "Nunca lo está, y pierdes la ayuda que te ofrecen." }
        ]
      },
      {
        text: "Sounds good. Let's touch base again next week.",
        es: "Me parece bien. Lo volvemos a hablar la semana que viene.",
        options: [
          { en: "Perfect. I'll send you a short update before then.", ok: true, why: "Cierras con un compromiso concreto." },
          { en: "Touch what?", ok: false, why: "«Touch base» = ponerse al día. Es muy común en la empresa." },
          { en: "OK, I will touch your base.", ok: false, why: "Por favor, no 😂" }
        ]
      }
    ],
    outro: "Feedback dado, prioridades claras. Así da gusto. ✨"
  }
];
