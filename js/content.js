/*
  Contenido de stand-up.

  Rutas → unidades → lecciones → frases.
  Cada frase:
    en    frase en inglés (corta, real)
    es    traducción
    gap   palabra que se quita en los huecos (tiene que estar tal cual en «en»)
    wrong opciones falsas: errores típicos de hispanohablantes o palabras parecidas
    note  explicación corta (opcional)
  Cada lección puede tener una escena: alguien te escribe y eliges la respuesta.
*/
window.ROUTES = [
  {
    id: "team",
    code: "01",
    title: "Sobrevivir al día a día del equipo",
    desc: "Dailies, Slack, correos y reuniones. El inglés que usas cada mañana.",
    units: [
      {
        id: "daily",
        title: "Daily stand-up",
        desc: "Ayer, hoy y bloqueos en 30 segundos.",
        lessons: [
          {
            title: "Ayer, hoy y bloqueos",
            level: "A2",
            items: [
              { en: "Quick update.", es: "Una actualización rápida.", gap: "update", wrong: ["actualization", "upgrade", "news"], note: "«Actualization» no existe en inglés." },
              { en: "Yesterday I fixed the bug.", es: "Ayer arreglé el bug.", gap: "fixed", wrong: ["fix", "fixes", "fixing"], note: "Para ayer, pasado: «fixed»." },
              { en: "Today I'm on the pipeline.", es: "Hoy estoy con la pipeline.", gap: "on", wrong: ["in", "at", "with"], note: "«Be on something» = estar con una tarea." },
              { en: "No blockers.", es: "Sin bloqueos.", gap: "blockers", wrong: ["blocks", "blockings", "stoppers"] },
              { en: "I'm blocked by networking.", es: "Estoy bloqueado por el equipo de red.", gap: "blocked", wrong: ["blocking", "block", "locked"], note: "«I'm blocking» significa que tú bloqueas a otros." },
              { en: "That's it from me.", es: "Eso es todo por mi parte.", gap: "from", wrong: ["for", "of", "by"] }
            ],
            scene: {
              who: "Emma", role: "Scrum Master",
              text: "Sergio, want to go first?", es: "Sergio, ¿quieres empezar tú?",
              options: [
                { en: "Sure. No blockers on my side.", ok: true, why: "Directo y natural." },
                { en: "Yes, I go first.", ok: false, why: "Falta el futuro: «I'll go first»." },
                { en: "Of course, I begin.", ok: false, why: "Suena traducido. Lo natural es «Sure, I'll start»." }
              ]
            }
          },
          {
            title: "Estado de las tareas",
            level: "B1",
            items: [
              { en: "Still in progress.", es: "Sigue en curso.", gap: "progress", wrong: ["process", "course", "curse"], note: "«In course» no se usa: es «in progress»." },
              { en: "Almost done.", es: "Casi terminado.", gap: "done", wrong: ["finish", "made", "ended"] },
              { en: "The PR is ready for review.", es: "La PR está lista para revisión.", gap: "review", wrong: ["revision", "check", "revise"], note: "«Revision» es una versión corregida, no una revisión de código." },
              { en: "I'll pair with Ana.", es: "Voy a trabajar en pareja con Ana.", gap: "pair", wrong: ["couple", "pairs", "join"], note: "«Pair» = programar en pareja." },
              { en: "It took longer than expected.", es: "Me llevó más de lo esperado.", gap: "longer", wrong: ["larger", "later", "longest"] },
              { en: "I'm waiting on QA.", es: "Estoy esperando a QA.", gap: "waiting", wrong: ["hoping", "expecting", "attending"], note: "«Expect» es prever. Esperar a alguien es «wait for» o «wait on»." }
            ],
            scene: {
              who: "Emma", role: "Scrum Master",
              text: "How's the migration going?", es: "¿Cómo va la migración?",
              options: [
                { en: "Almost done. It took longer than expected.", ok: true, why: "Das el estado y el motivo en dos frases." },
                { en: "It's going in course.", ok: false, why: "No existe. Di «It's in progress»." },
                { en: "Actually it's finished, but not yet.", ok: false, why: "«Actually» significa «en realidad», no «actualmente». Y la frase se contradice." }
              ]
            }
          },
          {
            title: "Pedir ayuda y cerrar",
            level: "B2",
            items: [
              { en: "Can anyone help with this?", es: "¿Alguien puede ayudar con esto?", gap: "help", wrong: ["assist", "attend", "care"], note: "«Assist» es formal y «attend» es asistir a algo. En el daily, «help»." },
              { en: "Let's take it offline.", es: "Lo hablamos aparte.", gap: "offline", wrong: ["outside", "apart", "off"], note: "No tiene nada que ver con internet: es hablarlo fuera de la reunión." },
              { en: "I'll ping you after.", es: "Te escribo después.", gap: "ping", wrong: ["touch", "ring", "beep"], note: "«Ping someone» = escribir o avisar a alguien." },
              { en: "Heads-up: I'm out on Friday.", es: "Aviso: el viernes no estoy.", gap: "out", wrong: ["absent", "outside", "holidays"], note: "«Absent» suena a colegio." },
              { en: "Who's picking this up?", es: "¿Quién se encarga de esto?", gap: "picking", wrong: ["catching", "getting", "lifting"] },
              { en: "Let's keep it short.", es: "Vamos a ser breves.", gap: "short", wrong: ["small", "little", "low"] }
            ],
            scene: {
              who: "Mike", role: "SRE",
              text: "Can we discuss the DNS issue now?", es: "¿Podemos hablar ahora del problema de DNS?",
              options: [
                { en: "Let's take it offline after the stand-up.", ok: true, why: "Proteges el tiempo del daily y no ignoras el tema." },
                { en: "Let's discuss it apart.", ok: false, why: "«Apart» no se usa así. Di «take it offline» o «discuss it separately»." },
                { en: "Better not, it's a long history.", ok: false, why: "«History» es historia del pasado. Aquí es «a long story»." }
              ]
            }
          }
        ]
      },
      {
        id: "async",
        title: "Slack y correo",
        desc: "Mensajes cortos, correos claros y tono profesional.",
        lessons: [
          {
            title: "Mensajes rápidos",
            level: "A2",
            items: [
              { en: "Got it, thanks.", es: "Entendido, gracias.", gap: "Got", wrong: ["Have", "Take", "Catch"] },
              { en: "On it.", es: "Me pongo con ello.", gap: "On", wrong: ["In", "At", "With"] },
              { en: "Sounds good.", es: "Me parece bien.", gap: "Sounds", wrong: ["Listens", "Hears", "Seems"] },
              { en: "Quick question.", es: "Una pregunta rápida.", gap: "Quick", wrong: ["Fast", "Rapid", "Speed"] },
              { en: "No rush.", es: "Sin prisa.", gap: "rush", wrong: ["press", "run", "race"] },
              { en: "Thanks for the heads-up.", es: "Gracias por avisar.", gap: "heads-up", wrong: ["advise", "advertise", "head"], note: "«Advertise» es anunciar, de publicidad. Falso amigo de «advertir»." }
            ],
            scene: {
              who: "Ana", role: "Backend Developer",
              text: "Can you review my PR today?", es: "¿Puedes revisar mi PR hoy?",
              options: [
                { en: "Sure, on it.", ok: true, why: "Corto y claro, como se escribe en Slack." },
                { en: "Of course, I will revise it.", ok: false, why: "«Revise» es corregir y reescribir. Revisar código es «review»." },
                { en: "Yes, I'm going to it.", ok: false, why: "Calco del español. Di «I'm on it» o «I'll take a look»." }
              ]
            }
          },
          {
            title: "Correos claros",
            level: "B1",
            items: [
              { en: "Please find the report attached.", es: "Te adjunto el informe.", gap: "attached", wrong: ["adjunt", "annexed", "joined"], note: "«Adjunt» no existe." },
              { en: "Just following up.", es: "Te escribo para hacer seguimiento.", gap: "following", wrong: ["continuing", "pursuing", "persecuting"], note: "«Persecute» es perseguir a alguien con mala intención." },
              { en: "Could you confirm by Friday?", es: "¿Puedes confirmarlo como tarde el viernes?", gap: "by", wrong: ["until", "for", "since"], note: "«By Friday» = como tarde el viernes. «Until» marca duración." },
              { en: "Looping in Ana.", es: "Añado a Ana al hilo.", gap: "Looping", wrong: ["Rounding", "Linking", "Hooking"] },
              { en: "Let me know.", es: "Dime algo.", gap: "know", wrong: ["now", "knew", "known"] },
              { en: "Sorry for the delay.", es: "Perdona el retraso.", gap: "delay", wrong: ["retard", "late", "retire"], note: "«Retard» es un insulto en inglés. Nunca lo uses por «retraso»." }
            ],
            scene: {
              who: "Laura", role: "Engineering Manager",
              text: "When can you send the report?", es: "¿Cuándo puedes enviar el informe?",
              options: [
                { en: "I'll send it by Friday.", ok: true, why: "«By» es la fecha límite. Compromiso claro." },
                { en: "I'll send it until Friday.", ok: false, why: "«Until» marca duración. Para una fecha límite: «by Friday»." },
                { en: "I send it on Friday, sure.", ok: false, why: "Para prometer algo usa el futuro: «I'll send»." }
              ]
            }
          },
          {
            title: "Tono profesional",
            level: "B2",
            items: [
              { en: "Gentle reminder.", es: "Te lo recuerdo amablemente.", gap: "Gentle", wrong: ["Gentile", "Soft", "Sweet"] },
              { en: "Happy to help.", es: "Encantado de ayudar.", gap: "Happy", wrong: ["Content", "Joyful", "Funny"] },
              { en: "I'd like to flag an issue.", es: "Quiero avisar de un problema.", gap: "flag", wrong: ["advert", "alarm", "sign"] },
              { en: "As discussed, here are the next steps.", es: "Como hablamos, estos son los siguientes pasos.", gap: "discussed", wrong: ["argued", "talked", "spoken"], note: "«Argue» es discutir enfadado." },
              { en: "Let's circle back next week.", es: "Lo retomamos la semana que viene.", gap: "circle", wrong: ["turn", "round", "spin"] },
              { en: "Apologies for the confusion.", es: "Disculpas por la confusión.", gap: "Apologies", wrong: ["Excuses", "Sorries", "Pardons"], note: "«Excuses» son excusas, no disculpas." }
            ],
            scene: {
              who: "Tom", role: "Product Manager",
              text: "Wait, the deadline moved again?", es: "Espera, ¿la fecha ha vuelto a cambiar?",
              options: [
                { en: "Yes, apologies for the confusion. Here are the new dates.", ok: true, why: "Reconoces el problema y das la información." },
                { en: "Yes, excuse me for the confusion.", ok: false, why: "«Excuse me» es para pedir paso o interrumpir." },
                { en: "Yes. Not my problem.", ok: false, why: "Demasiado brusco, sobre todo por escrito." }
              ]
            }
          }
        ]
      },
      {
        id: "meetings",
        title: "Reuniones",
        desc: "Llamadas, opiniones y cómo cerrar con tareas claras.",
        lessons: [
          {
            title: "Lo básico en una llamada",
            level: "A2",
            items: [
              { en: "Can you hear me?", es: "¿Me oís?", gap: "hear", wrong: ["listen", "here", "ear"], note: "«Listen» es escuchar con atención. Para el audio, «hear»." },
              { en: "You're on mute.", es: "Tienes el micro silenciado.", gap: "mute", wrong: ["silence", "quiet", "mud"] },
              { en: "Can you see my screen?", es: "¿Veis mi pantalla?", gap: "screen", wrong: ["scream", "window", "screw"] },
              { en: "Sorry, you cut out.", es: "Perdona, se te ha cortado.", gap: "cut", wrong: ["cutted", "broke", "fell"], note: "«Cutted» no existe: el pasado de «cut» es «cut»." },
              { en: "Let's get started.", es: "Empecemos.", gap: "started", wrong: ["starting", "began", "stared"] },
              { en: "I have a hard stop at five.", es: "A las cinco tengo que irme sí o sí.", gap: "stop", wrong: ["end", "leave", "exit"] }
            ],
            scene: {
              who: "Laura", role: "Engineering Manager",
              text: "Sergio, are you there? We can't hear you.", es: "Sergio, ¿estás? No te oímos.",
              options: [
                { en: "Sorry, I was on mute. Can you hear me now?", ok: true, why: "Explicas qué pasaba y compruebas que ya te oyen." },
                { en: "Sorry, I was in silence.", ok: false, why: "Para el micrófono se dice «on mute»." },
                { en: "Yes, I'm listening you.", ok: false, why: "Falta «to»: «listening to you». Y el problema es que no te oyen a ti." }
              ]
            }
          },
          {
            title: "Opinar y preguntar",
            level: "B1",
            items: [
              { en: "I agree.", es: "Estoy de acuerdo.", gap: "agree", wrong: ["accord", "agreed", "agreeing"], note: "Nunca «I'm agree»: «agree» ya es el verbo." },
              { en: "Good point.", es: "Buen apunte.", gap: "point", wrong: ["note", "pointer", "punt"] },
              { en: "Just to clarify...", es: "Solo para aclarar...", gap: "clarify", wrong: ["clear", "clearify", "clarity"] },
              { en: "What do you mean?", es: "¿Qué quieres decir?", gap: "mean", wrong: ["say", "meaning", "signify"] },
              { en: "Could you explain that?", es: "¿Puedes explicar eso?", gap: "explain", wrong: ["expose", "explicate", "exploit"], note: "Ojo con «explain me»: lo correcto es «explain it to me»." },
              { en: "I see your point, but...", es: "Entiendo lo que dices, pero...", gap: "see", wrong: ["watch", "look", "sea"] }
            ],
            scene: {
              who: "Mike", role: "SRE",
              text: "So we migrate everything on Monday.", es: "Entonces migramos todo el lunes.",
              options: [
                { en: "Good point, but could you explain the rollback plan?", ok: true, why: "Reconoces la idea y pides lo que falta." },
                { en: "Actually, Monday is a public holiday.", ok: true, why: "Bien usado: «actually» = en realidad. Corriges un dato con educación." },
                { en: "I'm agree, but explain me the rollback.", ok: false, why: "Dos errores típicos: «I agree» y «explain it to me»." }
              ]
            }
          },
          {
            title: "Decidir y cerrar",
            level: "B2",
            items: [
              { en: "Let's park that for now.", es: "Dejemos eso aparcado de momento.", gap: "park", wrong: ["parking", "stay", "leave"] },
              { en: "Are we aligned?", es: "¿Estamos alineados?", gap: "aligned", wrong: ["aligning", "lined", "agree"] },
              { en: "Who owns this?", es: "¿Quién es responsable de esto?", gap: "owns", wrong: ["has", "takes", "owners"] },
              { en: "Let's wrap up.", es: "Vamos cerrando.", gap: "wrap", wrong: ["rap", "warp", "roll"] },
              { en: "I'll send a recap.", es: "Mando un resumen.", gap: "recap", wrong: ["resume", "resumen", "summing"], note: "«Resume» (o «résumé») es un currículum." },
              { en: "Action items are in the doc.", es: "Las tareas están en el documento.", gap: "Action", wrong: ["Acting", "Actions", "Activity"] }
            ],
            scene: {
              who: "Laura", role: "Engineering Manager",
              text: "Anything else before we finish?", es: "¿Algo más antes de terminar?",
              options: [
                { en: "No, I think we're aligned. I'll send a recap.", ok: true, why: "Confirmas el acuerdo y te comprometes a algo concreto." },
                { en: "No. I will send a resume.", ok: false, why: "«Resume» es un currículum. Resumen = «recap» o «summary»." },
                { en: "Nothing more, we can finish the reunion.", ok: false, why: "«Reunion» es un reencuentro, como el de antiguos alumnos. Reunión = «meeting»." }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    id: "interviews",
    code: "02",
    title: "Pasar entrevistas",
    desc: "Preséntate, cuenta tus proyectos y responde a lo difícil.",
    soon: ["Preséntate", "Cuenta un proyecto", "Preguntas difíciles", "Tus preguntas"],
    units: []
  },
  {
    id: "explain",
    code: "03",
    title: "Explicar ideas técnicas",
    desc: "Proponer, comparar alternativas y discrepar con educación.",
    soon: ["Proponer", "Comparar alternativas", "Discrepar con educación", "Dar estimaciones"],
    units: []
  },
  {
    id: "ops",
    code: "04",
    title: "Incidencias y code review",
    desc: "Guardias, post-mortems y comentarios en PR.",
    soon: ["On-call", "Post-mortem", "Comentarios en PR"],
    units: []
  },
  {
    id: "mistakes",
    code: "05",
    title: "Errores que delatan al hispanohablante",
    desc: "Actually, assist, «I'm agree», «explain me»… y cómo evitarlos.",
    soon: ["Falsos amigos", "Calcos del español", "Pronunciación"],
    units: []
  }
];
